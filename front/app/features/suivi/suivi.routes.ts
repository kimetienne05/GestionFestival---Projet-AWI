import { Routes } from '@angular/router';
import { niveauGuard } from '../../core/guards/auth.guard';
export const SUIVI_ROUTES: Routes = [{ path: '', canMatch:[niveauGuard(4)], loadComponent:()=>import('./suivi-page').then(m=>m.SuiviPageComponent) }];
