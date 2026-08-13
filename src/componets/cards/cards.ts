import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-cards',
  imports: [CommonModule],
  templateUrl: './cards.html',
  styleUrl: './cards.css',
})
export class Cards {
  title = input.required<string>();
  value = input.required<number>();
  icon = input.required<string>();
  color = input('primary');
}
