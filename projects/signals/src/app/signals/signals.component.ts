import { Component, computed, signal, effect } from '@angular/core';

@Component({
  selector: 'app-signals',
  templateUrl: './signals.component.html',
  standalone: true,
})
export class SignalsComponent {
  actions = signal<string[]>([]);
  counter = signal(0);
  doubleCounter = computed(() => this.counter() * 2);

  constructor() {
    effect(() => {
      console.log('Counter:', this.counter());
    });
  }

  increment() {
    this.counter.set(this.counter() + 1);
    this.actions.update((value) => [...value, 'INCREMENT']);
  }

  decrement() {
    this.counter.set(this.counter() - 1);
    this.actions.update((value) => [...value, 'DECREMENT']);
  }
}
