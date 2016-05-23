import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import App from './containers/App';
import loginApp from './reducers';

let store = createStore(loginApp);

let appElement = document.getElementById('app');

render(
	<Provider store={store}>
		<App />
	</Provider>,
	appElement
);
