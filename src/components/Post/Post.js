var React = require('react');
var moment = require('moment');
var diffString = require('./jsdiff');
var FA = require('react-fontawesome');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var Scroll = require('react-scroll');
var scroll = Scroll.animateScroll;
var $ = require('jquery');

import { Alert, Button, ButtonGroup, Panel, Label, ListGroup, ListGroupItem, FormGroup, FormControl, InputGroup } from 'react-bootstrap';

var Post = React.createClass({
  getInitialState: function() {
    return {
      alertVisible: true,
      showChangesCommand: false,
      showChanges: true,
      showReviseForm: false,
      showCommentForm: false
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
          <Button bsStyle="success" bsSize="large" block onClick={this.scrollDown}><FA name="angle-down" /> Scroll down to latest post</Button><br />
          <ReactCSSTransitionGroup transitionName="evt-transition" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
            {this.state.alertVisible ?
              <Alert bsStyle="warning" onDismiss={this.handleAlertDismiss}>
                <b><FA name="lightbulb-o" /> Tip: During presentations, you can click on a post or comment to enlarge its text size!</b>
              </Alert>
            : true}
          </ReactCSSTransitionGroup>
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
                <Button bsStyle="warning" onClick={this.showCommentForm}><FA name="comment" /> Comment</Button>   
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
                  <input type="text" data-emojiable="true" required ref="revisionComment" placeholder="Explain or comment on your changes." /><br/>
                  <ButtonGroup justified>
                    <ButtonGroup>
                      <Button bsStyle="success" type="submit"><FA name="upload" /> Post revision</Button>
                    </ButtonGroup>
                    <ButtonGroup>
                      <Button bsStyle="danger" onClick={this.goBack}><FA name="times-circle" /> Close</Button>
                    </ButtonGroup>
                  </ButtonGroup>
                </form>
              : false}
              {this.state.showCommentForm ?
                <form onSubmit={this.addComment}>
                  <br />
                  <input type="text" data-emojiable="true" autoFocus required ref="commentOnly" placeholder="Comment on the revision above." /><br/>
                  <ButtonGroup justified>
                    <ButtonGroup>
                      <Button bsStyle="success" type="submit"><FA name="upload" /> Post comment</Button>
                    </ButtonGroup>
                    <ButtonGroup>
                      <Button bsStyle="danger" onClick={this.goBack}><FA name="times-circle" /> Close</Button>
                    </ButtonGroup>
                  </ButtonGroup>
                </form>
              : false}
            </ReactCSSTransitionGroup>
          </Panel>
        </li>        
      );
    } else {
      if (content === 'general_comment') {
        postTitle = (
          <div className="post_title">
            <Label className="title_header">ANNOUNCE / DISCUSS</Label>
            <div className="byline" dangerouslySetInnerHTML={{__html: 'Posted ' + timeStamp}}></div>
          </div>          
        );
        //For general comments
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
                      <input className="button_combined" type="text" data-emojiable="true" required ref="commentOnly" placeholder="Comment on the discussion above." />
                      <InputGroup.Button>
                        <Button type="submit"><FA name="comment" /></Button>
                      </InputGroup.Button>
                    </InputGroup>
                  </FormGroup>  
                </form>
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
                  <Button bsStyle="warning" onClick={this.showCommentForm}><FA name="comment" /> Comment</Button>   
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
                    <input type="text" data-emojiable="true" required ref="revisionComment" placeholder="Explain or comment on your changes." /><br/>
                    <ButtonGroup justified>
                      <ButtonGroup>
                        <Button bsStyle="success" type="submit"><FA name="upload" /> Post revision</Button>
                      </ButtonGroup>
                      <ButtonGroup>
                        <Button bsStyle="danger" onClick={this.goBack}><FA name="times-circle" /> Close</Button>
                      </ButtonGroup>
                    </ButtonGroup>
                  </form>
                : false}
                {this.state.showCommentForm ?
                  <form onSubmit={this.addComment}>
                    <br />
                    <input type="text" data-emojiable="true" autoFocus required ref="commentOnly" placeholder="Comment on the revision above." /><br/>
                    <ButtonGroup justified>
                      <ButtonGroup>
                        <Button bsStyle="success" type="submit"><FA name="upload" /> Post comment</Button>
                      </ButtonGroup>
                      <ButtonGroup>
                        <Button bsStyle="danger" onClick={this.goBack}><FA name="times-circle" /> Close</Button>
                      </ButtonGroup>
                    </ButtonGroup>
                  </form>
                : false}
              </ReactCSSTransitionGroup>
            </Panel>
          </li>              
        );
      }
    }
  },
  
  scrollDown: function() {
    scroll.scrollToBottom();
  },
  
  handleAlertDismiss: function() {
    this.setState({alertVisible: false});
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
    this.setState({
      showReviseForm: true,
      showCommentForm: false
    }, function(){
      this.refs.revisionContent.value = this.props.post.content;
    });
  },
  
  showCommentForm: function(){
    this.setState({
      showCommentForm: true,
      showReviseForm: false
    });
  },
  
  addRevision: function (e){
    e.preventDefault();
  
    var data = {
      accessCode: this.props.post.accessCode,
      username: this.props.yourUsername,
      content: this.refs.revisionContent.value.replace(/\n\r?/g, '<br />'),
      prevContent: this.props.post.content,
      editedFrom: this.props.version,
      comment: this.refs.revisionComment.value
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
    })
    .done(function() {
      this.refs.commentOnly.value = '';   
    }.bind(this));
    
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

//Enlarge text when clicked
$('body').on('click', '.writing, p', function() {
  $(this).toggleClass('large_text');
});

module.exports = Post;