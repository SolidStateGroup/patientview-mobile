import React, {Component, PropTypes} from 'react';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

import INSDiaryRecordingsTab from './INSDiaryRecordingsTab';
import HospitalisationsTab from './HospitalisationsTab';
import ImmunisationsTab from './ImmunisationsTab';

// import EditResultTable from '../EditResultTable'
const initialLayout = { width: Dimensions.get('window').width };

const TheComponent = class extends Component {
    displayName: 'TheComponent'
    static navigatorStyle = global.navbarStyle;

    constructor(props, context) {
        super(props, context);
        this.state = {
            index: 0,
            routes: [
                { key: 'add-diary-recording', title: 'Diary Recordings', accessibilityLabel: 'Diary Recordings' },
                { key: 'hospitalisations', title: 'Hospitalisations', accessibilityLabel: 'Hospitalisations' },
                { key: 'immunisations', title: 'Immunisations', accessibilityLabel: 'Immunisations' },
            ]
        };
        ES6Component(this)
    }

    componentDidMount() {
        routeHelper.handleNavEvent(this.props.navigator, 'ins-diary-recordings', this.onNavigatorEvent);
    }

    onNavigatorEvent = (event) => {
        if (event.id == Constants.navEvents.SHOW) {
            Utils.recordScreenView('INS Diary Recording Screen');
        }
        if (event.id == 'close') {
            this.props.navigator.dismissModal();
        }
    };

    onEndReached = () => {
        if (!INSDiaryRecordingsStore.hasMoreRecordings()) return;
        AppActions.getMoreINSDiaryRecordings();
    }

    setIndex = (index) => this.setState({index});

    renderTabBarLabel = ({route, focused, color}) => (
        <Text style={Styles.tabBarLabel}>
            {route.title}
        </Text>
    )

    renderTabBar = (props) => (
        <TabBar
            {...props}
            style={Styles.tabBar}
            renderLabel={this.renderTabBarLabel}
            indicatorStyle={Styles.tabBarIndicator}
            contentContainerStyle={{padding: 0}}
            scrollEnabled
            tabStyle={Styles.tabBarTab}
        />
    )

    renderScene = ({ route, jumpTo }) => {
        switch (route.key) {
            case 'add-diary-recording':
                return <INSDiaryRecordingsTab navigator={this.props.navigator} />;
            case 'hospitalisations':
                return <HospitalisationsTab navigator={this.props.navigator} />
            case 'immunisations':
                return <ImmunisationsTab navigator={this.props.navigator} />
        }
    }

    render() {
        const { routes, index } = this.state;
        return (
            <TabView
                navigationState={{ index, routes }}
                renderScene={this.renderScene}
                onIndexChange={this.setIndex}
                initialLayout={initialLayout}
                renderTabBar={this.renderTabBar}
            />
        )
    }
};

TheComponent.propTypes = {};

module.exports = TheComponent;