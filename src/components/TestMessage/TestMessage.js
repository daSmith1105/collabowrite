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
        <p><b>This is just a demo for you to see what a Collabowrite project looks like.</b></p>
        <p><b><FA name="plus-circle" /> Create your own project by:</b></p>
        <ul>
          <li>Describing the context of your project</li>
          <li>Providing an initial version (optional)</li>
        </ul>
        <p><b>Easier than 1-2-3, right? Go test it out!</b></p>
      </Modal.Body>
      <Modal.Footer>
        <Button bsStyle="success"><a href=".">Create my own</a></Button>
        <Button bsStyle="info" onClick={props.closeTestMessage}>Look around more</Button>     
      </Modal.Footer>
    </Modal>
  );
}