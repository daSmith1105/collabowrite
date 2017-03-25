import React from 'react';
import generateTimeStamp from './generateTimeStamp';
import { Panel, ListGroup } from 'react-bootstrap';
import FA from 'react-fontawesome';
import PostHeader from '../PostHeader/PostHeader';
import PostBody from '../PostBody/PostBody';
import Comments from '../Comments/Comments';
import PostForms from '../PostForms/PostForms';

export default function Post(props) {
  const username = props.post.username;
  const timeStamp = generateTimeStamp(props.post.insertedAt);
  const content = props.post.content;
  const version = props.version;
  const editedFrom = props.post.editedFrom;
  
  //Panel styling for different types of posts
  let panelStyle;
  if (content === '') { panelStyle = "warning"; } //Context posts
  else if (version === 1 || editedFrom === 0 && content !== '' && content !== 'general_comment') { panelStyle = "info"; } //Originals
  else if (editedFrom !== 0 ) { panelStyle = "success"; } //Revisions
  else if (content === "general_comment") { panelStyle="default"; } //Discussion threads

  return (
    <li className="postitem">
      <Panel bsStyle={panelStyle} header={
        <PostHeader username={username} timeStamp={timeStamp} content={content} version={version} editedFrom={editedFrom} />}>
        <ListGroup fill>
          <PostBody username={username} content={content} version={version} editedFrom={editedFrom} prevContent={props.post.prevContent} />
          <Comments comments={props.post.comments} updated={props.post.updated} content={content} />
        </ListGroup>
        <PostForms content={content} accessCode={props.post.accessCode} yourUsername={props.yourUsername} version={version} _id={props.post._id} />
      </Panel>
    </li>
  );  
}