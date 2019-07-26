/**
 * Created by Kyle on 17/06/2016.
 */
const Container = (props) => (
  <View style={[Styles.container, props.style]}>{props.children}</View>
);

Container.propTypes = {
  style: React.PropTypes.any,
  children: React.PropTypes.any
};

module.exports = Container;
