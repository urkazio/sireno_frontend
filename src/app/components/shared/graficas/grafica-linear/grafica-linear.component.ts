import { Component, AfterViewInit, Input, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import type { ChartOptions } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-grafica-linear',
  templateUrl: './grafica-linear.component.html',
  styleUrls: ['./grafica-linear.component.css']
})
export class GraficaLinearComponent implements AfterViewInit {
  @Input() cuantos: number[] = []; // Entrada para recibir los datos del array 'cuantos'
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() parametros: any;
  cod_pregunta: String = "";
  cod_situacion_docente: String = ""; 
  texto_pregunta: String = ""; 


  ngAfterViewInit() {
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['parametros'] && changes['parametros'].currentValue) {
      const newParametros = changes['parametros'].currentValue;
      this.parametros = newParametros;
      this.cod_pregunta = this.parametros["cod_pregunta"];
      this.cod_situacion_docente = this.parametros["cod_situacion_docente"];
      this.texto_pregunta = this.parametros["texto_pregunta"];
    }
  }

  renderChart() {
    const total = this.cuantos.reduce((a, b) => a + b, 0);
    const normalizedData = this.cuantos.map(value => value*100 / total);

    const data = {
      labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6'],
      datasets: [
        {
          label: this.cod_pregunta  +" - "+this.texto_pregunta,
          data: [2,3,4,1,5,3],
          borderColor: 'rgba(255, 177, 77, 0.7)',
          backgroundColor: 'rgba(255, 177, 77, 0.7)',
          pointStyle: 'circle',
          pointRadius: 10,
          pointHoverRadius: 15
        }
      ]
    };

    /*
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
    */

    new Chart(this.canvasRef.nativeElement, {

      type: 'line',
      data: data,
      options: {
        responsive: true,
      }
      
    });


    
  }
}
