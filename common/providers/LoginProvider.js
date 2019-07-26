/**
 * Created by kyle- on 6/4/2017.
 */
import React, {Component, PropTypes} from 'react';
import data from '../../common/data/_data'
const TheComponent = class extends Component {
    displayName: 'TheComponent'

    constructor(props, context) {
        super(props, context);
        ES6Component(this);

        this.state = {
            tries: 0,
            username: '',
            password: '',
            secretWord: '',
        };
    }

    componentWillMount() {
        this.listenTo(AccountStore, 'change', () => {
            this.setState({
                isLoading: AccountStore.isLoading,
                error: AccountStore.error
            })
        });
        this.listenTo(AccountStore, 'problem', () => {
            state = {secretWord: ''};
            if (this.props.secretWord) {
                var tries = this.state.tries + 1
                if (tries >= Constants.loginAttempts) {
                    this.props.onLock && this.props.onLock()
                    return;
                }
                state.tries = tries;
            }
            this.setState(state,()=>{
                this.props.onError && this.props.onError();
            })
        });
        this.listenTo(AccountStore, 'loggedin', () => {
            this.setState({isLoading: false});
            this.props.onLogin && this.props.onLogin();
        });
    }

    login = () => {
        AppActions.login({username: this.state.username, password: this.state.password, secretWord: this.state.secretWord});
    };

    setUsername = (username) => this.setState({username});
    setPassword = (password) => this.setState({password});
    setSecretWord = (secretWord) => this.setState({secretWord:secretWord.toUpperCase()});

    render() {
        return this.props.children(AccountStore.getUser(), this.state, {
            setUsername: this.setUsername,
            setPassword: this.setPassword,
            login: this.login,
            setSecretWord: this.setSecretWord
        });
    }
};

TheComponent.propTypes = {};

module.exports = TheComponent;