import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckoutComponent } from './checkout.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { StoreModule, Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { CheckoutService } from '../../core/services/checkout.service';
import { NavigationExtras, Router } from '@angular/router';
import { of } from 'rxjs';
import {  } from '../../store/cart/cart.state';
import {  removeItemFromCart, updateCartItemQuantity } from '../../store/cart/cart.actions';

// Mocking required services
class MockCheckoutService {
  createOrder(payload: any) {
    return of({ success: true });
  }
}

class MockToastrService {
  success(message: string) {}
  error(message: string) {}
}

class MockRouter {
  navigate(commands: any[], extras?: NavigationExtras): Promise<boolean> {
    return Promise.resolve(true); // Mocking a successful navigation
  }
}

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  let store: Store;
  let toastr: MockToastrService;
  let router: MockRouter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, StoreModule.forRoot({})],
      declarations: [CheckoutComponent],
      providers: [
        FormBuilder,
        { provide: CheckoutService, useClass: MockCheckoutService },
        { provide: ToastrService, useClass: MockToastrService },
        { provide: Router, useClass: MockRouter },
      ]
    });

    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    toastr = TestBed.inject(ToastrService);
    router = TestBed.inject(Router);
    
    // Set up mock store
    spyOn(store, 'select').and.returnValue(of([{ id: "1", name: 'Item 1', price: 100, quantity: 2 }]));
    spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the cart items count and total price', () => {
    const cartItemsCount = fixture.nativeElement.querySelector('.font-bold.text-lg');
    expect(cartItemsCount.textContent).toBe('1'); // 1 cart item mock data
    
    const totalPrice = fixture.nativeElement.querySelector('.text-lg.font-bold');
    expect(totalPrice.textContent).toBe('$200.00'); // 100 x 2 items
  });

  it('should increase quantity when increase button is clicked', () => {
    const increaseButton = fixture.nativeElement.querySelector('button[ng-reflect-ng-class="px-3 py-1 bg-gray-200 rounded-full"]');
    increaseButton.click();
    expect(store.dispatch).toHaveBeenCalledWith(updateCartItemQuantity({ id: '1', quantity: 3 })); // id as string
  });
  
  it('should decrease quantity when decrease button is clicked', () => {
    const decreaseButton = fixture.nativeElement.querySelector('button[ng-reflect-ng-class="px-3 py-1 bg-gray-200 rounded-full"]:nth-of-type(1)');
    decreaseButton.click();
    expect(store.dispatch).toHaveBeenCalledWith(updateCartItemQuantity({ id: '1', quantity: 1 })); // id as string
  });
  
  it('should remove item when remove button is clicked', () => {
    const removeButton = fixture.nativeElement.querySelector('button.text-red-500');
    removeButton.click();
    expect(store.dispatch).toHaveBeenCalledWith(removeItemFromCart({ id: '1' })); // id as string
  });
  

  it('should decrease quantity when decrease button is clicked', () => {
    const decreaseButton = fixture.nativeElement.querySelector('button[ng-reflect-ng-class="px-3 py-1 bg-gray-200 rounded-full"]:nth-of-type(1)');
    decreaseButton.click();
    expect(store.dispatch).toHaveBeenCalledWith(updateCartItemQuantity({ id: '1', quantity: 1 })); // id as string
  });
  

  it('should remove item when remove button is clicked', () => {
    const removeButton = fixture.nativeElement.querySelector('button.text-red-500');
    removeButton.click();
    expect(store.dispatch).toHaveBeenCalledWith(removeItemFromCart({ id: '1' })); // id as string
  });

  it('should submit the form if valid', () => {
    // Setting form values to be valid
    component.checkoutForm.setValue({
      name: 'John Doe',
      email: 'john.doe@example.com',
      mobileNumber: '1234567890',
    });

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    spyOn(router, 'navigate');

    submitButton.click();
    expect(store.dispatch).toHaveBeenCalled();
    expect(toastr.success).toHaveBeenCalledWith('Order placed successfully');
  });

  it('should show error if the form is invalid', () => {
    // Setting invalid form value
    component.checkoutForm.setValue({
      name: '',
      email: 'invalid-email',
      mobileNumber: '123',
    });

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    submitButton.click();
    
    expect(toastr.error).toHaveBeenCalledWith('Please fill in the required fields & select one line item');
  });

  it('should show error if no items in the cart', () => {
    // Simulating empty cart
    spyOn(store, 'select').and.returnValue(of([]));
    fixture.detectChanges();

    component.validateCart();
    expect(component.checkoutForm.errors).toEqual({ noItems: true });
  });
});
