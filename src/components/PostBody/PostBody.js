import React from 'react';
import { ListGroupItem, Label } from 'react-bootstrap';
import diffString from './jsdiff.js';

class PostBody extends React.Component {
  constructor() {
    super();
    this.state = {
      showChangesCommand: false,
      showChanges: true
    };
    this.showChanges = this.showChanges.bind(this);
    this.hideChanges = this.hideChanges.bind(this);
  }
  
  showChanges(e) {
    e.preventDefault();
    this.setState({ showChangesCommand: false, showChanges: true });
  }
  
  hideChanges(e) {
    e.preventDefault();
    this.setState({ showChangesCommand: true, showChanges: false });    
  }
  
  changeTextSize(e) {
    if (document.body.clientWidth > 767) {
      // Enable text enlarging for presentations on larger screen sizes
      if (e.target.tagName.toLowerCase() === 'div' || 'ins' || 'del' || 'span') {
        e.target.closest('div').classList.toggle('enlarged_text');
      }
    }
  }
  
  render() {
    let largerText = '';
    // If content is short, add an font-size enlarging CSS class
    if (this.props.content.length < 60) { largerText = ' larger_text'; }
    
    // Render different post types
    if (this.props.content === '' || this.props.content === "general_comment") {
      // Context posts or discussion threads
      return null;
      
    } else if (this.props.version === 1 || this.props.editedFrom === 0) {
      // New proposals
      return (
        <ListGroupItem>
          <div className={"writing" + largerText} onClick={this.changeTextSize} dangerouslySetInnerHTML={{__html: '<span class="quotations">&ldquo;</span>' + this.props.content + '<span class="quotations">&rdquo;</span>'}}></div>
        </ListGroupItem>
      );
      
    } else if (this.props.editedFrom !== 0 ) {
      const changes = diffString(this.props.prevContent, this.props.content).replace('&lt;', '<').replace('&gt;', '>').replace('<br </ins><ins>/>', '<br />').replace('<br </del><del>/>', '<br />').replace('<br <ins>/>', '<br /><ins>').replace('<ins><br </ins> />', '<br />').replace('<br <del>/>', '<br /><del>').replace('<del><br </del> />', '<br />').replace('<ins>&lt;br </ins><ins>/&gt;', '<br /><ins>').replace('</del><del><br />', '').trim();
      
      // Revisions
      return (
        <ListGroupItem>
          {this.state.showChangesCommand ?
            <div>
              <a href="#" onClick={this.showChanges}>
                <div className="changes_command">
                  + Show changes from <Label bsStyle="default" className="change_version">VERSION {this.props.editedFrom}</Label>
                </div>
              </a>
              <div className={"writing" + largerText} onClick={this.changeTextSize} dangerouslySetInnerHTML={{__html: '<span class="quotations">&ldquo;</span>' + this.props.content + '<span class="quotations">&rdquo;</span>'}}></div>
            </div>
          : false}
          {this.state.showChanges ?
            <div>
              <a href="#" onClick={this.hideChanges}>
                <div className="changes_command">
                  - Hide changes from <Label bsStyle="default" className="change_version">VERSION {this.props.editedFrom}</Label>
                </div>
              </a>
              <div className={"writing" + largerText} onClick={this.changeTextSize} dangerouslySetInnerHTML={{__html: '<span class="quotations">&ldquo;</span>' + changes + '<span class="quotations">&rdquo;</span>'}}></div>
            </div>
          : true}
        </ListGroupItem>
      );
    }
  }
}

export default PostBody;