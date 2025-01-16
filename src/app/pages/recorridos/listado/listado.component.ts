import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { Recorrido } from '@app/interface/models';
import { SynfusionModule } from '@app/lib/synfusion.module';
import { DataService } from '@app/services/data.service';
import { RecorridoService } from '@app/services/recorrido.service';
import { FabbuttonComponent } from '@app/shared/fabbutton/fabbutton.component';


@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [SynfusionModule, FabbuttonComponent, CommonModule],
  templateUrl: './listado.component.html',
  styleUrl: './listado.component.css'
})
export class ListadoComponent extends BaseGridComponent implements OnInit {



  public dataService = inject(DataService);

  private _recorridos = signal<Recorrido[]>([]);
  recorridoService = inject(RecorridoService);
  ngOnInit(): void {
    this.autoFitColumns = true;
    this.iniciarResizeGrid(this.minusHeight);
    this.recorridoService.listar().subscribe(({ recorridos }) => {
      this._recorridos.set(recorridos);
    });
  }
  Recorridos = computed(() => this._recorridos());
  protected minusHeight = 0;
  constructor() {
    super();
  }
}
