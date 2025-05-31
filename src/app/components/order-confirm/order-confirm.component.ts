import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/Cart/cart.service';
import { ProductService } from 'src/app/services/Product/product.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order-confirm',
  templateUrl: './order-confirm.component.html',
  styleUrls: ['./order-confirm.component.scss']
})
export class OrderConfirmComponent implements OnInit {
  cartItems: { product: Product, quantity: number }[] = [];
  couponCode: string = '';
  totalAmount: number = 0;

  constructor(
    private readonly cartService: CartService,
    private readonly productService: ProductService
  ) { }

  ngOnInit(): void {
    const cart = this.cartService.getCart();
    //console.log(cart);

    const productIds = Array.from(cart.keys());
    //console.log(productIds);

    if (productIds.length === 0) {
      console.warn('Cart is empty.');
      return;
    }

    this.productService.getProductByIds(productIds).subscribe({
      next: (products) => {
        //console.log(products);
        this.cartItems = productIds.map((productId) => {
          const product = products.find((p) => p.id === productId);
          if (!product) {
            console.warn(`Product not found: ${productId}`);
            return null;
          }

          product.thumbnail = `${environment.apiUrl}/products/images/${product.thumbnail}`;
          return {
            product,
            quantity: cart.get(productId) ?? 0
          };
        }).filter((item): item is { product: Product, quantity: number } => item !== null);

        this.calculateTotal();
      },
      error: (error) => {
        console.error('Error fetching product details:', error);
      }
    });
  }

  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  applyCoupon(): void {
    const trimmedCode = this.couponCode.trim().toUpperCase();
    // fill input: DISCOUNT10

    // Example: fixed set of valid coupons
    const coupons: { [code: string]: number } = {
      'DISCOUNT10': 0.10, // 10% discount
      'DISCOUNT20': 0.20, // 20% discount
      'FREESHIP': 0.05    // 5% off for shipping
    };

    const discountRate = coupons[trimmedCode];

    if (discountRate) {
      const originalTotal = this.cartItems.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );
      this.totalAmount = originalTotal - originalTotal * discountRate;

      console.log(`Applied coupon ${trimmedCode}: -${discountRate * 100}%`);
    } else {
      console.warn('Invalid coupon code.');
      this.calculateTotal(); // Recalculate without discount
    }
  }

}
