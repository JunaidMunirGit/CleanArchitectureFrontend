import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ProductsApiService } from '../../data-access/products-api.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import type { CreateProductRequest, UpdateProductRequest } from '../../models/product.models';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export class ProductFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ProductsApiService);
  private readonly notification = inject(NotificationService);

  readonly productId = signal<string | null>(null);
  readonly isEdit = computed(() => !!this.productId());
  private rowVersion = '';

  form!: FormGroup;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.productId.set(id);
    this.buildForm();
    if (id) {
      this.api.getById(id).subscribe({
        next: (p) => this.patchForm(p),
        error: () => this.notification.error('Product not found'),
      });
    }
  }

  private buildForm(): void {
    this.form = this.fb.nonNullable.group({
      sku: ['', [Validators.required, Validators.maxLength(50)]],
      name: ['', [Validators.required, Validators.maxLength(200)]],
      description: [''],
      categoryId: ['', Validators.required],
      brandId: [''],
      unitOfMeasureId: ['', Validators.required],
      costPrice: [0, [Validators.required, Validators.min(0)]],
      sellingPrice: [0, [Validators.required, Validators.min(0)]],
      discountable: [false],
      trackInventory: [true],
      reorderLevel: [0, [Validators.min(0)]],
      taxCategoryId: ['', Validators.required],
      imageUrl: [''],
      barcodes: [''],
      primaryBarcode: [''],
    });
  }

  private patchForm(p: {
    sku: string;
    name: string;
    description?: string;
    categoryId: string;
    brandId?: string;
    unitOfMeasureId: string;
    costPrice: number;
    sellingPrice: number;
    discountable: boolean;
    trackInventory: boolean;
    reorderLevel: number;
    taxCategoryId: string;
    imageUrl?: string;
    barcodes: string[];
    primaryBarcode?: string;
    rowVersion: string;
  }): void {
    this.form.patchValue({
      sku: p.sku,
      name: p.name,
      description: p.description ?? '',
      categoryId: p.categoryId,
      brandId: p.brandId ?? '',
      unitOfMeasureId: p.unitOfMeasureId,
      costPrice: p.costPrice,
      sellingPrice: p.sellingPrice,
      discountable: p.discountable,
      trackInventory: p.trackInventory,
      reorderLevel: p.reorderLevel,
      taxCategoryId: p.taxCategoryId,
      imageUrl: p.imageUrl ?? '',
      barcodes: (p.barcodes ?? []).join('\n'),
      primaryBarcode: p.primaryBarcode ?? '',
    });
    this.rowVersion = p.rowVersion;
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    const barcodes = (v.barcodes as string)
      .split(/[\n,]/)
      .map((s: string) => s.trim())
      .filter(Boolean);

    if (this.isEdit()) {
      const id = this.productId()!;
      const rowVersion = this.rowVersion;
      const body: UpdateProductRequest = {
        rowVersion,
        name: v.name,
        description: v.description || undefined,
        categoryId: v.categoryId,
        brandId: v.brandId || undefined,
        unitOfMeasureId: v.unitOfMeasureId,
        costPrice: v.costPrice,
        sellingPrice: v.sellingPrice,
        discountable: v.discountable,
        trackInventory: v.trackInventory,
        reorderLevel: v.reorderLevel,
        taxCategoryId: v.taxCategoryId,
        imageUrl: v.imageUrl || undefined,
        barcodes,
        primaryBarcode: v.primaryBarcode || undefined,
      };
      this.api.update(id, body).subscribe({
        next: () => {
          this.notification.success('Product updated');
          this.router.navigate(['/products']);
        },
      });
    } else {
      const body: CreateProductRequest = {
        sku: v.sku,
        name: v.name,
        description: v.description || undefined,
        categoryId: v.categoryId,
        brandId: v.brandId || undefined,
        unitOfMeasureId: v.unitOfMeasureId,
        costPrice: v.costPrice,
        sellingPrice: v.sellingPrice,
        discountable: v.discountable,
        trackInventory: v.trackInventory,
        reorderLevel: v.reorderLevel,
        taxCategoryId: v.taxCategoryId,
        imageUrl: v.imageUrl || undefined,
        barcodes,
        primaryBarcode: v.primaryBarcode || undefined,
      };
      this.api.create(body).subscribe({
        next: () => {
          this.notification.success('Product created');
          this.router.navigate(['/products']);
        },
      });
    }
  }
}
