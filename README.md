PatientView Mobile
=============

PatientView shows patients' latest test results plus information about their diagnosis and treatment. They can share 
this information with anyone they want, and view it from anywhere in the world. PatientView has developed from a project 
launched for patients of Renal Units, but has expanded to be able to show information for others too. It requires your 
local unit to have joined. (e.g. renal unit, diabetes unit, IBD unit)

Prerequisites 
==================
```
brew install node
brew install watchman
npm install -g react-native-cli
```


Install
==================
```
npm i
```

Running
==================

***Note: this project requires you to add a file called integrity-check.js at the root of the project, we've added a sample one for convience which can be renamed accordingly***


Android - open an android similator simulator and run
```
adb reverse tcp:8081 tcp:8081  && react-native run-android
```

iOS - Run in XCode

Technology
==========

PatientView 2 (PV2) uses [ReactNative](https://facebook.github.io/react-native/) to allow for cross platform native app development. The following is a summary of noteworthy libraries used:

- lottie for native JSON based animations 
- lodash for common utilities
- momentjs for date functionality
- react-native-cached-image for OS level image caching
- react-native-charts-wrapper for a highly performant virtualised charts
- fabric/crashlytics for detailed crash reporting
- firebase for analytics and push notifications
- simple-crypto-js and react-native-simple-encryption for encrypting local data
- react-native-image-crop-picker for uploading media
- react-native-photo-view for full screen pinch zooming images
- react-native-navigation for a truly native navigation stack 

Active Development
==================

Active development is either on develop or branches off develop to be merged in via pull request. The develop branch is
considered the latest version of the code but may include incomplete features or code.

New release branches are named after their version number, e.g. 2.0.1-RELEASE. When a release is finalised a new branch
is created and then merged into master, so master is considered the latest stable release.

Secured Storage
========

All data stored in local storage on Android / iOS is encrypted against a secure salt using Android and iOS keystore with biometric encryption.
