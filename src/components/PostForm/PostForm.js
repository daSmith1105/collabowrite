var React = require('react');
var FA = require('react-fontawesome');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var Scroll = require('react-scroll');
var scroll = Scroll.animateScroll;
var $ = require('jquery');

import { Panel, Button, ButtonGroup } from 'react-bootstrap';

var PostForm = React.createClass({
  getInitialState: function() {
    return {
      showButtons: true,
      showCommentForm: false
    };
  },

  render: function(){
    return (
      <Panel>
        {this.state.showButtons ?
          <ButtonGroup justified bsSize="large">
            <ButtonGroup>
              <Button bsStyle="primary" onClick={this.showCommentForm}><FA name="bullhorn" /> Announce / Discuss</Button>   
            </ButtonGroup>
            <ButtonGroup>
              <Button bsStyle="danger" onClick={this.scrollUp}><FA name="angle-up" /> Scroll to top</Button>
            </ButtonGroup>
          </ButtonGroup>
        : true}
        {this.state.showCommentForm ?
          <form onSubmit={this.addComment}>
            <textarea className="general_comment_textarea" autoFocus spellCheck="true" required ref="comment" placeholder="Make a group announcement or start a discussion about the project." /><br />
            <ButtonGroup justified>
              <ButtonGroup>
                <Button bsStyle="success" type="submit"><FA name="upload" /> Post thread</Button>
              </ButtonGroup>
              <ButtonGroup>
                <Button bsStyle="danger" onClick={this.goBack}><FA name="times-circle" /> Close</Button>
              </ButtonGroup>
            </ButtonGroup>
          </form>
        : false}
      </Panel>
    );
  },
  
  showCommentForm: function(){
    this.setState({
      showButtons: false,
      showCommentForm: true,
    }, function (){
      scroll.scrollToBottom();      
    });
  },
  
  scrollUp: function (){
    scroll.scrollToTop();
  },
  
  addComment: function (e){
    e.preventDefault();
  
    var data = {
      accessCode: this.props.accessCode,
      username: this.props.username,
      content: 'general_comment',
      prevContent: 'general_comment',
      editedFrom: 0,
      comment: this.refs.comment.value
    };
  
    $.ajax('/api/post', {
      type: 'POST',
      data: JSON.stringify(data),
      datatype: 'json',
      contentType: 'application/json'
    });
    
    this.setState({
      showButtons: true,
      showCommentForm: false
    }, function(){
      scroll.scrollToBottom();
    });
  },
  
  goBack: function() {
    this.setState({
      showButtons: true,
      showCommentForm: false
    });
  }
  
});

module.exports = PostForm;