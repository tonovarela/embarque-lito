import { ChangeDetectionStrategy, Component,  signal,input } from '@angular/core';

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
    isRunning  = input.required<boolean>();    
    public hours = signal<number>(0);
    public minutes= signal<number>(0);
    public seconds = signal<number>(0);
    private interval: any;
  
    ngOnInit() {            
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
          const now = new Date();
          const startTimeValue = this.startTime();
          const startTime = typeof startTimeValue === 'string' ? new Date(startTimeValue) : startTimeValue;
          const diff = now.getTime() - startTime!.getTime();
          this.hours.set(Math.floor(diff / (1000 * 60 * 60)));
          this.minutes.set(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
          this.seconds.set(Math.floor((diff % (1000 * 60)) / 1000));          
        }
      }, 1000);
    }
}
