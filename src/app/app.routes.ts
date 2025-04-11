import { Routes } from '@angular/router';

import { SesionLayoutComponent } from '@layout/sesion-layout/sesion-layout.component';

import { authGuard } from './guards/auth/auth.guard';
import { choferGuard } from './guards/auth/chofer.guard';
import { embarquesGuard } from './guards/auth/embarques.guard';

export const routes: Routes = [
    { path: 'embarques',            
      canActivateChild: [authGuard,embarquesGuard],    
        component: SesionLayoutComponent, children: [
        {
            path: 'recorridos', children: [
                { path: '', loadComponent:()=> import('@app/pages/embarques/recorridos/listado/listado.component') },
                { path: 'nuevo', loadComponent: () => import('@app/pages/embarques/recorridos/nueva/nueva.component') },                            
                
            ]
        },
        {
            path: 'carga',children: [
                { path: '', loadComponent:()=> import('@app/pages/embarques/carga/listado/listado.component') },
                { path: 'nuevo', loadComponent:()=> import('@app/pages/embarques/carga/nuevo/nuevo.component') },                                
            ]
        },
        {
            path: 'mantenimiento',            
            children: [
                { path: '', loadComponent: () => import('./pages/embarques/mantenimiento/listado/listado.component') },
                { path: 'nuevo', loadComponent: () => import('./pages/embarques/mantenimiento/nuevo/nuevo.component') },                                
            ]
        },
        {path: '**', redirectTo: 'recorridos', pathMatch: 'full' }
    ],
     
},
{
    path: 'chofer',    
    canActivateChild: [authGuard, choferGuard],
    component: SesionLayoutComponent,    
    children: [
        { path: 'recorridos', loadComponent:()=> import('./pages/chofer/recorridos/listado/listado.component') },
        { path: 'recorridos/nuevo', loadComponent:()=> import('./pages/chofer/recorridos/nuevo/nuevo.component') },
         {path: '**', redirectTo: 'recorridos', pathMatch: 'full' }
    ]

},
//{ path: '**', redirectTo: '/', pathMatch: 'full' },    
];
