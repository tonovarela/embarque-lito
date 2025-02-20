import { HttpClient } from '@angular/common/http';
import {  inject, Injectable, signal } from '@angular/core';
import { MotivoMantenimiento } from '@app/interface/models/Catalogos';
import { environment } from '@environments/environment.development';


@Injectable({
  providedIn: 'root'
})


export class MantenimientoService {
  readonly API_URL = environment.API_URL;

  private http = inject(HttpClient);
  constructor() { }

  motivosMantenimiento = signal<MotivoMantenimiento[]>([]);
  
  public cargarMotivos() {
    this.motivosMantenimiento.set([
      { id_motivo: 1, descripcion: 'Mantenimiento' },
      { id_motivo: 2, descripcion: 'Reparación' },
      { id_motivo: 3, descripcion: 'Cambio de aceite' },
      { id_motivo: 4, descripcion: 'Cambio de llantas' },
      { id_motivo: 5, descripcion: 'Cambio de frenos' },
      { id_motivo: 6, descripcion: 'Cambio de amortiguadores' }]);
  }

  public registrar(mantenimiento: any) {
    return this.http.post(`${this.API_URL}/api/mantenimiento`, {mantenimiento});

  }

}
