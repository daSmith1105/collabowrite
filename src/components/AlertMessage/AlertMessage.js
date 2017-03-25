import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import FA from 'react-fontawesome';

export default function AlertMessage(props) {
  return (
    <Modal show={props.showModal} onHide={props.closeAlert}>
      <Modal.Header closeButton>
        <Modal.Title><FA name="exclamation-triangle" /> <b>Sorry, project not found.</b></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><b>The project access code you entered doesn't seem to be valid.</b></p>
        <p><FA name="info-circle" /> You may want to:</p>
        <ul>
          <li>Check your code for typos</li>
          <li>Ask your project initiater for the correct code again</li>
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button bsStyle="success" onClick={props.closeAlert}>Got it</Button>
      </Modal.Footer>
    </Modal>
  );
}