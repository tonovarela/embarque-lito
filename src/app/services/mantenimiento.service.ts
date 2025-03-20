import { HttpClient } from '@angular/common/http';
import {  inject, Injectable, signal } from '@angular/core';
import { MotivoMantenimiento } from '@app/interface/models/Catalogos';
import { ResponseMantenimiento } from '@app/interface/responses/ResponseMantenimiento';
import { ResponseMotivosMantenimiento } from '@app/interface/responses/ResponseMotivoMantenimiento';
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

   this.http.get<ResponseMotivosMantenimiento>(`${this.API_URL}/api/mantenimiento/motivos`).subscribe(response=>{
      this.motivosMantenimiento.set(response.motivos);
   })
  }

  public registrar(mantenimiento: any) {
    return this.http.post(`${this.API_URL}/api/mantenimiento`, {mantenimiento});

  }

  public listar(){
    return this.http.get<ResponseMantenimiento>(`${this.API_URL}/api/mantenimiento`);
  }

  public eliminar(id: number) {
    return this.http.delete(`${this.API_URL}/api/mantenimiento/${id}`);
  }   

  public editarFecha(id_mantenimiento: number, fecha_fin: string) {
    return this.http.put(`${this.API_URL}/api/mantenimiento/${id_mantenimiento}`, {fecha_fin});
  }




}
