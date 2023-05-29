import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  registerForm: FormGroup;
  loginForm: FormGroup;
  errorMessage: string = '';
  registrationSuccess: boolean = false;

  constructor(private http: HttpClient, private router: Router) {
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    });

    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
  }

  registerUser() {
    if (this.registerForm && this.registerForm.valid) {
      const emailControl = this.registerForm.get('email');
      const passwordControl = this.registerForm.get('password');
      if (emailControl && passwordControl) {
        const userData = {
          email: emailControl.value,
          password: passwordControl.value
        };

      this.http.post('https://good-gold-kitten-slip.cyclic.app/auth/register', userData).subscribe(
        (response) => {
          console.log(response);
          this.registrationSuccess = true;
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }
}

  loginUser() {
    if (this.loginForm && this.loginForm.valid) {
    const emailControl = this.loginForm.get('email');
    const passwordControl = this.loginForm.get('password');
    if (emailControl && passwordControl) {
      const userData = {
        email: emailControl.value,
        password: passwordControl.value
      };

      this.http.post('https://good-gold-kitten-slip.cyclic.app/auth/login', userData).subscribe(
        (response: any) => {
          if (response.auth === false) {
            this.errorMessage = response.token;
          } else {
            console.log(response);
            sessionStorage.setItem("loginStatus","LoggedIn")
            this.router.navigate(['/products']);
          }
        },
        (error: any) => {
          this.errorMessage = error;
        }
      );
    }
  }
}
}
