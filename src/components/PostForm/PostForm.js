var React = require('react');
var $ = require('jquery');
var Scroll = require('react-scroll');
var scroll = Scroll.animateScroll;

var PostForm = React.createClass({
  getInitialState: function() {
    return {
      showButtons: true,
      showCommentForm: false
    };
  },

  render: function(){
    return (
      <div>
        {this.state.showButtons ?
          <div>
            <button onClick={this.showCommentForm}>Post a general comment in the project room</button>
            <button onClick={this.scrollUp}>Scroll to the original post</button>
            <br /><br />
          </div>
        : true}
        
        {this.state.showCommentForm ?
          <form onSubmit={this.addComment}>
            <label>Post a comment.</label><br/>
            <input type="text" autoFocus required ref="comment" /><br/>
            <input type="submit" value="Post your announcement" />
            <button onClick={this.goBack}>Back</button>
            <br /><br />
          </form>
        : false}
      </div>
    );
  },
  
  showCommentForm: function(){
    this.setState({
      showButtons: false,
      showCommentForm: true,
    });
  },
  
  scrollUp: function(){
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