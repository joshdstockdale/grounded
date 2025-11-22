import { Directive, HostListener, ElementRef, OnInit, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCurrencyInput]',
  standalone: true,
  providers: [CurrencyPipe], // Provide the CurrencyPipe at the directive level
})
export class CurrencyInputDirective implements OnInit {
  private el: HTMLInputElement = inject(ElementRef).nativeElement;
  private currencyPipe: CurrencyPipe = inject(CurrencyPipe);
  private control: NgControl = inject(NgControl);

  ngOnInit() {
    // Format the initial value when the control loads
    this.formatValue(this.control.value);
  }

  @HostListener('focus', ['$event'])
  onFocus(event: Event) {
    if (event.currentTarget instanceof HTMLInputElement) {
      // Type guard
      const value = event.currentTarget.value;
      const numericValue = this.parseCurrency(value);
      this.el.value = numericValue?.toString() || '';
    }
  }

  @HostListener('blur', ['$event'])
  onBlur(event: Event) {
    if (event.currentTarget instanceof HTMLInputElement) {
      // Type guard
      const value = event.currentTarget.value;
      const numericValue = this.parseCurrency(value);
      this.formatValue(numericValue);
      this.control.control?.setValue(numericValue, { emitEvent: true });
    }
  }

  private formatValue(value: any): void {
    if (value) {
      // Use the CurrencyPipe to format the number
      const formattedValue = this.currencyPipe.transform(value, 'USD', 'symbol', '1.2-2');
      this.el.value = formattedValue || '';
    } else {
      this.el.value = '';
    }
  }

  private parseCurrency(value: string): number | null {
    // Remove non-numeric characters (except decimal point and sign) to get the raw number
    const numericValue = value.replace(/[^0-9.-]+/g, '');
    return numericValue ? parseFloat(numericValue) : null;
  }
}
