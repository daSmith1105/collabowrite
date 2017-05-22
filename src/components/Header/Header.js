import React from 'react';
import store from 'store';
import { Tooltip, Jumbotron, OverlayTrigger, Button, Alert } from 'react-bootstrap';
import FA from 'react-fontawesome';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      example: 'a sentence.',
      soundButton: store.get('sound').setting,
      alertVisible: true
    };
    this.setSound = this.setSound.bind(this);
    this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
  }
  
  componentWillMount() {
    if (document.body.clientWidth < 767) {
      // Turn off example animation sequence on smaller screen sizes
      this.setState({ example: '' });
    }
  }
  
  componentDidMount() {
    // Project type examples
    const examples = [
      "a topic sentence", "a thesis statement", "a mission statement", "instructions",
      "product descriptions", "translations", "a plotline", "a headline", "a tagline",
      "a catchphrase", "a paraphrase", "a paragraph", "a sentence"
    ];
    
    if (document.body.clientWidth > 767) {
      // Animate examples next to Collabowrite logo on larger screen sizes
      setInterval(function(){
        this.setState({ example: examples[examples.push(examples.shift())-1] + '.' });
      }.bind(this), 1500);    
    }
  }

	setSound() {
	  const soundOn = function(boolean) {
	    // Change displayed sound button icon by updating state
      this.setState({soundButton: boolean});
      
      // Update local storage sound setting
      store.set('sound', { setting: boolean });
      
      // Pass up sound setting to App parent component
      this.props.setSound(boolean);
      
      // Play sound setting to confirm when switched on
      if (boolean === true) {
        const notification = new Audio('notification.mp3');
        notification.play();
      }
	  }.bind(this);
	  
	  // Ternary operator to swith sound settings on and off
    this.state.soundButton ? soundOn(false) : soundOn(true);
	}
	
  handleAlertDismiss() { this.setState({ alertVisible: false }); }

	render() {
    const tooltip = (
      <Tooltip id="tooltip">
        <b><FA name="lightbulb-o" /> Tip</b>: Turn on/off notification sounds for new posts and comments.
      </Tooltip>
    );
    
	  if (!this.props.signIn) {
	    return (
        <Jumbotron>
          <a href="http://www.collabowrite.co"><h2>Collabo<span className="green">write </span>
            <ReactCSSTransitionGroup transitionName="text-transition" transitionEnterTimeout={1000} transitionLeaveTimeout={400}>
              <span className="example" key={this.state.example}>
                {this.state.example}
              </span>
            </ReactCSSTransitionGroup>
          </h2></a>
        </Jumbotron>
	    );
	  } else {
  	  return (
  	    <div>
          <Jumbotron>
            <h2><a href="http://www.collabowrite.co">Collabo<span className="green">write</span></a>
              <OverlayTrigger placement="left" overlay={tooltip}>
                <Button bsStyle="info" className="sound" onClick={this.setSound}>
                  <FA name={ this.state.soundButton ? "volume-up" : "volume-off" } />
                </Button>
              </OverlayTrigger>
            </h2>
          </Jumbotron>	 
          <ReactCSSTransitionGroup transitionName="evt-transition" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
            {this.state.alertVisible ?
              <Alert bsStyle="success" onDismiss={this.handleAlertDismiss}>
                <b><FA name="lightbulb-o" /> Tip</b>: If you're showing this on a projector, click on a post or comment to enlarge its text size.
              </Alert>
            : true}
          </ReactCSSTransitionGroup>
        </div>
  	  );
	  }
	}
}

export default Header;