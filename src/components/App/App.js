import React from 'react';
import store from 'store';
import Pusher from '../../pusher.min.js';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Header from '../Header/Header';
import Posts from '../Posts/Posts';
import AppForms from '../AppForms/AppForms';
import { Label } from 'react-bootstrap';

const notification = new Audio('notification.mp3');

class App extends React.Component {
  constructor() {
    super();
    if (!store.get('sound')) {
      // Turn on notification sounds if no sound setting on local storage
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
    const PUSHER_APP_KEY = '8dfa4a5831cd9c0be510';
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
  
  showIntro(boolean) {
    this.setState({ showIntro: boolean });
  }
  
  setSound(boolean) {
    this.setState({ sound: boolean });
  }
  
  addPosts(data) {
    if (data.accessCode === this.state.matchCode) {
      let newArray = this.state.posts;
      newArray.push(data);
      this.setState({ posts: newArray });
      
      if (this.state.sound) {
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
        // Update comments array for post that received new comment
        newArray[i].comments = data.comments;
        
        // Add updated flag for use in Post component for highlighting CSS class
        newArray[i].updated = true;
        
        this.setState({ posts: newArray });
        
        // Temporarily higlight comment by toggling CSS class
        setTimeout(function() {
          document.querySelector('p.newComment').classList.toggle("highlight");
          setTimeout(function() {
            document.querySelector('p.newComment').classList.toggle("highlight");
            setTimeout(function() {
              newArray[i].updated = false;
              this.setState({ posts: newArray });
            }.bind(this), 1000);
          }.bind(this), 1000);
        }.bind(this), 100);
        
        if (this.state.sound) { notification.play(); } 
        break;
      }
    }
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
  
  render() {
    return (
      <div className="row">
        <Header setSound={this.setSound} signIn={this.state.showPosts} />
        <ReactCSSTransitionGroup transitionName="evt-transition" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
          {this.state.showPosts ? <Posts posts={this.state.posts} matchCode={this.state.matchCode} username={this.state.username} /> : null}
        </ReactCSSTransitionGroup>
        <AppForms showPosts={this.showPosts} getSigninVars={this.getSigninVars} />
        <div className="rights"><Label className="rights">© 2017 Tim Paik</Label></div>
      </div>
    );
  }  
}

export default App;