import { Routes } from '@angular/router';
import { SesionLayoutComponent } from '@layout/sesion-layout/sesion-layout.component';
export const routes: Routes = [
    {
        path: 'home', component: SesionLayoutComponent, children: [
            { path: 'sesion', loadComponent: () => import('@pages/sesion/sesion.component').then(m => m.SesionComponent) },
            { path: 'nuevo', loadComponent: () => import('@pages/nueva/nueva.component').then(m => m.NuevaComponent) },
            { path: '', redirectTo: 'sesion' , pathMatch: 'full' }
        ]
    },
    { path: '**', redirectTo: 'home', pathMatch: 'full' },
    // { path: '**', redirectTo: 'sesion' } //Se necesita el 404 component
];
