import { gsap } from 'gsap';

document.addEventListener('DOMContentLoaded', () => {
  // Timeline animation
  let animation = gsap.timeline()
  // Animate first word
  .from(".animate-word-list-1", {
    height: '0', 
    duration: 1.5, 
    opacity: 0,
    ease: 'back'
  } )
  .from(".animate-word-list-2", {
    height: '0',
    opacity: 0,
    duration: 1.2, 
    ease: 'back',
  },"-=0.7" );
}, false);