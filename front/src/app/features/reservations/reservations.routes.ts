import { Routes } from '@angular/router';
import { commercialOuTresorierGuard } from '../../core/guards/auth.guard';

export const RESERVATIONS_ROUTES: Routes = [
  {
    path: '',
    canMatch: [commercialOuTresorierGuard],
    loadComponent: () => import('./reservations-page').then((module) => module.ReservationsPageComponent)
  }
];
