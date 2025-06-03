import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/Cart/cart.service';
import { ProductService } from 'src/app/services/Product/product.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss']
})
export class DetailProductComponent implements OnInit {
  product?: Product;
  productId: number = 0;
  currentImageIndex: number = 0;
  isPressedAddToCart: boolean = false;
  quantity: number = 1;


  addToCart(): void {
    this.isPressedAddToCart = true;
    if (this.product) {
      this.cartService.addToCart(this.product.id, this.quantity);
      console.log(`Đã thêm ${this.quantity} sản phẩm vào giỏ hàng.`);
    } else {
      console.error('Không thể thêm sản phẩm vào giỏ hàng vì product là null.');
    }
  }

  increaseQuantity(): void {
    //debugger
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  getTotalPrice(): number {
    if (this.product) {
      return this.product.price * this.quantity;
    }
    return 0;
  }

  buyNow(): void {
    if (!this.isPressedAddToCart) {
      this.addToCart();
    }
    this.router.navigate(['/orders']);
  }

  constructor(
    private readonly productService: ProductService,
    private readonly cartService: CartService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    //this.cartService.clearCart();

    // Remove a specific product from cart
    //this.cartService.removeFromCart(2);

    // Lấy productId từ URL      
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');

    // +idParam: This is a unary plus operator. It converts a string (like "5") into a number (5).
    //+("2")  // => 2 (number)
    //+("abc")  // => NaN (not a number)

    if (idParam !== null && !isNaN(+idParam)) {
      //debugger
      this.productId = +idParam;
      this.loadProduct();
    } else {
      console.error('Invalid productId:', idParam);
    }
  }

  loadProduct(): void {
    this.productService.getDetailProduct(this.productId).subscribe({
      next: (response: Product) => {
        //debugger
        //console.log(response);
        // Append full URL to each product image
        if (response.product_images?.length) {
          response.product_images.forEach(img => {
            img.image_url = this.getFullImageUrl(img.image_url);
          });
        }

        this.product = response;
        this.showImage(0); // Start with the first image
      },
      error: (error: any) => {
        console.error('Error fetching detail:', error);
      }
    });
  }


  private getFullImageUrl(filename: string): string {
    return `${environment.apiUrl}/products/images/${filename}`;
  }

  showImage(index: number): void {
    //debugger
    if (!this.product?.product_images?.length) return;

    const total = this.product.product_images.length;
    this.currentImageIndex = Math.min(Math.max(index, 0), total - 1);
  }


  thumbnailClick(index: number): void {
    //debugger
    //console.log(index);
    this.currentImageIndex = index;
  }

  nextImage(): void {
    this.showImage(this.currentImageIndex + 1);
  }

  previousImage(): void {
    this.showImage(this.currentImageIndex - 1);
  }




}
