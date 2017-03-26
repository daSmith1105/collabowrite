import React from 'react';
import moment from 'moment';

class Comment extends React.Component {
  changeTextSize(e) {
    if (document.body.clientWidth > 767) {
      // Enable text enlarging for presentations on larger screen sizes
      if (e.target.tagName.toLowerCase() === 'p' || 'span' || 'b') {
        e.target.closest('p').classList.toggle('enlarged_text');
      }
    }
  }
  
  render() {
    let pClass ='';
    let timeStamp = moment(this.props.insertedAt).fromNow();
    if (timeStamp === 'in a few seconds') { timeStamp = 'a few seconds ago' }
    const now = moment();
    
    if (!moment(this.props.insertedAt).add(60, 'minutes').isBefore(now)) {
      // Bolded timestamp if comment is from within the hour
      timeStamp = <b className="newComment_time">{timeStamp}</b>;

      if (this.props.updated && this.props.index === this.props.length-1) {
        // Highlight CSS class for new comments while user in session
        pClass = 'newComment';
      }
    }
  
    return (
      <p className={pClass} onClick={this.changeTextSize}>
        <span className="displayed_username">{this.props.username}: </span>
        <span dangerouslySetInnerHTML={{__html: this.props.comment }}></span>
        <span className="comment_timestamp">{timeStamp}</span>
      </p>
    );
  }
}

export default Comment;