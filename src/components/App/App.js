var React = require('react');
var UserForms = require('../UserForms/UserForms');
var Posts = require('../Posts/Posts');
var PUSHER_APP_KEY = '8dfa4a5831cd9c0be510';

var App = React.createClass({
  getInitialState: function() {
    return {
      posts: [],
      matchCode: ''
    };
  },

  componentWillMount: function() {
    this.pusher = new Pusher(PUSHER_APP_KEY, {
      encrypted: true,
    });
    this.channel = this.pusher.subscribe('project_posts');
  },

  componentDidMount: function() {
    this.channel.bind('new_post', this.updatePosts);
  },

  componentWillUnmount: function() {
    this.channel.unbind();

    this.pusher.unsubscribe(this.channel);
  },

  updatePosts: function(data) {
    var newArray = this.state.posts;
    newArray.push(data);
    this.setState({
      posts: newArray,
    });
  },

  render: function() {
    return (
      <div>
        <Posts posts={this.state.posts} matchCode={this.state.matchCode} ref="posts" />
        <UserForms showOldPosts={this.showOldPosts} getAccessCode={this.getAccessCode} />
      </div>
    );
  },
  
  showOldPosts: function(data) {
    this.setState({posts: data});
  },
  
  getAccessCode: function(accessCode) {
    this.setState({matchCode: accessCode});
  }
});

module.exports = App;