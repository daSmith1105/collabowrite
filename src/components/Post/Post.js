var React = require('react');
var moment = require('moment');
var diffString = require('./jsdiff');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var Scroll = require('react-scroll');
var scroll = Scroll.animateScroll;
var Element = Scroll.Element;
var scroller = Scroll.scroller;
var $ = require('jquery');

import { Label } from 'react-bootstrap';

var Post = React.createClass({
  getInitialState: function() {
    return {
      showChangesCommand: true,
      showReviseForm: false,
      showCommentForm: false
    };
  },
  
  render: function() {
    //Create post time stamp and bold if within the hour
    var now = moment();
    var postInsertedAt = this.props.post.insertedAt;
    if (moment(postInsertedAt).add(60, 'minutes').isBefore(now)) {
      var timeStamp = moment(this.props.post.insertedAt).fromNow() + ':';
    } else {
      timeStamp = '<b>' + moment(this.props.post.insertedAt).fromNow() + '</b>:';
      if (timeStamp === '<b>in a few seconds</b>:') {
        timeStamp === '<b>a few seconds ago</b>:';
      }
    }
    
    //Post variables
    var username = this.props.post.username;
    var content = this.props.post.content;
    var prevContent = this.props.post.prevContent;
    var changes = '"' + diffString(prevContent, content).trim() + '"';
    var editedFrom = this.props.post.editedFrom;
    
    var commentsArray = this.props.post.comments;
    var commentsHTML = '';
    var stringifyComments = function(pClass, index, openBold, closeBold) {
      return commentsHTML += pClass + '<span class="displayed_username">' + commentsArray[index].username + '</span>'+ ' commented '
      + openBold + moment(commentsArray[index].insertedAt).fromNow() + closeBold + ': <br />'
      + commentsArray[index].comment + '</p>';
    };
    
    //Generate HTML from comments array
    for (var i=0; i < commentsArray.length-1; i++) {
      if (moment(commentsArray[i].insertedAt).add(60, 'minutes').isBefore(now)) {
        stringifyComments('<p>', i, '', '');
      } else {
        stringifyComments('<p>', i, '<b>', '</b>');
      }
    }
    
    //HTML for most recent or newly added comments
    if (this.props.post.updated) {
      //Add p class for css highlighting function
      stringifyComments('<p class="newComment">', commentsArray.length-1, '<b>', '</b>');
    } else {
      if (moment(commentsArray[commentsArray.length-1].insertedAt).add(60, 'minutes').isBefore(now)) {
        stringifyComments('<p>', commentsArray.length-1, '', '');
      } else {
        stringifyComments('<p>', commentsArray.length-1, '<b>', '</b>');
      }
    }
    
    //For original post
    if (this.props.version == 1) {
      return (
        <li className="postitem">
          <button onClick={this.scrollDown}>Scroll down to latest post</button>
          <br /><br />
          <Element name={"top" + this.props.version.toString()}></Element>
          <Label>VER. {this.props.version}</Label>
          <div className="byline" dangerouslySetInnerHTML={{__html: '<span class="displayed_username">' + username + '</span> posted ' + timeStamp}}></div>
          <div className={'evt-name'}>"{content}"</div>
          <div className="evt-name comment" dangerouslySetInnerHTML={{__html: commentsHTML}}></div>
          <div>
            <button onClick={this.showReviseForm}>Revise this version</button>
            <button onClick={this.showCommentForm}>Comment on this version</button>
          </div>
          <Element name={"bottom" + this.props.version.toString()}></Element>  
          <ReactCSSTransitionGroup transitionName="form-transition" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
            {this.state.showReviseForm ?
              <form onSubmit={this.addRevision}>
                <label>Make changes or leave as is if you wish to simply comment on it.</label><br/>
                <textarea required ref="revisionContent" /><br/>
                <label>Share a comment about the writing above.</label><br/>
                <input type="text" autoFocus required ref="revisionComment" /><br/>
                <input type="submit" value="Submit your ideas" />
                <button onClick={this.goBack}>Close</button>
                <br /><br />
              </form>
            : false}
            {this.state.showCommentForm ?
              <form onSubmit={this.addComment}>
                <label>Post a comment.</label><br/>
                <input type="text" autoFocus required ref="commentOnly" /><br/>
                <input type="submit" value="Submit your ideas" />
                <button onClick={this.goBack}>Close</button>
                <br /><br />
              </form>
            : false}
          </ReactCSSTransitionGroup>
        </li>        
      );
    } else {
      if (content === 'general_comment') {
        //For comments
        return (
          <li className={'evt'}>
            <Element name={"top" + this.props.version.toString()}></Element>  
            <div className="evt-name" dangerouslySetInnerHTML={{__html: 'A discussion was ' + timeStamp}}></div>
            <div className="evt-name comment" dangerouslySetInnerHTML={{__html: commentsHTML}}></div>
            <button onClick={this.showCommentForm}>Comment</button>
            <Element name={"bottom" + this.props.version.toString()}></Element>   
            {this.state.showCommentForm ?
              <form onSubmit={this.addComment}>
                <label>Post a comment.</label><br/>
                <input type="text" autoFocus required ref="commentOnly" /><br/>
                <input type="submit" value="Submit your ideas" />
                <button onClick={this.goBack}>Close</button>
                <br /><br />
              </form>
            : false}
          </li>
        );  
      } else {
        //For revisions
        return (
          <li className={'evt'}>
            <Element name={"top" + this.props.version.toString()}></Element>           
            <div className={'evt-name'}>Version {this.props.version}:</div>
            <div className="evt-name" dangerouslySetInnerHTML={{__html: 'A revision of ver. ' + editedFrom + ' was' + timeStamp + ' by ' + username}}></div>
            {this.state.showChangesCommand ?
              <div>
                <div className={'evt-name'}>"{content}"</div>
                <div className={'evt-name'} onClick={this.showChanges}>+ Show changes from ver. {editedFrom}</div>
              </div>
            : true}
            {this.state.showChanges ?
              <div>
                <div className={'evt-name'} dangerouslySetInnerHTML={{__html: changes}}></div>
                <div className={'evt-name'} onClick={this.hideChanges}>- Hide changes from ver. {editedFrom}</div>
              </div>
            : false}
            <div className="evt-name comment" dangerouslySetInnerHTML={{__html: commentsHTML}}></div>
            <div>
              <button onClick={this.showReviseForm}>Revise this version</button>
              <button onClick={this.showCommentForm}>Comment on this version</button>
            </div>
            <Element name={"bottom" + this.props.version.toString()}></Element>                
            <ReactCSSTransitionGroup transitionName="form-transition" transitionEnterTimeout={500} transitionLeaveTimeout={300}>              
              {this.state.showReviseForm ?
                <form onSubmit={this.addRevision}>
                  <label>Make changes or leave as is if you wish to simply comment on it.</label><br/>
                  <textarea required ref="revisionContent" /><br/>
                  <label>Share a comment about the writing above.</label><br/>
                  <input type="text" autoFocus required ref="revisionComment" /><br/>
                  <input type="submit" value="Submit your ideas" />
                  <button onClick={this.goBack}>Close</button>
                  <br /><br />
                </form>
              : false}
              {this.state.showCommentForm ?
                <form onSubmit={this.addComment}>
                  <label>Post a comment.</label><br/>
                  <input type="text" autoFocus required ref="commentOnly" /><br/>
                  <input type="submit" value="Submit your ideas" />
                  <button onClick={this.goBack}>Close</button>
                  <br /><br />
                </form>
              : false}
            </ReactCSSTransitionGroup>
          </li>
        );
      }
    }
  },
  
  scrollDown: function() {
    scroll.scrollToBottom();
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
      scroller.scrollTo("bottom" + this.props.version.toString(), {
        duration: 1000,
        delay: 100,
        offset: -150,
        smooth: true,
      });
    });
  },
  
  showCommentForm: function(){
    this.setState({
      showCommentForm: true,
      showReviseForm: false
    }, function(){
      scroller.scrollTo("bottom" + this.props.version.toString(), {
        duration: 1000,
        delay: 100,
        offset: -150,
        smooth: true,
      });
    });
  },
  
  addRevision: function (e){
    e.preventDefault();
  
    var data = {
      accessCode: this.props.post.accessCode,
      username: this.props.yourUsername,
      content: this.refs.revisionContent.value,
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
      console.log('Successfully posted.');      
      scroll.scrollToBottom();
    })
    .fail(function() {
      console.log('Failed to post.');
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
      console.log('Successfully posted.');      
    })
    .fail(function() {
      console.log('Failed to post.');
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
    }, function(){
      scroller.scrollTo("top" + this.props.version.toString(), {
        duration: 1000,
        delay: 100,
        smooth: true,
      });
    });
  }
});

module.exports = Post;