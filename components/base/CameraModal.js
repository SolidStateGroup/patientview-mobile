import React, {Component, PropTypes} from 'react';
import Camera from 'react-native-camera';
// import ImageResizer from 'react-native-image-resizer';
import RNFetchBlob from 'rn-fetch-blob';
import Fade from './animation/Fade';
const { on, off, auto } = Camera.constants.FlashMode;

const CameraModal = class extends Component {
    displayName: 'CameraModal'
    static  navigatorStyle = Object.assign({ navBarHidden: true });

    constructor (props, context) {
        super(props, context);
        this.state = {
            flashMode: auto
        };
        setTimeout(() => {
            StatusBar.setHidden(true, true);
        }, 200)
    }

    render () {
        return (
            <Flex style={{backgroundColor:'black'}}>
                <Camera
                    captureTarget={Camera.constants.CaptureTarget.disk}
                    flashMode={this.state.flashMode}
                    ref={(cam) => {
                      this.camera = cam;
                    }}
                    style={styles.preview}
                    aspect={Camera.constants.Aspect.fill}/>
                <Fade style={styles.preview} value={this.state.data?1:0}>
                    <Image
                        style={styles.preview}

                        source={{uri:this.state.path}}/>
                </Fade>
                {!this.state.data && (
                    <Row space>
                        <TouchableOpacity onPress={this.close}>
                            <Column>
                                <ION name="ios-arrow-back" style={styles.backIcon}/>
                            </Column>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.toggleFlash}>
                            <Column style={styles.flashModeContainer}>
                                <ION name="ios-flash"
                                     style={[styles.flashModeIcon, styles[this.state.flashMode]]}/>

                                <Text style={styles.flashModeText}>{this.state.flashMode == auto && 'auto'}</Text>

                            </Column>
                        </TouchableOpacity>

                    </Row>
                )}

                <Flex/>
                <Row>
                    <Flex></Flex>
                    {this.state.data ? (
                            <Row>
                                <Column>
                                    <TouchableOpacity onPress={this.cancelPicture} style={styles.optionButton}>
                                        <Text style={styles.optionButtonText}>
                                            Cancel
                                        </Text>
                                    </TouchableOpacity>
                                </Column>
                                <Column>
                                    <TouchableOpacity onPress={this.submit} style={styles.optionButton}>
                                        <Text style={styles.optionButtonText}>
                                            Confirm
                                        </Text>
                                    </TouchableOpacity>
                                </Column>
                            </Row>
                        ) : (
                            <TouchableOpacity style={styles.sendButton} onPress={this.takePicture}>
                                <View/>
                            </TouchableOpacity>
                        )}
                    <Flex></Flex>
                </Row>
            </Flex>
        );
    }

    takePicture = () => {

        this.camera.capture()
            .then((data) => {
                this.setState({ data, path: data.path })
            })
            .catch(err => console.error(err));
    };

    cancelPicture = () => {
        this.setState({ data: null });
    };

    submit = () => {
        if (this.state.data)

            if (this.props.output) {
                const { width, height, compressFormat, quality, rotation, outputPath } = this.props.output;

                if (width && height) {
                    ImageResizer.createResizedImage(this.state.path, width, height, compressFormat||'JPEG', quality, rotation, outputPath).then((resizedImageUri) => {
                        RNFetchBlob.fs.readFile(resizedImageUri, 'base64')
                            .then((data) => {
                                this.props.onSubmit && this.props.onSubmit({path:resizedImageUri,data});
                            });
                    }).catch((err) => {
                        // Oops, something went wrong. Check that the filename is correct and
                        // inspect err to get more details.
                    });

                } else {
                    RNFetchBlob.fs.readFile(this.state.path, 'base64')
                        .then((data) => {
                            this.props.onSubmit && this.props.onSubmit({path:this.state.path,data});
                        });
                }

            } else {
                this.props.onSubmit && this.props.onSubmit(this.state.path);
            }

        this.close();
    };

    toggleFlash = () => {
        var flash = this.state.flashMode;
        let newFlashMode;

        if (flash === auto) {
            newFlashMode = on;
        } else if (flash === on) {
            newFlashMode = off;
        } else if (flash === off) {
            newFlashMode = auto;
        }

        this.setState({ flashMode: newFlashMode });

    };

    close = () => {
        StatusBar.setHidden(false, true);
        this.props.navigator.dismissModal()
    }
};

CameraModal.propTypes = {};
const sendButtonSize = 64;


var s = {
    sendButton: {
        width: sendButtonSize,
        height: sendButtonSize,
        marginBottom: 20,
        borderRadius: sendButtonSize / 2,
        backgroundColor: 'transparent',
        borderWidth: 4,
        borderColor: 'white',
    },
    preview: {
        backgroundColor:'#000',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    flashModeContainer: {
        width: 50,
        alignItems: 'center'
    },
    flashModeIcon: {
        alignSelf: 'center',
        backgroundColor: 'transparent',
        color: 'white',
        fontSize: em(2.5)
    },
    backIcon: {
        backgroundColor: 'transparent',
        color: 'white',
        fontSize: em(2.5)
    },
    flashModeText: {
        marginTop: -10,
        backgroundColor: 'transparent',
        fontSize: em(1),
    },
    optionButton: {
        padding: 10,
        borderWidth: 2,
        borderColor: 'white',
        marginBottom: 20,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,.2)'
    },
    optionButtonText: {
        fontSize: em(1),
        backgroundColor: 'transparent'
    }
};

s[auto] = {
    color: '#06d000'
};

s[on] = {
    color: '#ffe500'
};

var styles = StyleSheet.create(s);

module.exports = CameraModal;