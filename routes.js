//All routes are registered here

import {Navigation} from "react-native-navigation";

//Account Pages
Navigation.registerComponent('/account', () => require('./components/pages/AccountPage'));
Navigation.registerComponent('/login', () => require('./components/pages/LoginPage'));
Navigation.registerComponent('/secret-word', () => require('./components/pages/SecretWordLoginPage'));
Navigation.registerComponent('/secret-word-challenge', () => require('./components/pages/SecretWordChallengePage'));
Navigation.registerComponent('/set-secret-word', () => require('./components/pages/SecretWordOnboarding'));


Navigation.registerComponent('/conditions', () => require('./components/pages/ConditionsPage'));


Navigation.registerComponent('/edit-result', () => require('./components/pages/EditResultPage'));
Navigation.registerComponent('/edit-results', () => require('./components/pages/EditResultsPage'));

Navigation.registerComponent('/ins-diary-recordings', () => require('./components/pages/INSDiaryRecordingsPage'));
Navigation.registerComponent('/ins-diary-recording', () => require('./components/pages/INSDiaryRecordingPage'));
Navigation.registerComponent('/add-relapse-medication', () => require('./components/pages/AddRelapseMedicationPage'));
Navigation.registerComponent('/ins-hospitalisation', () => require('./components/pages/HospitalisationPage'));
Navigation.registerComponent('/ins-immunisation', () => require('./components/pages/ImmunisationPage'));

//Utility pages
Navigation.registerComponent('/info', () => require('./components/pages/InfoModal'));
Navigation.registerComponent('/image-preview', () => require('./components/pages/ImagePreview'));
Navigation.registerComponent('/select', () => require('./components/base/SelectModal'));
Navigation.registerComponent('/webmodal', () => require('./components/base/NativeWebModal'));
// Navigation.registerComponent('/select-contact', () => require('./components/base/ContactSelectModal'));
// Navigation.registerComponent('/camera', () => require('./components/base/CameraModal'));

//Result Pages
Navigation.registerComponent('/enter-result', () => require('./components/pages/EnterResultPage'));
Navigation.registerComponent('/enter-results', () => require('./components/pages/EnterResultsPage'));
Navigation.registerComponent('/result', () => require('./components/pages/ResultDetailsPage'));
Navigation.registerComponent('/results', () => require('./components/pages/ResultsPage'));

//Letter Pages
Navigation.registerComponent('/letter-content', () => require('./components/pages/LetterContentPage'));
Navigation.registerComponent('/letters', () => require('./components/pages/LettersPage'));
Navigation.registerComponent('/letters/about', () => require('./components/pages/LettersAboutPage'));
Navigation.registerComponent('/results/about', () => require('./components/pages/ResultAboutPage'));

//Media Pages
Navigation.registerComponent('/media', () => require('./components/pages/MediaPage'));
Navigation.registerComponent('/media/about', () => require('./components/pages/MediaAboutPage'));

//Medicines Pages
Navigation.registerComponent('/medicines', () => require('./components/pages/MedicinesPage'));
Navigation.registerComponent('/medicines/about', () => require('./components/pages/MedicinesAboutPage'));

//Messaging pages
Navigation.registerComponent('/create-message', () => require('./components/pages/CreateMessagePage'));
Navigation.registerComponent('/message', () => require('./components/pages/MessagePage'));
Navigation.registerComponent('/message-select', () => require('./components/pages/MessageSelect'));
Navigation.registerComponent('/messages', () => require('./components/pages/MessagesPage'));
Navigation.registerComponent('/recipients', () => require('./components/pages/RecipientsPage'));

//Settings page
Navigation.registerComponent('/settings', () => require('./components/pages/SettingsPage'));
Navigation.registerComponent('/settings/contact', () => require('./components/pages/settings/ContactSettingsPage'));
Navigation.registerComponent('/settings/notifications', () => require('./components/pages/settings/NotificationSettingsPage'));
Navigation.registerComponent('/settings/secret-word', () => require('./components/pages/settings/ChangeSecretWordPage'));
