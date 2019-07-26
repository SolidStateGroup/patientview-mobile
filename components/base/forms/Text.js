module.exports = ({style,children,...props})=>(
    <ReactNative.Text {...props} style={[Styles.text, style]}>{children}</ReactNative.Text>
)