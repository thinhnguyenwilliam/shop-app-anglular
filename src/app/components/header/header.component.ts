import { Component, OnInit } from '@angular/core';
import { UserResponse } from 'src/app/dtos/user/user.response';
import { TokenService } from 'src/app/services/Token/token.service';
import { UserService } from 'src/app/services/User/user.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userResponse?: UserResponse | null;
  isPopoverOpen = false;
  activeNavItem: number = 0;

  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly router: Router
  ) { }

  setActiveNavItem(index: number): void {
    this.activeNavItem = index;
  }

  ngOnInit(): void {
    this.userResponse = this.userService.getUserResponseFromLocalStorage();
    console.log(this.userResponse);

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        if (url === '/') {
          this.activeNavItem = 0;
        } else if (url.startsWith('/orders')) {
          this.activeNavItem = 2;
        } else {
          this.activeNavItem = -1;
        }
      }
    });
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
