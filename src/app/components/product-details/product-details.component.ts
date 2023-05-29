import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product-service.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  isEditFormVisible: boolean = false;
  productId: number = 0;
  errorMessage: string = '';
  productDetails: any[] = [];
  editProductForm: FormGroup = new FormGroup({});

  showEditForm() {
    this.isEditFormVisible = true;
  }

  isLoggedIn(): boolean {
    return sessionStorage.getItem('loginStatus') === 'LoggedIn';
  }

  cancelEdit() {
    this.isEditFormVisible = false;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    
    this.route.params.subscribe((params) => {
      this.productId = params['id'];
      this.getProductDetails();
    });

    this.editProductForm = this.formBuilder.group({
      title: ['', Validators.required],
      brand: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      originalPrice: [null, [Validators.required, Validators.min(0)]],
      discountPrice: [null, [Validators.required, Validators.min(0)]],
      rating: [null, [Validators.required, Validators.min(0)]],
      availability: ['', Validators.required],
    });
  }

  getProductDetails(): void {
    this.productService.getProductDetails(this.productId).subscribe(
      (response) => {
        console.log(response);
        this.productDetails = response;
        this.populateForm();
      },
      (error) => {
        console.error('Error retrieving product details:', error);
      }
    );
  }

  populateForm(): void {
    this.editProductForm.patchValue({
      title: this.productDetails[0].title,
      brand: this.productDetails[0].brand,
      description: this.productDetails[0].description,
      category: this.productDetails[0].category,
      originalPrice: this.productDetails[0].originalPrice,
      discountPrice: this.productDetails[0].discountPrice,
      rating: this.productDetails[0].rating,
      availability: this.productDetails[0].availability,
    });
  }

  onSubmit(): void {
    if (this.editProductForm.invalid) {
      return;
    }

    const editedProduct = this.editProductForm.value;
    this.productService.editProduct(this.productId, editedProduct).subscribe(
      (response: any) => {
        if (response.auth === true) {
          console.log(response);
          this.router.navigate(['/products']);
        } else {
          this.errorMessage = "Error while adding product"
        }
      },
      (error) => {
        console.error('Error editing product:', error);
      }
    );
  }
}
