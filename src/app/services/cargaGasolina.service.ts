import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CargaGasolina } from '@app/interface/models';
import { ResponseListadoCargasGasolina } from '@app/interface/responses';
import { ResponseUltimaCarga } from '@app/interface/responses/ResponseUltimaCarga';
import { environment } from '@environments/environment.development';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CargaGasolinaService {
  http = inject(HttpClient);
  readonly API_URL = environment.API_URL;
  constructor() { }

  // Método para cargar gasolina
  listar() {
    return this.http.get<ResponseListadoCargasGasolina>(`${this.API_URL}/api/carga`);
  }

  registrar(carga: CargaGasolina) {
    return this.http.post(`${this.API_URL}/api/carga`, { carga });
  }

  ultimo(id_transporte: string) {
    return this.http.get<ResponseUltimaCarga>(`${this.API_URL}/api/carga/ultimo/${id_transporte}`).pipe(
      map(({ carga }) => 
         carga == null ? { carga: null } 
                       :{carga: { ...carga, fecha: new Date(`${carga.fecha_carga}`) } } 
      ));

  }







}
