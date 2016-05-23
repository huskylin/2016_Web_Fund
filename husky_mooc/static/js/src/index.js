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

const initialState = { errorMessage: '' };

// Reducers
function loginApp(state = initialState, action = {}) {
	switch (action.type) {
		case LOGIN_FAIL:
			return Object.assign({}, state, {
				errorMessage: state.errorMessage
			});
		default:
			return state;
	}
}

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

		// ajax request
		fetch('/post', {
			method: 'POST',
			body: JSON.stringfy({
				username,
				password
			})
		})
			.then(response => repsonse.json())
			.then((content) => {
				if (!content) {
					// show error message.
					this.props.actions.loginFail(content);
					// clean password field.
					passwordNode.value = '';
				} else {
					// login success.
					window.redirect('/');
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
			login
		}, dispatch)
	};
}

connect(mapStateToProps, mapDispatchToProps)(App);

let store = createStore(loginApp);

let appElement = document.getElementById('app');

render(
	<Provider store={store}>
		<App />
	</Provider>,
	appElement
);
