import React, {Component, PropTypes} from 'react';

const Delay = class extends Component {
    displayName: 'Delay'

    constructor (props, context) {
        super(props, context);
        this.state = {};
        setTimeout(() => this.setState({ ready: true }), this.props.delay);
    }

    render () {
        return this.props.children[this.state.ready ? 1 : 0]
    }
};

Delay.propTypes = {};
Delay.defaultProps = {
    delay: 50
};

module.exports = Delay;