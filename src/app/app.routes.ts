import { Routes } from '@angular/router';
import { ListadoComponent  as ListadoCarga } from '@app/pages/carga/listado/listado.component';
import { ListadoComponent  as ListadoRecorrido} from './pages/recorridos/listado/listado.component';
import { NuevoComponent as NuevaCarga } from '@app/pages/carga/nuevo/nuevo.component';
import { NuevaComponent as NuevaRecorrido } from '@app/pages/recorridos/nueva/nueva.component';
import { SesionLayoutComponent } from '@layout/sesion-layout/sesion-layout.component';

export const routes: Routes = [
    {
        path: 'recorridos', component: SesionLayoutComponent, children: [
            { path: '', component:ListadoRecorrido },
            { path: 'nuevo', component:NuevaRecorrido },            
            { path: '', redirectTo: '', pathMatch: 'full' }
        ],

    },
    {
        path: 'carga', component: SesionLayoutComponent, children: [
            {path:'',component:ListadoCarga},
            {path:'nuevo',component:NuevaCarga},
            { path: '', redirectTo: '', pathMatch: 'full' }
        ]
    },
    { path: '**', redirectTo: 'recorridos', pathMatch: 'full' },
    // { path: '**', redirectTo: 'sesion' } //Se necesita el 404 component
];
