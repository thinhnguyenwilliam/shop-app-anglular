import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserLoginDto } from 'src/app/dtos/user/login.dto';
import { UserService } from 'src/app/services/User/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @ViewChild('loginForm') loginForm!: NgForm;

  phone: string = '098768776';
  // phoneNumber = '+14155552671';  // US number with country code +1
  
  password: string = '46129573';
  rememberMe: boolean = false;
  showPassword: boolean = false;
  validationErrors: string[] = [];


  constructor(private readonly router: Router, private readonly userService: UserService) { }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onPhoneChange(): void {
    console.log(this.phone);
  }

  onLogin(): void {
    // Create DTO instance from plain object
    const loginDto = plainToInstance(UserLoginDto, {
      phoneNumber: this.phone,
      password: this.password
    });

    // Validate the DTO
    validate(loginDto).then(errors => {
      if (errors.length > 0) {
        // Extract error messages
        this.validationErrors = errors.map(err => {
          const constraints = err.constraints ? Object.values(err.constraints) : [];
          return constraints.join(', ');
        });
        console.log('Validation failed:', this.validationErrors);
        alert('Thông tin đăng nhập không hợp lệ.');
      } else {
        // Proceed with login
        this.validationErrors = [];

        // Call backend login API here if needed
        this.userService.login(loginDto).subscribe({
          next: (res) => {
            console.log('Login successful', res);
          },
          error: (err) => {
            console.error('Login failed', err.error.message);
            alert(`Lỗi: ${err.error.message}`);
          }
        });

      }
    });
  }



}
