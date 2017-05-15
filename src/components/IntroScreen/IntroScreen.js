import React from 'react';
import FA from 'react-fontawesome';

export default function IntroScreen() {
  return (
    <div className="intro_section">
      <div className="intro_point">
        <h3><FA name="clock-o" className="intro" /> Collaborate <span className="green">real-time</span></h3>
        <h5>Work with others to perfect the phrasing of that sentence or paragraph you need for your project. Share and be notified real-time of suggestions, comments, and revisions while you collaborate.</h5>
      </div>
      <div className="intro_point">
        <h3><FA name="mobile" className="intro" /> Work <span className="green">mobile-friendly</span></h3>
        <h5>For those light-bulb moments while you're out, access and work on your projects on a smartphone or tablet, with all of the functions you have while you're on your computer.</h5>
      </div>
      <div className="intro_point">      
        <h3><FA name="slideshare" className="intro" /> Involve your <span className="green"> audience</span></h3>
        <h5>Skip the slides. If you're leading a class, meeting, or a brainstorming session, put your Collabowrite project on a projector and invite others to share ideas onto the screen using their smartphones. Enlarge text by clicking on posts or comments. </h5>
      </div>
      <div className="intro_point">
        <h3><FA name="hand-peace-o" className="intro" /> Get started <span className="green"> hassle-free</span></h3>
        <h5>Skip account registration, too. Just start a new project by providing a starting point or context, and we'll generate a unique code that you and your project members can use to access the project anytime, anywhere.</h5>
      </div>
    </div>
  );
}