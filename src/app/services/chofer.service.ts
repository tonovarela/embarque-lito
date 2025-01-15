import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { Choferes } from '@app/interface/Catalogos';
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

}
