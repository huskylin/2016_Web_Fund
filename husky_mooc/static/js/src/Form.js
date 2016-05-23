import React, { Component, PropTypes } from 'react';

class Form extends Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	render() {
		const { username, password } = this.props;

		return (
			<div>
				<input type="text" value={username} ref="username" />
				<input type="password" value={password} ref="password" />
				<button
					onClick={this.handleClick}
				>Login</button>
			</div>
		);
	}

	handleClick(e) {
		let usernameNode = this.refs.username;
		let passwordNode = this.refs.password;

		let username = usernameNode.value;
		let password = passwordNode.value;

		this.props.actions.login(username, password);

		passwordNode.value = '';
	}
}

Form.propTypes = {
	username: PropTypes.string.isRequired,
	password: PropTypes.string.isRequired,
};

export default Form;
