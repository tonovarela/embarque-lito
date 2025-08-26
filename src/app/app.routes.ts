import { Routes } from '@angular/router';

import { SesionLayoutComponent } from '@layout/sesion-layout/sesion-layout.component';

import { authGuard } from './guards/auth/auth.guard';
import { choferGuard } from './guards/auth/chofer.guard';
import { embarquesGuard } from './guards/auth/embarques.guard';

export const routes: Routes = [
    { path: 'logistica',            
      canActivateChild: [authGuard,embarquesGuard],    
        component: SesionLayoutComponent, children: [
        {
            path: 'recorridos', 
            data: { type: 'recorridos' },
            children: [
                { path: '', loadComponent:()=> import('@app/pages/logistica/recorridos/listado/listado.component') },
                { path: 'nuevo', loadComponent: () => import('@app/pages/logistica/recorridos/nueva/nueva.component') },                            
                
            ]  
        },
        {
            path: 'retornos', children: [
                { path: '', loadComponent: () => import('@app/pages/logistica/retornos/listado/listado.component') },
                { path: 'nuevo', loadComponent: () => import('@app/pages/logistica/retornos/nueva/nueva.component') },
            ]
        },
        {
            path:'solicitudes', loadComponent: () => import('@app/pages/logistica/recorridos/listado/listado.component'),
            data:{ type: 'solicitudes' }
        },        
        {
            path: 'carga',children: [
                { path: '', loadComponent:()=> import('@app/pages/logistica/carga/listado/listado.component') },
                { path: 'nuevo', loadComponent:()=> import('@app/pages/logistica/carga/nuevo/nuevo.component') },                                
            ]
        },
        {
            path: 'mantenimiento',            
            children: [
                { path: '', loadComponent: () => import('./pages/logistica/mantenimiento/listado/listado.component') },
                { path: 'nuevo', loadComponent: () => import('./pages/logistica/mantenimiento/nuevo/nuevo.component') },                                
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
        { path: '**', redirectTo: 'recorridos', pathMatch: 'full' }
    ]

},
//{ path: '**', redirectTo: '/', pathMatch: 'full' },    
];
