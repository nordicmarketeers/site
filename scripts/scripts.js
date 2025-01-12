const headerEl = document.querySelector('.navigation');

window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    headerEl.classList.add('nav-scrolled');
  } else if (window.scrollY <= 80) {
    headerEl.classList.remove('nav-scrolled');
  }
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
  });
});

const accordions = document.querySelectorAll('.accordion');

const openAccordion = (accordion) => {
  const content = accordion.querySelector('.accordion__content');
  accordion.classList.add('accordion__active');
  content.style.maxHeight = content.scrollHeight + 'px';
};

const closeAccordion = (accordion) => {
  const content = accordion.querySelector('.accordion__content');
  accordion.classList.remove('accordion__active');
  content.style.maxHeight = null;
};

accordions.forEach((accordion) => {
  const intro = accordion.querySelector('.accordion__intro');
  const content = accordion.querySelector('.accordion__content');

  intro.onclick = () => {
    if (content.style.maxHeight) {
      closeAccordion(accordion);
    } else {
      accordions.forEach((accordion) => closeAccordion(accordion));
      openAccordion(accordion);
    }
  };
});
