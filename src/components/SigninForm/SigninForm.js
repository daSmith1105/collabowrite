var React = require('react');
var $ = require('jquery');

var SigninForm = React.createClass({
  getInitialState: function() {
    return {
      showButtons: true,
      showNewForm: false,
      showJoinForm: false
    };
  },
  
  render: function() {
    return (
      <div>
        {this.state.showButtons ? <div>
          <button id="newproject" onClick={this.showNewForm}>Start a new project</button>
          <button id="joinproject" onClick={this.showJoinForm}>Join in on a project</button>
        </div> : true }
        {this.state.showNewForm ? <form id="newform" onSubmit={this.createNewPost}> 
          <label>This is your project access code. Please write it down!</label>&nbsp;<input type="text" required ref="newAccessCode" readOnly />
          <br />
          <label>Enter your name</label>&nbsp;<input type="text" autoFocus required ref="newUsername" />
          <br />
          <label>Comment on what you're writing about and what you'd like others to focus on.</label>
          <br/>
          <textarea required ref="comment" />
          <br/>
          <label>Share your initial version of the writing.</label>
          <br/>
          <textarea required ref="content" />
          <br/>
          <input type="submit" value="Start a new project" />
          <button onClick={this.goBack}>Back</button>
        </form> : false }
        {this.state.showJoinForm ? <form id="joinform" onSubmit={this.storeSigninVars}> 
          <label>Project access code</label>&nbsp;<input type="text" autoFocus required ref="accessCode" />
          <br />
          <label>Username</label>&nbsp;<input type="text" required ref="username" />
          <br />
          <input type="submit" value="Join in on the project" />
          <button onClick={this.goBack}>Back</button>
        </form> : false }
      </div>
    );
  },
  
  showNewForm: function(e) {
    e.preventDefault();
    this.setState({
      showButtons: false,
      showNewForm: true
    });
    var candidateCode = Math.random().toString(36).substr(2, 4);
    $.get('/api/posts/' + candidateCode, function(data){
      var match = false;
      if (data.length !== 0) { match = true }
      if (match) {
        candidateCode = Math.random().toString(36).substr(2, 4);
        this.refs.newAccessCode.value = candidateCode;
      } else {
        this.refs.newAccessCode.value = candidateCode;
      }
    }.bind(this));
  },
  
  showJoinForm: function(e) {
    e.preventDefault();
    this.setState({
      showButtons: false,
      showJoinForm: true
    });
  },
  
  goBack: function(e) {
    e.preventDefault();
    this.setState({
      showButtons: true,
      showNewForm: false,
      showJoinForm: false
    });
  },
  
  createNewPost: function(e) {
    e.preventDefault();
    this.props.onStart(this.refs.newAccessCode.value, this.refs.newUsername.value);
    
    var data = {
      accessCode: this.refs.newAccessCode.value,
      username: this.refs.newUsername.value,
      content: this.refs.content.value,
      comment: this.refs.comment.value
    };
  
    $.ajax('/api/post', {
      type: 'POST',
      data: JSON.stringify(data),
      datatype: 'json',
      contentType: 'application/json'
    })
    .done(function(data) {
      console.log('Successfully posted to database.');      
    })
    .fail(function() {
      console.log('Failed to post to database.');
    });
  },
  
  storeSigninVars: function(e) {
    e.preventDefault();
    $.get('/api/posts/' + this.refs.accessCode.value, function(data){
      var noMatch = false;
      if (data.length === 0) { noMatch = true }
      if (noMatch) {
        alert('The project access code you typed in is not valid. Please check again!');
      } else {
        this.props.onSignin(this.refs.accessCode.value, this.refs.username.value);
      }
    }.bind(this));
  }
});

module.exports = SigninForm;