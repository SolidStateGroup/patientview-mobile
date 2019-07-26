//High order component, determines max size of a view based on maxWidth, actual width and height
import React, {Component, PropTypes} from 'react';

const AutoSizer = class extends Component {
    displayName: 'AutoSizer'

    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        const {maxWidth, width, height} = this.props;
        if (this.props.maxWidth) {
            var aspectRatio = width / height;
            var desiredWidth = Math.min(maxWidth, width);
            var landscapeDimensions = {width: maxWidth, height: desiredWidth / aspectRatio}
            return this.props.children(landscapeDimensions.width, landscapeDimensions.height)
        }
        //todo: support max height
    }
};

AutoSizer.propTypes = {
    height:OptionalNumber,
    width:OptionalNumber,
    maxWidth:OptionalNumber,
};

module.exports = AutoSizer;