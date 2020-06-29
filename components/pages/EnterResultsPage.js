import React, {Component, PropTypes} from 'react';
import ImagePicker from 'react-native-image-crop-picker';

import api from '../../common/data/results';
import { upload, getBPM } from '../../common/data/medpic';

const TheComponent = class extends Component {
    displayName: 'TheComponent'
    static navigatorStyle = global.navbarStyle;

    constructor(props, context) {
        super(props, context);
        this.state = {isLoading: true, isSaving: false};
        ES6Component(this)
    }


    componentWillMount() {
        this.listenTo(ResultClustersStore, "change", () => {
            this.setState({
                resultClusters: ResultClustersStore.model,
                isLoading: ResultClustersStore.isLoading
            })
        });
        AppActions.getResultClusters();
        routeHelper.handleNavEvent(this.props.navigator, 'enter-result', this.onNavigatorEvent);
    }


    onNavigatorEvent = (event) => {
        if (event.id == Constants.navEvents.SHOW) {
            Utils.recordScreenView('Enter Results Screen');
        }
        if (event.id == 'close') {
            this.props.navigator.dismissModal();
        }
    };

    takeMedPicPhoto = async (camera) => {
        const userId = AccountStore.getUserId();
        const imageOptions = {
            mediaType: 'photo',
        };
        const promise = !Constants.simulate.MEDPIC ? camera ? ImagePicker.openCamera(imageOptions) : ImagePicker.openPicker(imageOptions) : Promise.resolve({});
        promise.then(res => {
            this.setState({isSaving: true});
            return upload(userId, res)
        }).then(({filename}) => {
            return getBPM(userId, filename);
        }).then(res => {
            const { result, ErrorDetails, ErrorMessage, ErrorCode } = res;
            if (ErrorCode != null) {
                this.setState({isSaving: false});
                Alert.alert(ErrorMessage, ErrorDetails);
                return;
            }
            const { systolic, diastolic, pulses } = result;
            Alert.alert(
                '',
                `Please confirm you wish to save the following values to your records:
BP systolic: ${systolic.value.toFixed(0)}
BP diastolic: ${diastolic.value.toFixed(0)}
Pulse: ${pulses.value.toFixed(0)}`,
                [
                    { text: 'No', style: 'cancel', onPress: () => this.setState({isSaving: false}) },
                    { text: 'Yes', onPress: () => this.saveMedPicResult(result) }
                ],
            );
        }).catch(e => { 
            if (e instanceof Error && e.message === 'User cancelled image selection') return;
            this.setState({isSaving: false});
            console.log(e);
            if (typeof e === 'object') {
                const { ErrorDetails, ErrorMessage, ErrorCode } = e;
                if (ErrorCode != null) {
                    Alert.alert(ErrorMessage, ErrorDetails);
                    return;
                }
            }
            Alert.alert('', `Error while processing MedPic photo${typeof e === 'string' ? `: ${e}` : ''}`);
        });
    }

    saveMedPicResult = (result) => {
        const bloodPressurePulseCluster = _.find(this.state.resultClusters, resultCluster => {
            return _.find(resultCluster.resultClusterObservationHeadings, heading => heading.observationHeading.code === 'bpsys');
        })

        if (!bloodPressurePulseCluster) {
            const e = 'Could not find blood pressure / pulse result cluster';
            console.log(e);
            Alert.alert('', `Error while saving MedPic result: ${e}`);
            this.setState({isSaving: false});
            return;
        }

        let bpsysHeadingId, bpdiaHeadingId, pulseHeadingId;
        _.each(bloodPressurePulseCluster.resultClusterObservationHeadings, heading => {
            switch (heading.observationHeading.code) {
                case 'bpsys':
                    bpsysHeadingId = heading.observationHeading.id;
                    return;
                case 'bpdia':
                    bpdiaHeadingId = heading.observationHeading.id;
                    return;
                case 'pulse':
                    pulseHeadingId = heading.observationHeading.id;
                    return;
            }
        });

        if (!bpsysHeadingId || !bpdiaHeadingId || !pulseHeadingId) {
            const e = 'Not able to find all result headers';
            console.log(e);
            Alert.alert('', `Error while saving MedPic result: ${e}`);
            this.setState({isSaving: false});
            return;
        }

        const now = moment();
        const day = now.format("DD");
        const month = now.format("MM");
        const year = parseInt(now.format("YYYY"));
        const hour = parseInt(now.format("HH"));
        const minute = parseInt(now.format("mm"));
        const { systolic, diastolic, pulses } = result;
        const values = [
            {
                id: bpsysHeadingId,
                value: systolic.value.toFixed(0),
            },
            {
                id: bpdiaHeadingId,
                value: diastolic.value.toFixed(0),
            },
            {
                id: pulseHeadingId,
                value: pulses.value.toFixed(0),
            },
        ];
        const comments = "Results captured using MedPic";
        api.enterResult(AccountStore.getUserId(), {day, month, year, hour, minute, values, comments})
            .then((res) => {
                _.each(values, (v) => {
                    const result = _.find(bloodPressurePulseCluster.resultClusterObservationHeadings, (r) => {
                        return parseInt(r.observationHeading && r.observationHeading.id) == parseInt(v.id);
                    });
                    if (result) {
                        AppActions.getResults(result.observationHeading.code)
                    }
                })
                Alert.alert('', `Readings saved successfully.
BP systolic: ${systolic.value.toFixed(0)}
BP diastolic: ${diastolic.value.toFixed(0)}
Pulse: ${pulses.value.toFixed(0)}`);
                AppActions.getResultsSummary();
                this.setState({isSaving: false});
            })
            .catch(e => {
                console.log(e);
                Alert.alert('', `Error while saving MedPic result: ${typeof e === 'string' ? `: ${e}` : ''}`);
                this.setState({isSaving: false});
            });
    }


    render() {
        const {isLoading, resultClusters, isSaving} = this.state;
        const insDiaryRecording = AccountStore.hasGroupFeature('INS_DIARY');
        const medpic = AccountStore.hasGroupFeature('MEDPIC');
        return isLoading ?
            <Flex>
                <NetworkBar message="It seems you are offline, you need to be online to enter your own data."/>
                <View style={Styles.centeredContainer}>
                    <Loader/>
                </View>
            </Flex>
            : (
                <Flex style={Styles.whiteContainer}>
                    <NetworkBar message="It seems you are offline, you need to be online to enter your own data."/>
                    <FormGroup style={[Styles.greyContainer, {paddingBottom: 10}]}>
                        <Container>
                            <Text style={Styles.bold}>
                                Select the results you would like to add:
                            </Text>
                        </Container>
                    </FormGroup>
                    <View>
                        {resultClusters && resultClusters.length ?
                            resultClusters.map((r) =>
                                r.resultClusterObservationHeadings.length ?
                                    <ListItem
                                        key={r.id}
                                        onPress={() => routeHelper.goEnterResult(this.props.navigator, r)}>
                                        <Text>{r.name}</Text>
                                        <ION name="ios-arrow-forward" style={[Styles.listIconNav]}/>
                                    </ListItem> : <View/>
                            )
                            : (
                                <Text>You do not have any result clusters</Text>
                            )}
                        <FormGroup>
                            <Column>
                                <Button onPress={() => routeHelper.goEditResults(this.props.navigator)}>
                                    View & Edit Past Entries
                                </Button>
                            </Column>
                        </FormGroup>
                        {insDiaryRecording && (
                            <FormGroup>
                                <Column>
                                    <Button onPress={() => routeHelper.goINSDiaryRecordings(this.props.navigator)} style={Styles.buttonINSDiaryRecordings}>
                                        <Row style={Styles.alignCenter}>
                                            <Image source={require('../../images/nest-logo-2.png')} style={Styles.buttonINSDiaryRecordingsImage} resizeMode="contain" />
                                            <Text style={Styles.buttonText}>Nephrotic Syndrome Diary</Text>
                                        </Row>
                                    </Button>
                                </Column>
                            </FormGroup>
                        )}
                        {medpic && (
                            <>
                                <Container style={Styles.mt5}>
                                    <Text style={Styles.bold}>Entering blood pressure from a photo</Text>
                                    <Text style={Styles.mt5}>Please take a clear photo of the readings on your BP monitor. The numbers from that can automatically be saved to your PatientView record. <Text
                                        onPress={()=>Linking.openURL('http://help.patientview.org/patientview2/howto/user-guide-for-patients/uploading-blood-pressure-from-a-photo/')}
                                        style={[Styles.anchor, {color: colour.primary}]}>More info and help here.</Text></Text>
                                </Container>
                                {isSaving ? (
                                    <Flex style={Styles.centeredContainer}>
                                        <Loader/>
                                    </Flex>
                                ) : (
                                    <View>
                                        <FormGroup>
                                            <Column>
                                                <Button onPress={() => this.takeMedPicPhoto(true)}>
                                                    <Row style={Styles.alignCenter}>
                                                        <FontAwesome style={[Styles.listItemIcon, Styles.mr5, {color: pallette.white}]} name="camera"/>
                                                        <Text style={Styles.buttonText}>Take Photo</Text>
                                                    </Row>
                                                </Button>
                                            </Column>
                                        </FormGroup>
                                        <FormGroup>
                                            <Column>
                                                <Button onPress={() => this.takeMedPicPhoto(false)}>
                                                    <Row style={Styles.alignCenter}>
                                                        <FontAwesome style={[Styles.listItemIcon, Styles.mr5, {color: pallette.white}]} name="image"/>
                                                        <Text style={Styles.buttonText}>Upload Gallery Photo</Text>
                                                    </Row>
                                                </Button>
                                            </Column>
                                        </FormGroup>
                                    </View>
                                )}
                            </>
                        )}
                    </View>
                </Flex>
            );
    }
};

TheComponent.propTypes = {};

module.exports = TheComponent;