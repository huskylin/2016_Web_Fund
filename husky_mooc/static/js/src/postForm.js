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

function postLoad(posts, len, max) {
  // Debug.
  //console.log(max);
  //console.log(len);
  return {
    type: POST_LOAD,
    posts,
    len,
    max
  };
}

const initialState = {
  errorMessage: '',
  posts: [],
  len: 0,
  max: 0
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
        posts: action.posts.concat(state.posts),
        len: action.len,
        max: action.max
      });
    default:
      return state;
  }
}

let store = createStore(postApp);

function _loadPost() {
  const { len, max } = this.props;
  const { postFail, postLoad } = this.props.actions;

  fetch('/load', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      start: max + 1,
      howMany: 10
    })
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.success) {
        response.posts.reverse();
        const newLen = response.posts.length + len;
        const newMax = response.posts[0].id;
        return postLoad(response.posts, newLen, newMax);
      } else {
        return postFail(response.errorMessage);
      }
    });
}

class PostItem extends Component {
  render() {
    // Debug
    //console.log(this.props.post);
    const { id, date, user, content } = this.props.post;
    return (
      <div>
        <p>{date}</p>
        <p>{user}</p>
        <p>{content}</p>
      </div>
    );
  }
}

PostItem.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    user: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    date: PropTypes.string.isRequred
  }).isRequired
};

class PostList extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this._loadPost   = _loadPost.bind(this);
  }

  render() {
    const { posts, postLoad } = this.props;

    const postElements = posts.map((post) => (
      <li key={post.id}>
        <PostItem post={post} />
      </li>
    ));

    return (
      <div>
        <ul>{postElements}</ul>
        <button onClick={this.handleClick}>顯示較早留言</button>
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
  len: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  posts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    user: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    date: PropTypes.string.isRequred
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
        <PostList
          posts={this.props.posts}
          len={this.props.len}
          max={this.props.max}
          actions={this.props.actions}
        />
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
  len: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  posts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    user: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    date: PropTypes.string.isRequred
  }).isRequired).isRequired
};

function mapStateToProps(state) {
  return {
    errorMessage: state.errorMessage,
    posts: state.posts,
    len: state.len,
    max: state.max
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
