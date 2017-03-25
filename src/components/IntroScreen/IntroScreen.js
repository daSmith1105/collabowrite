import React from 'react';
import FA from 'react-fontawesome';

export default function IntroScreen() {
  return (
    <div>
      <h3><FA name="clock-o" className="intro" /> Collaborate <span className="green">real-time</span></h3>
      <h5>Anytime you post a revision, comment, suggestion, or announcment, others working on the project will see it instantly. No more waiting around or refreshing for updates.</h5>
      <h3><FA name="mobile" className="intro" /> Work <span className="green">mobile-friendly</span></h3>
      <h5>For those light-bulb moments while you're out, access and work on your projects on a smartphone or tablet, with all of the functions you have while you're on your computer.</h5>
      <h3><FA name="slideshare" className="intro" /> Involve your <span className="green"> audience</span></h3>
      <h5>Skip the slides: when you're facilitating a class, meeting, or a brainstorming session, just put your project on a projector and invite others in the room to share their ideas onto the screen using their smartphones. You can blow up the text of any post or comment with a single click.</h5> 
      <h3><FA name="hand-peace-o" className="intro" /> Get started <span className="green"> hassle-free</span></h3>
      <h5>No need to sign up for an account. Create a new project, and we'll generate a four-letter/number code that you and your project members can use to access the project anytime, anywhere.</h5>
    </div>
  );
}