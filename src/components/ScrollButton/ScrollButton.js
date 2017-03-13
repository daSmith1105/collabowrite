import React from 'react';
import FA from 'react-fontawesome';
import { Button } from 'react-bootstrap';

export default function ScrollButton(props) {
  if (props.postsArray.length > 3) {
    return (
      <div>
        <Button block bsStyle={props.bsStyle} bsSize="large" onClick={props.handleClick}>
          <FA name={props.FAname} /> {props.buttonText}
        </Button>
        <br />
      </div>
    );
  } else {
    return null;
  }
}