//Custom video player with cross platform full screen support

import React, {Component, PropTypes} from 'react';
import Video from 'react-native-video';

var {showVideoPlayer} = require('react-native-native-video-player');

const VideoPlayer = class extends Component {
    displayName: 'VideoPlayer';

    constructor(props, context) {
        super(props, context);
        this.state = {paused: true};
    }

    setTime = ({currentTime, playableDuration}) => {
        this.setState({
            currentTime: Format.duration(currentTime),
            playableDuration: Format.duration(playableDuration),
        })
    };

    play = () => {
        this.setState({paused: !this.state.paused})
    };

    fullScreen = () => {
        if (Platform.OS == "android") { //Android video player doesn't support fullscreen, launch an intent
            this.setState({paused: true})
            showVideoPlayer(this.props.source.uri);
        } else {
            this.player && this.player.presentFullscreenPlayer();
        }
    };

    onFullscreenPlayerWillDismiss = () => {

    };

    onEnd = () => {
        this.setState({paused: true, currentTime: 0})
    };

    render() {
        const {paused} = this.state;
        return (
            <Flex style={{backgroundColor: "black"}}>

                <Video
                    ref={(ref) => this.player = ref}
                    onEnd={this.onEnd}
                    onFullscreenPlayerWillDismiss={this.onFullscreenPlayerWillDismiss}
                    onProgress={this.setTime}
                    paused={this.state.paused}
                    onError={err => console.log(err)}
                    {...this.props}
                />

                {/*Player Controls*/}
                <Row style={styles.playerActionButtonContainer}>
                    <Flex>
                        <Row>
                            <TouchableOpacity onPress={this.play}>
                                <Column>
                                    <ION name={paused ? "md-play" : "md-pause"} style={styles.playerActionButtonText}/>
                                </Column>
                            </TouchableOpacity>
                        </Row>
                    </Flex>
                    <TouchableOpacity onPress={this.fullScreen}>
                        <Column>
                            <ION name="md-expand" style={styles.playerActionButtonText}/>
                        </Column>
                    </TouchableOpacity>
                </Row>

            </Flex>
        );
    }
};

VideoPlayer.propTypes = {
    source: RequiredObject,
    style: Any,
    resizeMode: Any
};

var styles = StyleSheet.create({
    playerActionButtonContainer: {
        height: 33,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "transparent"
    },
    durationText: {
        color: 'white',
        fontSize: em(0.9)
    },
    playerActionButton: {},
    playerActionButtonText: {
        color: 'white',
        textShadowColor: 'rgba(0,0,0,.5)',
        textShadowOffset: {width: 0, height: 0},
        textShadowRadius: em(0.5),

        fontSize: em(1.5)
    }
});

module.exports = VideoPlayer;