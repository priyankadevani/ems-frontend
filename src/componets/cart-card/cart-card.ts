import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, effect, ElementRef, inject, input, signal, ViewChild, viewChild } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';
//import '../models/dashboard.model';

@Component({
  selector: 'app-cart-card',
  imports: [CommonModule],
  templateUrl: './cart-card.html',
  styleUrl: './cart-card.css',
})
export class CartCard {


  chartData = input.required<any[]>();
  chartType = input.required<ChartType>();
  chartLabel = input.required<string>();
  charttitle = input.required<string>();

  // @ViewChild('chartCanvas')
  // chartCanvas!: ElementRef<HTMLCanvasElement>;
  chartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('chartCanvas');


  chart!: Chart;


  constructor() {
    effect(() => {
      const canvas = this.chartCanvas();
      const data = this.chartData();
      if (!canvas || !data.length) {
        return;
      }
      this.createChart(data)

    })
  }

  createChart(data: any[]) {
    const labels = data.map(item => item._id);
    const values = data.map(item => item.count);

    if (this.chart) {
      this.chart.destroy();
    }

    const options: any = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    };

    if (this.chartType() === 'bar') {
      options.scales = {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            precision: 0
          }
        }
      };
    }

    this.chart = new Chart(
      this.chartCanvas()!.nativeElement,
      {
        type: this.chartType(),
        data: {
          labels,
          datasets: [{
            label: this.chartLabel(),
            data: values,
            backgroundColor: [
              '#4F46E5',
              '#10B981',
              '#F59E0B',
              '#EF4444',
              '#06B6D4',
              '#8B5CF6'
            ]
          }]
        },
        options: options
      }

    )


  }
}
// export class CartCard implements AfterViewInit {

//   chartData = input.required<DepartmentChart[]>();
//   viewReady = signal(false);

//   @ViewChild('chartCanvas')
//   chartCanvas!: ElementRef<HTMLCanvasElement>;

//   chart!: Chart;
//   ngAfterViewInit(): void {
//     this.viewReady.set(true);
//   }

//   constructor() {
//     effect(() => {
//       if (!this.viewReady()) {
//         return;
//       }
//       const data = this.chartData();
//       if (!data.length) {
//         return;
//       }
//       this.createChart(data)

//     })
//   }

//   createChart(data: DepartmentChart[]) {
//     const labels = data.map(item => item._id);
//     const values = data.map(item => item.count);

//     if (this.chart) {
//       this.chart.destroy();
//     }

//     this.chart = new Chart(
//       this.chartCanvas.nativeElement,
//       {
//         type: 'doughnut',
//         data: {
//           labels,
//           datasets: [{
//             label: 'Employees',
//             data: values,
//             backgroundColor: [
//               '#4F46E5',
//               '#10B981',
//               '#F59E0B',
//               '#EF4444',
//               '#06B6D4',
//               '#8B5CF6'
//             ]
//           }]
//         },
//         options: {
//           responsive: true,
//           plugins: {
//             legend: {
//               position: 'bottom'
//             }
//           }
//         }
//       }

//     )


//   }

// }
