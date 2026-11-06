import { Routes } from '@angular/router';
import { commercialOuTresorierGuard } from '../../core/guards/auth.guard';

export const FACTURATION_ROUTES: Routes = [
  {
    path: '',
    canMatch: [commercialOuTresorierGuard],
    loadComponent: () => import('./facturation-page').then((module) => module.FacturationPageComponent)
  }
];
