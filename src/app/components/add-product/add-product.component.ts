import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { ProductService } from '../../services/product-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  addProductForm: FormGroup = new FormGroup({});
  productLength: number=0;
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder, private productService: ProductService, private router: Router) { }

  ngOnInit(): void {

    function noSpecialCharacters(control: FormControl) {
      const pattern = /^[a-zA-Z0-9 ]*$/;
      if (pattern.test(control.value)) {
        return null;
      } else {
        return { specialCharacters: true }; 
      }
    }

    function onlyNumbers(control: FormControl) {
      const pattern = /^[0-9]+(\.[0-9]{1,2})?$/;
      if (pattern.test(control.value)) {
        return null;
      } else {
        return { onlyNumbers: true };
      }
    }

    function validateDiscountPrice(control: FormControl) {
      const originalPriceControl = control.root.get('originalPrice');
      const originalPrice = originalPriceControl ? originalPriceControl.value : null;
      const discountPrice = control.value;
      if (originalPrice !== null && discountPrice !== null && discountPrice >= originalPrice) {
        return { validateDiscountPrice: true };
      }
      return null;
    }
    

    this.addProductForm = this.formBuilder.group({
      id:[Number(sessionStorage.getItem("length")),Validators.required],
      title: ['', [Validators.required, Validators.maxLength(30), noSpecialCharacters]],
      brand: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      originalPrice: [null, [Validators.required, Validators.min(0), onlyNumbers]],
      discountPrice: [null, [Validators.required, Validators.min(0), onlyNumbers, validateDiscountPrice]],
      rating: [null, [Validators.required, Validators.min(0), Validators.max(5), onlyNumbers]],
      availability: ['', Validators.required],
      images: ['', Validators.required]
    });


    

    this.addProductForm.get('category')?.valueChanges.subscribe((category) => {
      let imageUrl = '';
      if (category === 'Food Items') {
        imageUrl = 'https://i.ibb.co/7pmnx9z/balanced-diet.png';
      } else if (category === 'Clothes') {
        imageUrl = 'https://i.ibb.co/WNrkw6n/clothes-rack.png';
      } else if (category === 'Electronics') {
        imageUrl = 'https://i.ibb.co/0ZHbCzZ/responsive-design.png';
      } else if (category === 'Accessories') {
        imageUrl = 'https://i.ibb.co/bF3vnd2/bags.png';
      }
      
      this.addProductForm.patchValue({
        images: imageUrl
      });
    });
  }

  navigateToProductsList(): void {
    this.router.navigate(['/']);
  }

  onSubmit(): void {
    if (this.addProductForm.invalid) {
      return;
    }

    const product = this.addProductForm.value;
    this.productService.addProduct(product).subscribe(
      (response: any) => {
        if (response.auth === true) {
          console.log(response);
          this.router.navigate(['/products']);
        } else {
          this.errorMessage = "Error while adding product"
        }
      },
      (error: any) => {
        this.errorMessage = error;
      }
    );
  }
}
