import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from './api/message.service';
import { lastValueFrom, Observable, of, Subscription } from 'rxjs';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmTableImports } from '@spartan-ng/helm/table';

import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CurrencyInputDirective } from '../directives/currencyInput.directive';
import { parseCurrency } from '../utils/utils';
import { LineDetail, BudgetService, Budget } from './api/budget.service';
import { lucidePlus, lucideX } from '@ng-icons/lucide';
const FieldTypes = ['text', 'checkbox', 'integer', 'currency'];

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    AsyncPipe,
    CurrencyInputDirective,
    ReactiveFormsModule,
    HlmInputImports,
    HlmCheckboxImports,
    HlmButtonImports,
    HlmIconImports,
    HlmTableImports,
    HlmIcon,
    NgIcon,
  ],
  providers: [CurrencyPipe, provideIcons({ lucideX, lucidePlus })],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('frontend');
  private messageService = inject(MessageService);
  private budgetService = inject(BudgetService);

  fieldTypes = FieldTypes;
  subscriptions: Subscription[] = [];

  budgetDetail: Budget = {
    id: '1',
    name: 'Test',
    month: 10,
    year: 2025,
    archived: false,
    lines: [
      { id: '1', payee: 'Gas 0', auto: false, dayOfMonth: 10, actual: 36.0, budget: 35.0 },
      { id: '2', payee: 'Rent', auto: true, dayOfMonth: 1, actual: 1500, budget: 2500.54 },
      { id: '3', payee: 'Food 0', auto: false, dayOfMonth: 5, actual: 500, budget: 500.0 },
    ],
  };

  budgetForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.budgetForm = this.fb.group({
      items: this.fb.array([]), // Initialize an empty FormArray
    });
    this.addInitialItems();
    this.sortForm('dayOfMonth', 'payee', 'asc');
  }

  addInitialItems(): void {
    this.budgetDetail.lines.map((detail) => this.addItem(detail));
  }

  sortForm(primary: string, secondary: string, direction: 'asc' | 'desc'): void {
    this.itemsArray.controls.sort((a, b) => {
      const valueA = a.get(primary)?.value;
      const valueB = b.get(primary)?.value;

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return direction === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        return direction === 'asc' ? valueA - valueB : valueB - valueA;
      }

      return 0; // Fallback if types are not comparable
    });
  }

  addNewItem(): void {
    const item = {
      id: '',
      payee: '',
      auto: false,
      dayOfMonth: 31,
      actual: 0,
      balance: 0,
      budget: 0,
    };
    this.addItem(item);
    lastValueFrom(this.budgetService.addBudgetLine(item));
  }

  createItemFormGroup(item: LineDetail): FormGroup {
    const rowGroup = this.fb.group({
      id: [item.id],
      payee: [item.payee, Validators.required],
      auto: [item.auto],
      dayOfMonth: [item.dayOfMonth, [Validators.min(1), Validators.max(31), Validators.required]],
      actual: [item.actual],
      balance: [item.balance],
      budget: [item.budget],
    });

    // Compute Balance
    const balanceFromBudgetSub = rowGroup
      .get('budget')
      ?.valueChanges.subscribe(() => this.calcBalance(rowGroup));
    const balanceFromActualSub = rowGroup
      .get('actual')
      ?.valueChanges.subscribe(() => this.calcBalance(rowGroup));

    if (balanceFromBudgetSub && balanceFromActualSub) {
      this.subscriptions.push(balanceFromBudgetSub);
      this.subscriptions.push(balanceFromActualSub);
    }

    return rowGroup;
  }
  valueChanged(col: string, value: any, id: string) {
    let ogLine = this.budgetDetail.lines.find((line) => line.id === id);
    if (ogLine && ogLine[col as keyof LineDetail] !== value) {
      // Update og with new value
      this.budgetDetail.lines = this.budgetDetail.lines.map((obj) => {
        if (obj.id === id) {
          return { ...ogLine, [col]: value } as LineDetail;
        }
        return obj as LineDetail;
      });

      return true;
    }
    return false;
  }
  saveBool(col: string, value: boolean, id: string) {
    if (col && value && id) {
      if (this.valueChanged(col, value, id)) {
        lastValueFrom(this.budgetService.updateBudgetLine(col, value, id));
      }
    }
  }
  saveCurrency(evt: Event) {
    if (evt.currentTarget instanceof HTMLInputElement) {
      const value = parseCurrency(evt.currentTarget.value);
      const col = evt.currentTarget.dataset['col'];
      const id = evt.currentTarget.dataset['id'];
      if (col && value && id) {
        if (this.valueChanged(col, value, id)) {
          lastValueFrom(this.budgetService.updateBudgetLine(col, value, id));
        }
      }
    }
  }
  saveNumber(evt: Event) {
    if (evt.currentTarget instanceof HTMLInputElement) {
      const value = parseInt(evt.currentTarget.value);
      const col = evt.currentTarget.dataset['col'];
      const id = evt.currentTarget.dataset['id'];
      if (col && value && id) {
        if (this.valueChanged(col, value, id)) {
          lastValueFrom(this.budgetService.updateBudgetLine(col, value, id));

          this.sortForm('dayOfMonth', 'payee', 'asc');
        }
      }
    }
  }
  saveString(evt: Event) {
    if (evt.currentTarget instanceof HTMLInputElement) {
      const value = evt.currentTarget.value;
      const col = evt.currentTarget.dataset['col'];
      const id = evt.currentTarget.dataset['id'];
      if (col && value && id) {
        if (this.valueChanged(col, value, id)) {
          lastValueFrom(this.budgetService.updateBudgetLine(col, value, id));
        }
      }
    }
  }

  calcBalance(rowGroup: FormGroup): void {
    const budget = parseCurrency(rowGroup.get('budget')?.value);
    const actual = parseCurrency(rowGroup.get('actual')?.value);
    const balance = budget - actual;
    rowGroup.get('balance')?.setValue(balance, { emitEvent: true });
  }

  // Helper getter to access the items FormArray
  get itemsArray() {
    return this.budgetForm.get('items') as FormArray;
  }

  addItem(item: LineDetail) {
    this.itemsArray.push(
      this.createItemFormGroup({
        id: item.id,
        payee: item.payee,
        auto: item.auto,
        dayOfMonth: item.dayOfMonth,
        actual: item.actual,
        balance: 0,
        budget: item.budget,
      })
    );
  }

  removeItem(index: number) {
    this.itemsArray.removeAt(index);
  }

  message$: Observable<{ message: string } | null> = of(null);

  getData() {
    this.message$ = this.messageService.getMessage();
  }
  ngOnDestroy(): void {
    this.subscriptions.map((sub) => sub.unsubscribe());
  }
}
