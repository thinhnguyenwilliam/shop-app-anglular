import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly cart: Map<number, number> = new Map<number, number>();

  constructor() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cart = new Map(JSON.parse(storedCart));
    }
  }

  addToCart(productId: number, quantity: number = 1): void {
    if (this.cart.has(productId)) {
      this.cart.set(productId, this.cart.get(productId)! + quantity);
    } else {
      this.cart.set(productId, quantity);
    }
    this.saveCartToLocalStorage();
  }

  getCart(): Map<number, number> {
    return this.cart;
  }

  private saveCartToLocalStorage(): void {
    localStorage.setItem('cart', JSON.stringify(Array.from(this.cart.entries())));
  }

  // Hàm xóa dữ liệu giỏ hàng và cập nhật Local Storage
  clearCart(): void {
    this.cart.clear(); // Xóa toàn bộ dữ liệu trong giỏ hàng
    this.saveCartToLocalStorage(); // Lưu giỏ hàng mới vào Local Storage (trống)
  }

  removeFromCart(productId: number): void {
    if (this.cart.has(productId)) {
      this.cart.delete(productId);
      this.saveCartToLocalStorage();
    }
  }

}
