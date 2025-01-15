import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RecorridoService {

  http = inject(HttpClient);
  readonly API_URL = environment.API_URL;

  constructor() { }

}
