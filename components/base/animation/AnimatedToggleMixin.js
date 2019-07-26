/**
 * Created by kylejohnson on 09/01/2016.
 * deprecated, copy existing logic to components you wish to animate
 */
module.exports = {
  getDefaultProps: function () {
    return {
      animation: Animated.timing,
      duration: 300,
      friction: 5,
      tension: 20,
      easing: Easing.inOut(Easing.ease),
      easingOut: Easing.linear(Easing.ease),
      animatedProps: ['value']
    };
  },
  getInitialState: function () {
    var props = {};
    _.each(this.props.animatedProps, function (prop) {
      props['animated_' + prop] = new Animated.Value(this.props[prop] && !this.props.autostart ? 1 : 0);
    }.bind(this));
    return props;
  },
  componentDidMount: function () {
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
  },
  componentWillReceiveProps: function (newProps) {
    _.each(newProps.animatedProps, function (key) {
      var easing = newProps.value ? newProps.easing : newProps.easingOut;
      if (newProps[key] != this.props[key]) {
        const timeout = (newProps[key]?newProps.startTimeout:newProps.stopTimeout) || 0;
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
        },timeout);

      }
    }.bind(this));

  }
};
