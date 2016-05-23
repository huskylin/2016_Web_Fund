import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import comonents

import { login } from '../actions';
import Form from '../components/From';

class App extends Component {
	render() {
		const {
			actions,
			username,
			password
		} = this.props;

		return (
			<div>
				<Form
					actions={actions}
					username={username}
					password={password}
				/>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return { todos: state };
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({
			login
		})
	};
}

App = connect(mapStateToProps, mapDispatchToProps)(App);

export default App;
