// import React, {Component, PropTypes} from 'react';
// import Interactable from 'react-native-interactable';
// const TheComponent = class extends Component {
//     displayName: 'TheComponent'
//
//     constructor(props) {
//         super(props);
//         this._deltaX = new Animated.Value(0);
//     }
//
//     render() {
//         return (
//             <View style={{ backgroundColor: '#de6d77' }}>
//
//
//                 {/*Left buttons*/}
//                 <View style={{ position: 'absolute', left: 0, height: 75, flexDirection: 'row', alignItems: 'center' }}>
//                     <TouchableOpacity onPress={this.onButtonPress.bind(this, 'done')}>
//                         <ION name="ios-arrow-forward" style={[styles.buttonLeft,
//                             {
//                                 opacity: this._deltaX.interpolate({
//                                     inputRange: [50, 90],
//                                     outputRange: [0, 1],
//                                     extrapolateLeft: 'clamp',
//                                     extrapolateRight: 'clamp'
//                                 }),
//                                 transform: [{
//                                     scale: this._deltaX.interpolate({
//                                         inputRange: [50, 90],
//                                         outputRange: [0.7, 1],
//                                         extrapolateLeft: 'clamp',
//                                         extrapolateRight: 'clamp'
//                                     })
//                                 }]
//                             }
//                         ]}/>
//                     </TouchableOpacity>
//                 </View>
//
//                 {/*Main content*/}
//                 <Interactable.View
//                     horizontalOnly={true}
//                     boundaries={
//                         { left: -155, bounces: false, right: 90 }
//                     }
//                     snapPoints={[
//                         { x: 90, damping: 1 - this.props.damping, tension: this.props.tension },
//                         { x: 0, damping: 1 - this.props.damping, tension: this.props.tension },
//                         { x: -155, damping: 1 - this.props.damping, tension: this.props.tension }
//                     ]}
//                     dragToss={0.01}
//                     animatedValueX={this._deltaX}>
//                     <View style={{ left: 0, right: 0, height: 75, backgroundColor: 'white' }}>
//                         {this.props.children}
//                     </View>
//                 </Interactable.View>
//
//                 {/*Right View*/}
//                 <View
//                     style={{ position: 'absolute', right: 0, height: 75, flexDirection: 'row', alignItems: 'center' }}>
//                     <View onPress={this.onButtonPress.bind(this, 'trash')}>
//                         <ION name="ios-arrow-forward" style={
//                             [styles.buttonRight, {
//                                 opacity: this._deltaX.interpolate({
//                                     inputRange: [-155, -115],
//                                     outputRange: [1, 0],
//                                     extrapolateLeft: 'clamp',
//                                     extrapolateRight: 'clamp'
//                                 }),
//                                 transform: [{
//                                     scale: this._deltaX.interpolate({
//                                         inputRange: [-155, -115],
//                                         outputRange: [1, 0.7],
//                                         extrapolateLeft: 'clamp',
//                                         extrapolateRight: 'clamp'
//                                     })
//                                 }]
//                             }
//                             ]}/>
//                     </View>
//                     <View onPress={this.onButtonPress.bind(this, 'snooze')}>
//                         <ION name="ios-arrow-forward" style={
//                             [styles.buttonRight, {
//                                 opacity: this._deltaX.interpolate({
//                                     inputRange: [-90, -50],
//                                     outputRange: [1, 0],
//                                     extrapolateLeft: 'clamp',
//                                     extrapolateRight: 'clamp'
//                                 }),
//                                 transform: [{
//                                     scale: this._deltaX.interpolate({
//                                         inputRange: [-90, -50],
//                                         outputRange: [1, 0.7],
//                                         extrapolateLeft: 'clamp',
//                                         extrapolateRight: 'clamp'
//                                     })
//                                 }]
//                             }
//                             ]}/>
//                     </View>
//                 </View>
//             </View>
//         );
//     }
//
//     onButtonPress(name) {
//         alert(`Button ${name} pressed`);
//     }
// };
//
// TheComponent.propTypes = {};
//
//
// var styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: 'white'
//     },
//     rowContent: {
//         flex: 1,
//         flexDirection: 'row',
//         alignItems: 'center',
//         borderBottomWidth: 1,
//         borderColor: '#eeeeee'
//     },
//     rowIcon: {
//         fontSize: 50,
//         borderRadius: 25,
//         backgroundColor: '#73d4e3',
//         margin: 20
//     },
//     rowTitle: {
//         fontWeight: 'bold',
//         fontSize: 20
//     },
//     rowSubtitle: {
//         fontSize: 18,
//         color: 'gray'
//     },
//     buttonRight: {
//         width: 40,
//         height: 40,
//         fontSize: 40,
//         color: 'white',
//         textAlign: 'center',
//         marginRight: 25
//     },
//     buttonLeft: {
//         fontSize: 40,
//         width: 40,
//         height: 40,
//         color: 'white',
//         textAlign: 'center',
//         marginLeft: 25
//     },
//     slider: {
//         height: 40
//     }
// });
//
//
// TheComponent.defaultProps = {
//     damping: 0.4
// }
// module.exports = TheComponent;
