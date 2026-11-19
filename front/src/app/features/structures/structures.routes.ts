import { Routes } from '@angular/router';
import { niveauGuard } from '../../core/guards/auth.guard';
export const STRUCTURES_ROUTES: Routes = [{ path: '', canMatch:[niveauGuard(1)], loadComponent:()=>import('./structures-page').then(m=>m.StructuresPageComponent) }];
