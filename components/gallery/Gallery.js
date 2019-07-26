/**
 * Created by kylejohnson on 22/05/2016.
 */
/**
 * Created by kylejohnson on 04/05/2016.
 */
import gridify from './gridify';

module.exports = class extends React.Component {
    constructor(props) {
        super();
        this.gridify(props);

        this.state = {data: props.items};
    }

    gridify = (props) => {
        _.each(props.items, ({data}) => {
            gridify(data || [],
                () => DeviceWidth - (props.padding * 2),
                this.calculateWidth,
                this.calculateHeight,
                () => props.maxHeight,
                props.padding
            );
        });
    };

    componentWillReceiveProps(newProps) {
        if (this.props.length !== newProps.length) {
            this.gridify(newProps);
            this.setState({data: newProps.items});
        }
    }

    calculateWidth(item) {
        if (item.width) {
            return item.width;
        }
        return 1920
    }

    calculateHeight(item) {
        if (item.height) {
            return item.height;
        }
        return 1080
    }

    render() {
        return this.props.items ? (
            <Flex style={{padding: this.props.padding}}>
                <SectionList
                    stickySectionHeadersEnabled={true}
                    sections={this.state.data}
                    initialNumToRender={6}
                    maxToRenderPerBatch={2}
                    scrollEventThrottle={20}
                    removeClippedSubviews={true}
                    renderSectionHeader={this.props.renderSectionHeader}
                    contentContainerStyle= {{ flexWrap: 'wrap', flexDirection: 'row', }}
                    keyExtractor={this.props.keyExtractor}
                    renderItem={this.props.renderItem}
                    renderScrollComponent={(props) => <ScrollCompWithHeader {...props} header={this.props.header}/>}

                />
            </Flex>
        ) : <View/>
    }
};


const ScrollCompWithHeader = ({stickyHeaderIndices, header, children, ...otherProps}) => (
    <ScrollView
        {...otherProps}
        stickyHeaderIndices={header ?
            stickyHeaderIndices.map((i) => i + 1) :
            stickyHeaderIndices}
    >
        {header}
        {children}
    </ScrollView>
);