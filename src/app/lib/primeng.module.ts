import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule } from 'primeng/autocomplete';

import { SpeedDialModule } from 'primeng/speeddial';



import { ChipModule } from 'primeng/chip';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,    
  ],
  exports:[AutoCompleteModule,ChipModule,SpeedDialModule]
})
export class PrimeNgModule { }
