import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  private baseUrl = 'https://silver-dove-fez.cyclic.app';

  constructor(private http: HttpClient) { }

  getProductList(): Observable<any> {
    return this.http.get(`${this.baseUrl}/list`);
  }

  getProductDetails(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/details/${id}`);
  }

  addProduct(product: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, product);
  }

  editProduct(id: number, product: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/edit/${id}`, product);
  }

}
