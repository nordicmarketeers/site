import Typed from 'typed.js';

document.addEventListener('DOMContentLoaded', () => {
  const template1 = document.querySelector(".typewriter__template-1");
  const templateChildren1 = Array.from(template1.content.children).map(child => child.textContent.trim());

  const template2 = document.querySelector(".typewriter__template-2");
  const templateChildren2 = Array.from(template2.content.children).map(child => child.textContent.trim());

  const typewriter1 = document.querySelector(".typewriter-1");
  const typewriter2 = document.querySelector(".typewriter-2");

  let currentIndex1 = 0;
  let currentIndex2 = 0;

  // Set initial text for typewriters
  typewriter1.textContent = templateChildren1[currentIndex1]; // Display the first word in typewriter 1
  typewriter2.textContent = templateChildren2[currentIndex2]; // Display the first word in typewriter 2

  function startTypewriter1() {
    if (currentIndex1 < templateChildren1.length) {
      new Typed(typewriter1, {
        strings: [templateChildren1[currentIndex1]],
        typeSpeed: 100,
        backSpeed: 50,
        backDelay: 150,
        loop: false,
        onStringTyped: () => {
          currentIndex1++;
          document.querySelector('.typed-cursor').remove();
          
          // Check if we reached the end of the first template
          if (currentIndex1 >= templateChildren1.length) {
            currentIndex1 = 0; // Reset index to loop
          }
          
          startTypewriter2(); // After typing finishes, switch to the second typewriter
        }
      });
    }
  }

  function startTypewriter2() {
    if (currentIndex2 < templateChildren2.length) {
      new Typed(typewriter2, {
        strings: [ templateChildren2[currentIndex2]],
        typeSpeed: 100,
        backSpeed: 50,
        backDelay: 150,
        loop: false,
        onStringTyped: () => {
          currentIndex2++;
          document.querySelector('.typed-cursor').remove();
          
          // Check if we reached the end of the second template
          if (currentIndex2 >= templateChildren2.length) {
            currentIndex2 = 0; // Reset index to loop
          }

          setTimeout(() => {
            startTypewriter1(); // After typing finishes, switch back to the first typewriter
          }, 1000); // Optional delay before switching back
        }
      });
    }
  }

  // Start with the first typewriter
  startTypewriter1();
}, false);