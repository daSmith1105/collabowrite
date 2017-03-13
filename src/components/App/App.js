import React from 'react';
import store from 'store';
import Pusher from '../../pusher.min.js';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PostContainer from '../PostContainer/PostContainer';
import UserForms from '../UserForms/UserForms';
import { Label } from 'react-bootstrap';
import $ from 'jquery';

const PUSHER_APP_KEY = '8dfa4a5831cd9c0be510';
const notification = new Audio('notification.mp3');

class App extends React.Component {
  constructor() {
    super();
    
    //Turn on notification sounds if no sound setting found on local storage
    if (!store.get('sound')) {
      store.set('sound', { setting: true });
    }
    
    this.state = {
      posts: [],
      matchCode: '',
      username: '',
      showPosts: false,
      sound: store.get('sound').setting
    };      
    
    this.addPosts = this.addPosts.bind(this);
    this.addComments = this.addComments.bind(this);
    this.setSound = this.setSound.bind(this);
    this.showPosts = this.showPosts.bind(this);
    this.getSigninVars = this.getSigninVars.bind(this);
  }
  
  componentWillMount() {
    this.pusher = new Pusher(PUSHER_APP_KEY, {
      encrypted: true,
    });
    this.channel = this.pusher.subscribe('project_posts');
  }

  componentDidMount() {
    this.channel.bind('new_post', this.addPosts);
    this.channel.bind('new_comment', this.addComments);
  }

  componentWillUnmount() {
    this.channel.unbind();
    this.pusher.unsubscribe(this.channel);
  }

  render() {
    return (
      <div className="row">
        <ReactCSSTransitionGroup transitionName="evt-transition" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
          {this.state.showPosts ? <PostContainer posts={this.state.posts} matchCode={this.state.matchCode} username={this.state.username} setSound={this.setSound} /> : null}
        </ReactCSSTransitionGroup>
        <UserForms showPosts={this.showPosts} getSigninVars={this.getSigninVars} />
        <div className="rights"><Label className="rights">© 2017 Tim Paik</Label></div>
      </div>
    );
  }
  
  addPosts(data) {
    if (data.accessCode === this.state.matchCode) {
      let newArray = this.state.posts;
      newArray.push(data);
      this.setState({
        posts: newArray
      });
      
      //Play notification sound if sound setting is on and the post was not made by the user
      if (this.state.sound && this.state.username !== data.username) {
    	  notification.play();
    	}
    }
  }
  
  addComments(data) {
    let newArray = this.state.posts;
    const comments = data.comments;
    const commentUser = comments[comments.length-1].username;
    for (var i = 0; i < newArray.length; i++) {
      if (newArray[i]._id === data._id) {
        //Update comments array for post that received new comment
        newArray[i].comments = data.comments;
        
        //Add an updated flag which will be used in Post component to add a highlighting CSS class
        newArray[i].updated = true;
        
        this.setState({
          posts: newArray
        });
        
        //Temporarily higlight comment by toggling CSS class
        setTimeout(function() {
          $(".newComment").toggleClass("highlight");
          setTimeout(function() {
            $(".newComment").toggleClass("highlight");
            setTimeout(function() {
              newArray[i].updated = false;
              this.setState({
                posts: newArray
              });
            }.bind(this), 1000);
          }.bind(this), 1000);
        }.bind(this), 100);
        
        if (this.state.sound && this.state.username !== commentUser) {
      	  notification.play();
      	}
      	
        break;
      }
    }
  }
  
  setSound(boolean) {
    this.setState({
      sound: boolean
    });
  }
  
  showPosts(data) {
    this.setState({
      posts: data,
      showPosts: true
    });
  }
  
  getSigninVars(accessCode, username) {
    this.setState({
      matchCode: accessCode,
      username: username,
      showPosts: true
    });
  }
}

export default App;