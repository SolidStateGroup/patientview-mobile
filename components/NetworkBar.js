//Displays a network warning if the user is offline
module.exports = (props) => (
    <NetworkProvider>
        {(isConnected) => (
            <View>
                <SlideUp duration={200}
                         style={ [{ backgroundColor: pallette.third }]}
                         value={!isConnected} height={64}>
                    <Row>
                        <Column>
                            <ION style={{ fontSize: em(2), color: 'white' }} name="md-warning"/>
                        </Column>
                        <Column style={{width:DeviceWidth-100}}>
                            <Text style={[Styles.barText]}>
                                {props.message || "It seems you are offline, you need to be online to update your details."}
                            </Text>
                        </Column>
                    </Row>
                </SlideUp>
            </View>
        )}
    </NetworkProvider>
);