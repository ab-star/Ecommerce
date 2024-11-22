import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent {
  // Carousel options
  carouselOptions = {
    loop: true,
    autoplay: true,
    items: 1,
    nav: true, // Show navigation arrows
    dots: true, // Show dots at the bottom
    autoplayTimeout: 3000, // 3-second interval between slides
    autoplayHoverPause: true
  };

  // Hero images array
  heroImages = [
    { src: 'hero1.jpg', alt: 'Hero Image 1' },
    { src: 'hero2.jpg', alt: 'Hero Image 2' },
    { src: 'hero3.jpg', alt: 'Hero Image 3' }
  ];
}
