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

function postSuccess(newPosts, minId, maxId, len) {
  // Debug.
  console.log(`minId is ${minId}`);
  console.log(`maxId is ${maxId}`);
  console.log(`len is ${len}`);
  return {
    type: POST_SUCCESS,
    newPosts,
    minId,
    maxId,
    len
  };
}

function postLoad(oldPosts, minId, maxId, len) {
  // Debug.
  console.log(`minId is ${minId}`);
  console.log(`maxId is ${maxId}`);
  console.log(`len is ${len}`);
  return {
    type: POST_LOAD,
    oldPosts,
    minId,
    maxId,
    len
  };
}

const initialState = {
  errorMessage: '',
  posts: [],
  minId: 10000,
  maxId: 0,
  len: 0
};

function postApp(state = initialState, action = {}) {
  switch (action.type) {
    case 'POST_FAIL':
      return Object.assign({}, state, {
        errorMessage: action.errorMessage
      });
    case 'POST_SUCCESS':
      return Object.assign({}, state, {
        errorMessage: '',
        posts: action.newPosts.concat(state.posts),
        minId: action.minId,
        maxId: action.maxId,
        len: action.len
      });
    case 'POST_LOAD':
      return Object.assign({}, state, {
        errorMessage: '',
        posts: state.posts.concat(action.oldPosts),
        minId: action.minId,
        maxId: action.maxId,
        len: action.len
      });
    default:
      return state;
  }
}

let store = createStore(postApp);

function _loadPost() {
  const { minId, maxId, len } = this.props;
  const { postFail, postLoad } = this.props.actions;

  fetch('/load', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      minId: minId,
      howMany: 10
    })
  })
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      if (response.success) {
        // debug
        console.log(response.posts);

        const newLen = response.posts.length + len;
        let newMinId;
        let newMaxId;

        if (response.posts.length !== 0) {
          if (response.posts[0].id < minId)
            newMinId = response.posts[0].id;
          else
            newMinId = minId;
        } else {
          newMinId = minId;
        }

        response.posts.reverse();

        if (response.posts.length !== 0) {
          if (response.posts[0].id > maxId)
            newMaxId = response.posts[0].id;
          else
            newMaxId = maxId;
        } else {
          newMaxId = maxId;
        }

        return postLoad(response.posts, newMinId, newMaxId, newLen);
      } else {
        return postFail(response.errorMessage);
      }
    });
}

class PostItem extends Component {
  render() {

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
  minId: PropTypes.number.isRequired,
  maxId: PropTypes.number.isRequired,
  len: PropTypes.number.isRequired,
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
          minId={this.props.minId}
          maxId={this.props.maxId}
          len={this.props.len}
          actions={this.props.actions}
        />
      </div>
    );
  }

  handleSubmit(e) {
    e.preventDefault();

    const { minId, maxId, len } = this.props;
    const { postFail, postSuccess } = this.props.actions;

    const contentNode = this.refs.content;
    const content     = contentNode.value;

    if (content.length < 5) {
      contentNode.value = '';
      return postFail('打滿五個字很困難嗎?');
    }

    fetch('/post', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        maxId,
        content
      })
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          contentNode.value = '';
          // debug
          console.log(response.posts);

          const newLen = response.posts.length + len;
          let newMinId;
          let newMaxId;

          if (response.posts.length !== 0) {
            if (response.posts[0].id < minId)
              newMinId = response.posts[0].id;
            else
              newMinId = minId;
          } else {
            newMinId = minId;
          }

          response.posts.reverse();

          if (response.posts.length !== 0) {
            if (response.posts[0].id > maxId)
              newMaxId = response.posts[0].id;
            else
              newMaxId = maxId;
          } else {
            newMaxId = maxId;
          }

          return postSuccess(response.posts, newMinId, newMaxId, newLen);
        } else {
          return postFail(response.errorMessage);
        }
      });
  }
}

App.PropTypes = {
  errorMessage: PropTypes.string.isRequired,
  minId: PropTypes.number.isRequired,
  maxId: PropTypes.number.isRequired,
  len: PropTypes.number.isRequired,
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
    minId: state.minId,
    maxId: state.maxId,
    len: state.len
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
