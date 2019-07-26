//Select modal

const NativeModal = class extends React.Component {
    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this.state = {isLoading: true, value: props.value}
    }

    onNavigatorEvent(event) {
        if (event.id == 'close') {
            this.props.navigator.dismissModal();
        } else if (event.id == Constants.navEvents.SHOW) {

        } else {
        }

    }

    onDone = () => {
        this.props.navigator.dismissModal();
        this.props.onChange(this.state.value);
    };

    render() {
        const {isLoading, multiple, items} = this.props;
        const {value} = this.state;
        return (
            <Delay>
                <Flex style={[Styles.whiteContainer, Styles.container]}>
                    <Flex style={Styles.centeredContainer}><Loader/></Flex>
                    <Button>Done</Button>
                </Flex>

                <Flex style={[Styles.whiteContainer]}>
                    <KeyboardAvoidingView style={{flex: 1}} behavior={"padding"}
                                          keyboardVerticalOffset={ReactNative.Platform.OS == 'android' ? -260 : 64}>

                        { isLoading && <Flex style={Styles.centeredContainer}><Loader/></Flex> }
                        { items && <Fade style={{flex: 1}} autostart={true} value={1}>
                            <Select
                                placeholder={this.props.placeholder || "Search"}
                                items={items}
                                value={value}
                                filterText={this.props.filterText}
                                onChange={(value) => this.setState({value})}
                                multiple={multiple}
                                renderRow={(item, isSelected, toggleItem) => this.props.renderRow(item, isSelected, toggleItem)}
                                filterItem={this.props.filterItem}
                            />
                        </Fade>}
                        <Container>
                            <Button onPress={this.onDone}>Done</Button>
                        </Container>
                    </KeyboardAvoidingView>
                </Flex>
            </Delay>
        );
    }
};

module.exports = NativeModal;
