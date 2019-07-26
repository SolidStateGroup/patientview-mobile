//Icon based on sort asc property

import React, {Component, PropTypes} from 'react';

const SortIcon = class extends Component {
    displayName: 'SortIcon';

    render() {
        return <ION name={this.props.asc ? "ios-arrow-up" : "ios-arrow-down"}/>
    }
};

SortIcon.propTypes = {
    asc: OptionalBool
};

module.exports = SortIcon;