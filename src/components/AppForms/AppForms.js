import React from 'react';
import SigninForm from '../SigninForm/SigninForm';
import ThreadForm from '../ThreadForm/ThreadForm';
import axios from 'axios';

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
    axios.get('/api/posts/' + accessCode).then(function(res){
      this.props.showPosts(res.data);
    }.bind(this));
  }

  render() {
    return (
      <div>
        {this.state.showSigninForm ? <SigninForm onStart={this.onStart} onSignin={this.onSignin} /> : true }
        {this.state.showThreadForm ? <ThreadForm accessCode={this.state.accessCode} username={this.state.username} /> : null }
      </div>
    );
  }
}

export default AppForms;