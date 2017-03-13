import React from 'react';
import store from 'store';
import Post from '../Post/Post';
import { Jumbotron, Button, Alert } from 'react-bootstrap';
import FA from 'react-fontawesome';
import ScrollButton from '../ScrollButton/ScrollButton';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Scroll from 'react-scroll';

const scroll = Scroll.animateScroll;
const notification = new Audio('notification.mp3');

class PostContainer extends React.Component {
  constructor() {
    super();
    
    //Display on/off icon in sound button with corresponding boolean value
    this.state = {
      soundButton: store.get('sound').setting,
      alertVisible: true
    };
    
    this.setSound = this.setSound.bind(this);
    this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
  }

	render() {
	  const postsArray = this.props.posts;
	  let verNumber = 0;
	  
	  //Create list of individual Post components from array data
    let postsMapped = postsArray.map(function (post, index) {
      //Increment version number if post isn't a discussion thread or context post
      if (post.content !== 'general_comment' && post.content !== '') {
        verNumber++;
      }
      
      return <Post post={post} key={index} version={verNumber} yourUsername={this.props.username} />;
    }.bind(this));
    
    return (
      <div>
        <Jumbotron>
          <h2>Collabo<span className="green">write</span>
            <Button bsStyle="info" className="sound" onClick={this.setSound}>
              <FA name={ this.state.soundButton ? "volume-up" : "volume-off" } />
            </Button>
          </h2>
        </Jumbotron>
        <ScrollButton postsArray={postsArray} bsStyle="success" handleClick={this.scrollDown} FAname="angle-down" buttonText="Scroll down to the latest post" /> 
        <ReactCSSTransitionGroup transitionName="evt-transition" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
          {this.state.alertVisible ?
            <Alert bsStyle="info" onDismiss={this.handleAlertDismiss}>
              <b><FA name="lightbulb-o" /> Tip: If you're showing this on a projector, click on a post or comment to enlarge its text size.</b>
            </Alert>
          : true}
        </ReactCSSTransitionGroup>
        <ReactCSSTransitionGroup component="ul" className="postlist" transitionName="evt-transition" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
          {postsMapped}
        </ReactCSSTransitionGroup>
        <ScrollButton postsArray={postsArray} bsStyle="info" handleClick={this.scrollUp} FAname="angle-up" buttonText="Scroll up to the original post" /> 
      </div>
    );
	}
	
	setSound() {
	  const soundOn = function(boolean) {
	    //Change displayed sound button icon by updating state
      this.setState({soundButton: boolean});
      
      //Update local storage sound setting
      store.set('sound', { setting: boolean });
      
      //Pass up sound setting to App parent component
      this.props.setSound(boolean);
      
      //Play sound setting to confirm when switched on
      if (boolean === true) {
        notification.play();
      }
	  }.bind(this);
	  
	  //Ternary operator to swith sound settings on and off
    this.state.soundButton ? soundOn(false) : soundOn(true);
	}
	
  scrollDown() {
    scroll.scrollToBottom();
  }

  scrollUp(){
    scroll.scrollToTop();
  }
  
  handleAlertDismiss() {
    this.setState({alertVisible: false});
  }
}

export default PostContainer;