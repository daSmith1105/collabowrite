import React from 'react';
import { Modal, Alert, Button } from 'react-bootstrap';
import FA from 'react-fontawesome';

export default function ConfirmMessage(props) {
  return (
    <Modal show={props.showModal} onHide={props.closeConfirm}>
      <Modal.Header closeButton>
        <Modal.Title><h3><FA name="exclamation-triangle" /> <b>You have unsaved work.</b></h3></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <b>You're about to close this form without submitting your work in it.</b><br />
        <span className="confirm_info"><FA name="info-circle" /> Submit work by clicking on the <b>post button</b> below the form you're working on.</span>
      </Modal.Body>
      <Modal.Footer>
        <Button bsStyle="danger" onClick={props.closeForm}>Discard your work</Button>
        <Button bsStyle="success" onClick={props.closeConfirm}>Keep working</Button>
      </Modal.Footer>
    </Modal>
  );
}
