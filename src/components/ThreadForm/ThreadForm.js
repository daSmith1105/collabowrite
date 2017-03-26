import React from 'react';
import { Well, Button } from 'react-bootstrap';
import FA from 'react-fontawesome';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ConfirmMessage from '../ConfirmMessage/ConfirmMessage';
import TestMessage from '../TestMessage/TestMessage';
import axios from 'axios';
import Scroll from 'react-scroll';
const scroll = Scroll.animateScroll;

class ThreadForm extends React.Component {
  constructor() {
    super();
    this.state = {
      showButtons: true,
      showCommentForm: false,
      showModal: false,
      showTestMessage: false
    };
    this.showCommentForm = this.showCommentForm.bind(this);
    this.addComment = this.addComment.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.closeConfirm = this.closeConfirm.bind(this);
    this.closeTestMessage = this.closeTestMessage.bind(this);
  }
  
  showCommentForm() {
    if (this.state.showCommentForm == false) {
      this.setState({ showCommentForm: true }, function() {
        scroll.scrollToBottom();      
      });
    } else {
      if (this.refs.comment.value !== '') {
        this.setState({ showModal: true }); 
      } else {
        this.setState({ showCommentForm: false });
      }
    }     
  }
  
  addComment(e) {
    e.preventDefault();
    let data = {
      accessCode: this.props.accessCode,
      username: this.props.username,
      content: 'general_comment',
      prevContent: 'general_comment',
      editedFrom: 0,
      comment: this.refs.comment.value.replace(/\n\r?/g, '<br />'),
    };
    if (data.username === 'Test user') {
      this.setState({ showTestMessage: true });
    } else {
      axios.post('/api/post', data);
      this.setState({ showCommentForm: false }, function() {
        scroll.scrollToBottom();
      });
    }
  }
  
  closeForm() {
    this.setState({
      showCommentForm: false,
      showModal: false
    });  
  }

  closeConfirm() { this.setState({ showModal: false }); }
  
  closeTestMessage() { this.setState({ showCommentForm: false, showTestMessage: false }); }

  render() {
    return (
      <Well>
        <Button block bsSize="large" onClick={this.showCommentForm}><b><FA name="bullhorn" /> Announce / Discuss</b></Button>   
        <ReactCSSTransitionGroup transitionName="form-transition" transitionEnterTimeout={500} transitionLeaveTimeout={300}>   
          {this.state.showCommentForm ?
            <form onSubmit={this.addComment}>
              <br />
              <textarea className="general_comment_textarea" autoFocus spellCheck="true" required ref="comment" placeholder="Make an announcement or suggestion about this project in a separate discussion thread post." /><br />
              <Button block bsStyle="success" type="submit">Begin thread</Button>
            </form>
          : false}
        </ReactCSSTransitionGroup>
        <ConfirmMessage showModal={this.state.showModal} closeConfirm={this.closeConfirm} closeForm={this.closeForm} />
        <TestMessage showTestMessage={this.state.showTestMessage} closeTestMessage={this.closeTestMessage} />
      </Well>
    );
  }
}

export default ThreadForm;