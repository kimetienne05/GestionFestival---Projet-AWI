import { Routes } from '@angular/router';
import { niveauGuard } from '../../core/guards/auth.guard';
export const COMPTES_ROUTES: Routes = [{ path: '', canMatch:[niveauGuard(5)], loadComponent:()=>import('./comptes-page').then(m=>m.ComptesPageComponent) }];
