import React, {Component, PropTypes} from 'react';
import data from "../common/data/_data";

const MediaItem = class extends Component {
    displayName: 'MediaItem'

    constructor(props, context) {
        super(props, context);
        this.state = {};
    }


    shouldComponentUpdate(newProps) {
        return newProps.localPath != this.props.localPath && newProps.id != this.props.id && newProps.deleted != this.props.deleted
    }

    renderRow = (uri, deleted) => {
        var footer = (
            <Row style={{height: 44, alignItems: "center", backgroundColor: "white"}}>
                <Flex style={{minWidth: 100}}>
                    <Column>
                        <Text style={Styles.fontSizeSmall}>
                            {Format.formatBytes(this.props.filesize)}
                        </Text>
                    </Column>
                </Flex>
                <Column>
                    <Text>
                        .{Constants.simulate.SCREENSHOT ? "png" : Format.fileExtension(this.props.localPath).toLowerCase()}
                    </Text>
                </Column>
            </Row>
        )

        if (deleted) {
            return (
                <View style={{flex: 1}}>
                    <Flex style={[Styles.centeredContainer, {backgroundColor: "#f1f1f1"}]}>
                        <Text style={{fontStyle: "italic"}}>
                            Attachment deleted by user
                        </Text>
                    </Flex>
                    {footer}
                </View>
            )
        }
        switch (this.props.type) {
            case "IMAGE":
                var source = {
                    uri,
                    headers: {
                        Pragma: 'no-cache',
                        "X-Auth-Token": data.token
                    }
                };
                return (
                    <View style={{flex: 1}}>

                        <CachedImage
                            resizeMethod="resize"
                            style={{flex: 1, backgroundColor: "#f1f1f1"}}
                            source={source}
                        />

                        {footer}
                    </View>
                )
            case "VIDEO":
                return (
                    <View style={{flex: 1}}>
                        <VideoPlayer
                            resizeMode="auto"
                            style={{flex: 1}}
                            source={{uri}}
                        />
                        {footer}
                    </View>
                )
        }
    }

    render() {
        return (
            <LocalAssetProvider uri={this.props.localPath}
                                fallbackUri={Constants.simulate.SCREENSHOT ? this.props.url : Project.api.substring(0, Project.api.length - 1) + (this.props.type === 'IMAGE' ? this.props.thumbnail : this.props.path) + `?token=${data.token}`}>
                {(isLoading, uri) => !isLoading && this.renderRow(uri, this.props.deleted)}
            </LocalAssetProvider>
        );
    }
};

MediaItem.propTypes = {};

module.exports = MediaItem;