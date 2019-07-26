import React, {Component, PropTypes} from 'react';

const Row = (props)=>(
    <View style={[Styles.row, props.space && { justifyContent: 'space-between' }, props.style]}>
      {props.children}
    </View>
);

Row.displayName = "Row";

Row.propTypes = {
  children: oneOfType([OptionalObject, OptionalArray])
};

module.exports = Row;
