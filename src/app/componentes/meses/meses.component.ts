import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-meses',
  templateUrl: './meses.component.html',
  styleUrls: ['./meses.component.css'],
})
export class MesesComponent {
  months: string[] = [];
  currentMonthIndex: number = 0;
  @ViewChild('monthContainer') monthContainer!: ElementRef;

  constructor() {
    const locale = window.navigator.language;
    for (let i = 0; i < 12; i++) {
      const date = new Date(2000, i, 1); // Qualquer ano serve aqui
      const monthName = date.toLocaleString(locale, { month: 'long' });
      this.months.push(monthName);
    }
  }

  scrollMonths(direction: number): void {
    const container = this.monthContainer.nativeElement;
    if (direction === 1) {
      container.scrollLeft += container.offsetWidth;
      this.currentMonthIndex = Math.min(this.currentMonthIndex + 1, this.months.length - 1);
    } else {
      container.scrollLeft -= container.offsetWidth;
      this.currentMonthIndex = Math.max(this.currentMonthIndex - 1, 0);
    }
    console.log(this.months)
  }
}
