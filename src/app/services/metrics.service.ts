import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ResponseOrdenMetrics } from '@app/interface/ResponseOrdenMetrics';
import { environment } from '@environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class MetricsService {

  http =inject(HttpClient);
  readonly API_URL = environment.API_URL;
  constructor() { }
  
  buscar(patron:string){
    return this.http.post<ResponseOrdenMetrics>(`${this.API_URL}/api/orden`,{patron});
  }

}
