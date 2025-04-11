import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nuevo',
  standalone: true,
  imports: [],
  templateUrl: './nuevo.component.html',
  styleUrl: './nuevo.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NuevoComponent {

  private router = inject(Router);
  private guardandoRecorrido = signal<boolean>(false);


  regresar() {
    if (this.guardandoRecorrido()) {
      return;
    }
    this.router.navigate(['/chofer/recorridos'])
  }

}
