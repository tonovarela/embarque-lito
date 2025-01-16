import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { Transportes } from '@app/interface/models/Catalogos';
import { environment } from '@environments/environment.development';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransporteService {

  readonly API_URL = environment.API_URL;
  http = inject(HttpClient);    
  transportes = signal<Transportes>({ internos: [], externos: [],tipoServicios:[] });

  
  constructor() { }
  async cargar(){
    const resp =await firstValueFrom(this.http.get<Transportes>(`${this.API_URL}/api/transporte`));
    this.transportes.set(resp);
  }
}
