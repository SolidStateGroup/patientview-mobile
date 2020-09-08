// Secured async storage module
import PBKDF2 from 'react-native-pbkdf2';
import _ from 'lodash';
import {AsyncStorage} from 'react-native';
import SimpleCryptoJS from 'simple-crypto-js';
import * as Keychain from 'react-native-keychain';

const DB_KEY = 'secured-storage-data'; //Empty object, used to test challenge
const SALT_KEY = 'secured-storage-salt'; //Stores the secured storage secret word salt
const MAP_KEY = "secured-storage-keys"; //Stores all the encrypted db keys
import {encrypt, decrypt} from 'react-native-simple-encryption';

let challengeActive;
let storage = null; //cached local storage

let localStorageKey = '';
const STORAGE_KEY = 'secured-storage-key'; // Stores the local storage decryption key in the keychain/keystore
const SECRET_WORD_SERVICE = 'secret-word-hash';

const strongEncrypt = (key, val) => {
    let simpleCrypto = new SimpleCryptoJS(key);
    return simpleCrypto.encrypt(val);
};

const strongDecrypt = (key, val) => {
    let simpleCrypto = new SimpleCryptoJS(key);
    return simpleCrypto.decrypt(val);
};

const SecuredAsyncStorage = class {

    async init (password) {
        // Used logged in with their password, generate encryption key for local storage
        localStorageKey = strongEncrypt(SimpleCryptoJS.generateRandom(), password);

        // Write storage key to keychain
        try {
            let keychainAuth = false;
            const service = STORAGE_KEY;
            const supportedBiometryType = await Keychain.getSupportedBiometryType();
            if (Platform.OS === 'android') {
                keychainAuth = supportedBiometryType === Keychain.BIOMETRY_TYPE.FINGERPRINT;
                await Keychain.setGenericPassword(STORAGE_KEY, localStorageKey,
                    keychainAuth ?
                    {accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE, service} : {service});
            } else {
                const canUseBiometrics = !!supportedBiometryType;
                if (!DeviceInfo.isEmulator()) {
                    keychainAuth = await Keychain.canImplyAuthentication({authenticationType: Keychain.AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS});
                }
                await Keychain.setGenericPassword(STORAGE_KEY, localStorageKey,
                    keychainAuth ? {accessControl: canUseBiometrics ? Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET : Keychain.ACCESS_CONTROL.DEVICE_PASSCODE, service} : {service});
            }
            if (keychainAuth) AsyncStorage.setItem('biometricKeychain', 'true');
            console.log('Secured storage key written to keychain. Biometric/passcode secured =', keychainAuth);
            return keychainAuth;
        } catch(e) {
            console.log('Failed to write secured storage key to keychain', e);
            return Promise.reject(e);
        }
    }

    async setSecretWord(secretWord, salt) {
        try {
            const hash = await PBKDF2.derivationKey(secretWord, salt, 10000);
            await Keychain.setGenericPassword(SECRET_WORD_SERVICE, hash, {service: SECRET_WORD_SERVICE});
            await Keychain.setGenericPassword(SALT_KEY, strongEncrypt(secretWord, salt), {service: SALT_KEY});
        } catch (e) {
            console.log('Failed to write secret word hash / salt to keychain', e);
            return Promise.reject(e);
        }
    }

    clear = async () => { //Clear out any secured storage
        challengeActive = false;
        localStorageKey = '';
        await Keychain.resetGenericPassword({service: STORAGE_KEY}).catch(err => console.log('Error clearing keychain'));
        await Keychain.resetGenericPassword({service: SECRET_WORD_SERVICE}).catch(err => console.log('Error clearing keychain'));
        await Keychain.resetGenericPassword({service: SALT_KEY}).catch(err => console.log('Error clearing keychain'));
        await AsyncStorage.setItem(DB_KEY, "");
        await AsyncStorage.setItem(SALT_KEY, "");
        const res = await AsyncStorage.getItem(MAP_KEY);
        if (res) {
            var keys = JSON.parse(res).map((key) => DB_KEY + key);
            await Promise.all(_.map(keys, (key) => {
                return AsyncStorage.setItem(key, "");
            }));
        }
        storage = null;
    }

    async get() { // Either prompts user for biometrics/passcode or prompts user to enter secret word to unlock storage
        try {
            const isLockedByBiometrics = await AsyncStorage.getItem('biometricKeychain');
            let keychainAuth;
            if (Platform.OS === 'android') {
                const supportedBiometryType = await Keychain.getSupportedBiometryType();
                keychainAuth = supportedBiometryType === Keychain.BIOMETRY_TYPE.FINGERPRINT;
            } else {
                keychainAuth = await Keychain.canImplyAuthentication({authenticationType: Keychain.AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS});
            }
            if (!keychainAuth) {
                if (isLockedByBiometrics) {
                    // Keychain is locked by biometrics but biometrics have been disabled
                    // Log user out
                    return Promise.reject('Biometrically secure keychain without biometrics enabled');
                }
                return { promptSecretWord: true };
            } else if (!isLockedByBiometrics) {
                // Keychain is not secured by biometrics but biometrics have been enabled
                return { promptSecretWord: true, enableBiometrics: true };
            }

            // Get storage key from keychain
            ({ password: localStorageKey } = await Keychain.getGenericPassword({service: STORAGE_KEY, authenticationPrompt: 'Log in'}));

            // Decrypt local storage and return
            const storage = await this.unlock();

            return { storage };
        } catch(e) {
            if (e.message !== (Platform.OS === 'ios' ? 'User canceled the operation.' : (DeviceInfo.getAPILevel() >= 28 ? 'Cancel' : 'Fingerprint operation cancelled.')) &&
                e.message !== 'Log Out') {
                console.log('Error while getting secure storage', e);
            }
            return Promise.reject(e);
        }
    }

    async checkSecretWord(secretWord, enableBiometrics) {
        // Get the salt and hash
        try {
            const { password: saltHash } = await Keychain.getGenericPassword({service: SALT_KEY});
            const { password: secretWordHash } = await Keychain.getGenericPassword({service: SECRET_WORD_SERVICE});
            // TODO argon2
            const salt = strongDecrypt(secretWord, saltHash);
            const hash = await PBKDF2.derivationKey(secretWord, salt, 10000);
            if (hash === secretWordHash) {
                // Secret word is correct, get storage key from keychain
                ({ password: localStorageKey } = await Keychain.getGenericPassword({service: STORAGE_KEY}));

                if (enableBiometrics) {
                    // Biometrics have been enabled on the device, secure the password with biometrics
                    const service = STORAGE_KEY;
                    if (Platform.OS === 'android') {
                        await Keychain.setGenericPassword(STORAGE_KEY, localStorageKey, {accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE, service});
                    } else {
                        await Keychain.setGenericPassword(STORAGE_KEY, localStorageKey, {accessControl: Keychain.ACCESS_CONTROL.USER_PRESENCE, service});
                    }
                    AsyncStorage.setItem('biometricKeychain', 'true');
                }

                // Decrypt local storage and return
                return this.unlock();
            } else {
                // Incorrect
                return Promise.reject('Incorrect');
            }

        } catch (e) {
            console.log('Error checking secret word');
            return Promise.reject(e);
        }
    }

    async unlock() {
        if (!localStorageKey) {
            console.warn('Attempt to decrypt local storage without key');
            return Promise.reject();
        }
        try {
            const keymap = await AsyncStorage.getItem(MAP_KEY);
            if (keymap) {
                var keys = JSON.parse(keymap).map((key) => DB_KEY + key);
                const encryptedData = await AsyncStorage.multiGet(keys);
                storage = {};
                await _.map(encryptedData, async (val) => {
                    var storageKey = val[0].replace(DB_KEY, "");
                    if (val[1]) {
                        try {
                            var str = decrypt(localStorageKey, val[1]);
                            
                            storage[storageKey] = JSON.parse(str);
                        } catch (e) {
                            console.log(`Failed to decrypt item ${storageKey}`);
                            if (storageKey.indexOf('result-') === 0) {
                                await AsyncStorage.removeItem(storageKey.substr(7));
                            }
                            // todo: force recover other types?
                        }
                    }
                });

                return storage;
            } else {
                return null;
            }
        } catch (e) {
            console.log('Failed to decrypt local storage', e);
            return Promise.reject(e);
        }
    }

    setItem(key, val, string) {

        storage = storage || {};
        storage[key] = val;

        //todo: this may perform slightly better in a staggered queue
        if (localStorageKey) {
            AsyncStorage.setItem(MAP_KEY, JSON.stringify(Object.keys(storage))); // Update keys in secured storage
            var encryptedStorage = encrypt(localStorageKey, string || JSON.stringify(val)); //Encrypt string with current secret
            console.log("Encrypting", key);
            return AsyncStorage.setItem(DB_KEY + key, encryptedStorage); //Update local storage
        } else {
            console.warn("Attempted to set secured storage without a key");
        }
    }

};

module.exports = new SecuredAsyncStorage();
