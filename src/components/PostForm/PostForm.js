var React = require('react');
var FA = require('react-fontawesome');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var Scroll = require('react-scroll');
var scroll = Scroll.animateScroll;
var $ = require('jquery');

import { Well, Button } from 'react-bootstrap';

var PostForm = React.createClass({
  getInitialState: function() {
    return {
      showButtons: true,
      showCommentForm: false
    };
  },

  render: function(){
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
      </Well>
    );
  },
  
  showCommentForm: function(){
    if (this.state.showCommentForm == false) {
      this.setState({
        showCommentForm: true,
      }, function (){
        scroll.scrollToBottom();      
      });
    } else {
      if (this.refs.comment.value !== '') {
        if (confirm("You haven't posted your thread yet.\nDo you still want to close this form?")) {
          this.setState({
            showCommentForm: false
          });          
        }
      } else {
        this.setState({
          showCommentForm: false
        });
      }
    }     
  },
  
  addComment: function (e){
    e.preventDefault();
  
    var data = {
      accessCode: this.props.accessCode,
      username: this.props.username,
      content: 'general_comment',
      prevContent: 'general_comment',
      editedFrom: 0,
      comment: this.refs.comment.value.replace(/\n\r?/g, '<br />'),
    };
  
    $.ajax('/api/post', {
      type: 'POST',
      data: JSON.stringify(data),
      datatype: 'json',
      contentType: 'application/json'
    });
    
    this.setState({
      showCommentForm: false
    }, function(){
      scroll.scrollToBottom();
    });
  }
});

module.exports = PostForm;