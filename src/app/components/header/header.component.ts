import { Component, OnInit } from '@angular/core';
import { UserResponse } from 'src/app/dtos/user/user.response';
import { TokenService } from 'src/app/services/Token/token.service';
import { UserService } from 'src/app/services/User/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  userResponse?: UserResponse | null;
  isPopoverOpen = false;

  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService
  ) { }

  ngOnInit(): void {
    this.userResponse = this.userService.getUserResponseFromLocalStorage();
  }

  togglePopover(event: Event): void {
    event.preventDefault();
    this.isPopoverOpen = !this.isPopoverOpen;
  }

  handleItemClick(index: number): void {
    switch (index) {
      case 0:
        // Tài khoản của tôi
        // You can navigate to profile or trigger some action
        break;
      case 1:
        // Đơn mua
        // You can navigate to orders or something
        break;
      case 2:
        // Đăng xuất
        this.userService.removeUserFromLocalStorage();
        this.tokenService.removeToken();
        this.userResponse = null;
        break;
    }
    this.isPopoverOpen = false;
  }
}
