import React, {Component, PropTypes} from 'react';

const TheComponent = class extends Component {
    displayName: 'TheComponent'

    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    onPressOut = ()=> {
        if (this.timeout)
            clearTimeout(this.timeout)
    }
    onPressIn = ()=> {
        this.timeout = setTimeout(()=> {
            this.props.onLongPressIn && this.props.onLongPressIn()
            clearTimeout(this.timeout);
            this.timeout = null;
        }, this.props.duration || 500)
    }

    render() {
        return this.props.children(this.onPressIn,this.onPressOut)
    }
};

TheComponent.propTypes = {};

module.exports = TheComponent;