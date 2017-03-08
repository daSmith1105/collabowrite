var React = require('react');
var FA = require('react-fontawesome');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var $ = require('jquery');

import { Jumbotron, Panel, Well, Button, ButtonGroup, Tooltip, OverlayTrigger } from 'react-bootstrap';


var SigninForm = React.createClass({
  getInitialState: function() {
    return {
      showIntro: true,
      showNewForm: false,
      showJoinForm: false
    };
  },
  
  render: function() {
    
    var tooltip = (
      <Tooltip id="tooltip"><b><FA name="lightbulb-o" /> Tip</b>: Share only with your group members since this is what your project members will use to log into the project.</Tooltip>
    );
    
    var buttons = (
      <div>
        <ButtonGroup justified>
          <ButtonGroup>
            <Button bsStyle="success" onClick={this.showNewForm}>Create project</Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button bsStyle="info" onClick={this.showJoinForm}>Join project</Button>
          </ButtonGroup>
        </ButtonGroup>
      </div>
    );
    
    return (
      <div>
        <Jumbotron>
          <a href="#" onClick={this.showIntro}><h2>Collabo<span className="green">write</span> <span className="example">a sentence.</span></h2></a>
        </Jumbotron>
        <Panel header={buttons} className="intro_screen">
          {this.state.showIntro ?
            <div>
              <h3><FA name="clock-o" className="intro" /> Collaborate <span className="green">real-time</span></h3>
              <h5>Anytime you post a revision, comment, suggestion, or announcment, others working on the project will see it instantly. No more waiting around or refreshing for updates.</h5>
              <h3><FA name="mobile" className="intro" /> Work <span className="green">mobile-friendly</span></h3>
              <h5>For those light-bulb moments while you're out, access and work on your projects on a smartphone or tablet, with all of the functions you have while you're on your computer.</h5>
              <h3><FA name="slideshare" className="intro" /> Involve your <span className="green"> audience</span></h3>
              <h5>Skip the slides: when you're facilitating a class, meeting, or a brainstorming session, just put your project on a projector and invite others in the room to share their ideas onto the screen using their smartphones. You can blow up the text of any post or comment with a single click.</h5> 
              <h3><FA name="hand-peace-o" className="intro" /> Get started <span className="green"> hassle-free</span></h3>
              <h5>No need to sign up for an account. Create a new project, and we'll generate a four-letter/number code that you and your project members can use to access the project anytime, anywhere.</h5>
              <Button block onClick={this.showDemo}><b>Click to see a demo project</b></Button>
            </div>
          : true }
          <ReactCSSTransitionGroup transitionName="form-transition" transitionEnterTimeout={500} transitionLeaveTimeout={300}>        
            {this.state.showNewForm ?
              <div>
                <form id="newform" onSubmit={this.createNewPost}> 
                  <Well>
                    <label className="accesscode_label">Below is your new project access code.<br />Please write it down or save it somewhere safe.</label>
                    <OverlayTrigger placement="bottom" overlay={tooltip}>
                      <input className="accesscode_input" type="text" required ref="newAccessCode" readOnly />
                    </OverlayTrigger>
                  </Well>
                  <label>Enter your name</label>&nbsp;<input type="text" autoFocus required ref="newUsername" />
                  <br />
                  <label>Provide some context for this project (i.e. what kind of writing it is, what others should focus on...)</label>
                  <br/>
                  <textarea required ref="comment" />
                  <br/>
                  <label>Optional: Share an initial version or starting point for the writing you have in mind</label>
                  <br/>
                  <textarea ref="content" />
                  <br/>
                  <Button block bsStyle="success" type="submit"><FA name="upload" /> Launch it!</Button>
                </form>
              </div>
            : false}
            {this.state.showJoinForm ?
              <div>
                <form id="joinform" onSubmit={this.storeSigninVars}> 
                  <input type="password" autoFocus required ref="accessCode" placeholder="Project access code" />
                  <br />
                  <input type="text" required ref="username" placeholder="Your name" />
                  <br />
                  <Button block bsStyle="info" type="submit"><FA name="sign-in" /> Join in!</Button>
                </form>
              </div>
            : false}
          </ReactCSSTransitionGroup>
        </Panel>
      </div>
    );
  },
  
  showIntro: function(e) {
    e.preventDefault();
    this.setState({
      showIntro: true,
      showNewForm: false,
      showJoinForm: false
    });
  },
  
  showDemo: function() {
    $.get('/api/posts/1234', function(data){
      if (data.length === 0) {
        alert('The project access code you typed in is not valid. Please check again!');
      } else {
        this.props.onSignin('1234', 'Test user');
      }
    }.bind(this));
  },
  
  showNewForm: function() {
    this.setState({
      showIntro: false,
      showNewForm: true,
      showJoinForm: false,
    });
    
    var candidateCode;
    var generateCode = function() {
      candidateCode = '';
      var possible = "abcdefghijkmnpqrtuvwxyz234678";
  
      for( var i=0; i < 4; i++ )
          candidateCode += possible.charAt(Math.floor(Math.random() * possible.length));
  
      return candidateCode;
    };
    
    generateCode();
    
    $.get('/api/posts/' + candidateCode, function(data){
      if (data.length !== 0) {
        generateCode();
        this.refs.newAccessCode.value = candidateCode;
      } else {
        this.refs.newAccessCode.value = candidateCode;
      }
    }.bind(this));
  },
  
  showJoinForm: function() {
    this.setState({
      showIntro: false,
      showJoinForm: true,
      showNewForm: false
    });
  },
  
  createNewPost: function(e) {
    e.preventDefault();
    
    this.props.onStart(this.refs.newAccessCode.value, this.refs.newUsername.value);
    
    var data = {
      accessCode: this.refs.newAccessCode.value,
      username: this.refs.newUsername.value,
      content: this.refs.content.value.replace(/\n\r?/g, '<br />'),
      prevContent: '',
      editedFrom: 0,
      comment: this.refs.comment.value.replace(/\n\r?/g, '<br />')
    };
    
    if (data.content === '') {
      data.content = '';
    }

    $.ajax('/api/post', {
      type: 'POST',
      data: JSON.stringify(data),
      datatype: 'json',
      contentType: 'application/json'
    });
  },
  
  storeSigninVars: function(e) {
    e.preventDefault();
    $.get('/api/posts/' + this.refs.accessCode.value, function(data){
      if (data.length === 0) {
        alert('The project access code you typed in is not valid. Please check again!');
      } else {
        this.props.onSignin(this.refs.accessCode.value, this.refs.username.value);
      }
    }.bind(this));
  }
});

var examples = [ "a topic sentence", "a thesis statement", "a mission statement", "instructions", "product descriptions", "translations", "a plotline", "a headline", "a tagline", "a catchphrase", "a paraphrase", "a paragraph", "a sentence"];


if ($(window).width() > 767) {
  setInterval(function(){
    $(".example").fadeOut(function() {
      $(this).text(examples[examples.push(examples.shift())-1] + '.').fadeIn();
    });  
  }, 1500);    
}

module.exports = SigninForm;