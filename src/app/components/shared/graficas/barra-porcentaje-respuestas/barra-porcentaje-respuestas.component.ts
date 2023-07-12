import { Component, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import type { ChartOptions } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-barra-porcentaje-respuestas',
  templateUrl: './barra-porcentaje-respuestas.component.html',
  styleUrls: ['./barra-porcentaje-respuestas.component.css']
})
export class BarraPorcentajeRespuestasComponent implements AfterViewInit {
  @Input() cuantos: number[] = []; // Entrada para recibir los datos del array 'cuantos'
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit() {
    this.renderChart();
  }

  renderChart() {
    const total = this.cuantos.reduce((a, b) => a + b, 0);
    const normalizedData = this.cuantos.map(value => value*100 / total);
    console.log(this.cuantos)


    const data = {
      labels: ['valoración'],
      datasets: [
        {
          label: '1',
          data: [normalizedData[0]],
          backgroundColor: 'rgba(255, 177, 77, 0.7)',
          borderColor: 'black',
          borderWidth: 1
        },
        {
          label: '2',
          data: [normalizedData[1]],
          backgroundColor: 'rgba(255, 152, 54, 0.7)',
          borderColor: 'black',
          borderWidth: 1
        },
        {
          label: '3',
          data: [normalizedData[2]],
          backgroundColor: 'rgba(255, 126, 31, 0.7)',
          borderColor: 'black',
          borderWidth: 1
        },
        {
          label: '4',
          data: [normalizedData[3]],
          backgroundColor: 'rgba(255, 101, 9, 0.7)',
          borderColor: 'black',
          borderWidth: 1
        },
        {
          label: '5',
          data: [normalizedData[4]],
          backgroundColor: 'rgba(255, 76, 0, 0.7)',
          borderColor: 'black',
          borderWidth: 1
        }
      ]
    };

    new Chart(this.canvasRef.nativeElement, {
      type: 'bar',
      data: data,
      options: {
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: false
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: (context) => {
                const value = context.dataset.data[context.dataIndex];
                if (typeof value === 'number') {
                  if(context.dataset.label){
                    const i: number = parseInt(context.dataset.label[context.dataIndex]);
                    return i+": "+ value.toFixed(2) + '% ' +"("+this.cuantos[i-1] +")";
                  }

                }
                return '';
              }
            }
          }
        },
        responsive: true,
        indexAxis: 'y',
        scales: {
          x: {
            stacked: true,
            display: false
          },
          y: {
            stacked: true,
            display: false
          }
        },
        barThickness: 50
      } as ChartOptions<'bar'>
    });
  }
}
