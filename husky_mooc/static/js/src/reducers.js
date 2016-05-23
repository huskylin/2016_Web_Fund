import { combineReducers } from 'redux';
import { LOGIN } from './actions.js';

function login(state = [], action) {
	switch (action.type) {
		case 'CLICK_BUTTON':
			return state;
		default:
			return state;
	}
}

const loginApp = combineReducers({
	login
});

export default loginApp;
