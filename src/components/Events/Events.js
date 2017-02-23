var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var Event = require('../Event/Event');

var Events = React.createClass({
	render: function() {
	  var eventsArray = this.props.events;
    for (var i = 0; i < eventsArray.length; i++) { 
      if (i === 0) {
  	    eventsArray[i].prevContent = eventsArray[i].content;        
      } else {
        eventsArray[i].prevContent = eventsArray[i-1].content;
      }
	  }
    var eventsMapped = eventsArray.map(function (evt, index) {
      const key = index;
      if (this.props.matchCode === evt.accessCode) {
        return <Event event={evt} key={key} id={key} />;
      }
    }.bind(this));
    return <section className={'blue-gradient-background intro-splash splash'}>
             <div className={'container center-all-container'}>
               <ReactCSSTransitionGroup component="ul" className="evts" transitionName="evt-transition" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
                 {eventsMapped}
               </ReactCSSTransitionGroup>
             </div>
           </section>;
	}
});

module.exports = Events;