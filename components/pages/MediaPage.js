/**
 * Created by kylejohnson on 28/01/2017.
 */
import React, {Component, PropTypes} from 'react';
import {PermissionsAndroid} from 'react-native';
import MediaStore from '../../common/stores/media-store';
import MediaItem from '../MediaItem';
import ImagePicker from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs';
import Gallery from '../gallery/Gallery';
import data from '../../common/data/_data'

var padding = 10;

async function requestStoragePermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'PatientView Storage Permission',
          message:
            'PatientView needs access to your external storage ' +
            'so you can view local media.',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can read external storage');
      } else {
        console.log('Read external storage permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

const MediaPage = class extends Component {

    static navigatorStyle = global.navbarStyle;

    constructor(props, context) {
        super(props, context);
        this.state = {
            isLoading: true,
            media: Constants.simulate.SCREENSHOT ? Constants.exampleMedia : MediaStore.grouped
        };
        ES6Component(this);
    }

    async componentDidMount() {
        routeHelper.handleNavEvent(this.props.navigator, 'message', this.onNavigatorEvent);
        this.listenTo(MediaStore, 'change', () => {
            this.setState({
                isLoading: MediaStore.isLoading,
                length: MediaStore.model && MediaStore.model.length,
                isSaving: MediaStore.isSaving,
                isDeleting: MediaStore.isDeleting,
                isSharing: MediaStore.isSharing,
                media: Constants.simulate.SCREENSHOT ? Constants.exampleMedia : MediaStore.grouped,
                error: MediaStore.error,
            })
        });

        this.listenTo(MediaStore, 'saved', () => {
            this.setState({isSelecting: false})
        })
        if (Platform.OS === 'android') {
            await requestStoragePermission();
        }
        AppActions.getMedia();
    }


    onNavigatorEvent = (event) => {
        if (event.id == Constants.navEvents.SHOW) {
            Utils.recordScreenView('Media Screen');
        } else if (event.id == 'info') {
            routeHelper.showAboutMedia(this.props.navigator)
        }
    };

    processMedia = (file, type) => {
        if (!file)
            return;
        const {size, sourceURL, path, width = 1024, height = 576} = file;
        if (file.size > (Constants.maxFilesize * 1.5)) {
            MediaStore.error = `File size exceeds the maximum of ${Constants.maxFilesizeString} per individual file. Please reduce file size or select another.`
            this.setState({
                error: MediaStore.error
            });
            return;
        }
        //todo: filesize logic
        let error = "";
        return RNFS.readFile(path, 'base64')
            .then((data) => {
                if (data.length > Constants.maxFilesize || Constants.simulate.FILESIZE_WARNING) {
                    error = `File size exceeds the maximum of ${Constants.maxFilesizeString} per individual file. Please reduce file size or select another.`
                }

                if (error) {
                    MediaStore.error = error;
                    this.setState({error: MediaStore.error})
                } else {
                    const payload = {
                        type,
                        data,
                        localPath: sourceURL || path,
                        filesize: size,
                        width,
                        height
                    }
                    AppActions.uploadMedia(payload)
                }

            })

    };

    upload = () => {
        return ImagePicker.openPicker({compressImageQuality: 0.8, mediaType: "any"})
            .then((file) => {
                return this.processMedia(file, file.mime.indexOf("image") == -1 ? "VIDEO" : "IMAGE")
            });
    };


    renderRow = (media, uri) => {
        switch (media.type) {
            case "IMAGE":
                return (
                    <Image
                        resizeMode="stretch"
                        style={{flex: 1}}
                        onError={(e) => {
                            console.log(uri)
                        }}
                        source={{
                            uri,
                            headers: {
                                Pragma: 'no-cache',
                                "X-Auth-Token": data.token
                            }
                        }}
                    />
                )
            case "VIDEO":
                return (
                    <VideoPlayer
                        resizeMode="stretch"
                        style={{flex: 1}}
                        source={{uri}}
                    />
                )
        }
    }

    cancelSelection = () => {
        this.setState({selection: null, isSelecting: false});
    }

    startSelection = () => {
        this.setState({selection: [], isSelecting: true})
    }

    toggleMedia = (media) => {
        const index = this.state.selection.indexOf(media);
        if (index == -1) {
            this.setState({selection: this.state.selection.concat([media])})
        } else {
            this.state.selection.splice(index, 1);
            this.setState({selection: this.state.selection})

        }
    }

    delete = () => {
        const {selection} = this.state;
        Alert.alert(
            'Delete Media',
            `Are you sure you want to delete your media from PatientView?`,
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {
                    text: 'OK', onPress: () => {
                        AppActions.deleteMedia(selection);
                    }


                },
            ],
            {cancelable: false}
        );
    }

    onMessageSelect = (message) => {
        AppActions.shareMedia(this.state.selection, message)
    }

    share = () => {
        routeHelper.showSelectMessage(this.props.navigator, this.onMessageSelect)
    }


    selectAllMedia = () => {
        this.setState({selection: [].concat(MediaStore.model)})
    }

    onPress = (mediaItem) => {
        if (this.state.isSelecting)
            this.toggleMedia(mediaItem);
        else if (mediaItem.type == "IMAGE") {
            routeHelper.showImagePreview({
                uri: mediaItem.localPath,
                fallbackUri: Project.api.substring(0, Project.api.length - 1) + mediaItem.path
            });
        }

    };

    render() {
        const {isLoading, media, error, isSaving, isDeleting, selection, isSelecting, isSharing} = this.state;
        let savingMessage = "Uploading Media";
        if (isDeleting)
            savingMessage = "Deleting Media"
        if (isSharing)
            savingMessage = "Sharing Media"
        return (

            <NetworkProvider>
                {(isConnected) => (
                    <Flex style={[Styles.whiteContainer]}>
                        <Flex>
                            <NetworkBar
                                message="It seems you are offline, you need to be online to manage your media."/>
                            {/*Error / saving bar */}
                            <SlideUp
                                stopTimeout={3000}
                                height={64}
                                style={[{backgroundColor: error ? pallette.third : isSaving ? "#333" : "#4bb54f"}]}
                                value={isConnected && (isSaving || error)}>
                                {!error ?
                                    <Flex style={{alignItems: 'center'}}>
                                        <Fade autostart={true} value={isSaving}>
                                            <Loader/>
                                        </Fade>

                                        <Text style={[Styles.barText, Styles.textCenter]}>
                                            {isSaving ? savingMessage : "Complete ✓"}
                                        </Text>
                                    </Flex> :
                                    <Row>
                                        <Column>
                                            <ION style={{fontSize: em(2), color: 'white'}}
                                                 name="md-warning"/>
                                        </Column>
                                        <Column style={{width: DeviceWidth - 100}}>
                                            <Text style={[Styles.barText]}>
                                                {error}
                                            </Text>
                                        </Column>
                                    </Row>
                                }
                            </SlideUp>

                            <ListItem
                                style={[Styles.greyContainer, Styles.paddedContainer, {height: 54}]}>
                                <Row>
                                    <Flex>
                                        {media && !isSelecting && (
                                            <Flex>
                                                <Text>
                                                    Library size:
                                                </Text>
                                                <Text>
                                                    <Text
                                                        style={Styles.bold}>{MediaStore.total || "0MB"}</Text> of <Text
                                                    style={Styles.bold}>{Constants.maxMyMediaString}</Text>
                                                </Text>
                                            </Flex>
                                        )}
                                        {isSelecting && (
                                            <Column>
                                                <Text>
                                                    <Text
                                                        style={Styles.bold}>{selection.length}</Text> of {MediaStore.model.length} media
                                                    selected
                                                </Text>
                                                {selection.length ? <Text style={Styles.bold}>
                                                    ({MediaStore.calculateTotal(selection)})</Text> : null}

                                            </Column>
                                        )}
                                    </Flex>
                                    {isSelecting && (
                                        <Row>
                                            <Column>
                                                <Text>
                                                    Select All
                                                </Text>
                                            </Column>
                                            <Column>
                                                <View>
                                                    <TouchableWithoutFeedback
                                                        onPress={selection.length == MediaStore.model.length ? () => this.setState({selection: []}) : this.selectAllMedia}>
                                                        <ION
                                                            style={[Styles.listIcon, {
                                                                color: selection.length == MediaStore.model.length ? colour.primary : colour.listItemNav,
                                                            }]}
                                                            name={selection.length == MediaStore.model.length ? "ios-checkbox" : "ios-checkbox-outline"}/>
                                                    </TouchableWithoutFeedback>
                                                </View>
                                            </Column>
                                        </Row>
                                    )}
                                    {!isSelecting && (
                                        <Button style={{
                                            alignSelf: 'center',
                                            paddingLeft: 20,
                                            paddingRight: 20
                                        }}
                                                disabled={!isConnected || isSaving || isDeleting}
                                                onPress={this.upload}>
                                            <Text style={Styles.buttonText}>
                                                <ION style={Styles.buttonText}
                                                     name={"md-cloud-upload"}/>
                                                {" Upload Image or Video"}
                                            </Text>
                                        </Button>
                                    )}
                                </Row>
                            </ListItem>

                            {/*Action Buttons*/}

                            {media && media.length ? ( //Tile media
                                <Gallery
                                    renderSectionHeader={({section: {title}}) => (
                                        <View style={{width: DeviceWidth}}>
                                            <View style={{
                                                alignSelf: "center",
                                                marginTop: 10,
                                                padding: 10, borderRadius: 20, backgroundColor: "rgba(255,255,255,.7)"
                                            }}>
                                                <Text style={{fontWeight: 'bold'}}>{title}</Text>
                                            </View>
                                        </View>
                                    )}
                                    header={
                                        <View>
                                            <FormGroup>
                                                <Column style={Styles.alert}>
                                                    <Text>
                                                        Upload media related to your condition, such as photos from your
                                                        device. These may be securely shared with your unit in
                                                        PatientView messages.
                                                    </Text>
                                                </Column>
                                            </FormGroup>
                                        </View>
                                    }
                                    maxHeight={300}
                                    padding={5}
                                    length={this.state.length}
                                    items={media}
                                    keyExtractor={(item, index) => {
                                        return item.localPath + item.id
                                    }}
                                    renderItem={({item, index}) => {
                                        const mediaItem = Constants.simulate.SCREENSHOT ? item : MediaStore.model[index];
                                        const isSelected = this.state.selection && _.find(this.state.selection, {id: mediaItem.id})
                                        return (
                                            <LongPressProvider
                                                key={item.localPath + item.id}
                                                onLongPressIn={this.startSelection}
                                                duration={500}>
                                                {(onPressIn, onPressOut) => (
                                                    <TouchableOpacity
                                                        onPress={() => this.onPress(mediaItem)}
                                                        activeOpacity={1}
                                                        onPressIn={onPressIn}
                                                        onPressOut={onPressOut}
                                                        style={[{
                                                            marginLeft: 5,
                                                            marginRight: 5,
                                                            alignSelf: "flex-start",
                                                            width: item.data.width,
                                                            height: item.data.height + 44
                                                        },
                                                            styles.mediaItem
                                                        ]}>
                                                        <View style={{flex: 1}}>
                                                            <MediaItem {...mediaItem}/>
                                                            {isSelecting && (
                                                                <Fade autostart={true} value={true} style={[
                                                                    styles.mediaItemSelection,
                                                                    isSelected && styles.mediaItemSelected,
                                                                ]}>
                                                                    <View>
                                                                        <View style={{ //style hack
                                                                            backgroundColor: isSelected ? 'white' : "#fff",
                                                                            width: 29,
                                                                            height: 29,
                                                                            marginTop: 5,
                                                                            position: "absolute"
                                                                        }}/>
                                                                        <ION
                                                                            style={[Styles.listIcon, {
                                                                                color: isSelected ? colour.primary : colour.listItemNav,
                                                                            }]}
                                                                            name={isSelected ? "ios-checkbox" : "ios-checkbox-outline"}/>

                                                                    </View>
                                                                </Fade>
                                                            )}
                                                        </View>
                                                    </TouchableOpacity>
                                                )}
                                            </LongPressProvider>
                                        )
                                    }}
                                />
                            ) : ( //Is loading or no media
                                <FormGroup>
                                    {isLoading ? <View style={{alignSelf: "center"}}><Loader/></View> : (
                                        <Text style={Styles.textCenter}>You do not have any media items</Text>
                                    )}
                                </FormGroup>
                            )}
                        </Flex>
                        {isSelecting && (
                            <ListItem style={[Styles.greyContainer, Styles.paddedContainer, {overflow: "hidden"}]}>
                                <Flex style={{width: DeviceWidth}}>
                                    <Row>
                                        <Flex>
                                            <Row>
                                                <Button
                                                    disabled={!isConnected}
                                                    onPress={this.share} style={{backgroundColor: colour.primary}}>
                                                    Share
                                                </Button>
                                                <Column>
                                                    <Button
                                                        disabled={!isConnected}
                                                        style={{backgroundColor: colour.danger}}
                                                        onPress={this.delete}>
                                                        Delete
                                                    </Button>
                                                </Column>
                                            </Row>
                                        </Flex>

                                        <Button onPress={this.cancelSelection}>
                                            Cancel Selection
                                        </Button>
                                    </Row>
                                </Flex>
                            </ListItem>
                        )}

                    </Flex>
                )}
            </NetworkProvider>
        )
    }
};

MediaPage.propTypes = {};

var styles = StyleSheet.create({
    checkboxContainer: {
        width: 44,
        height: 44,
        borderWidth: 4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colour.primary,
        borderColor: colour.primaryDark
    },
    checkbox: {
        fontSize: em(3),
        color: "white"
    },
    mediaItemSelection: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "rgba(0,0,0,.4)"
    },
    mediaItemSelected: {
        backgroundColor: "rgba(255,255,255,.2)"

    },

    mediaItem: {
        marginTop: padding,
        marginBottom: padding,
        backgroundColor: "#f1f1f1"
    }
});

module.exports = MediaPage;
