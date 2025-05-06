import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { SynfusionModule } from '@app/lib/synfusion.module';
import { FormsModule } from '@angular/forms';
import { PrimeNgModule } from '@app/lib/primeng.module';


import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { getMapboxImageUrl } from '@app/helpers/getImagePosition';
import { NumberFormatter, obtenerValorNumerico } from '@app/helpers/validators';
import {  Recorrido } from '@app/interface/models';
import { Firma } from '@app/interface/responses';



import { RecorridoService } from '@app/services/recorrido.service';
import { UiService } from '@app/services/ui.service';
import { FabbuttonComponent } from '@app/shared/fabbutton/fabbutton.component';
import { GpsPositionSvgComponent } from '@app/shared/svg';
import { EditService } from '@syncfusion/ej2-angular-grids';
import { firstValueFrom } from 'rxjs';
import * as XLSX from 'xlsx';
import { environment } from '@environments/environment.development';


type ubicacionRecorrido  ={
  inicial:string | null,
  final:string | null
}

@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [SynfusionModule, FabbuttonComponent, CommonModule, PrimeNgModule, FormsModule, GpsPositionSvgComponent],
  providers: [EditService],
  templateUrl: './listado.component.html',
  styleUrl: './listado.component.css'
})
export default class ListadoComponent extends BaseGridComponent implements OnInit {
  private _recorridos = signal<Recorrido[]>([]);
  private recorridoService = inject(RecorridoService);
  public recorridoActivo: Recorrido | null = null;

  ubicacionesRecorrido: ubicacionRecorrido = {inicial:null, final:null};

  public cargando = signal<boolean>(false);
  public cargandoUbicaciones = signal<boolean>(false);  
  public firma:Firma | null = null;

  public visibleEditarInfo = signal<boolean>(false);
  public visibleUbicaciones = signal<boolean>(false);

  private uiService = inject(UiService);
  protected minusHeight = 0.27;



  detalleRecorridoVisible: boolean = false;
  recorridoSeleccionado: any | null = null;

  Recorridos = computed(() => this._recorridos());


  cargarInformacion() {
    this.cargando.set(true);
    this.recorridoService.listar().subscribe(({ recorridos }) => {
      this._recorridos.set(recorridos);
      this.cargando.set(false);
    });
  }

  ngOnInit(): void {
    //this.autoFitColumns = true;
    this.iniciarResizeGrid(this.minusHeight);
    this.cargarInformacion();
  }
  
  
  constructor() {
    super();
  }

  

  showEditDialog(recorrido: Recorrido) {
    this.recorridoActivo = recorrido;
    const { importe_factura } = this.recorridoActivo
    this.recorridoActivo = { ...this.recorridoActivo, importe_factura: importe_factura == 0 ? 0 : importe_factura }
    this.visibleEditarInfo.set(true);
  }




  async save() {
     await firstValueFrom(this.recorridoService.actualizarFactura(this.recorridoActivo!))
    this._recorridos.set(this._recorridos().map((r) => {
      if (r.id_recorrido === this.recorridoActivo!.id_recorrido) {
        this.recorridoActivo!.importe_factura = obtenerValorNumerico(`${this.recorridoActivo?.importe_factura!}`);
        return this.recorridoActivo!

      }
      return r;
    }));
    this.recorridoActivo = null;
    this.visibleEditarInfo.set(false);
  }


  visibleChange(e: boolean) {
    this.hideEditDialog();
  }

  hideEditDialog() {
    if (this.visibleEditarInfo()) {
      this.visibleEditarInfo.set(false);
      this.recorridoActivo = null;
    }
  }

  ubicacionDialogChange(e: boolean) {
    this.hideUbicacionesDialog();
  }

  hideUbicacionesDialog() {
    if (this.visibleUbicaciones()) {
      this.visibleUbicaciones.set(false);
      this.ubicacionesRecorrido = { inicial: null, final: null };
      this.firma = null;
    }
  }


  onValidateNumber(event: KeyboardEvent) {
    const charCode = event.charCode;
    const charStr = String.fromCharCode(charCode);
    if (!charStr.match(/^[0-9.]$/)) {
      event.preventDefault();
    }
  }


  onInput(event: any, prefix: string) {
    const target = event.target as HTMLInputElement;
    let value = target.value;
    const newValue = new NumberFormatter(value, prefix).getFormat(2);
    target.value = newValue;
  }


  async descargarExcel() {
    let data: Recorrido[];
    const filtered = await this.grid.getFilteredRecords() as Recorrido[];
    if (filtered.length === 0) {
      data = this.Recorridos();
    } else {
      data = filtered;
    }

    const dataforExcel = data.map(({ id_previo, ...rest }) => rest);
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataforExcel);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Recorridos');

    /* save to file */
    XLSX.writeFile(wb, 'Recorridos.xlsx');
  }

  async eliminarRecorrido(recorrido: Recorrido) {

    const { isConfirmed } = await this.uiService.mostrarAlertaConfirmacion("Recorridos", "¿Está seguro de eliminar el recorrido?", "Si,eliminarlo", "Cancelar");
    if (!isConfirmed) {
      return;
    }
    const { id_recorrido } = recorrido;
    this._recorridos.set([]);
    try {
      await firstValueFrom(this.recorridoService.eliminar(id_recorrido!));
    } catch (exception: any) {
      const mensaje = exception["error"]["mensaje"] || "Error al eliminar el recorrido";
      this.uiService.mostrarAlertaError("Recorridos", mensaje);
    } finally {
      this.cargarInformacion();
    }
  }
  async mostrarUbicaciones(recorrido: Recorrido) {
    const { id_recorrido } = recorrido;

    try {
      this.cargandoUbicaciones.set(true);
      this.visibleUbicaciones.set(true);
      const { ubicaciones,firma } = await firstValueFrom(this.recorridoService.obtenerUbicacion(id_recorrido!));      
      this.firma = firma || null;
      const inicial = ubicaciones.find((u) => u.type === "Inicio");
      const final = ubicaciones.find((u) => u.type === "Fin");      
      this.ubicacionesRecorrido.inicial = inicial ? getMapboxImageUrl(inicial.longitude,inicial.latitude,): null;
      this.ubicacionesRecorrido.final = final ? getMapboxImageUrl(final.longitude,final.latitude): null;      
    } catch (_) {
      this.uiService.mostrarAlertaError("Recorridos", "Error al obtener las ubicaciones");
    }
    finally{
      this.cargandoUbicaciones.set(false);
    }
  }


  irUbicacionGooleMaps(ubicacion: string) {    
    try {
      // Extraer las coordenadas de la URL
      const coordenadas = ubicacion.split("/").slice(-2)[0].split(",");
      const latitude = parseFloat(coordenadas[1]);
      const longitude = parseFloat(coordenadas[0]);
  
      // Validar que las coordenadas sean números válidos
      if (!isNaN(latitude) && !isNaN(longitude)) {
        const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        window.open(googleMapsUrl, "_blank");
      } else {
        throw new Error("Coordenadas inválidas");
      }
    } catch (error) {
      this.uiService.mostrarAlertaError("Error", "No se pudieron obtener las coordenadas correctamente");
    }
  }
  

  mostrarDetalleRecorrido(recorrido: any) {
    this.recorridoSeleccionado = recorrido;
    this.recorridoSeleccionado.fotoChofer= `${!environment.production?'https://servicios.litoprocess.com':''}/colaboradores/api/foto/${recorrido.personalChofer==0?'XXX':recorrido.personalChofer}`;
    this.detalleRecorridoVisible = true;
  }

  cerrarDetalleRecorrido() {
    this.detalleRecorridoVisible = false;
    this.recorridoSeleccionado = null;
  }


}
