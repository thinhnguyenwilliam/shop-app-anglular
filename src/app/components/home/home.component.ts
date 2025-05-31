import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { CategoryService } from 'src/app/services/Category/category.service';
import { ProductService } from 'src/app/services/Product/product.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 2;
  totalPages: number = 0;
  visiblePages: number[] = [];
  categories: Category[] = [];
  selectedCategoryId: number = 0;
  keyword: string = "";

  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
    this.getCategories(0, 100);
  }

  searchProducts() {
    this.currentPage = 0;
    this.itemsPerPage = 12;
    //debugger;
    //console.log(`Category is here: ${this.selectedCategoryId}`);
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
  }

  getCategories(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (categories: Category[]) => {
        //console.log(categories);
        //debugger;
        this.categories = categories;
      },
      complete: () => {
        //debugger;
      },
      error: (error: any) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  getProducts(keyword: string, selectedCategoryId: number, page: number, limit: number): void {
    this.productService.getProducts(keyword, selectedCategoryId, page, limit).subscribe({
      next: (data: any) => {
        //console.log(data);
        this.products = data.products.map((product: Product) => {
          return {
            ...product,
            url: `${environment.apiUrl}/products/images/${product.thumbnail}`
          };
        });

        // this.products.forEach((product) => {
        //   console.log(product.url);
        // });

        this.totalPages = data.totalPages
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      error: (err) => {
        console.error('Failed to fetch products:', err);
      },
      complete: () => {
        console.log('Product fetch completed');
      }
    });
  }

  onPageChange(page: number): void {
    if (page !== this.currentPage) {
      this.currentPage = page;
      this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
    }
  }


  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisible = 5;
    let startPage = Math.max(currentPage - Math.floor(maxVisible / 2), 0);
    let endPage = startPage + maxVisible - 1;

    if (endPage >= totalPages) {
      endPage = totalPages - 1;
      startPage = Math.max(endPage - maxVisible + 1, 0);
    }

    const pages: number[] = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i + 1); // Convert to 1-based for display
    }

    return pages;
  }


}
