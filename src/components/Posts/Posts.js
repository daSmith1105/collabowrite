var React = require('react');
var Post = require('../Post/Post');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var notification = new Audio('notification.mp3');

var Posts = React.createClass({
	render: function() {
	  var postsArray = this.props.posts;
	  var verNumber = 0;
	  
    var postsMapped = postsArray.map(function (post, index) {
      if (this.props.matchCode === post.accessCode) {
        notification.play();
        if (post.content !== 'general_comment' ) {
          verNumber++;
        }
        return <Post post={post} key={index} version={verNumber} yourUsername={this.props.username} />;
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