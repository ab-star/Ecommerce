import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { StoreModuleConfig } from './store/storeconfig.module';


const routes: Routes = [
  { path: '', loadChildren: () => import('./features/landing/landing.module').then(m => m.LandingModule) },
  { path: 'checkout', loadChildren: () => import('./features/checkout/checkout.module').then(m => m.CheckoutModule) },
];

@NgModule({
  declarations: [AppComponent],  // Declare the AppComponent here
  imports: [
    BrowserModule,
    SharedModule,
    CommonModule,
    RouterModule.forRoot(routes),  // Configure the routing in the module
    BrowserAnimationsModule,
    StoreModuleConfig,
  ],
  providers: [],
  bootstrap: [AppComponent]  // Bootstrap AppComponent
})
export class AppModule { }
