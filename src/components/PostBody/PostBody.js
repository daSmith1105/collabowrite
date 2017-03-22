import React from 'react';
import { ListGroupItem, Label } from 'react-bootstrap';
import diffString from './jsdiff.js';

class PostBody extends React.Component {
  constructor() {
    super();
    this.state = { showChangesCommand: false, showChanges: true };
    this.showChanges = this.showChanges.bind(this);
    this.hideChanges = this.hideChanges.bind(this);
  }
  
  render() {
    if (this.props.content === '' || this.props.content === "general_comment") {
      //Context posts or discussion threads
      return null;
      
    } else if (this.props.version === 1 || this.props.editedFrom === 0) {
      //Originals
      return (
        <ListGroupItem>
          <div className="writing" dangerouslySetInnerHTML={{__html: '"' + this.props.content + '"'}}></div>
        </ListGroupItem>
      );
    } else if (this.props.editedFrom !== 0 ) {
      //Revisions
      return (
        <ListGroupItem>
          {this.state.showChangesCommand ?
            <div>
              <a href="#" onClick={this.showChanges}>
                <div className="changes_command">
                  + Show changes made from <Label bsStyle="default" className="change_version">VERSION {this.props.editedFrom}</Label>
                </div>
              </a>
              <div className="writing" dangerouslySetInnerHTML={{__html: this.props.content}}></div>
            </div>
          : false}
          {this.state.showChanges ?
            <div>
              <a href="#" onClick={this.hideChanges}>
                <div className="changes_command">
                  - Hide changes from <Label bsStyle="default" className="change_version">VERSION {this.props.editedFrom}</Label>
                </div>
              </a>
              <div className="writing" dangerouslySetInnerHTML={{__html: '"' + diffString(this.props.prevContent, this.props.content).trim() + '"'}}></div>
            </div>
          : true}
        </ListGroupItem>
      );
    }
  }
  
  showChanges(e) {
    e.preventDefault();
    this.setState({ showChangesCommand: false, showChanges: true });
  }
  
  hideChanges(e) {
    e.preventDefault();
    this.setState({ showChangesCommand: true, showChanges: false });    
  }  
}

export default PostBody;