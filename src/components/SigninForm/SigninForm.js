import React from 'react';
import { Tooltip, ButtonGroup, Button, Panel, Well, OverlayTrigger } from 'react-bootstrap';
import IntroScreen from '../IntroScreen/IntroScreen';
import FA from 'react-fontawesome';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import AlertMessage from '../AlertMessage/AlertMessage';
import CodeMessage from '../CodeMessage/CodeMessage';
import axios from 'axios';

class SigninForm extends React.Component{
  constructor() {
    super();
    this.state = {
      showIntro: true,
      showNewForm: false,
      showJoinForm: false,
      showModal: false,
      showCodeMessage: false,
      accessCode: ''
    };
    this.showDemo = this.showDemo.bind(this);
    this.showNewForm = this.showNewForm.bind(this);
    this.showJoinForm = this.showJoinForm.bind(this);
    this.createNewPost = this.createNewPost.bind(this);
    this.storeSigninVars = this.storeSigninVars.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
    this.closeCodeMessage = this.closeCodeMessage.bind(this);
    this.confirmCodeMessage = this.confirmCodeMessage.bind(this);
  }
  
  showDemo() { this.props.onSignin('1234', 'Test user'); }
  
  showNewForm() {
    this.setState({
      showIntro: false,
      showNewForm: true,
      showJoinForm: false
    });
    
    let candidateCode = '';
    
    function generateCode() {
      const possible = "abcdefghijkmnpqrtuvwxyz234678";
      for (var i=0; i < 4; i++) candidateCode += possible.charAt(Math.floor(Math.random() * possible.length));
      return candidateCode;
    }
    
    generateCode();
    
    axios.get('/api/posts/' + candidateCode).then(function(res){
      // Run a get request with randomly generated access code
      if (res.data.length !== 0) {
        // Regenerate code in the statistically insignificant scenario that the code is already in use
        generateCode();
        this.setState({ accessCode: candidateCode });
        this.refs.newAccessCode.value = candidateCode;
      } else {
        this.setState({ accessCode: candidateCode });
        this.refs.newAccessCode.value = candidateCode;
      }
    }.bind(this));
  }
  
  showJoinForm() {
    this.setState({
      showIntro: false,
      showJoinForm: true,
      showNewForm: false
    });
  }
  
  createNewPost(e) {
    e.preventDefault();
    this.setState({ showCodeMessage: true });
  }
  
  storeSigninVars(e) {
    e.preventDefault();
    axios.get('/api/posts/' + this.refs.accessCode.value.toLowerCase()).then(function(res){
      if (res.data.length === 0) {  this.setState({ showModal: true }); }
      else { this.props.onSignin(this.refs.accessCode.value.toLowerCase(), this.refs.username.value); }
    }.bind(this));
  }

  closeAlert() { this.setState({ showModal: false }); }
  
  closeCodeMessage() { this.setState({ showCodeMessage: false }); }
  
  confirmCodeMessage() {
    this.setState({ showCodeMessage: false });
    this.props.onStart(this.refs.newAccessCode.value, this.refs.newUsername.value);
    let data = {
      accessCode: this.refs.newAccessCode.value,
      username: this.refs.newUsername.value,
      content: this.refs.content.value.replace(/\n\r?/g, ' <br />').replace( /\s\s+/g, ' ' ),
      prevContent: '',
      editedFrom: 0,
      comment: this.refs.comment.value.replace(/\n\r?/g, ' <br />').replace( /\s\s+/g, ' ' )
    };
    axios.post('/api/post/', data);
  }  

  render() {
    const buttons = (
      <ButtonGroup justified className="start_buttons">
        <Button bsStyle="success" onClick={this.showNewForm}>Create project</Button>
        <Button bsStyle="info" onClick={this.showJoinForm}>Join project</Button>
      </ButtonGroup>
    );
    
    const tooltip = (
      <Tooltip id="tooltip">
        <b><FA name="lightbulb-o" /> Tip</b>: Share only with your group members since this is what your project members will use to log into the project.
      </Tooltip>
    );
    
    return (
      <Panel header={buttons} className="intro_screen">
        {this.state.showIntro ?
          <div>
            <div className="demo_banner">
              <div className="demo_button_wraper">
                <h5 className="demo_h5">See it for yourself.</h5>
                <Button bsStyle="info" className="demo_button" onClick={this.showDemo}><b>Explore a demo project</b></Button>
              </div>
              <img className="writer" src="writer.jpg" />
              <div className="cite_freepik">Image by <a href="http://www.freepik.com/free-vector/office-banners_800177.htm" target="_blank">Freepik</a></div>
            </div>
            <IntroScreen />            
          </div>
        : true }
        <ReactCSSTransitionGroup transitionName="form-transition" transitionEnterTimeout={500} transitionLeaveTimeout={300}>        
          {this.state.showNewForm ?
            <form id="newform" onSubmit={this.createNewPost}> 
              <Well>
                <label className="accesscode_label">Below is your new project access code.<br />Please write it down or save it somewhere safe.</label>
                <OverlayTrigger placement="bottom" overlay={tooltip}><input className="accesscode_input" type="text" required ref="newAccessCode" readOnly /></OverlayTrigger>
              </Well>
              <label>Enter your name</label>&nbsp;<input type="text" autoFocus required ref="newUsername" /><br />
              <label>Provide some context for this project (i.e. what kind of writing it is, what others should focus on...)</label><br/>
              <textarea required ref="comment" /><br/>
              <label>Optional: Share an initial version or starting point for the writing you have in mind</label><br/>
              <textarea ref="content" /><br/>
              <Button block bsStyle="success" type="submit"><FA name="upload" /> Launch it!</Button>
            </form>
          : false}
          {this.state.showJoinForm ?
            <form id="joinform" onSubmit={this.storeSigninVars}> 
              <input autoFocus required ref="accessCode" placeholder="Project access code" /><br />
              <input type="text" required ref="username" placeholder="Your name" /><br />
              <Button block bsStyle="info" type="submit"><FA name="sign-in" /> Join in!</Button>
            </form>
          : false}
        </ReactCSSTransitionGroup>
        <AlertMessage showModal={this.state.showModal} closeAlert={this.closeAlert} />
        <CodeMessage showCodeMessage={this.state.showCodeMessage} closeCodeMessage={this.closeCodeMessage} confirmCodeMessage={this.confirmCodeMessage} accessCode={this.state.accessCode}/>
      </Panel>
    );
  }
}

export default SigninForm;