import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import { createStore, bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';
import 'whatwg-fetch';

// Actions
const LOGIN_FAIL = 'LOGIN_FAIL';

// Action Creator
function loginFail(errorMessage) {
	return {
		type: LOGIN_FAIL,
		errorMessage
	};
}

// Reducers
const initialState = { errorMessage: '' };

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

// Container
class App extends Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	render() {
		const { actions, errorMessage } = this.props;
		return (
			<div>
				<h1>{errorMessage}</h1>
				<input
					type="text"
					ref="username"
				/>
				<input
					type="password"
					ref="password"
				/>
				<button onClick={this.handleClick}>Login</button>
			</div>
		);
	}

	handleClick(e) {
		let usernameNode = this.refs.username;
		let passwordNode = this.refs.password;

		let username = usernameNode.value;
		let password = passwordNode.value;

		console.log(username, password);

		// ajax request to login.
		//
		// If login successfully will get this format:
		// {
		//	 authenticated: true,
		//   redirect: '/'
		// }
		//
		// If login failed will get this format data:
		// {
		//   authenticated: false,
		//   errorMessage: 'Wrong password'
		// }
		fetch('http://127.0.0.1:3000/login/2', {
			method: 'GET',
			// body: JSON.stringify({
				// username,
				// password
			// })
		})
			.then(response => response.json())
			.then(response => {
				if (response.authenticated) {
					// login successfully and redirect.
					window.location.href = response.redirect;
				} else {
					// Login failed and show error message.
					this.props.actions.loginFail(response.errorMessage);
					// clean password field.
					passwordNode.value = '';
				}
			});
	}
}

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
	document.getElementById('app')
);
