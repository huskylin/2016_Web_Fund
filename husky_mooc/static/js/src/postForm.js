import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux';
import { createStore, bindActionCreators } from 'redux';
import 'whatwg-fetch';

const POST_FAIL = 'POST_FAIL';
const POST_SUCCESS = 'POST_SUCCESS';
const POST_LOAD = 'POST_LOAD';

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

function postLoad(posts) {
  return {
    type: POST_LOAD,
    posts
  };
}

const initialState = {
  errorMessage: '',
  posts: []
};

function postApp(state = initialState, action = {}) {
  switch (action.type) {
    case 'POST_FAIL':
      return Object.assign({}, state, {
        errorMessage: action.errorMessage
      });
    case 'POST_SUCCESS':
      return Object.assign({}, state, {
        errorMessage: ''
      });
    case 'POST_LOAD':
      return Object.assign({}, state, {
        posts: action.posts
      });
    default:
      return state;
  }
}

let store = createStore(postApp);

function _loadPost() {
  const { postFail, postLoad } = this.props.actions;

  fetch('/post', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      // NOTE: This part is not sure.
      start: 1,
      end: 10
    })
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.success) {
        return postLoad(response.posts);
      } else {
        return postFail(response.errorMessage);
      }
    });
}

class PostItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { content } = this.props.content;
    return (
      <p>{content}</p>
    );
  }
}

PostItem.propTypes = {
  content: PropTypes.string.isRequired
};

class PostList extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this._loadPost = _loadPost.bind(this);
  }

  render() {
    const { posts, postLoad } = this.props;

    const postElements = posts.map((post) => {
      <li key={post.id}>
        <PostItem content={post.content} />
      </li>
    });
    return (
      <div>
        <ul>{postElements}</ul>
        <button onClick={this.handleClick}>Load</button>
      </div>
    );
  }

  componentDidMount() {
    this._loadPost();
  }

  handleClick(e) {
    this._loadPost();
  }
}

PostList.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired
  }).isRequired).isRequired

};

class App extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this._loadPost    = _loadPost.bind(this);
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
        <PostList posts={this.props.posts} actions={this.props.actions}/>
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
          postSuccess();
          return this._loadPost();
        } else {
          return postFail(response.errorMessage);
        }
      });
  }
}

App.PropTypes = {
  errorMessage: PropTypes.string.isRequired,
  posts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired
  }).isRequired).isRequired
};

function mapStateToProps(state) {
  return {
    errorMessage: state.errorMessage,
    posts: state.posts
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      postFail,
      postSuccess,
      postLoad
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
