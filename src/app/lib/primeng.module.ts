import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { InputNumberModule } from 'primeng/inputnumber';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,    
  ],
  exports:[AutoCompleteModule,DropdownModule,InputNumberModule,CalendarModule,DialogModule,ToastModule]
})
export class PrimeNgModule { }
