import {
  Directive,
  HostListener,
  ElementRef,
  OnInit,
  inject,
  Renderer2,
  HostBinding,
  signal,
  SimpleChange,
  Optional,
  Self,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { NgControl } from '@angular/forms';
import { parseCurrency } from '../utils/utils';
import { Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[appCurrencyInput]',
  standalone: true,
  providers: [CurrencyPipe], // Provide the CurrencyPipe at the directive level
})
export class CurrencyInputDirective implements OnInit {
  private currencyPipe: CurrencyPipe = inject(CurrencyPipe);
  private control: NgControl = inject(NgControl);
  private destroy$ = new Subject<void>();

  constructor(
    @Optional() @Self() private ngControl: NgControl,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit() {
    const formattedValue = this.parseAndFormat(this.control.control?.getRawValue());
    this.control.control?.setValue(formattedValue, { emitEvent: true });

    if (this.ngControl && this.ngControl.valueChanges) {
      this.ngControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
        // This code runs when the value changes, including when setValue() is called

        const formattedValue = this.parseAndFormat(value);
        this.control.control?.setValue(formattedValue, { emitEvent: false });
      });
    }
  }

  @HostListener('blur', ['$event'])
  onBlur(event: Event) {
    if (event.currentTarget instanceof HTMLInputElement) {
      // Type guard
      const formattedValue = this.parseAndFormat(event.currentTarget.value);
      this.control.control?.setValue(formattedValue, { emitEvent: true });
    }
  }

  private parseAndFormat(value: string) {
    const numericValue = parseCurrency(value);
    const errClass = '!bg-red-700/30';
    if (numericValue < 0) {
      this.renderer.addClass(this.el.nativeElement, errClass);
    } else {
      this.renderer.removeClass(this.el.nativeElement, errClass);
    }
    return this.formatValue(numericValue);
  }

  private formatValue(value: any): string {
    if (value) {
      // Use the CurrencyPipe to format the number
      const formattedValue = this.currencyPipe.transform(value, 'USD', 'symbol', '1.2-2');
      return formattedValue || '$0.00';
    } else {
      return '$0.00';
    }
  }
}
