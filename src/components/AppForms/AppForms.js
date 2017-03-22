import React from 'react';
import SigninForm from '../SigninForm/SigninForm';
import ThreadForm from '../ThreadForm/ThreadForm';
import $ from 'jquery';

class AppForms extends React.Component {
  constructor() {
    super();
    
    this.state = {
      accessCode: '',
      username: '',
      showThreadForm: false,
      showSigninForm: true,      
    };
    
    this.onStart = this.onStart.bind(this);
    this.onSignin = this.onSignin.bind(this);
  }
  
  render() {
    return (
      <div>
        {this.state.showSigninForm ? <SigninForm onStart={this.onStart} onSignin={this.onSignin} /> : true }
        {this.state.showThreadForm ? <ThreadForm accessCode={this.state.accessCode} username={this.state.username} /> : null }
      </div>
    );
  }

  onStart(accessCode, username) {
    this.setState({
      accessCode: accessCode,
      username: username,
      showThreadForm: true,
      showSigninForm: false
    });
    
    this.props.getSigninVars(accessCode, username);
  }
  
  onSignin(accessCode, username) {
    this.setState({
      accessCode: accessCode,
      username: username,
      showThreadForm: true,
      showSigninForm: false
    });
    
    this.props.getSigninVars(accessCode, username);
    
    $.get('/api/posts/' + accessCode, function(data){
      this.props.showPosts(data);
    }.bind(this));
  }
}

export default AppForms;