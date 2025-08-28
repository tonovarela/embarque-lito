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
import { ArchivoRetorno } from '@app/interface/responses/ResponseListadoAdjuntos';

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
       const resp = await firstValueFrom(this.retornoService.obtenerArchivos(idRetorno));
       console.log('Archivos obtenidos:', resp);
      // Datos simulados para ejemplo
            
      this.archivosRetorno.set(resp.archivos );
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
    console.log('Descargando archivo:', archivo.nombre);
    
    // Verificar si tiene archivo en base64
    if (!archivo.archivo) {
      console.error('No hay datos del archivo para descargar');
      return;
    }

    // Crear el blob desde base64
    const byteCharacters = atob(archivo.archivo);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: archivo.tipo || 'application/octet-stream' });

    // Crear URL temporal y descargar
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = archivo.nombre;
    document.body.appendChild(link);
    link.click();
    
    // Limpiar
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Error al descargar archivo:', error);
  }
  }

  /**
   * Abre vista previa de imagen
   */
  previsualizarArchivo(archivo: ArchivoRetorno) {
     if (this.esImagen(archivo.nombre)) {
    try {
      console.log('Previsualizando imagen:', archivo.nombre);
      
      if (!archivo.archivo) {
        console.error('No hay datos del archivo para previsualizar');
        return;
      }

      // Crear data URL desde base64
      const dataUrl = `data:${archivo.tipo || 'image/jpeg'};base64,${archivo.archivo}`;
      
      // Abrir en nueva ventana
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>${archivo.nombre}</title>
              <style>
                body { 
                  margin: 0; 
                  padding: 20px; 
                  background-color: #f5f5f5; 
                  display: flex; 
                  justify-content: center; 
                  align-items: center; 
                  min-height: 100vh; 
                }
                img { 
                  max-width: 100%; 
                  max-height: 100vh; 
                  object-fit: contain; 
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
              </style>
            </head>
            <body>
              <img src="${dataUrl}" alt="${archivo.nombre}" />
            </body>
          </html>
        `);
        newWindow.document.close();
      }
    } catch (error) {
      console.error('Error al previsualizar archivo:', error);
    }
  }
  }

  /**
 * Convierte base64 a Blob
 */
private base64ToBlob(base64: string, mimeType: string): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
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
// interface ArchivoRetorno {
//   id_adjunto: number;
//   nombre: string;  
//   tipo: string;  
//   url: string;
// }
