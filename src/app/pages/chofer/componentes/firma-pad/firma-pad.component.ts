import {  Component, EventEmitter, Output } from '@angular/core';
import SignaturePad from 'signature_pad';
@Component({
  selector: 'firma-pad',
  standalone: true,
  imports: [],
  templateUrl: './firma-pad.component.html',
  styleUrl: './firma-pad.component.css',
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FirmaPadComponent {

  @Output("onGuardarFirma") _onGuardarFirm = new EventEmitter<string>();
  @Output("onCancelar") _onCancelar = new EventEmitter<void>();
  signaturePad: SignaturePad | undefined;

  ngOnInit(): void {
    const canvas = document.querySelector("canvas")!;
      const parentWidth = document.getElementById("contenedorFirma")!;
      canvas.setAttribute("width", parentWidth.clientWidth.toString());
      canvas.setAttribute("height", (parentWidth.clientHeight + 150).toString());
      this.signaturePad = new SignaturePad(canvas!);
   }
  ngAfterViewInit() {
    
      
    

  }
  startDrawing(event: Event) {
    // works in device not in browser	
  }

  moved(event: Event) {
    // works in device not in browser
  }

  limpiarPad() {
    this.signaturePad!.clear();
  }

  get tieneFirma() {
    if (this.signaturePad == undefined) {
      return false;
    }
    return !this.signaturePad.isEmpty();
  }

  guardarPad() {
    const base64Data = this.signaturePad!.toDataURL();
    this.limpiarPad();
    this._onGuardarFirm.emit(base64Data);
  }

  cancelarFirma() {
    this.limpiarPad();
    this._onCancelar.emit();
  }


}
