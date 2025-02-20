import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { SynfusionModule } from '@app/lib/synfusion.module';
import { FabbuttonComponent } from '@app/shared/fabbutton/fabbutton.component';

@Component({  
  standalone: true,
    imports: [SynfusionModule, FabbuttonComponent, CommonModule],
  templateUrl: './listado.component.html',
  styleUrl: './listado.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ListadoComponent extends BaseGridComponent {
 private _mantenimientos = signal<[]>([]);
  public cargando = signal<boolean>(false);
  ngOnInit() {
   
  }
    Mantenimientos = computed(() => this._mantenimientos());
 }
