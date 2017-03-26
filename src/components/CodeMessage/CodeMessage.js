import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import FA from 'react-fontawesome';

export default function CodeMessage(props) {
  return (
    <Modal show={props.showCodeMessage} onHide={props.closeCodeMessage}>
      <Modal.Header closeButton>
        <Modal.Title><FA name="question-circle" /> <b>Did you save your code?</b></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><b>Make sure you've written down or saved your access code below.</b></p>
        <div className="accesscode_input">{props.accessCode}</div>
        <p><FA name="info-circle" /> <b>You'll need this code to:</b></p>
        <ul>
          <li>Log back in after leaving a session</li>        
          <li>Give others access to the project</li>
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button bsStyle="success" onClick={props.confirmCodeMessage}>Saved it</Button>
      </Modal.Footer>
    </Modal>
  );
}