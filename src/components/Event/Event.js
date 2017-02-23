var React = require('react');
var moment = require('moment');
var diffString = require('./jsdiff');
var Scroll = require('react-scroll');
var scroll = Scroll.animateScroll;

var Event = React.createClass({
  getInitialState: function() {
    return {
      showCommand: true,
      showDiff: false  
    };
  },
  
  render: function() {
    var username = this.props.event.username;
    var date = moment(this.props.event.insertedAt).fromNow();
    var content = this.props.event.content;
    var prevContent = this.props.event.prevContent;
    var diff = diffString(prevContent, content);
    var notes = this.props.event.notes;   
    if (this.props.id == 0) {
      return (
        <li className={'evt'}>
          <div className={'evt-name'} onClick={this.scrollDown}>SCROLL DOWN TO THE LATEST VERSION</div>
          <br />
          <div className={'evt-name'}>{username} originally wrote,</div>
          <div className={'evt-name'}>{content}</div>
          <div className={'evt-name'}>Note - {notes}</div>
          <div className={'evt-name'}>Posted {date}</div>
        </li>        
      );
    } else {
      if (content !== prevContent) {
        return (
          <li className={'evt'}>
            <div className={'evt-name'}>{username} proposes,</div>
            {this.state.showCommand ? <div>
              <div className={'evt-name'}>{content}</div>
              <div className={'evt-name'} onClick={this.showDiff}>+ Show changes from previous version</div>
            </div> : true }
            {this.state.showDiff ? <div>
              <div className={'evt-name'} dangerouslySetInnerHTML={{__html: diff}}></div>
              <div className={'evt-name'} onClick={this.hideDiff}>- Hide changes from previous version</div>
            </div> : null }
            <div className={'evt-name'}>Note - {notes}</div>
            <div className={'evt-name'}>Posted {date}</div>
          </li>
        );
      } else {
        return (
          <li className={'evt'}>
            <div className={'evt-name'}>{username} commented:</div>
            <div className={'evt-name'}>{notes}</div>
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

module.exports = Event;