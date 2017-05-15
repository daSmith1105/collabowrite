import React from 'react';
import ConfirmMessage from '../ConfirmMessage/ConfirmMessage';
import TestMessage from '../TestMessage/TestMessage';
import { FormGroup, InputGroup, Button, ButtonGroup } from 'react-bootstrap';
import FA from 'react-fontawesome';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import axios from 'axios';
import Scroll from 'react-scroll';
const scroll = Scroll.animateScroll;

class PostForms extends React.Component {
  constructor () {
    super();
    this.state = {
      showReviseForm: false,
      showCommentForm: false,
      showWriteButton: true,
      showModal: false,
      showTestMessage: false
    };
    this.showReviseForm = this.showReviseForm.bind(this);
    this.showCommentForm = this.showCommentForm.bind(this);
    this.addRevision = this.addRevision.bind(this);
    this.addComment = this.addComment.bind(this);
    this.goBack = this.goBack.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.closeConfirm = this.closeConfirm.bind(this);   
    this.closeTestMessage = this.closeTestMessage.bind(this);
  }
  
  showReviseForm(){
    if (this.state.showReviseForm == false) {
      this.setState({ showReviseForm: true, showCommentForm: false }, function(){
        // Place content of the post in textarea for user to revise
        this.refs.revisionContent.value = this.props.content.replace(/<br\s*\/?>/mg,"\n");
      });
    } else {
      if (this.refs.revisionContent.value !== this.props.content) {
        // Open confirm message if user tries to close form with unsaved changes
        this.setState({ showModal: true });
      } else {
        this.setState({ showReviseForm: false });
      }
    }
  }
  
  showCommentForm() {
    if (this.state.showCommentForm == false) {
      this.setState({ showCommentForm: true, showReviseForm: false });
    } else {
      if (this.refs.commentOnly.value !== '') {
        this.setState({ showModal: true });
      } else {
        this.setState({ showCommentForm: false });
      }
    }    
  }
  
  addRevision(e) {
    e.preventDefault();
    var data = {
      accessCode: this.props.accessCode,
      username: this.props.yourUsername,
      content: this.refs.revisionContent.value.replace(/\n\r?/g, ' <br />').replace( /\s\s+/g, ' ' ),
      prevContent: this.props.content,
      editedFrom: this.props.version,
      comment: this.refs.revisionComment.value.replace(/\n\r?/g, ' <br />').replace( /\s\s+/g, ' ' )
    };
    
    if (data.username === 'Test user') {
      this.setState({ showTestMessage: true });
    } else {
      if (data.content === data.prevContent) {
        data = { username: this.props.yourUsername, comment: this.refs.revisionComment.value.replace(/\n\r?/g, ' <br />').replace( /\s\s+/g, ' ' ) };  
        axios.post('/api/post/' + this.props._id + '/comment', data);
      } else {
        axios.post('/api/post', data).then(function(){ scroll.scrollToBottom(); });
      }
      this.setState({ showReviseForm: false, showCommentForm: false });
    }
  }
  
  addComment(e) {
    e.preventDefault();
    var data = { username: this.props.yourUsername, comment: this.refs.commentOnly.value.replace(/\n\r?/g, ' <br />').replace( /\s\s+/g, ' ' ) };  
    if (data.username === 'Test user') {
      this.setState({ showTestMessage: true });
    } else {
      axios.post('/api/post/' + this.props._id + '/comment', data).then(function(){
        this.refs.commentOnly.value = '';
        this.setState({ showReviseForm: false, showCommentForm: false });        
      }.bind(this));
    }
  }
  
  goBack(e) {
    e.preventDefault();
    this.setState({ showReviseForm: false, showCommentForm: false });
  }
  
  closeForm() { this.setState({ showReviseForm: false, showCommentForm: false, showModal: false }); }

  closeConfirm() { this.setState({ showModal: false }); }
  
  closeTestMessage() { this.setState({ showReviseForm: false, showCommentForm: false, showTestMessage: false }); }

  render() {
    const confirmMsg = <ConfirmMessage showModal={this.state.showModal} closeConfirm={this.closeConfirm} closeForm={this.closeForm} />;
    const testMsg = <TestMessage showTestMessage={this.state.showTestMessage} closeTestMessage={this.closeTestMessage} />;
    
    if (this.props.content === "general_comment") {
      //Inline comment form only for discussion threads
      return (
        <form onSubmit={this.addComment}>
          <FormGroup className="button_combined">
            <InputGroup>
              <input className="button_combined" type="text" required ref="commentOnly" placeholder="Comment on this thread." />
              <InputGroup.Button>
                <Button type="submit"><FA name="comment" /></Button>
              </InputGroup.Button>
            </InputGroup>
          </FormGroup>
          {confirmMsg}
          {testMsg}
        </form>      
      );
      
    } else {
      //Collapsible comment & write forms for other post types
      return (
        <div>
          <ButtonGroup justified>
            <ButtonGroup><Button bsStyle="success" onClick={this.showCommentForm}><FA name="comment" /> Comment</Button></ButtonGroup>
            <ButtonGroup><Button bsStyle="info" onClick={this.showReviseForm}><FA name="pencil" /> Write</Button></ButtonGroup>
          </ButtonGroup>
          <ReactCSSTransitionGroup transitionName="form-transition" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
            {this.state.showReviseForm ?
              <form onSubmit={this.addRevision}>
                <br />
                <p><b><FA name="lightbulb-o" /> Tips:</b><span className="mobile_hide"> To enlarge form, pull its bottom right corner.</span> To close, click "Write" button again.</p>
                <textarea autoFocus spellCheck="true" required ref="revisionContent" placeholder="Suggest your version for the project writing." /><br />
                <textarea spellCheck="true" required ref="revisionComment" placeholder="Comment on your writing above." /><br />
                <Button block type="submit" bsStyle="info">Post your writing</Button>
              </form>
            : false}
            {this.state.showCommentForm ?
              <form onSubmit={this.addComment}>
                <br />
                <p><b><FA name="lightbulb-o" /> Tips:</b><span className="mobile_hide"> To enlarge form, pull its bottom right corner.</span> To close, click "Comment" button again.</p>                
                <textarea autoFocus required ref="commentOnly" placeholder="Comment on the post above." /><br />
                <Button block type="submit" bsStyle="success">Post comment</Button>
              </form>
            : false}
          </ReactCSSTransitionGroup>
          {confirmMsg}
          {testMsg}
        </div>
      );      
    }
  }
}

export default PostForms;