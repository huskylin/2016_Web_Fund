import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux';
import { createStore, bindActionCreators } from 'redux';
import 'whatwg-fetch';

// Actions
const LOGIN_FAIL = 'LOGIN_FAIL';

// Action Creator
function loginFail(errorMessage) {
  return {
    type: LOGIN_FAIL,
    errorMessage: errorMessage
  };
}

const initialState = { errorMessage: '' };

// Reducer
function loginApp(state = initialState, action = {}) {
  switch (action.type) {
    case LOGIN_FAIL:
      return Object.assign({}, state, {
        errorMessage: action.errorMessage
      });
    default:
      return state;
  }
}

// Store
let store = createStore(loginApp);

class App extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    const { errorMessage } = this.props;
    return (
      <form role="form"
          id="loginForm"
          method="POST"
          onSubmit={this.handleSubmit}
      >
        <h1>Sign in</h1>
        <h2>{errorMessage}</h2>
        <div className="form-gruop" >
          <input className="from-control" id="exampleInputEmail1" placeholder="User Name" type="text" ref="username" /><br/>
        </div>
        <div className="form-gruop" >
          <input className="from-control" id="exampleInputEmail1" placeholder="Password" type="password" ref="password" /><br/>
        </div>
        <button className="btn btn-primary" type="submit">Login</button>
      </form>
    );
  }

  handleSubmit(e) {
    e.preventDefault();

    const { loginFail } = this.props.actions;

    const usernameNode = this.refs.username;
    const passwordNode = this.refs.password;

    let username = usernameNode.value;
    let password = passwordNode.value;

    if (!username) {
      passwordNode.value = '';
      return loginFail('Please enter your username');
    }
    if (!password) {
      return loginFail('Please enter your password.');
    }

    fetch('/accounts/signin', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      })
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          window.location.href = response.redirect;
        } else {
          passwordNode.value = '';
          loginFail(response.errorMessage);
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
      loginFail
    }, dispatch)
  };
}

App = connect(mapStateToProps, mapDispatchToProps)(App);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('signinApp')
);
