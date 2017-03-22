import React from 'react';
import moment from 'moment';
import { ListGroupItem } from 'react-bootstrap';
import FA from 'react-fontawesome';

function stringifyComments(commentsArray, pClass, index, openBold, closeBold) {
  return pClass + '<span class="displayed_username">' + commentsArray[index].username
  + '</span>: '+ commentsArray[index].comment + '<span class="comment_timestamp">'
  + openBold + moment(commentsArray[index].insertedAt).fromNow() + closeBold
  + '</span></p>';
}

export default function Comments(props){
  let commentsArray = props.commentsArray;
  let commentsHTML = '';
  for (let i = 0; i < commentsArray.length-1; i++) {
    if (moment(commentsArray[i].insertedAt).add(60, 'minutes').isBefore(moment())) {
      commentsHTML += stringifyComments(commentsArray, '<p>', i, '', '');
    } else {
      commentsHTML += stringifyComments(commentsArray, '<p>', i, '<b class="newComment_time">', '</b>');
    }
  }
  
  if (props.updated) {
    commentsHTML += stringifyComments(commentsArray, '<p class="newComment">', commentsArray.length-1, '<b class="newComment_time">', '</b>');
  } else {
    if (moment(commentsArray[commentsArray.length-1].insertedAt).add(60, 'minutes').isBefore(moment())) {
      commentsHTML += stringifyComments(commentsArray, '<p>', commentsArray.length-1, '', '');
    } else {
      commentsHTML += stringifyComments(commentsArray, '<p>', commentsArray.length-1, '<b class="newComment_time">', '</b>');
    }
  }
  
  if (props.content === '' || props.content === "general_comment") {
    return <ListGroupItem><div className="comments" dangerouslySetInnerHTML={{__html: commentsHTML}}></div></ListGroupItem>;    
  } else {
    return (
      <ListGroupItem>
        <div className="comments_header"><b><FA name='comments' className="gray_icon" /> Comments</b> -</div>
        <div className="comments" dangerouslySetInnerHTML={{__html: commentsHTML}}></div>
      </ListGroupItem>
    );
  }
}