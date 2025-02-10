import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { CargaGasolina } from '@app/interface/models';
import { SynfusionModule } from '@app/lib/synfusion.module';
import { CargaGasolinaService } from '@app/services/cargaGasolina.service';
import { FabbuttonComponent } from '@app/shared/fabbutton/fabbutton.component';
import * as XLSX from 'xlsx';
@Component({  
  standalone: true,
  imports: [SynfusionModule,FabbuttonComponent,CommonModule],
  
  templateUrl: './listado.component.html',
  styleUrl: './listado.component.css'
})
export class ListadoComponent extends BaseGridComponent implements OnInit {


private cargaGasolinaService = inject(CargaGasolinaService);

private _cargas = signal<CargaGasolina[]>([]);  
  ngOnInit(): void {
    this.autoFitColumns = false;    
    this.cargaGasolinaService.listar().subscribe(response => this._cargas.set(response.cargas))
    
    
    this.iniciarResizeGrid(this.minusHeight);

    
  }
  cargasGasolina= computed(()=>this._cargas());
  protected minusHeight = 0.27;
  constructor() {
    super();
  }


  async descargarExcel() {
      let data: CargaGasolina[];
      const filtered = await this.grid.getFilteredRecords() as CargaGasolina[];
      if (filtered.length === 0) {
        data = this.cargasGasolina();
      } else {
        data = filtered;
      }
  
      const dataforExcel = data.map(({id_previo,...rest}) => rest );
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataforExcel);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'CargoGasolina');
  
      /* save to file */
      XLSX.writeFile(wb, 'CargasGasolina.xlsx');
    }
  
}
