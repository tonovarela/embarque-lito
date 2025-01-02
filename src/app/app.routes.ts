import { Routes } from '@angular/router';
import { SesionLayoutComponent } from '@layout/sesion-layout/sesion-layout.component';
export const routes: Routes = [
    {
        path: 'recorridos', component: SesionLayoutComponent, children: [
            { path: '', loadComponent: () => import('@app/pages/recorridos/listado/listado.component').then(m => m.ListadoComponent) },
            { path: 'nuevo', loadComponent: () => import('@pages/recorridos/nueva/nueva.component').then(m => m.NuevaComponent) },            
            { path: '', redirectTo: '', pathMatch: 'full' }
        ],

    },
    {
        path: 'carga', component: SesionLayoutComponent, children: [
            {path:'',loadComponent:()=>import('@app/pages/carga/listado/listado.component').then(m=>m.ListadoComponent)},
            {path:'nuevo',loadComponent:()=>import('@app/pages/carga/nuevo/nuevo.component').then(m=>m.NuevoComponent)},
            { path: '', redirectTo: '', pathMatch: 'full' }
        ]
    },
    { path: '**', redirectTo: 'recorridos', pathMatch: 'full' },
    // { path: '**', redirectTo: 'sesion' } //Se necesita el 404 component
];
