//View with standardised vertical spacing

import React, {PropTypes} from 'react';

const FormGroup = (props)=>(
    <View style={[Styles.formGroup, props.style]}>
      {props.children}
    </View>
);

FormGroup.displayName = "FormGroup";

FormGroup.propTypes = {
  children: OptionalObject
};

module.exports = FormGroup;
