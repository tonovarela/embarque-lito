import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from '@app/lib/primeng.module';
import { AutocompleteComponent } from '@app/shared/autocomplete/autocomplete.component';

@Component({
  selector: 'app-nueva',
  standalone: true,
  imports: [AutocompleteComponent,PrimeNgModule, ReactiveFormsModule,],
  templateUrl: './nueva.component.html',
  styleUrl: './nueva.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export  default class NuevaComponent {


  onSelectOP(event: any) {
    console.log(event);   

 }

}
