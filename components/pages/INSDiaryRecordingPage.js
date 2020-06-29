import React, {Component, PropTypes} from 'react';
import DatePicker from 'react-native-datepicker';
import TagInput from 'react-native-tag-input';

const INSDiaryRecording = class extends Component {
    static displayName = 'INSDiaryRecording';
    static navigatorStyle = global.navbarStyle;

    constructor(props, context) {
        super(props, context);
        const { entry, edit } = this.props;
        const remissionDate = _.get(entry, 'relapse.remissionDate');
        this.state = {
            ...entry, edit,
            entryDate: edit ? entry.entryDate : moment().startOf('minute').valueOf(),
            selectedOedema: entry ? entry.oedema && !!entry.oedema.length && entry.oedema[0] : null,
            relapse: {
                ...((entry && entry.relapse) ? entry.relapse : {}),
                relapseDate: entry ? _.get(entry, 'relapse.relapseDate') : moment().startOf('day').valueOf(),
                remissionDate: remissionDate ? remissionDate : null,
            }
        };
        ES6Component(this)
    }

    componentWillMount() {
        this.listenTo(INSDiaryRecordingsStore, "saved", () => {
            this.props.navigator.pop();
        });
        this.listenTo(INSDiaryRecordingsStore, "change", () => {
            this.setState({
                saving: INSDiaryRecordingsStore.isSaving
            });
        });
        this.listenTo(INSDiaryRecordingsStore, 'problem', () => {
            Alert.alert('Error', INSDiaryRecordingsStore.error);
        })
        routeHelper.handleNavEvent(this.props.navigator, 'message', this.onNavigatorEvent);
    }

    showUrineProteinDipstickOptions = () => {
        API.showOptions("Dipstick type", _.flatMap(Constants.urineProteinDipstick), true)
            .then((i)=> {
                if (i < Object.keys(Constants.urineProteinDipstick).length)
                    this.setState({dipstickType: Object.keys(Constants.urineProteinDipstick)[i]})
            })
    }

    setEntryDate = (date) => {console.log(date);this.setState({entryDate: moment(date, 'DD-MM-YYYY HH:mm').valueOf()})};

    setSystolicBP = (value) => this.setState({systolicBP: value ? value.match(/^\d+$/g) ? value : this.state.systolicBP : ''});

    toggleSystolicExclusion = () => this.setState({systolicBPExclude: !this.state.systolicBPExclude, systolicBP: ''});

    setDiastolicBP = (value) => this.setState({diastolicBP: value ? value.match(/^\d+$/g) ? value : this.state.diastolicBP : ''});

    toggleDiastolicExclusion = () => this.setState({diastolicBPExclude: !this.state.diastolicBPExclude, diastolicBP: ''});

    setWeight = (value) => this.setState({weight: value ? value.match(/^\d+\.?\d{0,1}$/g) ? value : this.state.weight : ''});

    toggleWeightExclusion = () => this.setState({weightExclude: !this.state.weightExclude, weight: ''});

    showInRelapseOptions = () => this.showYesNoOptions('inRelapse', 'Relapse');

    showYesNoOptions = (key, title) => {
        API.showOptions(title, ['Yes', 'No'], true)
            .then((i)=> {
                if (i < 2) {
                    const newState = _.set(this.state, key, i === 0);
                    if (key === 'inRelapse' && i === 0 && _.get(this.state, 'relapse.remissionDate')) {
                        newState.relapse = {
                            ...this.state.relapse,
                            remissionDate: null,
                        };
                    }
                    this.setState(newState);
                }
            })
    }

    showOedemaOptions = () => {
        API.showOptions("Oedema", _.flatMap(Constants.oedemas), true)
            .then((i)=> {
                if (i < Object.keys(Constants.oedemas).length) {
                    const oedema = this.state.oedema;
                    const selectedOedema = Object.keys(Constants.oedemas)[i];
                    if (selectedOedema !== 'NONE') {
                        const index = oedema && oedema.indexOf('NONE');
                        if (index != null && index !== -1) {
                            oedema.splice(index, 1);
                        }
                    }
                    this.setState({selectedOedema, oedema: (selectedOedema !== 'NONE' && oedema && oedema.length) ? oedema : [selectedOedema]})
                }
            })
    }

    addOedema = () => this.setState({oedema: (this.state.oedema || []).concat([this.state.selectedOedema])});

    removeOedema = () => this.setState({oedema: _.without(this.state.oedema, this.state.selectedOedema)});

    setRelapseDate = (date) => this.setState({relapse: { ...this.state.relapse, relapseDate: moment(date, 'DD-MM-YYYY').valueOf() }});

    setViralInfection = (viralInfection) => this.setState({relapse: { ...this.state.relapse, viralInfection }});

    showCommonColdOptions = () => this.showYesNoOptions('relapse.commonCold', 'Common Cold');

    showHayFeverOptions = () => this.showYesNoOptions('relapse.hayFever', 'Hay Fever');

    showAllergicReactionOptions = () => this.showYesNoOptions('relapse.allergicReaction', 'Allergic Reaction');

    showAllergicSkinRashOptions = () => this.showYesNoOptions('relapse.allergicSkinRash', 'Allergic Skin Rash');
    
    showFoodIntoleranceOptions = () => this.showYesNoOptions('relapse.foodIntolerance', 'Food Intolerance');

    setRemissionDate = (date) => this.setState({relapse: { ...this.state.relapse, remissionDate: moment(date, 'DD-MM-YYYY').valueOf() }});

    removeRelapseMedication = (index) => {
        const medications = _.clone(_.get(this.state, 'relapse.medications'));
        if (!medications || medications.length < index) return;
        medications.splice(index, 1);
        this.setState({relapse: { ...this.state.relapse, medications }});
    }

    addRelapseMedication = () => routeHelper.addRelapseMedication(this.props.navigator, (medication) => {
        this.props.navigator.dismissModal();
        this.setState({relapse: { ...this.state.relapse, medications: (_.get(this.state, 'relapse.medications') || []).concat([medication])}});
    });

    save = () => {
        const {
            edit, entryDate, dipstickType, systolicBP, systolicBPExclude, diastolicBP, diastolicBPExclude,
            weight, weightExclude, selectedOedema, oedema, relapse, inRelapse, id,
        } = this.state;

        if ((!systolicBPExclude && !systolicBP) || (!diastolicBPExclude && !diastolicBP) || (!weightExclude && !weight)) {
            Alert.alert('Error', 'Weight/Blood pressure needs to be entered, or tick Not Measured if unavailable.');
            return;
        }
        
        if (inRelapse == null) {
            Alert.alert('Error', 'Relapse is a required field.');
            return;
        }

        const recording = {
            ...this.state,
        }
        const hasRelapse = _.get(this.props, 'entry.relapse');
        if (!hasRelapse && !inRelapse) {
            recording.relapse = null;
        } else if (hasRelapse && !inRelapse && !relapse.remissionDate) {
            // Default to today since thats what the datepicker does
            recording.relapse.remissionDate = moment().startOf('day').valueOf();
        } else if (hasRelapse && inRelapse && relapse.remissionDate) {
            recording.relapse.remissionDate = null;
        }
        if (recording.selectedOedema) delete recording.selectedOedema;
        if (selectedOedema === 'NONE') {
            recording.oedema = ['NONE'];
        }
        if (edit) {
            AppActions.updateINSDiaryRecording(id, recording);
        } else {
            AppActions.saveINSDiaryRecording(recording);
        }
    };


    onNavigatorEvent = (event) => {
        if (event.id == Constants.navEvents.SHOW) {
            Utils.recordScreenView('INS Diary Recording Screen');
        }
        if (event.id == 'close') {
            this.props.navigator.dismissModal();
        }
    };

    renderRelapseMedicationRow = ({item, index}) => {
        const { name, other, doseQuantity, doseUnits, doseFrequency, route, started, stopped } = item;
        return (
            <Row style={[Styles.insDiaryListItem, Styles.mb20]}>
                <Flex>
                    <Row>
                        <Flex>
                            <Column>
                                <Text style={Styles.bold}>Medication</Text>
                                <Text>{name !== 'OTHER' ? Constants.relapseMedication[name] : other}</Text>
                            </Column>
                        </Flex>
                        <Flex>
                            <Column>
                                <Text style={Styles.bold}>Dose</Text>
                                <Text>{doseQuantity ? `${doseQuantity}${doseUnits || ''}` : '-'}</Text>
                            </Column>
                        </Flex>
                    </Row>
                    <Row style={Styles.mt10}>
                        <Flex>
                            <Column>
                                <Text style={Styles.bold}>Frequency</Text>
                                <Text>{doseFrequency ? Constants.relapseMedicationFrequency[doseFrequency] : '-'}</Text>
                            </Column>
                        </Flex>
                        <Flex>
                            <Column>
                                <Text style={Styles.bold}>Route</Text>
                                <Text>{route || '-'}</Text>
                            </Column>
                        </Flex>
                    </Row>
                    <Row style={Styles.mt10}>
                        <Flex>
                            <Column>
                                <Text style={Styles.bold}>Date Started</Text>
                                <Text>{started ? moment(started).format('DD-MM-YYYY') : '-'}</Text>
                            </Column>
                        </Flex>
                        <Flex>
                            <Column>
                                <Text style={Styles.bold}>Date Stopped</Text>
                                <Text>{stopped ? moment(stopped).format('DD-MM-YYYY') : '-'}</Text>
                            </Column>
                        </Flex>
                    </Row>
                </Flex>
                <Row>
                    <TouchableOpacity style={[Styles.buttonIcon, Styles.ml10, {paddingBottom: 4}]} onPress={() => this.removeRelapseMedication(index)}>
                        <FontAwesome style={[Styles.listItemIcon, {color: colour.danger}]} name="trash"/>
                    </TouchableOpacity>
                </Row>
            </Row>
        )
    }

    render() {
        const {
            edit, entryDate, dipstickType, systolicBP, systolicBPExclude, diastolicBP, diastolicBPExclude,
            weight, weightExclude, selectedOedema, oedema, relapse, inRelapse,
        } = this.state;
        const { entry } = this.props;
        return (
            <Flex>
                <NetworkProvider>
                    {(isConnected) => (
                        <Flex style={Styles.whiteContainer}>
                            <NetworkBar
                                message="It seems you are offline, you need to be online to enter your own data."/>

                            <Flex>
                                <Container style={{flex: 1}}>
                                    <KeyboardAwareScrollView keyboardShouldPersistTaps={"handled"} style={{flex: 1}}>
                                        <FormGroup>
                                            <Column>
                                                <Text style={Styles.label}>Date / Time</Text>
                                                <DatePicker
                                                    style={{alignSelf: "stretch", width: "100%", height: 54,}}
                                                    date={entryDate ? moment(entryDate) : moment().startOf('minute')}
                                                    mode="datetime"
                                                    maxDate={moment()}
                                                    placeholder="Tap to select date"
                                                    format="DD-MM-YYYY HH:mm"
                                                    confirmBtnText="Confirm"
                                                    cancelBtnText="Cancel"
                                                    customStyles={{
                                                        dateInput: [Styles.inputContainer, {
                                                            alignItems: "flex-start",
                                                            paddingLeft: 10,
                                                            height: 44,
                                                            alignSelf: "stretch"
                                                        }]
                                                        // ... You can check the source to find the other keys.
                                                    }}
                                                    onDateChange={this.setEntryDate}
                                                    disabled={edit}
                                                />
                                            </Column>
                                        </FormGroup>
                                        <FormGroup>
                                            <Column>
                                                <Text style={Styles.label}>Urine Protein Dipstick</Text>
                                                <SelectBox onPress={this.showUrineProteinDipstickOptions} style={{width: 150}}>
                                                    {Constants.urineProteinDipstick[dipstickType]}
                                                </SelectBox>
                                            </Column>
                                        </FormGroup>

                                        <FormGroup>
                                            <Column>
                                                <Text style={Styles.label}>Systolic BP (mm Hg)</Text>
                                                <Row>
                                                    <Flex style={Styles.mr10}>
                                                        <TextInput
                                                        value={(systolicBP || '') + ''}
                                                        keyboardType={"numeric"}
                                                        onChangeText={this.setSystolicBP}
                                                        disabled={systolicBPExclude}
                                                        style={systolicBPExclude ? Styles.inputDisabled : {}}
                                                        textStyle={systolicBPExclude ? Styles.inputDisabled : {}}
                                                    />
                                                    </Flex>
                                                    <TouchableOpacity onPress={this.toggleSystolicExclusion} disabled={edit} style={edit ? Styles.disabled : {}}>
                                                        <Row>
                                                            <ION
                                                                style={[Styles.listIcon, Styles.mr0, Styles.mt10, {
                                                                    color: systolicBPExclude ? !edit ? colour.primary : Styles.inputDisabled.backgroundColor : !edit ? colour.listItemNav : 'black',
                                                                }]}
                                                                name={systolicBPExclude ? "ios-checkbox" : "ios-checkbox-outline"}
                                                            />
                                                            <Text style={Styles.checkboxLabel}>Not measured</Text>
                                                        </Row>
                                                    </TouchableOpacity>
                                                </Row>
                                            </Column>
                                        </FormGroup>

                                        <FormGroup>
                                            <Column>
                                                <Text style={Styles.label}>Diastolic BP (mm Hg)</Text>
                                                <Row>
                                                    <Flex style={Styles.mr10}>
                                                        <TextInput
                                                            value={(diastolicBP || '') + ''}
                                                            keyboardType={"numeric"}
                                                            onChangeText={this.setDiastolicBP}
                                                            disabled={diastolicBPExclude}
                                                            style={diastolicBPExclude ? Styles.inputDisabled : {}}
                                                            textStyle={diastolicBPExclude ? Styles.inputDisabled : {}}
                                                        />
                                                    </Flex>
                                                    <TouchableOpacity onPress={this.toggleDiastolicExclusion} disabled={edit} style={edit ? Styles.disabled : {}}>
                                                        <Row>
                                                            <ION
                                                                style={[Styles.listIcon, Styles.mr0, Styles.mt10, {
                                                                    color: diastolicBPExclude ? !edit ? colour.primary : Styles.inputDisabled.backgroundColor : !edit ? colour.listItemNav : 'black',
                                                                }]}
                                                                name={diastolicBPExclude ? "ios-checkbox" : "ios-checkbox-outline"}
                                                            />
                                                            <Text style={Styles.checkboxLabel}>Not measured</Text>
                                                        </Row>
                                                    </TouchableOpacity>
                                                </Row>
                                            </Column>
                                        </FormGroup>

                                        <FormGroup>
                                            <Column>
                                                <Text style={Styles.label}>Weight (kg)</Text>
                                                <Row>
                                                    <Flex style={Styles.mr10}>
                                                        <TextInput
                                                            value={(weight || '') + ''}
                                                            keyboardType={"numeric"}
                                                            onChangeText={this.setWeight}
                                                            disabled={weightExclude}
                                                            style={weightExclude ? Styles.inputDisabled : {}}
                                                            textStyle={weightExclude ? Styles.inputDisabled : {}}
                                                        />
                                                    </Flex>
                                                    <TouchableOpacity onPress={this.toggleWeightExclusion} disabled={edit} style={edit ? Styles.disabled : {}}>
                                                        <Row>
                                                            <ION
                                                                style={[Styles.listIcon, Styles.mr0, Styles.mt10, {
                                                                    color: weightExclude ? !edit ? colour.primary : Styles.inputDisabled.backgroundColor : colour.listItemNav,
                                                                }]}
                                                                name={weightExclude ? "ios-checkbox" : "ios-checkbox-outline"}
                                                            />
                                                            <Text style={Styles.checkboxLabel}>Not measured</Text>
                                                        </Row>
                                                    </TouchableOpacity>
                                                </Row>
                                            </Column>
                                        </FormGroup>

                                        <FormGroup>
                                            <Column>
                                                <Text style={Styles.label}>Add Oedema</Text>
                                                <Row>
                                                    <Flex style={!!selectedOedema ? Styles.mr10 : {}}>
                                                        <SelectBox onPress={this.showOedemaOptions} style={{width: 150}}>
                                                            {Constants.oedemas[selectedOedema]}
                                                        </SelectBox>
                                                    </Flex>
                                                    {!!selectedOedema && selectedOedema !== 'NONE' &&
                                                        ((oedema && oedema.indexOf(selectedOedema) !== -1) ?
                                                        <Button style={[Styles.buttonOedema, {backgroundColor: colour.brandDanger}]} onPress={this.removeOedema}>-</Button> : 
                                                        <Button style={Styles.buttonOedema} onPress={this.addOedema}>+</Button>)}
                                                </Row>
                                                {selectedOedema !== 'NONE' && oedema && !!oedema.length && (
                                                    <TagInput
                                                        value={oedema}
                                                        onChange={oedema => this.setState({ oedema })}
                                                        labelExtractor={oedema => oedema}
                                                        text={''}
                                                        onChangeText={() => {}}
                                                        tagContainerStyle={Styles.tagContainer}
                                                        tagTextStyle={Styles.tagText}
                                                        textInputContainerStyle={[{ height: 60, marginBottom: 0, justifyContent: 'center' }]}
                                                        textInputStyle={[Styles.textInput, { paddingVertical: 5 }]}
                                                        flex
                                                        hideInput
                                                        inputDefaultWidth={130}
                                                        tagCloseIcon={<FontAwesome style={{ marginLeft: 10 }} name="times" size={15} />}
                                                    />
                                                )}
                                            </Column>
                                        </FormGroup>

                                        <FormGroup>
                                            <Column>
                                                <Text style={Styles.label}>Relapse</Text>
                                                {inRelapse && !edit && entry && entry.relapse && <Text style={[Styles.fontSizeSmall, {color: colour.danger}, Styles.mb5]}>If you are now in remission, you must change the Relapse value below to 'No' before saving the diary entry.</Text>}
                                                <Row>
                                                    <Flex style={!!selectedOedema ? Styles.mr10 : {}}>
                                                        <SelectBox onPress={this.showInRelapseOptions} style={{width: 150}} disabled={edit}>
                                                            {inRelapse == null ? '' : inRelapse ? 'Yes' : 'No'}
                                                        </SelectBox>
                                                    </Flex>
                                                </Row>
                                            </Column>
                                        </FormGroup>

                                        {((entry && entry.relapse) || inRelapse) && (
                                            <>
                                                <FormGroup>
                                                    <Column>
                                                        <Text style={Styles.label}>Date of Relapse</Text>
                                                        <DatePicker
                                                            style={{alignSelf: "stretch", width: "100%", height: 54,}}
                                                            date={(relapse && relapse.relapseDate) ? moment(relapse.relapseDate) : moment().startOf('day')}
                                                            mode="date"
                                                            maxDate={moment()}
                                                            placeholder="Tap to select date"
                                                            format="DD-MM-YYYY"
                                                            confirmBtnText="Confirm"
                                                            cancelBtnText="Cancel"
                                                            customStyles={{
                                                                dateInput: [Styles.inputContainer, {
                                                                    alignItems: "flex-start",
                                                                    paddingLeft: 10,
                                                                    height: 44,
                                                                    alignSelf: "stretch"
                                                                }]
                                                                // ... You can check the source to find the other keys.
                                                            }}
                                                            onDateChange={this.setRelapseDate}
                                                        />
                                                    </Column>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Column>
                                                        <Text style={Styles.label}>Date of Remission</Text>
                                                        {(entry && entry.relapse && !inRelapse) ? (
                                                            <DatePicker
                                                                style={{alignSelf: "stretch", width: "100%", height: 54,}}
                                                                date={(relapse && relapse.remissionDate) ? moment(relapse.remissionDate) : moment().startOf('day')}
                                                                mode="date"
                                                                maxDate={moment()}
                                                                placeholder="Tap to select date"
                                                                format="DD-MM-YYYY"
                                                                confirmBtnText="Confirm"
                                                                cancelBtnText="Cancel"
                                                                customStyles={{
                                                                    dateInput: [Styles.inputContainer, {
                                                                        alignItems: "flex-start",
                                                                        paddingLeft: 10,
                                                                        height: 44,
                                                                        alignSelf: "stretch"
                                                                    }]
                                                                    // ... You can check the source to find the other keys.
                                                                }}
                                                                onDateChange={this.setRemissionDate}
                                                            />
                                                        ) : (
                                                            <Text style={[Styles.bold, Styles.italic]}>{(relapse && relapse.remissionDate) ? moment(relapse.remissionDate).format('DD-MM-YYYY') : 'Ongoing'}</Text>
                                                        )}
                                                    </Column>
                                                </FormGroup>
                                                <Divider style={[Styles.mt10, Styles.mb10]} />
                                                <Column>
                                                    <Text style={Styles.bold}>Triggers for Relapse</Text>
                                                </Column>
                                                <FormGroup>
                                                    <Column>
                                                        <Text style={Styles.label}>Viral Infection</Text>
                                                        <TextInput
                                                            value={_.get(relapse, 'viralInfection') || ''}
                                                            onChangeText={this.setViralInfection}
                                                        />
                                                    </Column>
                                                </FormGroup>
                                                <Row>
                                                    <Flex>
                                                        <FormGroup>
                                                            <Column>
                                                                <Text style={Styles.label}>Common Cold</Text>
                                                                <SelectBox onPress={this.showCommonColdOptions} style={{width: 150}}>
                                                                    {_.get(relapse, 'commonCold') ? 'Yes' : 'No'}
                                                                </SelectBox>
                                                            </Column>
                                                        </FormGroup>
                                                    </Flex>
                                                    <Flex>
                                                        <FormGroup>
                                                            <Column>
                                                                <Text style={Styles.label}>Hay Fever</Text>
                                                                <SelectBox onPress={this.showHayFeverOptions} style={{width: 150}}>
                                                                    {_.get(relapse, 'hayFever') ? 'Yes' : 'No'}
                                                                </SelectBox>
                                                            </Column>
                                                        </FormGroup>
                                                    </Flex>
                                                </Row>
                                                <Row>
                                                    <Flex>
                                                        <FormGroup>
                                                            <Column>
                                                                <Text style={Styles.label}>Allergic Reaction</Text>
                                                                <SelectBox onPress={this.showAllergicReactionOptions} style={{width: 150}}>
                                                                    {_.get(relapse, 'allergicReaction') ? 'Yes' : 'No'}
                                                                </SelectBox>
                                                            </Column>
                                                        </FormGroup>
                                                    </Flex>
                                                    <Flex>
                                                        <FormGroup>
                                                            <Column>
                                                                <Text style={Styles.label}>Allergic Skin Rash</Text>
                                                                <SelectBox onPress={this.showAllergicSkinRashOptions} style={{width: 150}}>
                                                                    {_.get(relapse, 'allergicSkinRash') ? 'Yes' : 'No'}
                                                                </SelectBox>
                                                            </Column>
                                                        </FormGroup>
                                                    </Flex>
                                                </Row>
                                                <Row>
                                                    <Flex>
                                                        <FormGroup>
                                                            <Column>
                                                                <Text style={Styles.label}>Food Intolerance</Text>
                                                                <SelectBox onPress={this.showFoodIntoleranceOptions} style={{width: 150}}>
                                                                    {_.get(relapse, 'foodIntolerance') ? 'Yes' : 'No'}
                                                                </SelectBox>
                                                            </Column>
                                                        </FormGroup>
                                                    </Flex>
                                                    <Flex />
                                                </Row>
                                                <Divider style={[Styles.mt10, Styles.mb10]} />
                                                <Column style={Styles.mb10}>
                                                    <Text style={Styles.bold}>Medication Taken Specifically for Relapse</Text>
                                                </Column>
                                                {relapse && relapse.medications && !!relapse.medications.length && (
                                                    <FlatList
                                                        data={relapse.medications}
                                                        keyExtractor={item => item.id}
                                                        renderItem={this.renderRelapseMedicationRow}
                                                    />
                                                )}
                                                <FormGroup style={{marginBottom: 10}}>
                                                    <Column>
                                                        <Button onPress={this.addRelapseMedication} style={Styles.buttonSecondary}>Add Medication</Button>
                                                    </Column>
                                                </FormGroup>
                                            </>
                                        )}

                                        <FormGroup style={[Styles.mt10, Styles.mb10]}>
                                            <Column>
                                                <Button onPress={() => this.save(false)}
                                                        disabled={!isConnected || this.state.saving || this.state.value == ""}>
                                                    {this.state.saving ? "Saving..." : "Save"}
                                                </Button>
                                            </Column>
                                        </FormGroup>

                                    </KeyboardAwareScrollView>
                                </Container>
                            </Flex>
                        </Flex>
                    )}
                </NetworkProvider>
            </Flex>
        )
    }
};

INSDiaryRecording.propTypes = {};

module.exports = INSDiaryRecording;