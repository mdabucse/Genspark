import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-signal',
  imports: [],
  templateUrl: './signal.html',
  styleUrl: './signal.css',
})
export class Signal {
  // Here the main concept is when we increment the value it does automatically reflect on double also if we not using the signal we cant achieve
  value = signal(0);
  double = computed(()=>this.value() * 2);
  increment(){
    this.value.set(this.value()+1);
  }

}
