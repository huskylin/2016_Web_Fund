import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import { connect, Provider } from 'react-redux';
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

const initialState = {
	errorMesage: ''
};

// Reducers
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

// Container
class App extends Component {
	constructor(props) {
		super(props);

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	render() {
		const { errorMessage } = this.props;

		return (
			<form className="registerForm" onSubmit={this.handleSubmit}>
				<h1>{errorMessage}</h1>
				<input type="text" ref="username" />
				<input type="password" ref="password" />
				<input type="email" ref="email" />
				<button type="submit">x</button>
			</form>
		);
	}

	handleSubmit(e) {
		e.preventDefault();

		let usernameNode = this.refs.username;
		let passwordNode = this.refs.password;
		let emailNode    = this.refs.email;

		let username = usernameNode.value;
		let password = passwordNode.value;
		let email    = emailNode.value;

		// Ajax requests data.
		//
		// Success format:
		// {
		//	 success: true,
		//   redirect: '/'
		// }
		//
		// Failed format:
		// {
		//   success: false,
		//   errorMessage: 'user has been used.'
		// }
		//
		fetch('http://127.0.0.1:3000/register/1', {
			method: 'GET',
			// body: JSON.stringify({
				// username,
				// password
			// })
		})
			.then((response) => response.json())
			.then((response) => {
				if (response.success) {
					window.location.href = response.redirect;
				} else {
					passwordNode.value = '';
					emailNode.value = '';
					this.props.actions.registerFail(response.errorMessage);
				}
			});
	}
}

// Store
let store = createStore(registerApp);

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
	document.getElementById('registerForm')
);
