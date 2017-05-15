import React from 'react';
import Post from '../Post/Post';
import ScrollButton from '../ScrollButton/ScrollButton';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Scroll from 'react-scroll';
const scroll = Scroll.animateScroll;

class PostContainer extends React.Component {
  scrollDown() { scroll.scrollToBottom(); }

  scrollUp(){ scroll.scrollToTop(); }
  
	render() {
	  const postsArray = this.props.posts;
	  let version = 0;
    const postsMapped = postsArray.map(function (post, index) {
      //Increment version number if post isn't a discussion thread or context post
      if (post.content !== 'general_comment' && post.content !== '') { version++; }
      return <Post post={post} key={index} version={version} yourUsername={this.props.username} />;
    }.bind(this));
    
    return (
      <div>
        <ScrollButton postsArray={postsArray} bsStyle="success" handleClick={this.scrollDown} FAname="angle-double-down" buttonText="Scroll to latest post" />
        <ReactCSSTransitionGroup component="ul" className="postlist" transitionName="evt-transition" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
          {postsMapped}
        </ReactCSSTransitionGroup>
        <ScrollButton postsArray={postsArray} bsStyle="info" handleClick={this.scrollUp} FAname="angle-double-up" buttonText="Scroll to first post" /> 
      </div>
    );
	}
}

export default PostContainer;