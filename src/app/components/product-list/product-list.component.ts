import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  productList: any[] = [];

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.getProductList();
  }

  getProductList(): void {
    this.productService.getProductList().subscribe(
      (response) => {
        console.log(response)
        this.productList = response;
        sessionStorage.setItem("length",response.length+1)
      },
      (error) => {
        console.error('Error retrieving product list:', error);
      }
    );
  }

  navigateToProductDetails(productId: number): void {
    this.router.navigate(['/products', productId]);
  }
}
