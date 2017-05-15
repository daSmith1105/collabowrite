import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import FA from 'react-fontawesome';

export default function TestMessage(props) {
  return (
    <Modal show={props.showTestMessage} onHide={props.closeTestMessage}>
      <Modal.Header closeButton>
        <Modal.Title><FA name="question-circle" /> <b>Want to post or comment?</b></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><b>Sorry, this is just a demo for you to see what a Collabowrite project looks like, so posting has been disabled.</b></p>
        <p><FA name="plus-circle" /> <b>To create your own project:</b></p>
        <ul>
          <li>Describe the context of your project</li>
          <li>Optionally provide an initial version to work from</li>
        </ul>
        <p><b>And that's it, so go test it out!</b></p>
      </Modal.Body>
      <Modal.Footer>
        <Button bsStyle="success"><a href=".">Create my own</a></Button>
        <Button bsStyle="info" onClick={props.closeTestMessage}>Explore more</Button>     
      </Modal.Footer>
    </Modal>
  );
}