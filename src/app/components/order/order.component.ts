import { Component, OnInit } from '@angular/core';
import { OrderDTO } from 'src/app/dtos/order/order.dto';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/Cart/cart.service';
import { OrderService } from 'src/app/services/Order/order.service';
import { ProductService } from 'src/app/services/Product/product.service';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  orderForm: FormGroup;
  cartItems: { product: Product, quantity: number }[] = [];
  couponCode: string = '';
  totalAmount: number = 0;
  orderData: OrderDTO = {
    user_id: 1, // Thay bằng user_id thích hợp
    fullname: '', // Khởi tạo rỗng, sẽ được điền từ form
    email: '', // Khởi tạo rỗng, sẽ được điền từ form
    phone_number: '', // Khởi tạo rỗng, sẽ được điền từ form
    address: '', // Khởi tạo rỗng, sẽ được điền từ form
    note: '', // Có thể thêm trường ghi chú nếu cần
    total_money: 0, // Sẽ được tính toán dựa trên giỏ hàng và mã giảm giá
    payment_method: 'cod', // Mặc định là thanh toán khi nhận hàng (COD)
    shipping_method: 'express', // Mặc định là vận chuyển nhanh (Express)
    coupon_code: '', // Sẽ được điền từ form khi áp dụng mã giảm giá
    cart_items: []
  };


  constructor(
    private readonly cartService: CartService,
    private readonly productService: ProductService,
    private readonly orderService: OrderService,
    private readonly fb: FormBuilder
  ) {
    this.orderForm = this.fb.group({
      fullname: ['hoàng xx', Validators.required], // fullname là FormControl bắt buộc      
      email: ['hoang234@gmail.com', [Validators.email]], // Sử dụng Validators.email cho kiểm tra định dạng email
      phone_number: ['11445547', [Validators.required, Validators.minLength(6)]], // phone_number bắt buộc và ít nhất 6 ký tự
      address: ['nhà x ngõ y', [Validators.required, Validators.minLength(5)]], // address bắt buộc và ít nhất 5 ký tự
      note: ['dễ vữ'],
      shipping_method: ['express'],
      payment_method: ['cod']
    });
  }

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

  placeOrder() {
    if (this.orderForm.valid) {
      this.orderData = {
        ...this.orderData,
        ...this.orderForm.value,
        cart_items: this.cartItems.map(cartItem => ({
          product_id: cartItem.product.id,
          quantity: cartItem.quantity
        }))
      };
      console.log(this.orderData);

      this.orderService.placeOrder(this.orderData).subscribe({
        next: (response) => {
          console.log('Đặt hàng thành công');
          alert('Đặt hàng thành công!');
          this.orderForm.reset(); // ✅ Only reset on success
        },
        complete: () => {
          //this.calculateTotal();
        },
        error: (error: any) => {
          console.error('Lỗi khi đặt hàng:', error);
          alert('Đặt hàng thất bại!');
        },
      });

    } else {
      // ❌ Do NOT reset the form here
      alert('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
      this.orderForm.markAllAsTouched(); // Highlights all errors
    }
  }


}
