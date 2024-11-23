import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutComponent } from './checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';


const routes: Routes = [
  { path: '', component: CheckoutComponent },  // Default route for the home page
];

@NgModule({
  declarations: [CheckoutComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),  // Make sure to add this to handle the child routes in CheckoutModule
    SharedModule
  ]
})
export class CheckoutModule { }
