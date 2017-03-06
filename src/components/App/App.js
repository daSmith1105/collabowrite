var React = require('react');
var UserForms = require('../UserForms/UserForms');
var Posts = require('../Posts/Posts');
var PUSHER_APP_KEY = '8dfa4a5831cd9c0be510';
var $ = require('jquery');

var App = React.createClass({
  getInitialState: function() {
    return {
      posts: [],
      matchCode: '',
      username: ''
    };
  },

  componentWillMount: function() {
    this.pusher = new Pusher(PUSHER_APP_KEY, {
      encrypted: true,
    });
    this.channel = this.pusher.subscribe('project_posts');
  },

  componentDidMount: function() {
    this.channel.bind('new_post', this.addPosts);
    this.channel.bind('new_comment', this.addComments);
  },

  componentWillUnmount: function() {
    this.channel.unbind();
    this.pusher.unsubscribe(this.channel);
  },

  addPosts: function(data) {
    var newArray = this.state.posts;
    newArray.push(data);
    this.setState({
      posts: newArray
    });
  },
  
  addComments: function(data) {
    var newArray = this.state.posts;
    for (var i = 0; i < newArray.length; i++) {
      if (newArray[i]._id === data._id) {
        newArray[i].comments = data.comments;
        newArray[i].updated = true;
        this.setState({
          posts: newArray
        });
        setTimeout(function() {
          $(".newComment").toggleClass("highlight");
          setTimeout(function() {
            $(".newComment").toggleClass("highlight");
          }, 2000);
        }, 100);
        newArray[i].updated = null;
        break;
      }
    }
  },

  render: function() {
    return (
      <div className="row">
        <Posts posts={this.state.posts} matchCode={this.state.matchCode} username={this.state.username} ref="posts" />
        <UserForms showOldPosts={this.showOldPosts} getSigninVars={this.getSigninVars} />
      </div>
    );
  },
  
  showOldPosts: function(data) {
    this.setState({posts: data});
  },
  
  getSigninVars: function(accessCode, username) {
    this.setState({
      matchCode: accessCode,
      username: username
    });
  }
});

module.exports = App;