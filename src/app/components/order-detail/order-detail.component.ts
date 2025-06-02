import { Component, OnInit } from '@angular/core';
import { OrderResponse } from 'src/app/dtos/order/order.response';
import { OrderDetail } from 'src/app/models/order.detail';
import { OrderService } from 'src/app/services/Order/order.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  orderResponse: OrderResponse = {
    id: 0, // Hoặc bất kỳ giá trị số nào bạn muốn
    user_id: 0,
    fullname: '',
    phone_number: '',
    email: '',
    address: '',
    note: '',
    order_date: new Date(),
    status: '',
    total_money: 0, // Hoặc bất kỳ giá trị số nào bạn muốn
    shipping_method: '',
    shipping_address: '',
    shipping_date: new Date(),
    payment_method: '',
    order_details: [] // Một mảng rỗng
  };
  constructor(private readonly orderService: OrderService) { }

  ngOnInit(): void {
    this.getOrderDetails();
  }

  getOrderDetails(): void {
    //debugger
    const orderId = 1; // Thay bằng ID của đơn hàng bạn muốn lấy.
    this.orderService.getOrderById(orderId).subscribe({
      next: (response: OrderResponse) => {
        this.orderResponse = {
          ...response,
          order_date: new Date(response.order_date),
          shipping_date: new Date(response.shipping_date),
          order_details: response.order_details.map((detail: OrderDetail) => {
            detail.product.thumbnail = `${environment.apiUrl}/products/images/${detail.product.thumbnail}`;
            return detail;
          })
        };
      },
      error: (error: any) => {
        console.error('Error fetching detail:', error);
      }
    });

  }
}

