// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { findByData } from '../utils';

// gsap.registerPlugin(ScrollTrigger);

const section1 = findByData('about', 'id');
const section2 = findByData('program', 'id');
const elements = [section1, section2];

const options = {
  root: document,
  rootMargin: '0px',
  // threshold: [0, 0.25, 0.5, 0.75, 1],
  threshold: [0.95, 1],
  // trackVisibility: true,
  // delay: 100
}

// w/ IO
// https://w3c.github.io/IntersectionObserver
const observer = new IntersectionObserver(entries => {
  for (const entry of entries) {
    // entry.target.classList.toggle('scroller', entry.isIntersecting);
    entry.target.classList.toggle('scroller', (entry.intersectionRatio >= 0.95));
  }
}, {...options});

for (const element of elements) { observer.observe(element); }

// gsap.from(element, {
//   scrollTrigger: {
//     start: 'top top',
//     end: 'bottom center',
//     trigger: element,
//     toggleClass: 'scroller',
//     // markers: true,
//     // id: 'section',
//   }
// });
