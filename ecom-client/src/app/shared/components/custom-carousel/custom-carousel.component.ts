import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-custom-carousel',
  templateUrl: './custom-carousel.component.html',
  styleUrls: ['./custom-carousel.component.scss']
})
export class CustomCarouselComponent implements OnInit, OnDestroy {
  images: string[] = [
    'hero1.jpg',
    'hero2.jpg',
    'hero3.jpg',
  ];
  currentIndex: number = 0;
  nextIndex: number = 1;
  carouselInterval: any;

  constructor() {}

  ngOnInit(): void {
    // Start automatic image rotation every 3 seconds
    this.carouselInterval = setInterval(() => {
      this.nextImage();
    }, 3000);
  }

  ngOnDestroy(): void {
    // Clear the interval when the component is destroyed
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  // Move to the next image in the carousel
  nextImage(): void {
    this.currentIndex = this.nextIndex;
    this.nextIndex = (this.nextIndex + 1) % this.images.length;
  }

  // Move to the previous image in the carousel
  prevImage(): void {
    this.nextIndex =
      this.currentIndex === 0 ? this.images.length - 1 : this.currentIndex - 1;
    this.currentIndex = this.nextIndex;
  }
}
