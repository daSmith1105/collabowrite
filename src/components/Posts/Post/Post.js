var React = require('react');
var moment = require('moment');
var Scroll = require('react-scroll');
var scroll = Scroll.animateScroll;
var diffString = require('./jsdiff');

var Post = React.createClass({
  getInitialState: function() {
    return {
      showCommand: true,
      showDiff: false  
    };
  },
  
  render: function() {
    var username = this.props.post.username;
    var date = moment(this.props.post.insertedAt).fromNow();
    var content = this.props.post.content;
    var prevContent = this.props.post.prevContent;
    var diff = diffString(prevContent, content);
    var comment = this.props.post.comment;  
    
    //For original post
    if (this.props.id == 0) {
      return (
        <li className={'evt'}>
          <button onClick={this.scrollDown}>Latest discussion</button>
          <br /><br />
          <div className={'evt-name'}>{username} originally wrote,</div>
          <div className={'evt-name'}>{content}</div>
          <div className={'evt-name'}>Note - {comment}</div>
          <div className={'evt-name'}>Posted {date}</div>
        </li>        
      );
    } else {
      //For revisions
      if (content !== prevContent) {
        return (
          <li className={'evt'}>
            <div className={'evt-name'}>{username} proposes,</div>
            {this.state.showCommand ?
              <div>
                <div className={'evt-name'}>{content}</div>
                <div className={'evt-name'} onClick={this.showDiff}>+ Show changes from previous version</div>
              </div>
            : true}
            {this.state.showDiff ?
              <div>
                <div className={'evt-name'} dangerouslySetInnerHTML={{__html: diff}}></div>
                <div className={'evt-name'} onClick={this.hideDiff}>- Hide changes from previous version</div>
              </div>
            : false}
            <div className={'evt-name'}>Note - {comment}</div>
            <div className={'evt-name'}>Posted {date}</div>
          </li>
        );
      } else {
        //For comments
        return (
          <li className={'evt'}>
            <div className={'evt-name'}>{username} commented:</div>
            <div className={'evt-name'}>{comment}</div>
            <div className={'evt-name'}>Posted {date}</div>
          </li>
        );        
      }
    }
  },
  
  scrollDown: function() {
    scroll.scrollToBottom();
  },
  
  showDiff: function() {
    this.setState({
      showCommand: false,
      showDiff: true
    });
  },
  
  hideDiff: function() {
    this.setState({
      showCommand: true,
      showDiff: false
    });    
  }
});

module.exports = Post;