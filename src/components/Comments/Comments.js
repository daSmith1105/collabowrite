import React from 'react';
import moment from 'moment';
import Comment from '../Comment/Comment';
import { ListGroupItem } from 'react-bootstrap';
import FA from 'react-fontawesome';

export default function Comments(props) {
  const commentsArray = props.comments;
  const commentsMapped = commentsArray.map(function (comment, index) {
    return <Comment username={comment.username} comment={comment.comment} insertedAt={comment.insertedAt} updated={props.updated} index={index} length={commentsArray.length} key={index}/>;
  }.bind(this));
  
  if (props.content === '' || props.content === "general_comment") {
    return <ListGroupItem><div className="comments">{commentsMapped}</div></ListGroupItem>;
  } else {
    return (
      <ListGroupItem>
        <div className="comments_header"><b><FA name='comments' className="gray_icon" /> Comments</b> -</div>
        <div className="comments">{commentsMapped}</div>
      </ListGroupItem>
    );
  }
}