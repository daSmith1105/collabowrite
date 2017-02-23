var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var Post = require('../Post/Post');

var Posts = React.createClass({
	render: function() {
	  var postsArray = this.props.posts;
    for (var i = 0; i < postsArray.length; i++) { 
      if (i === 0) {
  	    postsArray[i].prevContent = postsArray[i].content;        
      } else {
        postsArray[i].prevContent = postsArray[i-1].content;
      }
	  }
    var postsMapped = postsArray.map(function (evt, index) {
      const key = index;
      if (this.props.matchCode === evt.accessCode) {
        return <Post post={evt} key={key} id={key} />;
      }
    }.bind(this));
    return <section className={'blue-gradient-background intro-splash splash'}>
             <div className={'container center-all-container'}>
               <ReactCSSTransitionGroup component="ul" className="evts" transitionName="evt-transition" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
                 {postsMapped}
               </ReactCSSTransitionGroup>
             </div>
           </section>;
	}
});

module.exports = Posts;