import { Routes } from '@angular/router';
import { KitchenSinkComponent } from './pages/kitchen-sink/kitchen-sink.page';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: 'kitchen-sink',
    component: KitchenSinkComponent,
  },
  {
    path: '',
    component: DashboardComponent,
  },
];
