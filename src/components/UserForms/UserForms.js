import React from 'react';
import SigninForm from '../SigninForm/SigninForm';
import PostForm from '../PostForm/PostForm';
import $ from 'jquery';

class UserForms extends React.Component {
  constructor() {
    super();
    
    this.state = {
      accessCode: '',
      username: '',
      showInputForm: false,
      showSigninForm: true,      
    };
    
    this.onStart = this.onStart.bind(this);
    this.onSignin = this.onSignin.bind(this);
  }
  
  render() {
    return (
      <div>
        {this.state.showSigninForm ? <SigninForm onStart={this.onStart} onSignin={this.onSignin} /> : true }
        {this.state.showInputForm ? <PostForm accessCode={this.state.accessCode} username={this.state.username} /> : null }
      </div>
    );
  }

  onStart(accessCode, username) {
    this.setState({
      accessCode: accessCode,
      username: username,
      showInputForm: true,
      showSigninForm: false
    });
    
    this.props.getSigninVars(accessCode, username);
  }
  
  onSignin(accessCode, username) {
    this.setState({
      accessCode: accessCode,
      username: username,
      showInputForm: true,
      showSigninForm: false
    });
    
    this.props.getSigninVars(accessCode, username);
    
    $.get('/api/posts/' + accessCode, function(data){
      this.props.showPosts(data);
    }.bind(this));
  }
}

module.exports = UserForms;