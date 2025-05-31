import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) { }

  getProducts(
    keyword?: string,
    categoryId?: number,
    page: number = 1,
    limit: number = 10
  ): Observable<Product[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (categoryId != null) {
      params = params.set('category_id', categoryId.toString());
    }

    if (keyword) {
      params = params.set('keyword', keyword);
    }

    return this.http.get<Product[]>(`${this.apiUrl}/products`, { params });
  }

  getDetailProduct(productId: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${productId}`);
  }

  getProductByIds(productIds: number[]): Observable<Product[]> {
    const params = new HttpParams().set('ids', productIds.join(','));
    return this.http.get<Product[]>(`${this.apiUrl}/products/multiple`, { params });
  }


}
