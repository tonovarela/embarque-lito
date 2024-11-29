import { Routes } from '@angular/router';
import { SesionLayoutComponent } from '@layout/sesion-layout/sesion-layout.component';
export const routes: Routes = [
    {
        path: 'sesion', component: SesionLayoutComponent, children: [
            { path: '', loadComponent:()=>import('@pages/sesion/sesion.component').then(m => m.SesionComponent) },
            { path: '**', redirectTo: '' }
        ]
    },
    { path: '', redirectTo: 'sesion', pathMatch: 'full' },
    // { path: '**', redirectTo: 'sesion' } //Se necesita el 404 component
];
