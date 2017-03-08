var React = require('react');
var Post = require('../Post/Post');
var FA = require('react-fontawesome');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var notification = new Audio('notification.mp3');
var store = require('store');
var Scroll = require('react-scroll');
var scroll = Scroll.animateScroll;

import { Jumbotron, Button, Alert } from 'react-bootstrap';

store.set('sound', { setting:'on' });

var Posts = React.createClass({
  getInitialState: function() {
    return {
      alertVisible: true,
      soundIcon: (<FA name="volume-up" />),
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
        return <Post post={post} key={index} version={verNumber} yourUsername={username} arrayLength={postsArray.length} />;
      }
    }.bind(this));

    if (postsArray.length < 4) {
      return (
        <div>
          <Jumbotron>
            <h2>Collabo<span className="green">write</span></h2><Button bsStyle="info" className="sound" onClick={this.setSound}>{this.state.soundIcon}</Button>
          </Jumbotron>
          <ReactCSSTransitionGroup transitionName="evt-transition" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
            {this.state.alertVisible ?
              <Alert bsStyle="info">
                <b><FA name="lightbulb-o" /> Tip: If you're showing this on a projector, click on a post or comment to enlarge its text size.</b>
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
            <h2>Collabo<span className="green">write</span><Button bsStyle="info" className="sound" onClick={this.setSound}>{this.state.soundIcon}</Button></h2>
          </Jumbotron>
          <Button bsStyle="success" bsSize="large" block onClick={this.scrollDown}><FA name="angle-down" /> Scroll down to latest post</Button><br />
          <ReactCSSTransitionGroup transitionName="evt-transition" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
            {this.state.alertVisible ?
              <Alert bsStyle="info">
                <b><FA name="lightbulb-o" /> Tip: If you're showing this on a projector, click on a post or comment to enlarge its text size.</b>
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
	
	setSound: function() {
    if (store.get('sound').setting === 'on') {
      store.set('sound', { setting:'off' });
      notification = new Audio();
      this.setState({
        soundIcon: (<FA name="volume-off" />)
      });
    } else {
      store.set('sound', { setting:'on' });
      notification = new Audio('notification.mp3');
      this.setState({
        soundIcon: (<FA name="volume-up" />)
      });
    }
    console.log(store.get('sound').setting);
	},
	
  scrollDown: function() {
    scroll.scrollToBottom();
  },

  scrollUp: function (){
    scroll.scrollToTop();
  }

});

module.exports = Posts;