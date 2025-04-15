import { ChangeDetectionStrategy, Component, Input, signal,input } from '@angular/core';

@Component({
  selector: 'counter',
  standalone: true,
  imports: [],
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterComponent { 
    @Input() startTime?: Date;
     isRunning  = input.required<boolean>();
    
    public minutes= signal<number>(0);
    public seconds = signal<number>(0);
    private interval: any;
  
    ngOnInit() {
      
      if (this.startTime) {
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
          const diff = now.getTime() - this.startTime!.getTime();
          this.minutes.set(Math.floor(diff / 60000));
          this.seconds.set(Math.floor((diff % 60000) / 1000));          
        }
      }, 1000);
    }
}
