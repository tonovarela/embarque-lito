import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UsuarioService } from '@app/services';

export const choferGuard: CanActivateFn = (route, state) => {
  const usuarioService = inject(UsuarioService);
  return usuarioService.esChofer() && !usuarioService.soloRetornos();
};
