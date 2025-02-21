import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { Mantenimiento } from '@app/interface/models/Mantenimiento';
import { SynfusionModule } from '@app/lib/synfusion.module';
import { MantenimientoService, UiService } from '@app/services';
import { FabbuttonComponent } from '@app/shared/fabbutton/fabbutton.component';
import { firstValueFrom } from 'rxjs';

import * as XLSX from 'xlsx';

@Component({
  standalone: true,
  imports: [SynfusionModule, FabbuttonComponent, CommonModule],
  templateUrl: './listado.component.html',
  styleUrl: './listado.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ListadoComponent extends BaseGridComponent {
  private uiService = inject(UiService);
  private _mantenimientos = signal<Mantenimiento[]>([]);
  public cargando = signal<boolean>(false);
  protected minusHeight = 0.27;

  Mantenimientos = computed(() => this._mantenimientos());
  mantenimientoService = inject(MantenimientoService);

  ngOnInit() {  
    this.autoFitColumns = true;
    this.cargarMantenimientos();
    this.iniciarResizeGrid(this.minusHeight);
  }

  cargarMantenimientos() {
    this.mantenimientoService.listar().subscribe(({ mantenimientos }) => {
      this._mantenimientos.set(mantenimientos);
    });
  }


   async descargarExcel() {
      let data: Mantenimiento[];
      const filtered = await this.grid.getFilteredRecords() as Mantenimiento[];
      if (filtered.length === 0) {
        data = this.Mantenimientos();
      } else {
        data = filtered;
      }
  
      const dataforExcel = data.map(({ ...rest }) => rest);
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataforExcel);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Recorridos');
  
      /* save to file */
      XLSX.writeFile(wb, 'Mantenimientos.xlsx');
    }




    async eliminarMantenimiento(mantenimiento: Mantenimiento) {
      
        const { id_mantenimiento } = mantenimiento    
        const { isConfirmed } = await this.uiService.mostrarAlertaConfirmacion("Mantenimiento", "¿Está seguro de eliminar este Mantenimiento?");
        if (!isConfirmed) {
          return;
        }
        try {
          await firstValueFrom(this.mantenimientoService.eliminar(id_mantenimiento!));
        } catch (_) {
          this.uiService.mostrarAlertaError("Carga", "No se pudo eliminar la carga de gasolina");
        } finally {
          this.cargarMantenimientos();
        }        
      }


}
