import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from 'src/app/components/calendar/calendar.component';
import { ReportComponent } from 'src/app/components/report/report.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrls: ['./dashboard.scss'],
  imports: [CommonModule, CalendarComponent, ReportComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {}
