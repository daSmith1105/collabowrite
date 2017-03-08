var React = require('react');
var Post = require('../Post/Post');
var FA = require('react-fontawesome');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var notification = new Audio('notification.mp3');
var Scroll = require('react-scroll');
var scroll = Scroll.animateScroll;

import { Jumbotron, Button, Alert } from 'react-bootstrap';

var Posts = React.createClass({
  getInitialState: function() {
    return {
      alertVisible: true
    };
  },
  
	render: function() {
	  var postsArray = this.props.posts;
	  var verNumber = 0;
	  var username = this.props.username;
	  
    var postsMapped = postsArray.map(function (post, index) {
      if (this.props.matchCode === post.accessCode) {
        notification.play();
        if (post.content !== 'general_comment' && post.content !== '') {
          verNumber++;
        }
        return <Post post={post} key={index} version={verNumber} yourUsername={username} />;
      }
    }.bind(this));

    if (postsArray.length < 4) {
      return (
        <div>
          <Jumbotron>
            <h2>Collabo<span className="green">write</span></h2>
          </Jumbotron>
          <ReactCSSTransitionGroup transitionName="evt-transition" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
            {this.state.alertVisible ?
              <Alert bsStyle="warning">
                <b><FA name="lightbulb-o" /> Tip: During presentations, you can click on a post or comment to enlarge its text size!</b>
              </Alert>
            : true}
          </ReactCSSTransitionGroup>
          <ReactCSSTransitionGroup component="ul" className="postlist" transitionName="evt-transition" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
            {postsMapped}
          </ReactCSSTransitionGroup>
        </div>
      );
    } else {
      return (
        <div>
          <Jumbotron>
            <h2>Collabo<span className="green">write</span></h2>
          </Jumbotron>
          <Button bsStyle="success" bsSize="large" block onClick={this.scrollDown}><FA name="angle-down" /> Scroll down to latest post</Button><br />
          <ReactCSSTransitionGroup transitionName="evt-transition" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
            {this.state.alertVisible ?
              <Alert bsStyle="warning">
                <b><FA name="lightbulb-o" /> Tip: During presentations, you can click on a post or comment to enlarge its text size!</b>
              </Alert>
            : true}
          </ReactCSSTransitionGroup>
          <ReactCSSTransitionGroup component="ul" className="postlist" transitionName="evt-transition" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
            {postsMapped}
          </ReactCSSTransitionGroup>
          <Button block bsSize="large" bsStyle="warning" onClick={this.scrollUp}><FA name="angle-up" /> Scroll up to original post</Button>
          <br />
        </div>
      );      
    }
	},
	
  scrollDown: function() {
    scroll.scrollToBottom();
  },

  scrollUp: function (){
    scroll.scrollToTop();
  }

});

module.exports = Posts;