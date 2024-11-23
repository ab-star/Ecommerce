import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from './components/hero/hero.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ProductsComponent } from './components/products/products.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterModule } from '@angular/router';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HeroComponent,   // Declare HeroComponent
    HeaderComponent,
    FooterComponent,
    ProductsComponent,
    PaginatorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CarouselModule,
    MatCardModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    RouterModule
  ],
  exports: [
    HeroComponent,   // Export HeroComponent
    HeaderComponent,
    FooterComponent,
    CarouselModule,
    MatCardModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    ProductsComponent,
    MatGridListModule
  ]
})
export class SharedModule { }
