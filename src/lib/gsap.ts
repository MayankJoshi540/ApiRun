import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  
  // Set default animation configs
  gsap.defaults({
    ease: 'power3.out',
    duration: 0.6,
  });
}

export { gsap, ScrollTrigger };
