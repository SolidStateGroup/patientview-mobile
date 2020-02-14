var currentScreen = '/';
import AccountStore from './common/stores/account-store'
import {Navigation} from "react-native-navigation";

//All navigation occurs here to ensure route properties are kept consistent

module.exports = {


    //Global handling for pages - can plug into analytics / deep linking
    handleNavEvent: (navigator, id, cb) => {
        navigator.setOnNavigatorEvent((event) => {
            switch (event.id) {
                case 'willAppear':
                    global.currentNavigator = navigator;
                    global.currentScreen = id;
                    break;
                case 'didAppear':
                    break;
                case 'willDisappear':
                    break;
                case 'didDisappear':
                    break;
            }

            if (event.type == 'DeepLink') {
                //Handle deep linking
                routeHelper[event.link] && routeHelper[event.link](navigator);
            } else if (event.id == 'side-menu') {
                //Handle open drawer
            }

            cb && cb(event);

        });
    },

    logout: (navigator) => {

        AppActions.logout();
        SecuredStorage.clear().then(() => {
            if (AccountStore.getUser()) {
                if (currentScreen !== 'login') {
                    navigator.resetTo({
                        title: 'PatientView',
                        navBarButtonColor: '#ffffff',
                        navigatorStyle: {
                            navBarButtonColor: '#ffffff',
                            screenBackgroundColor: '#fff',
                        },
                        screen: '/login', // unique ID registered with Navigation.registerScreen
                        navigatorButtons: {
                            leftButtons: []
                        }, // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
                    });
                }
            }
        });

        setTimeout(() => { //Workaround: race condition with navigation and modals
            Navigation.dismissAllModals();
        }, 2000);


    },

    showImagePreview: (source) => {
        Navigation.showModal({
            screen: "/image-preview",
            navigatorButtons: _.cloneDeep(global.modalNavButtons),
            title:"Your Media",
            subtitle:"Pinch to zoom in/out",
            passProps: {...source}
        })
    },

    //Login redirect if user is not logged in
    loginWall: (navigator, route, replace) => {
        if (AccountStore.getUser()) { // user already logged in
            if (replace) {
                navigator.resetTo(route);
            } else {
                navigator.push(route);
            }
        } else {
            navigator.push({
                screen: "/login",
                title: "Login",
                passProps: {
                    route,
                    onLogin: () => {
                        if (AccountStore.getUser()) {
                            navigator.resetTo(Object.assign({}, route));
                        } else {
                            navigator.resetTo({
                                screen: "/secret-word",
                                title: "Enter your Secret Word",
                                passProps: {
                                    route,
                                    onLogin: () => {
                                        navigator.resetTo(Object.assign({}, route));
                                    }
                                }
                            })
                        }

                    }
                }
            });
        }
    },

    goResults: (navigator) => {
        navigator.push({
            screen: "/results",
            title: "Your Results",
            backButtonTitle: "",
            passProps: {}
        });
    },

    goAbout: (navigator) => {
        navigator.push({
            screen: "/about",
            title: "About",
            backButtonTitle: "",
            passProps: {}
        });
    },

    openWebModal: (navigator, uri, title) => {
        navigator.showModal({
            screen: "/webmodal",
            title: title || '',
            navigatorButtons: _.cloneDeep(global.modalNavButtons),
            navigatorStyle: global.navbarStyle,
            passProps: {uri, title}
        });
    },

    openSelect: (navigator, title, {items, renderRow, value, onChange, multiple, filterItem, filterText, placeholder}) => {
        navigator.showModal({
            screen: "/select",
            title: title || '',
            navigatorButtons: _.cloneDeep(global.modalNavButtons),
            navigatorStyle: global.navbarStyle,
            passProps: {items, value, filterText, renderRow, onChange, multiple, filterItem, placeholder}
        });
    },

    showSelectMessage: (navigator, onSelect) => {
        navigator.showModal({
            screen: "/message-select",
            title: 'Select Conversation',
            navigatorButtons: _.cloneDeep(global.modalNavButtons),
            navigatorStyle: global.navbarStyle,
            passProps: {onSelect}
        });
    },

    openSetSecretWord: (navigator) => {
        navigator.showModal({
            screen: "/set-secret-word",
            title: 'Setup Your Account',
            backButtonHidden: true,
            overrideBackPress: true,
            navigatorStyle: global.navbarStyle,
        });
    },

    showSecretWordChallenge: (onCorrect, onFail, enableBiometrics) => {
        Navigation.showModal({
            screen: "/secret-word-challenge",
            title: "Welcome Back",
            overrideBackPress: true,
            backButtonHidden: true,
            navigatorButtons: {
                leftButtons: []
            },
            passProps: {
                onCorrect, onFail, enableBiometrics
            }
        });
    },

    goSettings: (navigator) => {
        navigator.push({
            screen: "/settings",
            title: 'Settings',
            backButtonTitle: "",
            navigatorStyle: global.navbarStyle,
            passProps: {
                logout: () => {
                    routeHelper.logout(navigator);
                }
            }
        });
    },

    goMedia: (navigator) => {
        navigator.push({
            screen: "/media",
            title: 'My Media',
            backButtonTitle: "",
            navigatorStyle: global.navbarStyle,
            navigatorButtons: {
                rightButtons: [
                    {
                        title: "Instructions", // for icon button, provide the local image asset name
                        id: 'info', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                    }
                ],
            },
            passProps: {}
        });
    },

    goContactSettings: (navigator) => {
        navigator.push({
            screen: "/settings/contact",
            title: "Change Contact Details",
            backButtonTitle: "",
            passProps: {}
        });
    },

    goNotificationSettings: (navigator) => {
        navigator.push({
            screen: "/settings/notifications",
            title: "Notification Settings",
            backButtonTitle: "",
            passProps: {}
        });
    },

    goSecretWordSettings: (navigator) => {
        navigator.push({
            screen: "/settings/secret-word",
            title: "Change Secret Word",
            backButtonTitle: "",
            passProps: {}
        });
    },

    goChat: (navigator, {name, _id}) => {
        navigator.push({
            screen: "/chat",
            title: "Chat",
            backButtonTitle: "",
            passProps: {group: {name, _id}}
        });
    },

    goResult: (navigator, result, resultB) => {
        let results = [result];
        if (resultB)
            results.push(resultB)

        navigator.push({
            screen: "/result",
            title: result.name,
            subtitle: result.units,
            backButtonTitle: "",
            navigatorButtons: {
                rightButtons: [
                    {
                        title: "About", // for icon button, provide the local image asset name
                        id: 'info', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                    }
                ],
            },
            passProps: {results}
        });
    },

    goConditions: (navigator) => {
        navigator.push({
            screen: "/conditions",
            title: "My Conditions",
            backButtonTitle: "",
            passProps: {result}
        });
    },

    goMedicines: (navigator) => {
        navigator.push({
            screen: "/medicines",
            title: "Medicines",
            backButtonTitle: "",
            navigatorButtons: {
                rightButtons: [
                    {
                        title: "About", // for icon button, provide the local image asset name
                        id: 'info', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                    }
                ],
            },
            passProps: {}
        });
    },

    goMessages: (navigator) => {
        navigator.push({
            screen: "/messages",
            title: "Messages",
            backButtonTitle: "",
            navigatorButtons: {
                rightButtons: [
                    {
                        disableIconTint: false,
                        title: "Create New", // for icon button, provide the local image asset name
                        id: 'create', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                    }
                ],
            },
            passProps: {}
        });
    },

    goCreateMessage: (navigator, onCreate) => {
        navigator.showModal({
            screen: "/create-message",
            title: "Create New Conversation",
            backButtonTitle: "",
            navigatorButtons: _.cloneDeep(global.modalNavButtons),
            passProps: {onCreate}
        });
    },

    showRecipientsModal: (navigator, conversation) => {
        navigator.showModal({
            screen: "/recipients",
            title: "Recipients",
            backButtonTitle: "",
            navigatorButtons: _.cloneDeep(global.modalNavButtons),
            passProps: {conversation}
        });
    },

    goMessage: (navigator, message) => {
        navigator.push({
            screen: "/message",
            title: message.title,
            backButtonTitle: "",
            navigatorButtons: {
                rightButtons: [
                    {
                        icon: iconsMap['md-more'], // for icon button, provide the local image asset name
                        id: 'side-menu', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                    }
                ],
            },
            passProps: {message}
        });
    },

    showAboutMedicines: (navigator) => {
        navigator.showModal({
            screen: "/medicines/about",
            title: "About medicines",
            navigatorButtons: _.cloneDeep(global.modalNavButtons),

            backButtonTitle: "",
            passProps: {}
        });
    },

    showAboutMedia: (navigator) => {
        navigator.showModal({
            screen: "/media/about",
            title: "My Media Instructions",
            navigatorButtons: _.cloneDeep(global.modalNavButtons),

            backButtonTitle: "",
            passProps: {}
        });
    },

    showAboutResult: (navigator, result) => {
        navigator.showModal({
            screen: "/results/about",
            title: `${result.name} Information`,
            navigatorButtons: _.cloneDeep(global.modalNavButtons),
            backButtonTitle: "",
            passProps: {result}
        });
    },

    showInfoModal: (navigator, title, message, subtitle) => {
        navigator.showModal({
            screen: "/info",
            title,
            navigatorButtons: _.cloneDeep(global.modalNavButtons),
            backButtonTitle: "",
            passProps: {title, message, subtitle}
        });
    },
    showAboutLetters: (navigator) => {
        navigator.showModal({
            screen: "/letters/about",
            title: "About letters",
            navigatorButtons: _.cloneDeep(global.modalNavButtons),

            backButtonTitle: "",
            passProps: {}
        });
    },

    goLetters: (navigator) => {
        navigator.push({
            screen: "/letters",
            title: "Letters",
            backButtonTitle: "",
            navigatorButtons: {
                rightButtons: [
                    {
                        title: "About", // for icon button, provide the local image asset name
                        id: 'info', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                    }
                ],
            },
            passProps: {}
        });
    },

    goEnterResults: (navigator) => {
        navigator.push({
            screen: "/enter-results",
            title: "Enter Own Data",
            backButtonTitle: "",
            passProps: {}
        });
    },

    goEditResults: (navigator) => {
        navigator.push({
            screen: "/edit-results",
            title: "Edit Own Results",
            backButtonTitle: "",
            passProps: {}
        });
    },

    showEditResult: (navigator, result) => {
        navigator.showModal({
            screen: "/edit-result",
            title: "Edit Own Results",
            backButtonTitle: "",
            navigatorButtons: _.cloneDeep(global.modalNavButtons),
            passProps: {result}
        });
    },

    goEnterResult: (navigator, resultCluster) => {
        navigator.showModal({
            screen: "/enter-result",
            title: "Results Entry",
            subtitle: resultCluster.name,
            backButtonTitle: "",
            passProps: {resultCluster},
            navigatorButtons: _.cloneDeep(global.modalNavButtons),

        });
    },

    showLetterContent: (navigator, letter) => {
        navigator.showModal({
            screen: "/letter-content",
            navigatorButtons: _.cloneDeep(global.modalNavButtons),
            title: "Letter",
            backButtonTitle: "",
            passProps: {letter}
        });
    },

    goAccount: function (navigator) {
        routeHelper.loginWall(navigator, { //Ensure user is logged in first
            screen: "/account",
            title: "Your Dashboard",
            backButtonTitle: "",
            navigatorButtons: {
                rightButtons: [
                    {
                        icon: iconsMap['md-more'], // for icon button, provide the local image asset name
                        id: 'side-menu', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                    }
                ],
            },
            passProps: {}
        }, true)
    },

    goINSDiaryRecordings: (navigator) => {
        navigator.push({
            screen: "/ins-diary-recordings",
            title: "INS Diary Recordings",
            backButtonTitle: "",
            passProps: {}
        });
    },

    goINSDiaryRecording: (navigator, entry, edit) => {
        navigator.push({
            screen: "/ins-diary-recording",
            title: `${entry ? 'Editing' : 'New'} Recording`,
            backButtonTitle: "",
            passProps: { entry, edit }
        })
    },

    addRelapseMedication: (navigator, onAdd) => {
        navigator.showModal({
            screen: '/add-relapse-medication',
            title: 'Add Medication',
            backButtonTitle: "",
            passProps: { onAdd }
        });
    },

    goINSHospitalisation: (navigator, entry) => {
        navigator.push({
            screen: "/ins-hospitalisation",
            title: `${entry ? 'Editing' : 'New'} Hospitalisation`,
            backButtonTitle: "",
            passProps: { entry }
        })
    },

    goINSImmunisation: (navigator, entry) => {
        navigator.push({
            screen: "/ins-immunisation",
            title: `${entry ? 'Editing' : 'New'} Immunisation`,
            backButtonTitle: "",
            passProps: { entry }
        })
    },



    // closeDrawer: (navigator) => {
    //     navigator.toggleDrawer({
    //         to: 'closed',
    //         side: 'right',
    //         animated: true
    //     });
    // },
    //
    // openDrawer: (navigator) => {
    //     navigator.toggleDrawer({
    //         side: 'right',
    //         animated: true
    //     });
    // },

    // showCamera: (navigator, width, height, onSubmit, quality = 80) => {
    //     navigator.showModal({
    //         screen: "/camera",
    //         navigatorButtons: _.cloneDeep(global.modalNavButtons),
    //         passProps: {
    //             onSubmit,
    //             output: {
    //                 width, height, quality
    //             }
    //         }
    //     });
    // },
    //
    //
    // openContactModal: (navigator, title, onChange, multiple) => {
    //     navigator.showModal({
    //         screen: "/select-contact",
    //         title: title || '',
    //         navigatorButtons: _.cloneDeep(global.modalNavButtons),
    //         navigatorStyle: global.navbarStyle,
    //         passProps: {onChange, multiple}
    //     });
    // },
};