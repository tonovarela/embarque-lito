import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { CargaGasolina } from '@app/interface/models';
import { SynfusionModule } from '@app/lib/synfusion.module';
import { CargaGasolinaService } from '@app/services/cargaGasolina.service';
import { FabbuttonComponent } from '@app/shared/fabbutton/fabbutton.component';
import * as XLSX from 'xlsx';
import { firstValueFrom, tap } from 'rxjs';
import { UiService } from '../../../services/ui.service';
@Component({
  standalone: true,
  imports: [SynfusionModule, FabbuttonComponent, CommonModule],

  templateUrl: './listado.component.html',
  styleUrl: './listado.component.css'
})
export class ListadoComponent extends BaseGridComponent implements OnInit {


  private cargaGasolinaService = inject(CargaGasolinaService);
  private uiService = inject(UiService);

  private _cargas = signal<CargaGasolina[]>([]);
  public cargando = signal<boolean>(true);


  ngOnInit(): void {
    this.autoFitColumns = true;
    this.cargarInformacion();
    this.iniciarResizeGrid(this.minusHeight);
  }

  cargarInformacion() {
    this.cargando.set(true);
    this.cargaGasolinaService.listar().pipe(
      tap(() => this.cargando.set(false))
    ).subscribe(response => this._cargas.set(response.cargas))
  }
  cargasGasolina = computed(() => this._cargas());
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

    const dataforExcel = data.map(({ id_previo, ...rest }) => rest);
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataforExcel);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'CargoGasolina');

    /* save to file */
    XLSX.writeFile(wb, 'CargasGasolina.xlsx');
  }


  async eliminarCarga(cargaGasolina: CargaGasolina) {
    const { id_carga_gasolina } = cargaGasolina

    const { isConfirmed } = await this.uiService.mostrarAlertaConfirmacion("Carga", "¿Está seguro de eliminar la carga de gasolina?");
    if (!isConfirmed) {
      return;
    }
    try {
      await firstValueFrom(this.cargaGasolinaService.eliminar(id_carga_gasolina!));
    } catch (_) {
      this.uiService.mostrarAlertaError("Carga", "No se pudo eliminar la carga de gasolina");
    } finally {
      this.cargarInformacion();
    }
    
  }

}
