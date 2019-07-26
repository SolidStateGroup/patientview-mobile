
import React, {Component, PropTypes} from 'react';

const TheComponent = class extends Component {
	displayName: 'TheComponent'

	constructor(props, context) {
		super(props, context);
		var props = {};
		_.each(this.props.animatedProps, function (prop) {
			props['animated_' + prop] = new Animated.Value(this.props[prop] && !this.props.autostart ? 1 : 0);
		}.bind(this));
		this.state = props;

	}

	componentDidMount() {
		if (this.props.autostart) {
			_.each(this.props.animatedProps, function (key) {
				this.props.animation(                          // Base: spring, decay, timing
					this.state['animated_' + key],                 // Animate `bounceValue`
					{
						toValue: isNaN(this.props[key]) ? this.props[key] ? 1 : 0 : this.props[key],                         // Animate to smaller size
						duration: this.props.duration,
						friction: this.props.friction,
						tension: this.props.tension
					}
				).start();
			}.bind(this));
		}
	}

	componentWillReceiveProps(newProps) {
		_.each(newProps.animatedProps, function (key) {
			var easing = newProps.value ? newProps.easing : newProps.easingOut;
			var timeout = newProps.value ?(this.props.startTimeout||0) :(this.props.stopTimeout||0)
			if (newProps[key] != this.props[key]) {
				setTimeout(()=>{
                    newProps.animation(                          // Base: spring, decay, timing
                        this.state['animated_' + key],                 // Animate `bounceValue`
                        {
                            easing: easing,
                            toValue: isNaN(newProps[key]) ? newProps[key] ? 1 : 0 : newProps[key],                         // Animate to smaller size
                            duration: newProps.duration,
                            friction: newProps.friction,
                            tension: newProps.tension
                        }
                    ).start();
				},timeout)

			}
		}.bind(this));

	}

	render() {
		var height = this.state.animated_value.interpolate({
			inputRange: [0, 1, 2],
			outputRange: [0, this.props.height, this.props.zoomedHeight]  // 0 : 150, 0.5 : 75, 1 : 0
		});
		return (
			<Animated.View
				style={[{ overflow: 'hidden', justifyContent: 'center', height: height }, this.props.style]}>
				{this.props.children}
			</Animated.View>
		);
	}
};

TheComponent.defaultProps = {
	animation: Animated.timing,
	duration: 300,
	friction: 5,
	tension: 20,
	easing: Easing.inOut(Easing.ease),
	easingOut: Easing.linear(Easing.ease),
	animatedProps: ['value']
};

module.exports = TheComponent;
