import { Component, ViewChild, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Role } from 'src/app/dtos/roles/role.dto';
import { UserLoginResponseDto } from 'src/app/dtos/user/login-response.dto';
import { UserLoginDto } from 'src/app/dtos/user/login.dto';
import { RoleService } from 'src/app/services/Role/role.service';
import { TokenService } from 'src/app/services/Token/token.service';
import { UserService } from 'src/app/services/User/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm') loginForm!: NgForm;

  phone: string = '1234567820';
  // phoneNumber = '+14155552671';  // US number with country code +1

  password: string = '46129573';
  rememberMe: boolean = false;
  showPassword: boolean = false;
  validationErrors: string[] = [];
  roles: Role[] = [];
  selectedRole: Role | null = null;


  constructor(
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly roleService: RoleService
  ) { }

  ngOnInit(): void {
    this.loadRoles();
  }

  private loadRoles(): void {
    this.roleService.getRoles().subscribe({
      next: (roles: Role[]) => {
        this.roles = roles;
        this.selectedRole = roles.length > 0 ? roles[0] : null;
      },
      error: (err) => {
        console.error('Failed to load roles', err);
        alert('Không thể tải danh sách quyền.');
      }
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onPhoneChange(): void {
    console.log(this.phone);
  }

  onRoleChange(): void {
    if (this.selectedRole) {
      console.log('Selected role ID:', this.selectedRole.id);
      console.log('Selected role Name:', this.selectedRole.name);
    }
  }


  onLogin(): void {
    // Create DTO instance from plain object
    const loginDto = plainToInstance(UserLoginDto, {
      phoneNumber: this.phone,
      password: this.password,
      role_id: this.selectedRole?.id
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
          next: (res: UserLoginResponseDto) => {
            console.log('Login successful', res);
            if (this.rememberMe) {
              console.log(this.rememberMe);
              this.tokenService.setToken(res.token);
            }
          },
          error: (err) => {
            //console.error('Login failed', err.error.message_honey);
            alert(`Lỗi: ${err.error.message_honey}`);
          }
        });

      }
    });
  }



}
