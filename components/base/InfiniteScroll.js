/**
 * Created by kylejohnson on 29/07/2016.
 */
var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

const InfiniteScroll = class extends React.Component {
  displayName:'InfiniteScroll'

  constructor (props, context) {
    super(props, context);
    this.state = {};
  }

  onRefresh = () => {
    this.setState({ isRefreshing: true }, this.props.onRefresh);
  }

  renderFooter = () => {
    if (this.props.isLoading && !this.state.isRefreshing) {
      return this.props.renderLoading();
    }
    return null;
  }

  componentWillReceiveProps (newProps) {
    if (this.props.isLoading && !newProps.isLoading && this.state.isRefreshing) {
      this.setState({
        isRefreshing: false
      });
    }
  }

  render () {
    return (
      <Flex>
        <ListView
          {... this.props}
          refreshControl={
            this.props.canRefresh ?
              <RefreshControl
                refreshing={this.state.isRefreshing || false}
                onRefresh={this.onRefresh}
              /> : undefined
          }
          renderRow={this.props.renderRow}
          onEndReachedThreshold={DeviceHeight * 2}
          onEndReached={!this.props.isLoading && this.props.loadMore || undefined}
          dataSource={ds.cloneWithRows(this.props.data || [])}
          renderFooter={this.renderFooter}
        />
      </Flex>
    );
  }
};

InfiniteScroll.defaultProps = {
  canRefresh: true
};

InfiniteScroll.propTypes = {
  data: RequiredArray,
  canRefresh: OptionalBool,
  onRefresh: OptionalFunc,
  isLoading: OptionalBool,
  loadMore: RequiredFunc,
  renderRow: RequiredFunc,
  renderLoading: OptionalFunc,
};

module.exports = InfiniteScroll;
