import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-nueva',
  standalone: true,
  imports: [],
  templateUrl: './nueva.component.html',
  styleUrl: './nueva.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export  default class NuevaComponent { }
