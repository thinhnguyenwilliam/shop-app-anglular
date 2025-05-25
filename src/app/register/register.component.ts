import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  phone: string = '';
  email: string = '';
  password: string = '';
  retypePassword: string = '';
  fullName: string = '';
  dob: string = '';
  address: string = '';
  isAccepted: boolean = false;
  showPassword: boolean = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onPhoneChange() {
    console.log(`phone number is: `, this.phone);
  }


}
