import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/User/user.service';
import { UserRegisterDto } from 'src/app/dtos/user/user-register.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  @ViewChild('registerForm') registerForm!: NgForm;

  constructor(
    private readonly userService: UserService,
    private readonly router: Router
  ) { }

  // Form fields
  phone = '1234567817';
  password = '46129573';
  retypePassword = '46129573';
  fullName = 'Trieu Thi Phuc';
  dateOfBirth = '2000-01-02';
  address = 'Nga tu xe lua';
  email = 'ttp@gmail.com';
  isAccepted = false;
  showPassword = false;

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
    } else if (retypeControl?.hasError('passwordMismatch')) {
      retypeControl.setErrors(null);
    }
  }

  checkAge() {
    const dob = new Date(this.dateOfBirth);
    const today = new Date();

    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();
    const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

    const dobControl = this.registerForm?.form?.controls['dateOfBirth'];
    if (actualAge < 18) {
      dobControl?.setErrors({ underage: true });
    } else if (dobControl?.hasError('underage')) {
      dobControl.setErrors(null);
    }
  }

  register() {
    this.checkPasswordsMatch();
    this.checkAge();

    if (!this.registerForm.valid) {
      console.warn('Form is invalid');
      return;
    }

    const userData: UserRegisterDto = {
      phone_number: this.phone,
      email: this.email,
      password: this.password,
      retype_password: this.retypePassword,
      fullname: this.fullName,
      date_of_birth: this.dateOfBirth,
      address: this.address,
      facebook_account_id: 0,
      google_account_id: 0,
      role_id: 2
    };

    // const dtoInstance = plainToInstance(UserRegisterDto, userData);

    // validate(dtoInstance).then(errors => {
    //   if (errors.length > 0) {
    //     console.log('❌ Validation failed:', errors);
    //   } else {
    //     console.log('✅ Validation passed');
    //   }
    // });

    this.userService.registerUser(userData).subscribe({
      next: (res) => {
        console.log('Registration successful', res);
        //this.router.navigate(['/login']); // Adjust route as needed
      },
      error: (err) => {
        console.error('Registration failed', err.error.message);
        alert(`Lỗi: ${err.error.message}`);
      }
    });
  }
}
