import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { LandingComponent } from './landing.component';


const routes: Routes = [
  { path: '', component: LandingComponent },  // Default route for the home page
];

@NgModule({
  declarations: [LandingComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),  // Make sure to add this to handle the child routes in CheckoutModule
    SharedModule
  ]
})
export class LandingModule { }
