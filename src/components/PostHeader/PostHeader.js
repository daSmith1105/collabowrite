import React from 'react';
import { Label } from 'react-bootstrap';

export default function PostHeader(props) {
    let bsStyle, labelText, postInfo;
    
    if (props.content === '') {
      //Context post
      bsStyle = "warning";
      labelText = "CONTEXT";
      postInfo = 'Provided by <span class="displayed_username">' + props.username + '</span> ' + props.timeStamp;

    } else if (props.version === 1 || props.editedFrom === 0 && props.content !== 'general_comment') {
      //Originals
      bsStyle = "info";
      labelText = "VERSION " + props.version + " - ORIGINAL";
      postInfo = 'Suggested by <span class="displayed_username">' + props.username + '</span> ' + props.timeStamp;

    } else if (props.editedFrom !== 0 ) {
      //Revisions
      bsStyle = "success";
      labelText = "VERSION " + props.version + " - REVISION";
      postInfo = 'Revised from <b>Version ' + props.editedFrom + '</b> by <span class="displayed_username">' + props.username + '</span>' + ' ' + props.timeStamp;
      
    } else if (props.content === "general_comment") {
      //Discussion threads
      bsStyle = "default";
      labelText = "ANNOUNCEMENT / DISCUSSION";
      postInfo = 'Initiated by <span class="displayed_username">' + props.username + '</span> ' + props.timeStamp;
    }

  return (
    <div className="post_title">
      <Label bsStyle={bsStyle} className="title_header">{labelText}</Label>
      <div className="byline" dangerouslySetInnerHTML={{__html: postInfo}}></div>
    </div>
  );
}