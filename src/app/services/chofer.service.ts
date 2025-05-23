import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { Choferes } from '@app/interface/models/Catalogos';
import { ResponseRecorridoActivo } from '@app/interface/responses';
import { environment } from '@environments/environment.development';
import { firstValueFrom, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ChoferService {

  public nowServer= signal<Date| null>(null);
  
  choferes = signal<Choferes>({ internos: [], externos: [] });
  readonly API_URL = environment.API_URL;
  http = inject(HttpClient);
  constructor() { }

  async cargar() {
    const resp = await firstValueFrom(this.http.get<Choferes>(`${this.API_URL}/api/chofer`));    
    this.choferes.set(resp);
  }


  async estaEnCurso(id_chofer: string) {
    const resp = await firstValueFrom(this.http.get<ResponseRecorridoActivo>(`${this.API_URL}/api/chofer/recorrido/${id_chofer}`).pipe(
      tap((resp) => {
        console.log('recorrido activo', resp);
        this.nowServer.set(new Date(resp.horaActual!));        
      })
    ));
    return resp;
  }

  

}
