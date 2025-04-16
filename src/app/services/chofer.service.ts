import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { Choferes } from '@app/interface/models/Catalogos';
import { environment } from '@environments/environment.development';
import { firstValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ChoferService {

  
  choferes = signal<Choferes>({ internos: [], externos: [] });
  readonly API_URL = environment.API_URL;
  http = inject(HttpClient);
  constructor() { }

  async cargar() {
    const resp = await firstValueFrom(this.http.get<Choferes>(`${this.API_URL}/api/chofer`));    
    this.choferes.set(resp);
  }


  async estaEnCurso(id_chofer: number) {
    const resp = await firstValueFrom(this.http.get<{ enCurso: boolean }>(`${this.API_URL}/api/chofer/recorrido/${id_chofer}`));
    return resp;
  }

}
