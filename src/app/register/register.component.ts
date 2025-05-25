import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  @ViewChild('registerForm') registerForm!: NgForm;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) { }

  //phone: string = '';
  phone: string = '1234567813';
  password: string = '46129573';
  retypePassword: string = '46129573';
  fullName: string = 'Trieu Thi Phuc';
  dateOfBirth: string = '2000-01-02';
  address: string = 'Nga tu xe lua';
  email: string = 'ttp@gmail.com';
  isAccepted: boolean = false;
  showPassword: boolean = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onPhoneChange() {
    console.log(`Phone number is: ${this.phone}`);
  }

  checkPasswordsMatch() {
    const retypeControl = this.registerForm?.form?.controls['retypePassword'];

    if (this.password !== this.retypePassword) {
      retypeControl?.setErrors({ passwordMismatch: true });
      return;
    }

    if (retypeControl?.hasError('passwordMismatch')) {
      retypeControl.setErrors(null);
    }
  }

  checkAge() {
    const dob = new Date(this.dateOfBirth);
    const today = new Date();

    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();

    // Adjust age if the birthday hasn't occurred yet this year
    const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

    const dobControl = this.registerForm?.form?.controls['dateOfBirth'];

    if (actualAge < 18) {
      dobControl?.setErrors({ underage: true });
      return;
    }

    if (dobControl?.hasError('underage')) {
      dobControl.setErrors(null);
    }
  }


  register() {
    // Step 1: Validate form
    this.checkPasswordsMatch();
    this.checkAge();

    if (!this.registerForm.valid) {
      console.warn('Form is invalid');
      return;
    }

    // Step 2: Prepare request body
    const userData = {
      phone_number: this.phone,
      email: this.email,
      password: this.password,
      retype_password: this.retypePassword,
      fullname: this.fullName,
      date_of_birth: this.dateOfBirth,
      address: this.address,
      //isAccepted: this.isAccepted,
      facebook_account_id: 0,
      google_account_id: 0,
      role_id: 2
    };
    //console.log(userData);

    // Optional: set headers if needed
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Step 3: Send POST request
    this.http.post('http://localhost:8088/shopapp/api/v1/users/register', userData, { headers })
      .subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          // Redirect or show success message
          //this.router.navigate(['/login']); // or your success route
        },
        error: (err) => {
          console.error('Registration failed', err.error.message);
          alert(`Lỗi: ${err.error.message}`);
        }
      });
  }



}
