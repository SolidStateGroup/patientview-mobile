import React, {Component, PropTypes} from 'react';
import RNFS from 'react-native-fs';

const TheComponent = class extends Component {
    displayName: 'TheComponent'

    constructor(props, context) {
        super(props, context);
        this.state = {isLoading: true};
    }
    componentWillMount() {
        this.get(this.props)
    }
    componentWillReceiveProps(newProps) {
        if (newProps.uri != this.props.uri || newProps.fallbackUri != this.props.fallbackUri) {
            this.get(newProps)
        }
    };

    get = (props) => {
        this.setState({isLoading: true})
        if (!props.uri) {
            this.setState({uri: props.fallbackUri, isLoading: false})
        } else {
            return RNFS.exists(props.uri)
                .then((res) => {
                    this.setState({
                        uri: res && !Constants.simulate.NO_LOCAL_IMAGE ? props.uri : props.fallbackUri,
                        isLoading: false
                    });
                })
        }

    };

    render() {
        return (
            this.props.children(this.state.isLoading, this.state.uri)
        );
    }
};

TheComponent.propTypes = {};

module.exports = TheComponent;