import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { StatusSesion, StatutLogin } from '@app/interface/models';
import { LoginResponse } from '@app/interface/responses/LoginResponse';
import { environment } from '@environments/environment.development';
import { delay, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly URL=`${environment.API_URL}/api`;
  private http = inject(HttpClient);
  private _statusSesion= signal<StatusSesion>(
     {  
      usuario: undefined,
      estatus: StatutLogin.LOGOUT
     }
  );
   
  StatusSesion = computed(() => {
    return this._statusSesion();
  });

  esChofer = computed(() => {
    const usuario = this._statusSesion().usuario;
    if (usuario) {
      return  !(usuario.puesto?.trim().toLowerCase() === 'chofer');
    }
    return false;
  });
  
  private async login(username: string, password: string) {
    this._statusSesion.set({ usuario: undefined, estatus: StatutLogin.LOADING });
    try {
      const resp =await firstValueFrom(this.http.post<LoginResponse>(`${this.URL}/auth/login`, { login:{username, password} }).pipe(delay(2000)));
      this._statusSesion.set({ usuario: resp.usuario, estatus: StatutLogin.LOGIN });      
    } catch (error) {
      this._statusSesion.set({ usuario: undefined, estatus: StatutLogin.ERROR });
    }    
  }


  public async verificarSesionLitoapps() {
    let user = localStorage.getItem("User") ;
    let password = localStorage.getItem("Pass");  
    if (!environment.production){
      const  {username,password:passwordDev} = environment.userDev;
      user = username;
      password = passwordDev;
    }
    if (!(user != null && password != null) ) {      
      this._statusSesion.set({ usuario: undefined, estatus: StatutLogin.ERROR });
      
      return;
    } 
    await  this.login(user, password);
  }


  logout() {  
    this._statusSesion.set({ usuario: undefined, estatus: StatutLogin.LOGOUT });
  }


}
