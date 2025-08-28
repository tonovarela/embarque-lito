import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ResponseMotivoRetorno } from '@app/interface/responses';
import { environment } from '@environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RetornoService {
 readonly API_URL = environment.API_URL;
 httpClient = inject(HttpClient); 

  constructor() { }


  public listarMotivos(){
    return this.httpClient.get<ResponseMotivoRetorno>(`${this.API_URL}/api/retorno/motivos`);
  }
  public registrar(registro:FormData){
    return this.httpClient.post(`${this.API_URL}/api/retorno`, registro);
  }
}
  