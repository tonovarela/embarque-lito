import { Routes } from '@angular/router';
import { SesionLayoutComponent } from '@layout/sesion-layout/sesion-layout.component';
export const routes: Routes = [
    {
        path: '', component: SesionLayoutComponent, children: [
            { path: 'recorridos', loadComponent: () => import('@app/pages/recorridos/listado/listado.component').then(m => m.ListadoComponent) },
            { path: 'recorridos/nuevo', loadComponent: () => import('@pages/recorridos/nueva/nueva.component').then(m => m.NuevaComponent) },
            { path: 'carga', loadComponent: () => import('@app/pages/carga/listado/listado.component').then(m => m.ListadoComponent) },
            { path: '', redirectTo: 'recorridos/nuevo', pathMatch: 'full' }
        ]
    },
    { path: '**', redirectTo: '', pathMatch: 'full' },
    // { path: '**', redirectTo: 'sesion' } //Se necesita el 404 component
];
