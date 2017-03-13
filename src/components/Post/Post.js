import React from 'react';
import moment from 'moment';
import diffString from './jsdiff';
import { Label, Panel, ListGroup, ListGroupItem, ButtonGroup, Button, FormGroup, InputGroup } from 'react-bootstrap';
import ConfirmMessage from '../ConfirmMessage/ConfirmMessage'
import FA from 'react-fontawesome';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import $ from 'jquery';
import Scroll from 'react-scroll';

const scroll = Scroll.animateScroll;

class Post extends React.Component {
  constructor() {
    super();
    
    this.state = {
      alertVisible: true,
      showChangesCommand: false,
      showChanges: true,
      showReviseForm: false,
      showCommentForm: false,
      showWriteButton: true,
      showModal: false
    };
    
    this.showChanges = this.showChanges.bind(this);
    this.hideChanges = this.hideChanges.bind(this);
    this.showReviseForm = this.showReviseForm.bind(this);
    this.showCommentForm = this.showCommentForm.bind(this);
    this.addRevision = this.addRevision.bind(this);
    this.addComment = this.addComment.bind(this);
    this.goBack = this.goBack.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.closeConfirm = this.closeConfirm.bind(this);
  }
  
  render() {
    //Time variables
    const now = moment();
    const postInsertedAt = moment(this.props.post.insertedAt);
    let timeStamp = '';
    
    //Create post time stamp and bold if within the hour
    if (postInsertedAt.add(60, 'minutes').isBefore(now)) {
      timeStamp = postInsertedAt.fromNow();
    } else {
      timeStamp = '<b>' + postInsertedAt.fromNow() + '</b>';
      if (timeStamp === '<b>in a few seconds</b>') {
        timeStamp === '<b>a few seconds ago</b>';
      }
    }
    
    //Post variables
    const username = this.props.post.username;
    const content = this.props.post.content;
    const contentInQuotes = '"' + content + '"';
    const prevContent = this.props.post.prevContent;
    const changes = '"' + diffString(prevContent, content).trim() + '"';
    const editedFrom = this.props.post.editedFrom;
    const version = this.props.version;
    
    //Comment-specific variables
    const commentsArray = this.props.post.comments;
    let commentsHTML = '';
    const stringifyComments = function(pClass, index, openBold, closeBold) {
      return commentsHTML += pClass + '<span class="displayed_username">' + commentsArray[index].username
      + '</span>: '+ commentsArray[index].comment + '<span class="comment_timestamp">'
      + openBold + moment(commentsArray[index].insertedAt).fromNow() + closeBold
      + '</span></p>';
    };
    
    //Generate HTML from comments array
    for (let i = 0; i < commentsArray.length-1; i++) {
      if (moment(commentsArray[i].insertedAt).add(60, 'minutes').isBefore(now)) {
        stringifyComments('<p>', i, '', '');
      } else {
        stringifyComments('<p>', i, '<b class="newComment_time">', '</b>');
      }
    }
    
    //Generate HTML for most recent or newly added comments
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
    
    //Post componenet elements
    let postTitle = null;
    
    //Generate post title
    function setPostTitle(bsStyle, labelText, postInfo) {
      return (
        <div className="post_title">
          <Label bsStyle={bsStyle} className="title_header">{labelText}</Label>
          <div className="byline" dangerouslySetInnerHTML={{__html: postInfo}}></div>
        </div>
      );
    }

    //Generate post type
    const renderPostType = function(bsStyle, changesCommand, commentsHeader, postFunctions) {
      return (
        <li className="postitem">
          <Panel header={postTitle} bsStyle={bsStyle}>
            <ListGroup fill>
              {changesCommand}
              <ListGroupItem>
                {commentsHeader}
                <div className="comments" dangerouslySetInnerHTML={{__html: commentsHTML}}></div>
              </ListGroupItem>
            </ListGroup>
            {postFunctions}
          </Panel>
          <ConfirmMessage showModal={this.state.showModal} closeConfirm={this.closeConfirm} closeForm={this.closeForm} />
        </li>
      );
    }.bind(this);

    //Content element
    const postContent = (
      <ListGroupItem>
        <div className="writing" dangerouslySetInnerHTML={{__html: contentInQuotes}}></div>
      </ListGroupItem>      
    );
    
    //Elements for showing/hiding changes from previous version    
    const changesFromPrev = (
      <ListGroupItem>
        {this.state.showChangesCommand ?
          <div>
            <a href="#" onClick={this.showChanges}>
              <div className="changes_command">
                + Show changes made from <Label bsStyle="default" className="change_version">VERSION {editedFrom}</Label>
              </div>
            </a>
            <div className="writing" dangerouslySetInnerHTML={{__html: contentInQuotes}}></div>
          </div>
        : false}
        {this.state.showChanges ?
          <div>
            <a href="#" onClick={this.hideChanges}>
              <div className="changes_command" onClick={this.hideChanges}>
                - Hide changes from <Label bsStyle="default" className="change_version">VERSION {editedFrom}</Label>
              </div>
            </a>
            <div className="writing" dangerouslySetInnerHTML={{__html: changes}}></div>
          </div>
        : true}
      </ListGroupItem>
    );
    
    //Header to separate comments from content
    const commentsHeaderHTML = (<div className="comments_header"><b><FA name='comments' className="gray_icon" /> Comments</b> -</div>);
    
    //Elements for comment and post functions
    const commentAndPost = (
      <div>
        <ButtonGroup justified>
          <ButtonGroup>
            <Button bsStyle="success" onClick={this.showCommentForm}><FA name="comment" /> Comment</Button>   
          </ButtonGroup>
          <ButtonGroup>
            <Button bsStyle="info" onClick={this.showReviseForm}><FA name="font" /> Write</Button>
          </ButtonGroup>
        </ButtonGroup>
        <ReactCSSTransitionGroup transitionName="form-transition" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
          {this.state.showReviseForm ?
            <form onSubmit={this.addRevision}>
              <br />
              <textarea autoFocus spellCheck="true" required ref="revisionContent" placeholder="Suggest your version for the project writing." /><br/>
              <textarea spellCheck="true" required ref="revisionComment" placeholder="Comment on your writing above." /><br/>
              <Button block type="submit" bsStyle="info">Post your writing</Button>
            </form>
          : false}
          {this.state.showCommentForm ?
            <form onSubmit={this.addComment}>
              <br />
              <textarea autoFocus required ref="commentOnly" placeholder="Comment on the post above." /><br/>
              <Button block type="submit" bsStyle="success">Post comment</Button>
            </form>
          : false}
        </ReactCSSTransitionGroup>
      </div>
    );
    
    //Elements for comment only function for discussion thread
    const onlyComment = (
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
    );    
    
    //Render different post types
    if (content === '') {
      //Context post
      postTitle = setPostTitle("warning", "CONTEXT", 'Provided by <span class="displayed_username">' + username + '</span> ' + timeStamp);
      return renderPostType("warning", '', '', commentAndPost);
    } else if (version === 1 || editedFrom === 0 && content !== '' && content !== 'general_comment') {
      //Originals
      postTitle = setPostTitle("info", "VERSION " + version + " - ORIGINAL", 'Suggested by <span class="displayed_username">' + username + '</span> ' + timeStamp);
      return renderPostType("info", postContent, commentsHeaderHTML, commentAndPost);
    } else if (editedFrom !== 0 ) {
      //Revisions
      postTitle = setPostTitle("success", "VERSION " + version + " - REVISION", 'Revised from <b>Version ' + editedFrom + '</b> by <span class="displayed_username">' + username + '</span>' + ' ' + timeStamp);
      return renderPostType("success", changesFromPrev, commentsHeaderHTML, commentAndPost);
    } else if (content === "general_comment") {
      //Discussion threads
      postTitle = setPostTitle("default", "ANNOUNCEMENT / DISCUSSION", 'Initiated by <span class="displayed_username">' + username + '</span> ' + timeStamp);
      return renderPostType("default", '', '', onlyComment);
    }
  }
  
  showChanges(e) {
    e.preventDefault();
    
    this.setState({
      showChangesCommand: false,
      showChanges: true
    });
  }
  
  hideChanges(e) {
    e.preventDefault();
    
    this.setState({
      showChangesCommand: true,
      showChanges: false
    });    
  }
  
  showReviseForm(){
    if (this.state.showReviseForm == false) {
      this.setState({
        showReviseForm: true,
        showCommentForm: false
      }, function(){
        this.refs.revisionContent.value = this.props.post.content;
      });
    } else {
      if (this.refs.revisionContent.value !== this.props.post.content) {
        this.setState({ showModal: true });
      } else {
        this.setState({
          showReviseForm: false
        });
      }
    }
  }
  
  showCommentForm() {
    if (this.state.showCommentForm == false) {
      this.setState({
        showCommentForm: true,
        showReviseForm: false
      });
    } else {
      if (this.refs.commentOnly.value !== '') {
        this.setState({ showModal: true });
      } else {
        this.setState({
          showCommentForm: false
        });
      }
    }    
  }
  
  addRevision(e) {
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
  }
  
  addComment(e) {
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
  }
  
  goBack(e) {
    e.preventDefault();
    
    this.setState({
      showReviseForm: false,
      showCommentForm: false
    });
  }
  
  closeForm() {
    this.setState({
      showReviseForm: false,
      showCommentForm: false,
      showModal: false
    });  
  }

  closeConfirm() {
    this.setState({ showModal: false });
  }
}

if ($(window).width() > 767) {
  //Enlarge post or comment text when clicked
  $('body').on('click', '.writing, p', function() {
    $(this).toggleClass('large_text');
  });
}

export default Post;