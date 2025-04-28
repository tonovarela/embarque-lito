import { ChangeDetectionStrategy, Component, signal, input, inject, computed } from '@angular/core';
import { ChoferService } from '@app/services';

@Component({
  selector: 'counter',
  standalone: true,
  imports: [],
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterComponent {
  startTime = input<Date | string>();

  isRunning = input.required<boolean>();

  public hours = signal<number>(0);
  public minutes = signal<number>(0);
  public seconds = signal<number>(0);
  private interval: any;
  private now = new Date(); // Current time in milliseconds

  choferService = inject(ChoferService);

  ngOnInit() {
    this.now = this.choferService.nowServer()!; // Current time in milliseconds      
    if (this.startTime()) {
      this.startCounter();
    }
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  private startCounter() {
    this.interval = setInterval(() => {
      if (this.isRunning()) {
        this.now.setSeconds(this.now.getSeconds() + 1); // Incrementar los segundos

        const startTimeValue = this.startTime();
        const startTime = typeof startTimeValue === 'string' ? new Date(startTimeValue) : startTimeValue;
        const diff = this.now.getTime() - startTime!.getTime();
        // Actualizar las señales de horas, minutos y segundos
        this.hours.set(Math.floor(diff / (1000 * 60 * 60)));
        this.minutes.set(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
        this.seconds.set(Math.floor((diff % (1000 * 60)) / 1000));
      }
    }, 1000);
  }



  

  formattedTime= computed(() => {
    const horas = this.hours().toString().padStart(2, '0');
    const minutos = this.minutes().toString().padStart(2, '0');
    const segundos = this.seconds().toString().padStart(2, '0');
    return `${horas}:${minutos}:${segundos}`;
  });
}
