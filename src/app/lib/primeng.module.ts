import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule } from 'primeng/autocomplete';

import { ChipModule } from 'primeng/chip';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,    
  ],
  exports:[AutoCompleteModule,ChipModule]
})
export class PrimeNgModule { }
