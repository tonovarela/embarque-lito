import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FabbuttonComponent } from '@app/shared/fabbutton/fabbutton.component';

@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [FabbuttonComponent],
  templateUrl: './listado.component.html',
  styleUrl: './listado.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ListadoComponent { }
