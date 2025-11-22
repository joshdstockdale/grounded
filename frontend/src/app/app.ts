import { Component, inject, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from './api/message.service';
import { Observable, of } from 'rxjs';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { form, Field } from '@angular/forms/signals'
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';

interface Fields {
  [value: BudgetHeaderChoices]: {
    type: FieldTypeChoices,
    default: string | boolean | number,
    max: number,
    label: string,
    required: boolean,
    computed: boolean,
    align: "left" | "center" | "right"
  }
}
const FieldTypes = [
  "text",
  "checkbox",
  "integer",
  "currency",
]
type FieldTypeChoices = typeof FieldTypes[number]

const BudgetHeaders = [
  "payee",
  "auto",
  "dayOfMonth",
  "actual",
  "balance",
  "budget"
]
type BudgetHeaderChoices = typeof BudgetHeaders[number]
type BudgetDetail = {
  id: string,
  [value: BudgetHeaderChoices]: string
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AsyncPipe, Field, CurrencyPipe, HlmInputImports, HlmCheckboxImports],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
  private messageService = inject(MessageService)
  fieldTypes = FieldTypes
  rowHeaders = BudgetHeaders

  budgetDetails: WritableSignal<BudgetDetail[]> = signal([
    { id: '1', payee: 'Gas 0', auto: 'false', dayOfMonth: '1', actual: '25.54', balance: '-0.01', budget: '35.00' },
    { id: '2', payee: 'Rent', auto: 'true', dayOfMonth: '1', actual: '2500.54', balance: '0.00', budget: '2500.54' },
    { id: '3', payee: 'Food 0', auto: 'false', dayOfMonth: '5', actual: '500.54', balance: '0.54', budget: '500.00' },
  ])

  budgetForm = form(this.budgetDetails)

  fields: Fields = {
    payee: { type: 'text', default: '', max: 255, label: 'Payee', required: true, computed: false, align: "left" },
    auto: { type: 'checkbox', default: false, max: 1, label: 'Auto?', required: true, computed: false, align: "center" },
    dayOfMonth: { type: 'integer', default: 1, max: 31, label: 'Day', required: true, computed: false, align: "center" },
    actual: { type: 'currency', default: 0.00, max: 8, label: 'Actual', required: false, computed: true, align: "right" },
    balance: { type: 'currency', default: 0.00, max: 8, label: 'Balance', required: true, computed: true, align: "right" },
    budget: { type: 'currency', default: 0.00, max: 8, label: 'Budget', required: true, computed: false, align: "right" }
  }

  updateBudgetDetails(idToUpdate: string, key: BudgetHeaderChoices, newValue: string): void {
    this.budgetDetails.update(currentItems =>
      currentItems.map(item =>
        item['id'] === idToUpdate ? { ...item, [key]: newValue } : item
      )
    );
  }
  formatCurrency(id: string, key: BudgetHeaderChoices, value: string) {
    //currency:'USD':'symbol':'1.2-2'
    this.updateBudgetDetails(id, key, value)
  }

  fieldToEdit = signal("");
  makeEditable(i: number, key: string) {
    this.fieldToEdit.set(i + ',' + key)
  }

  message$: Observable<{ message: string } | null> = of(null)

  getData() {
    this.message$ = this.messageService.getMessage()
  }
}
