var React = require('react');
var $ = require('jquery');
var Scroll = require('react-scroll');
var scroll = Scroll.animateScroll;

var PostForm = React.createClass({
  getInitialState: function() {
    return {
      showButtons: true,
      showReviseForm: false,
      showCommentForm: false,
      latestContent: ''
    };
  },

  render: function(){
    return (
      <div>
        {this.state.showButtons ? <div>
          <button autoFocus id="revise" onClick={this.showReviseForm}>Revise</button>
          <button id="comment" onClick={this.showCommentForm}>Comment</button>
          <button id="scrollup" onClick={this.scrollUp}>Read original</button>
        </div> : true }
        {this.state.showReviseForm ? <form onSubmit={this.addRevision}>
          <label>Make changes or leave as is if you wish to simply comment on it.</label>
          <br/>
          <textarea required ref="revisionContent" />
          <br/>
          <label>Share a comment about the writing above.</label>
          <br/>
          <input type="text" autoFocus required ref="revisionComment" />
          <br/>
          <input type="submit" value="Submit your ideas" />
          <button onClick={this.goBack}>Back</button>
        </form> : false }
        {this.state.showCommentForm ? <form onSubmit={this.addComment}>
          <label>Post a comment.</label>
          <br/>
          <input type="text" autoFocus required ref="commentOnly" />
          <br/>
          <input type="submit" value="Submit your ideas" />
          <button onClick={this.goBack}>Back</button>
        </form> : false }
      </div>
    );
  },
  
  showReviseForm: function(e){
    e.preventDefault();
    
    $.get('/api/posts/latest/' + this.props.accessCode, function(data){
      this.setState({
        showButtons: false,
        showReviseForm: true
      });
      this.refs.revisionContent.value = data.content;
    }.bind(this));
  },
  
  showCommentForm: function(e){
    e.preventDefault();
    
    $.get('/api/posts/latest/' + this.props.accessCode, function(data){
      this.setState({
        showButtons: false,
        showCommentForm: true,
        latestContent: data.content
      });
    }.bind(this));
    
  },
  
  scrollUp: function(){
    scroll.scrollToTop();
  },
  
  addRevision: function (e){
    e.preventDefault();
  
    var data = {
      accessCode: this.props.accessCode,
      username: this.props.username,
      content: this.refs.revisionContent.value,
      comment: this.refs.revisionComment.value
    };
  
    $.ajax('/api/post', {
      type: 'POST',
      data: JSON.stringify(data),
      datatype: 'json',
      contentType: 'application/json'
    })
    .done(function(data) {
      console.log('Successfully posted to database.');      
      console.log(data);
      scroll.scrollToBottom();
    })
    .fail(function() {
      console.log('Failed to post to database.');
    });
    
    this.setState({
      showButtons: true,
      showReviseForm: false,
      showCommentForm: false,
      latestContent: ''
    });
  },
  
  addComment: function (e){
    e.preventDefault();
  
    var data = {
      accessCode: this.props.accessCode,
      username: this.props.username,
      content: this.state.latestContent,
      comment: this.refs.commentOnly.value
    };
  
    $.ajax('/api/post', {
      type: 'POST',
      data: JSON.stringify(data),
      datatype: 'json',
      contentType: 'application/json'
    })
    .done(function(data) {
      console.log('Successfully posted to database.');      
      console.log(data);
      scroll.scrollToBottom();
    })
    .fail(function() {
      console.log('Failed to post to database.');
    });
    
    this.setState({
      showButtons: true,
      showReviseForm: false,
      showCommentForm: false,
      latestContent: ''
    });
    
  },
  
  goBack: function(e) {
    e.preventDefault();
    this.setState({
      showButtons: true,
      showReviseForm: false,
      showCommentForm: false,
      latestContent: ''
    });
  }
  
});

module.exports = PostForm;