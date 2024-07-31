import { DatePipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../..//utils/products-list';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'receipt',
  templateUrl: './receipt.component.html',
  standalone: true,
  imports: [NgFor, NgIf, MatDivider, DecimalPipe, DatePipe],
})
export class ReceiptComponent implements OnInit {
  @Input() receiptData: ReceiptData;
  @Input() showPaymentDetails: boolean = true;
  public date = new Date().toLocaleDateString();

  constructor() {}

  ngOnInit() {}
}

export interface ReceiptData {
  merchantName: string;
  items?: Product[];
  tax?: number;
  total?: number;
  paymentMethodDetails: string;
  customerName?: string;
}
