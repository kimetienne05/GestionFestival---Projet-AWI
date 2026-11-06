import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Festival } from '../../../core/models/festival.types';

@Component({
  selector: 'app-carte-festival',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './carte-festival.html',
  styleUrl: './carte-festival.scss'
})
export class CarteFestivalComponent {
  readonly festival = input.required<Festival>();
}