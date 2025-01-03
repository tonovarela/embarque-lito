import { Component, OnInit } from '@angular/core';
import { Transportes } from '@app/data';
import { Transporte } from '@app/interface';
import { GaugeComponent, MinusComponent, PlusComponent } from '@app/shared/svg';
import { CalendarComponent } from '@app/shared/svg/calendar/calendar.component';


@Component({
  selector: 'app-nuevo',
  standalone: true,
  imports: [CalendarComponent, PlusComponent, MinusComponent, GaugeComponent],
  templateUrl: './nuevo.component.html',
  styleUrl: './nuevo.component.css'
})
export class NuevoComponent implements OnInit {
  constructor() { }
  transportes: Transporte[] = [];

  ngOnInit() {
    this.transportes = Transportes;    
  }
  public onValidateNumber(event: KeyboardEvent) {
    const charCode = event.charCode;
    const charStr = String.fromCharCode(charCode);
    if (!charStr.match(/^[0-9.]$/)) {
      event.preventDefault();
    }
  }
  public onInput(event: any, prefijo:string) {
    const target = event.target as HTMLInputElement;
    const regex = new RegExp(`\\${prefijo}`, 'g');
    let value = target.value.replace(/\,/g, '').replace(regex, '');
    //Valida que solo se ingrese un punto
    const pointCount = (value.match(/\./g) || []).length;
    if (pointCount > 1) {
      target.value = this.formatNumber(value.slice(0, value.length - 1), prefijo);
      return;
    }
    //    Valida que solo sean 3 decimales
    const parts = value.split('.');
    if (parts.length > 1 && parts[1].length > 3) {
      target.value = this.formatNumber(value.slice(0, -1), prefijo);
      return;
    }
    target.value = this.formatNumber(value, prefijo);

  }
  private formatNumber(numero: string, prefijo:string): string {
    const parts = numero.split('.');
    parts[0] = parts[0].replace(/^0+(?!$)/, ''); //Elimina ceros a la izquierda
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");//Agrega comas        
    const value = parts.join('.');
    return value != "" ? `${prefijo}${value}` : '';
  }

}
