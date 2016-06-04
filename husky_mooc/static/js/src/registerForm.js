import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux';
import { createStore, bindActionCreators } from 'redux';
import 'whatwg-fetch';

// Actions
const REGISTER_FAIL = 'REGISTER_FAIL';

// Action Creators
function registerFail(errorMessage) {
  return {
    type: REGISTER_FAIL,
    errorMessage
  };
}

// Reducers
const initialState = { errorMessage: '' };

function registerApp(state = initialState, action = {}) {
  switch (action.type) {
    case REGISTER_FAIL:
      return Object.assign({}, state, {
        errorMessage: action.errorMessage
      });
    default:
      return state;
  }
}

let store = createStore(registerApp);

class App extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    const { errorMessage } = this.props;
    return (
      <form
          id="registerForm"
          onSubmit={this.handleSubmit}
      >
        <h1>{errorMessage}</h1>
        Username: <input type="text" ref="username" /><br/>
        Password: <input type="password" ref="password" /><br/>
        Password Again: <input type="password" ref="passwordRepeat" /><br/>
        Email: <input type="email" ref="email" /><br/>
        <button type="submit">Register</button>
      </form>
    );
  }

  handleSubmit(e) {
    e.preventDefault();

    const { registerFail } = this.props.actions;

    const usernameNode       = this.refs.username;
    const passwordNode       = this.refs.password;
    const passwordRepeatNode = this.refs.passwordRepeat;
    const emailNode          = this.refs.email;

    let username       = usernameNode.value;
    let password       = passwordNode.value;
    let passwordRepeat = passwordRepeatNode.value;
    let email          = emailNode.value;

    if (!username) {
      passwordNode.value       = '';
      passwordRepeatNode.value = '';
      return registerFail('Please fill in your Username.');
    }
    if (password < 8) {
      passwordNode.value       = '';
      passwordRepeatNode.value = '';
      return registerFail('Password need 8 charactor or number at least.');
    }
    if (password !== passwordRepeat) {
      passwordNode.value       = '';
      passwordRepeatNode.value = '';
      return registerFail('Confirm your password again.');
    }

    if (!email) {
      passwordNode.value       = '';
      passwordRepeatNode.value = '';
      return registerFail('Please Fill in your Email');
    }

    fetch('/register', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password,
        email
      })
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          window.location.href = response.redirect;
        } else {
          passwordNode.value       = '';
          passwordRepeatNode.value = ''
          return registerFail(response.errorMessage);
        }
      });
  }
}

App.propTypes = {
  errorMessage: PropTypes.string.isRequired
};

function mapStateToProps(state) {
  return {
    errorMessage: state.errorMessage
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      registerFail
    }, dispatch)
  };
}

App = connect(mapStateToProps, mapDispatchToProps)(App);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('registerApp')
);
