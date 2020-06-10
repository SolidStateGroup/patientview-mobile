import RNFetchBlob from 'rn-fetch-blob';
import ImageResizer from 'react-native-image-resizer';

var data = require('./_data');

const API_KEY = 'abeTrziLeb1oOM8tUU2BG4QXJVr8rTaJ51raWzCC';

module.exports = {
    upload: (userId, originalImage) => {
        let promise = Promise.resolve(originalImage);
        if (originalImage.size > 1048576) {
            console.log('Resizing medpic image as it exceeds 1MB', originalImage);
            promise = ImageResizer.createResizedImage(originalImage.path, 2250, 2250, 'JPEG', 80)
                .then(response => {
                    console.log('Resized medpic image:', response);
                    return { ...originalImage, path: response.path };
                });
        }

        return promise.then(image => {
            return RNFetchBlob.fetch('POST', `${Project.medpicApi}upload`, {
                'patientId': userId.toString(),
                'x-api-key': API_KEY,
                'Content-Type': image.mime,
            }, RNFetchBlob.wrap(image.path))
        })
        .then(res => res.text())
        .then(res => {
            try {
                res = JSON.parse(res)
            } catch (e) {
                return Promise.reject(e);
            }
            return res;
        });
    },
    getBPM: (userId, filename) => {
        return data.get(`${Project.medpicApi}bpm`, null, false, {
            patientId: userId,
            'x-api-key': API_KEY,
            filename,
        }).then(res => {
            return res;
        }).catch(e => {
            console.log(e);
            return Promise.reject(e);
        })
    },
}
