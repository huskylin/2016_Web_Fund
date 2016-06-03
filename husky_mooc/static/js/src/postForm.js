import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux';
import { createStore, bindActionCreators } from 'redux';
import 'whatwg-fetch';

const POST_FAIL = 'POST_FAIL';
const POST_SUCCESS = 'POST_SUCCESS';

function postFail(errorMessage) {
  return {
    type: POST_FAIL,
    errorMessage
  };
}

function postSuccess() {
	return {
		type: POST_SUCCESS
	};
}

const initialState = { errorMessage: '' };

function postApp(state = initialState, action = {}) {
  switch(action.type) {
    case 'POST_FAIL':
      return Object.assign({}, state, {
        errorMessage: action.errorMessage
			});
		case 'POST_SUCCESS':
			return Object.assign({}, state, {
				errorMessage: ''
			});
    default:
      return state;
  }
}

let store = createStore(postApp);

class App extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    const { errorMessage } = this.props;
    return (
      <div>
        <h1>{errorMessage}</h1>
        <form method="POST" id="postForm" onSubmit={this.handleSubmit}>
          Content: <input type="text" ref="content" /><br/>
          <button type="submit">Send Your Post</button>
        </form>
      </div>
    );
  }

  handleSubmit(e) {
    e.preventDefault();

    const { postFail, postSuccess } = this.props.actions;

    const contentNode = this.refs.content;
    const content     = contentNode.value;

    if (content.length < 5) {
      contentNode.value = '';
      return postFail('你就是這麼沒內容的人 打多一點 廢物!');
    }

    fetch('/post', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content
      })
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
					contentNode.value = '';
					return postSuccess();
        } else {
          return postFail(response.errorMessage);
        }
      });
  }
}

App.PropTypes = {
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
			postFail,
			postSuccess
    }, dispatch)
  };
}

App = connect(mapStateToProps, mapDispatchToProps)(App);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('postApp')
);
