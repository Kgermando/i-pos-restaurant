import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-cmd-qty-input',
  templateUrl: './cmd-qty-input.component.html',
  styleUrl: './cmd-qty-input.component.scss'
})
export class CmdQtyInputComponent {
  @Input() quantity: number = 1;
  @Output() quantityChange = new EventEmitter<number>();
 
  increment() {
    this.quantity++;
    this.quantityChange.emit(this.quantity);
  }

  decrement() {
    this.quantity = Math.max(0, this.quantity - 1);
    this.quantityChange.emit(this.quantity);
  }

  onInputChange() {
    this.quantityChange.emit(this.quantity);
  }
}
