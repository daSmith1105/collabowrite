var React = require('react');
var UserForms = require('../UserForms/UserForms');
var Events = require('../Events/Events');

var App = React.createClass({
  getInitialState: function() {
    return {
      events: [],
      matchCode: ''
    };
  },

  componentWillMount: function() {
    this.pusher = new Pusher(PUSHER_APP_KEY, {
      encrypted: true,
    });
    this.channel = this.pusher.subscribe('events_to_be_shown');
  },

  componentDidMount: function() {
    this.channel.bind('newPosts', this.updateEvents);
  },

  componentWillUnmount: function() {
    this.channel.unbind();

    this.pusher.unsubscribe(this.channel);
  },

  updateEvents: function(data) {
    var newArray = this.state.events;
    newArray.push(data);
    this.setState({
      events: newArray,
    });
  },

  render: function() {
    return (
      <div>
        <Events events={this.state.events} matchCode={this.state.matchCode} ref="events" />
        <UserForms showOldPosts={this.showOldPosts} getAccessCode={this.getAccessCode} />
      </div>
    );
  },
  
  showOldPosts: function(data) {
    this.setState({events: data});
  },
  
  getAccessCode: function(accessCode) {
    this.setState({matchCode: accessCode});
  }
});

module.exports = App;