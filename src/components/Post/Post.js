var React = require('react');
var moment = require('moment');
var diffString = require('./jsdiff');
var FA = require('react-fontawesome');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var Scroll = require('react-scroll');
var scroll = Scroll.animateScroll;
var $ = require('jquery');

import { Button, ButtonGroup, Panel, Label, ListGroup, ListGroupItem, FormGroup, InputGroup } from 'react-bootstrap';

var Post = React.createClass({
  getInitialState: function() {
    return {
      alertVisible: true,
      showChangesCommand: false,
      showChanges: true,
      showReviseForm: false,
      showCommentForm: false,
      showWriteButton: true
    };
  },
  
  render: function() {
    //Create post time stamp and bold if within the hour
    var now = moment();
    var postInsertedAt = this.props.post.insertedAt;
    if (moment(postInsertedAt).add(60, 'minutes').isBefore(now)) {
      var timeStamp = moment(this.props.post.insertedAt).fromNow();
    } else {
      timeStamp = '<b>' + moment(this.props.post.insertedAt).fromNow() + '</b>';
      if (timeStamp === '<b>in a few seconds</b>') {
        timeStamp === '<b>a few seconds ago</b>';
      }
    }
    
    //Post variables
    var username = this.props.post.username;
    var content = this.props.post.content;
    var contentInQuotes = '"' + content + '"';
    var prevContent = this.props.post.prevContent;
    var changes = '"' + diffString(prevContent, content).trim() + '"';
    var editedFrom = this.props.post.editedFrom;
    
    var commentsArray = this.props.post.comments;
    var commentsHTML = '';
    var stringifyComments = function(pClass, index, openBold, closeBold) {
      return commentsHTML += pClass + '<span class="displayed_username">' + commentsArray[index].username + '</span>: '+ commentsArray[index].comment + '<span class="comment_timestamp">'
      + openBold + moment(commentsArray[index].insertedAt).fromNow() + closeBold
      + '</span></p>';
    };
    
    //Generate HTML from comments array
    for (var i=0; i < commentsArray.length-1; i++) {
      if (moment(commentsArray[i].insertedAt).add(60, 'minutes').isBefore(now)) {
        stringifyComments('<p>', i, '', '');
      } else {
        stringifyComments('<p>', i, '<b class="newComment_time">', '</b>');
      }
    }
    
    //HTML for most recent or newly added comments
    if (this.props.post.updated) {
      //Add p class for css highlighting function
      stringifyComments('<p class="newComment">', commentsArray.length-1, '<b class="newComment_time">', '</b>');
    } else {
      if (moment(commentsArray[commentsArray.length-1].insertedAt).add(60, 'minutes').isBefore(now)) {
        stringifyComments('<p>', commentsArray.length-1, '', '');
      } else {
        stringifyComments('<p>', commentsArray.length-1, '<b class="newComment_time">', '</b>');
      }
    }
    
    //For original post
    if (this.props.version == 1) {
      var postTitle = (
        <div className="post_title">
          <Label bsStyle="info" className="title_header">VERSION {this.props.version}</Label>
          <div className="byline" dangerouslySetInnerHTML={{__html: 'Posted by <span class="displayed_username">' + username + '</span> ' + timeStamp}}></div>
        </div>
      );
      
      return (
        <li className="postitem">
          <Panel header={postTitle} bsStyle="info">
            <ListGroup fill>
              <ListGroupItem>
                <div className="writing" dangerouslySetInnerHTML={{__html: contentInQuotes}}></div>
              </ListGroupItem>
              <ListGroupItem>
                <div className="comments_header"><b><FA name='comments' className="gray_icon" /> Comments</b> -</div>
                <div className="comments" dangerouslySetInnerHTML={{__html: commentsHTML}}></div>
              </ListGroupItem>
            </ListGroup>
            <ButtonGroup justified>
              <ButtonGroup>
                <Button bsStyle="success" onClick={this.showCommentForm}><FA name="comment" /> Comment</Button>   
              </ButtonGroup>
              <ButtonGroup>
                <Button bsStyle="info" onClick={this.showReviseForm}><FA name="font" /> Revise</Button>
              </ButtonGroup>
            </ButtonGroup>
            <ReactCSSTransitionGroup transitionName="form-transition" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
              {this.state.showReviseForm ?
                <form onSubmit={this.addRevision}>
                  <br />
                  <textarea autoFocus spellCheck="true" required ref="revisionContent" /><br/>
                  <textarea spellCheck="true" required ref="revisionComment" placeholder="Explain your changes." /><br/>
                  <Button block bsStyle="info" type="submit">Post revision</Button>
                </form>
              : false}
              {this.state.showCommentForm ?
                <form onSubmit={this.addComment}>
                  <br />
                  <textarea autoFocus required ref="commentOnly" placeholder="Comment on the revision above." /><br/>
                  <Button block bsStyle="success" type="submit">Post comment</Button>
                </form>
              : false}
            </ReactCSSTransitionGroup>
          </Panel>
        </li>        
      );
    } else {
      if (content === 'general_comment') {
        //For discussion thread comments        
        postTitle = (
          <div className="post_title">
            <Label className="title_header">ANNOUNCE / DISCUSS</Label>
            <div className="byline" dangerouslySetInnerHTML={{__html: 'Posted ' + timeStamp}}></div>
          </div>          
        );
        return (
          <li className="postitem">
            <Panel header={postTitle} className="general_comment">
              <ListGroup fill>
                <ListGroupItem>
                  <div className="comments" dangerouslySetInnerHTML={{__html: commentsHTML}}></div>
                </ListGroupItem>
              </ListGroup>
                <form onSubmit={this.addComment}>
                  <FormGroup className="button_combined">
                    <InputGroup>
                      <input className="button_combined" type="text" required ref="commentOnly" placeholder="Comment on this thread." />
                      <InputGroup.Button>
                        <Button type="submit"><FA name="comment" /></Button>
                      </InputGroup.Button>
                    </InputGroup>
                  </FormGroup>  
                </form>
            </Panel>
          </li> 
        );  
      } else if (content === '') {
        //For initial post without content
        postTitle = (
          <div className="post_title">
            <Label bsStyle="warning" className="title_header">CONTEXT</Label>
            <div className="byline" dangerouslySetInnerHTML={{__html: 'Posted by <span class="displayed_username">' + username + '</span> ' + timeStamp}}></div>
          </div>
        );
      
        return (
          <li className="postitem">
            <Panel header={postTitle} bsStyle="warning">
              <ListGroup fill>
                <ListGroupItem>
                  <div className="comments" dangerouslySetInnerHTML={{__html: commentsHTML}}></div>
                </ListGroupItem>
              </ListGroup>
              <ButtonGroup justified>
                <ButtonGroup>
                  <Button bsStyle="success" onClick={this.showCommentForm}><FA name="comment" /> Comment</Button>   
                </ButtonGroup>
                {this.state.showWriteButton ?
                  <ButtonGroup>
                    <Button bsStyle="info" onClick={this.showReviseForm}><FA name="font" /> Write</Button>
                  </ButtonGroup>
                : null}
              </ButtonGroup>
              <ReactCSSTransitionGroup transitionName="form-transition" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
                {this.state.showReviseForm ?
                  <form onSubmit={this.addRevision}>
                    <br />
                    <textarea autoFocus spellCheck="true" required ref="revisionContent" placeholder="Suggest an initial version of writing for the project."/><br/>
                    <textarea spellCheck="true" required ref="revisionComment" placeholder="Explain your writing." /><br/>
                    <Button block type="submit" bsStyle="info">Post writing</Button>
                  </form>
                : false}
                {this.state.showCommentForm ?
                  <form onSubmit={this.addComment}>
                    <br />
                    <textarea autoFocus required ref="commentOnly" placeholder="Comment on the context or discussion above." /><br/>
                    <Button block type="submit" bsStyle="success">Post comment</Button>
                  </form>
                : false}
              </ReactCSSTransitionGroup>
            </Panel>
          </li>                
        );
      } else {
        //For revisions
        postTitle = (
          <div className="post_title">
            <Label bsStyle="success" className="title_header">VERSION {this.props.version}</Label>
            <div className="byline" dangerouslySetInnerHTML={{__html: 'Revised from <b>Version ' + editedFrom + '</b> by <span class="displayed_username">' + username + '</span>' + ' ' + timeStamp}}></div>
          </div>
        );        
        
        return (
          <li className="postitem">
            <Panel header={postTitle} bsStyle="success">
              <ListGroup fill>
                <ListGroupItem>
                  {this.state.showChangesCommand ?
                    <div>
                      <div className="changes_command" onClick={this.showChanges}>+ Show changes made from <Label bsStyle="default" className="change_version">VERSION {editedFrom}</Label></div>                      
                      <div className="writing" dangerouslySetInnerHTML={{__html: contentInQuotes}}></div>
                    </div>
                  : false}
                  {this.state.showChanges ?
                    <div>
                      <div className="changes_command" onClick={this.hideChanges}>- Hide changes from <Label bsStyle="default" className="change_version">VERSION {editedFrom}</Label></div>
                      <div className="writing" dangerouslySetInnerHTML={{__html: changes}}></div>
                    </div>
                  : true}
                </ListGroupItem>
                <ListGroupItem>
                  <div className="comments_header"><b><FA name='comments' className="gray_icon" /> Comments</b> -</div>
                  <div className="comments" dangerouslySetInnerHTML={{__html: commentsHTML}}></div>
                </ListGroupItem>
              </ListGroup>
              <ButtonGroup justified>
                <ButtonGroup>
                  <Button bsStyle="success" onClick={this.showCommentForm}><FA name="comment" /> Comment</Button>   
                </ButtonGroup>
                <ButtonGroup>
                  <Button bsStyle="info" onClick={this.showReviseForm}><FA name="font" /> Revise</Button>
                </ButtonGroup>
              </ButtonGroup>
              <ReactCSSTransitionGroup transitionName="form-transition" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
                {this.state.showReviseForm ?
                  <form onSubmit={this.addRevision}>
                    <br />
                    <textarea autoFocus spellCheck="true" required ref="revisionContent" /><br/>
                    <textarea spellCheck="true" required ref="revisionComment" placeholder="Explain your changes." /><br/>
                    <Button block type="submit" bsStyle="info">Post revision</Button>
                  </form>
                : false}
                {this.state.showCommentForm ?
                  <form onSubmit={this.addComment}>
                    <br />
                    <textarea autoFocus required ref="commentOnly" placeholder="Comment on the revision above." /><br/>
                    <Button block type="submit" bsStyle="success">Post comment</Button>
                  </form>
                : false}
              </ReactCSSTransitionGroup>
            </Panel>
          </li>              
        );
      }
    }
  },
  
  showChanges: function() {
    this.setState({
      showChangesCommand: false,
      showChanges: true
    });
  },
  
  hideChanges: function() {
    this.setState({
      showChangesCommand: true,
      showChanges: false
    });    
  },
  
  showReviseForm: function(){
    
    if (this.state.showReviseForm == false) {
      this.setState({
        showReviseForm: true,
        showCommentForm: false
      }, function(){
        this.refs.revisionContent.value = this.props.post.content;
      });
    } else {
      if (this.refs.revisionContent.value !== this.props.post.content) {
        if (confirm("You haven't posted your revision yet.\nDo you still want to close this form?")) {
          this.setState({
            showReviseForm: false
          });          
        }
      } else {
        this.setState({
          showReviseForm: false
        });
      }
    }    
    
  },
  
  showCommentForm: function(){
    if (this.state.showCommentForm == false) {
      this.setState({
        showCommentForm: true,
        showReviseForm: false
      });
    } else {
      if (this.refs.commentOnly.value !== '') {
        if (confirm("You haven't posted your comment yet.\nDo you still want to close this form?")) {
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
  
  addRevision: function (e){
    e.preventDefault();
  
    var data = {
      accessCode: this.props.post.accessCode,
      username: this.props.yourUsername,
      content: this.refs.revisionContent.value.replace(/\n\r?/g, '<br />'),
      prevContent: this.props.post.content,
      editedFrom: this.props.version,
      comment: this.refs.revisionComment.value.replace(/\n\r?/g, '<br />')
    };
  
    $.ajax('/api/post', {
      type: 'POST',
      data: JSON.stringify(data),
      datatype: 'json',
      contentType: 'application/json'
    })
    .done(function() {
      scroll.scrollToBottom();
    });
    
    this.setState({
      showReviseForm: false,
      showCommentForm: false
    });
  },
  
  addComment: function (e){
    e.preventDefault();
    
    var _id = this.props.post._id;
    var data = {
      username: this.props.yourUsername,
      comment: this.refs.commentOnly.value
    };  
  
    $.ajax('/api/post/' + _id + '/comment', {
      type: 'POST',
      data: JSON.stringify(data),
      datatype: 'json',
      contentType: 'application/json'
    });
    
    this.setState({
      showReviseForm: false,
      showCommentForm: false,
    });
  },
  
  goBack: function(e) {
    e.preventDefault();
    this.setState({
      showReviseForm: false,
      showCommentForm: false
    });
  }
});

if ($(window).width() > 767) {
  //Enlarge text when clicked
  $('body').on('click', '.writing, p', function() {
    $(this).toggleClass('large_text');
  });
}

module.exports = Post;