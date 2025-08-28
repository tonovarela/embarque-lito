import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { SynfusionModule } from '@app/lib/synfusion.module';
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { ResponseRetornos, Retorno } from '@app/interface/responses';
import { RetornoService } from '@app/services/retorno.service';
import { FabbuttonComponent } from '@app/shared/fabbutton/fabbutton.component';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listado',
  standalone: true,
  
  imports:[SynfusionModule,FabbuttonComponent,CommonModule],
  templateUrl: './listado.component.html',
  styleUrl: './listado.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ListadoComponent   extends BaseGridComponent implements OnInit
{
  private _retornos = signal<Retorno[]>([]);
  public  retornos = computed(() => this._retornos().map((r) => ({ ...r,tipoRetorno:r.tipo=='R'?'Rechazo':'Devolución' })));
  retornoService = inject(RetornoService);

  // Estados del modal
  mostrarModal = signal(false);
  retornoSeleccionado = signal<any>(null);
  archivosRetorno = signal<ArchivoRetorno[]>([]);
  cargandoArchivos = signal(false);

  cargando = signal(false);

  ngOnInit(): void {
    this.autoFitColumns = false;
    this.iniciarResizeGrid(0.27);    
    this.cargarInformacion();
  }

  async cargarInformacion() {
    this.cargando.set(true);
    try {
      const resp = await firstValueFrom<ResponseRetornos>(
        this.retornoService.listar()
      );
      this._retornos.set(resp.retornos);
    } catch (error) {
      console.error(error);
    } finally {
      this.cargando.set(false);
    }
  }

  /**
   * Abre el modal para mostrar los archivos de un retorno
   */
  async verArchivos(retorno: any) {
    this.retornoSeleccionado.set(retorno);
    this.mostrarModal.set(true);
    await this.cargarArchivosRetorno(retorno.id_retorno);
  }

  /**
   * Cierra el modal y limpia los datos
   */
  cerrarModal() {
    this.mostrarModal.set(false);
    this.retornoSeleccionado.set(null);
    this.archivosRetorno.set([]);
  }

  /**
   * Carga los archivos asociados a un retorno específico
   */
  async cargarArchivosRetorno(idRetorno: number) {
    this.cargandoArchivos.set(true);
    try {
      // TODO: Implementar el servicio para obtener archivos del retorno
      // const archivos = await this.retornoService.obtenerArchivos(idRetorno);
      
      // Datos simulados para ejemplo
      const archivosMock: ArchivoRetorno[] = [
        {
          id: 1,
          nombre: 'evidencia_defecto.jpg',
          tamano: 2048576, // 2MB
          tipo: 'image/jpeg',
          fecha_subida: new Date('2024-08-15T10:30:00'),
          url: '/api/archivos/evidencia_defecto.jpg'
        },
        {
          id: 2,
          nombre: 'reporte_calidad.pdf',
          tamano: 1536000, // 1.5MB
          tipo: 'application/pdf',
          fecha_subida: new Date('2024-08-15T11:15:00'),
          url: '/api/archivos/reporte_calidad.pdf'
        },
        {
          id: 3,
          nombre: 'formulario_retorno.docx',
          tamano: 512000, // 512KB
          tipo: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          fecha_subida: new Date('2024-08-15T14:20:00'),
          url: '/api/archivos/formulario_retorno.docx'
        }
      ];
      
      this.archivosRetorno.set(archivosMock);
    } catch (error) {
      console.error('Error al cargar archivos:', error);
      this.archivosRetorno.set([]);
    } finally {
      this.cargandoArchivos.set(false);
    }
  }

  /**
   * Descarga un archivo específico
   */
  async descargarArchivo(archivo: ArchivoRetorno) {
    try {
      // TODO: Implementar descarga real
      console.log('Descargando archivo:', archivo.nombre);
      
      // Simular descarga
      const link = document.createElement('a');
      link.href = archivo.url;
      link.download = archivo.nombre;
      link.click();
    } catch (error) {
      console.error('Error al descargar archivo:', error);
    }
  }

  /**
   * Abre vista previa de imagen
   */
  previsualizarArchivo(archivo: ArchivoRetorno) {
    if (this.esImagen(archivo.nombre)) {
      // TODO: Implementar modal de vista previa de imagen
      console.log('Previsualizando imagen:', archivo.nombre);
      window.open(archivo.url, '_blank');
    }
  }

  /**
   * Verifica si un archivo es una imagen
   */
  esImagen(nombreArchivo: string): boolean {
    const extensionesImagen = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    return extensionesImagen.some(ext => 
      nombreArchivo.toLowerCase().endsWith(ext)
    );
  }

  /**
   * Verifica si un archivo es PDF
   */
  esPDF(nombreArchivo: string): boolean {
    return nombreArchivo.toLowerCase().endsWith('.pdf');
  }

  /**
   * Formatea el tamaño del archivo en formato legible
   */
  formatearTamano(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Interface para los archivos del retorno
interface ArchivoRetorno {
  id: number;
  nombre: string;
  tamano: number;
  tipo: string;
  fecha_subida: Date;
  url: string;
}
