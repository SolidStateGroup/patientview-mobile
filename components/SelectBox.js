//HTML like select input

import React, {Component, PropTypes} from 'react';

const SelectBox = (props)=>(
    <View style={{opacity: props.disabled ? 0.5 : 1}}>
        <TouchableOpacity
            activeOpacity={props.disabled ? 1 : 0.8}
            onPress={!props.disabled && props.onPress}
            style={styles.container}>
            <Row style={{flexWrap: "nowrap"}} space>
                <Flex>
                    <Text numberOfLines={1} style={styles.text}>
                        {props.children} {" "}
                    </Text>
                </Flex>
                <Column>
                    <FontAwesome style={styles.icon} name="chevron-down"/>
                </Column>
            </Row>
        </TouchableOpacity>
    </View>
);

SelectBox.displayName = "SelectBox";

SelectBox.propTypes = {
    children: OptionalNode,
    disabled:OptionalBool,
    onPress:OptionalFunc
};

module.exports = SelectBox;


var styles = StyleSheet.create({
    icon: {},
    container: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#eaeaea"
    }
});
