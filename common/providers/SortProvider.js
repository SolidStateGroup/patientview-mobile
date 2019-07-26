import React, {Component, PropTypes} from 'react';

const TheComponent = class extends Component {
    displayName: 'TheComponent'

    render() {
        const {items, sort, asc} = this.props;
        var result = _.sortBy([].concat(items), sort)
        result = asc ? result : result.reverse();
        return this.props.children(result)
    }
};

TheComponent.propTypes = {};

module.exports = TheComponent;