import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from './api/message.service';
import { Observable, of } from 'rxjs';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CurrencyInputDirective } from '../directives/currencyInput.directive';
const FieldTypes = ['text', 'checkbox', 'integer', 'currency'];
type FieldTypeChoices = (typeof FieldTypes)[number];

type BudgetDetail = {
  id: string;
  payee: string;
  auto: boolean;
  dayOfMonth: number;
  budget: number;
};

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    AsyncPipe,
    CurrencyInputDirective,
    ReactiveFormsModule,
    HlmInputImports,
    HlmCheckboxImports,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('frontend');
  private messageService = inject(MessageService);
  fieldTypes = FieldTypes;

  budgetDetails = [
    { id: '1', payee: 'Gas 0', auto: false, dayOfMonth: 1, budget: 35.0 },
    { id: '2', payee: 'Rent', auto: true, dayOfMonth: 1, budget: 2500.54 },
    { id: '3', payee: 'Food 0', auto: false, dayOfMonth: 5, budget: 500.0 },
  ];

  budgetForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.budgetForm = this.fb.group({
      items: this.fb.array([]), // Initialize an empty FormArray
    });
    this.addInitialItems();
  }

  addInitialItems(): void {
    this.budgetDetails.map((detail) => this.addItem(detail));
  }

  createItemFormGroup(item: {
    id: string;
    payee: string;
    auto: boolean;
    dayOfMonth: number;
    budget: number;
  }): FormGroup {
    return this.fb.group({
      id: [item.id],
      payee: [item.payee, Validators.required],
      auto: [item.auto],
      dayOfMonth: [item.dayOfMonth, Validators.min(1)],
      budget: [item.budget],
    });
  }

  // Helper getter to access the items FormArray
  get itemsArray() {
    return this.budgetForm.get('items') as FormArray;
  }

  addItem(item: BudgetDetail) {
    this.itemsArray.push(
      this.createItemFormGroup({
        id: item.id,
        payee: item.payee,
        auto: item.auto,
        dayOfMonth: item.dayOfMonth,
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
}
