import { Injectable } from '@angular/core';
import { ProductsList } from '../../utils/products-list';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  getSubtotal(): number {
    return ProductsList.products.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  getTax(subtotal: number): number {
    return subtotal * ProductsList.taxRate;
  }

  getTotal(subtotal: number, tax: number): number {
    return subtotal + tax;
  }
}
