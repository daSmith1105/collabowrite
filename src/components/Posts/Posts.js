var React = require('react');
var Post = require('../Post/Post');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var notification = new Audio('notification.mp3');

var Posts = React.createClass({
	render: function() {
	  var postsArray = this.props.posts;
	  
    var postsMapped = postsArray.map(function (evt, index) {
      if (this.props.matchCode === evt.accessCode) {
        notification.play();
        return <Post post={evt} key={index} version={index + 1} yourUsername={this.props.username} />;
      }
    }.bind(this));
    
    return (
      <div>
        <ReactCSSTransitionGroup component="ul" className="postlist" transitionName="evt-transition" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
          {postsMapped}
        </ReactCSSTransitionGroup>
      </div>
    );
	}
});

module.exports = Posts;