import React, {Component, PropTypes} from 'react';

const Divider = (props)=>(
    <View style={[Styles.divider, props.style]}/>
);

Divider.displayName = "Divider";

Divider.propTypes = {
};

module.exports = Divider;
