import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Recorrido } from '@app/interface/models';
import { ResponseListadoRecorrido } from '@app/interface/responses';
import { ResponseUltimoRecorrido } from '@app/interface/responses/ResponseUltimoRecorrido';


import { environment } from '@environments/environment.development';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecorridoService {

  http = inject(HttpClient);
  readonly API_URL = environment.API_URL;

  constructor() { }

  listar(){
    return this.http.get<ResponseListadoRecorrido>(`${this.API_URL}/api/recorrido`);
  }
  ultimo(id_transporte:string){
    return this.http.get<ResponseUltimoRecorrido>(`${this.API_URL}/api/recorrido/ultimo/${id_transporte}`).pipe(      
      map(({recorrido}) =>  {        
        return recorrido==null?{recorrido: null}
              :{recorrido: {...recorrido, 
                fecha_salida: new Date(`${recorrido.fecha_salida}`), 
                fecha_regreso: new Date(`${recorrido.fecha_regreso}`)}};
      }),      
    );
  }
  registrar(recorrido:Recorrido){
    return this.http.post(`${this.API_URL}/api/recorrido`, {recorrido})

  }

}
