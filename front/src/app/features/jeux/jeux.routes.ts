import { Routes } from '@angular/router';
import { niveauGuard } from '../../core/guards/auth.guard';
export const JEUX_ROUTES: Routes = [{ path: '', canMatch:[niveauGuard(1)], loadComponent:()=>import('./jeux-page').then(m=>m.JeuxPageComponent) }];
