import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderDTO } from 'src/app/dtos/order/order.dto';
import { OrderResponse } from 'src/app/dtos/order/order.response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) { }

  placeOrder(orderData: OrderDTO): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/orders`, orderData, { headers });
  }

  getOrderById(orderId: number): Observable<OrderResponse> {
    const url = `${this.apiUrl}/orders/${orderId}`;
    return this.http.get<OrderResponse>(url);
  }

}
