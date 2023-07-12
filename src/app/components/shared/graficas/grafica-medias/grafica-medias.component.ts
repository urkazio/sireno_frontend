import { Component, AfterViewInit, Input, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, registerables, ChartOptions } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-grafica-medias',
  templateUrl: './grafica-medias.component.html',
  styleUrls: ['./grafica-medias.component.css']
})
export class GraficaMediasComponent implements AfterViewInit {
  @Input() parametros: any;
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  cod_pregunta: any;
  cod_situacion_docente: any;
  texto_pregunta: any;
  cod_asignatura: any;
  info_respuestas: any;
  año_curso: any;
  media: any;

  ngAfterViewInit() {

    if (this.parametros) {
      const newParametros = this.parametros;
      this.parametros = newParametros;

      this.cod_pregunta = this.parametros['cod_pregunta'];
      this.cod_situacion_docente = this.parametros['cod_situacion_docente'];
      this.texto_pregunta = this.parametros['texto_pregunta'];
      this.cod_asignatura = this.parametros['cod_asignatura'];
      this.info_respuestas = JSON.parse(this.parametros['info_respuestas']);

      console.log(this.info_respuestas)

      this.año_curso = this.info_respuestas.map((item:any) => item.año_curso);
      this.media = this.info_respuestas.map((item:any) => item.media);


    }
    this.renderChart();
    this.addBeforeUnloadListener();
  }



  renderChart() {
    const data = {
      labels: [22],
      datasets: [
        {
          label: 'dataset1',
          data: [33],
          borderColor: 'rgba(255, 132, 0)',
          backgroundColor: 'rgba(255, 188, 102)',
        },
        {
          label: 'dataset2',
          data: [20],
          borderColor: 'rgba(100, 100, 100)',
          backgroundColor: 'rgba(176, 176, 176)',
        }
      ]
    };
  
    const chart = new Chart(this.canvasRef.nativeElement, {
      type: 'bar',
      data: data,
      options: {
        indexAxis: 'y',
        elements: {
          bar: {
            borderWidth: 2.5,
          }
        },
        responsive: true,
        scales: {
          x: {
            display: false, // Oculta el eje X
            grid: {
              display: false, // Oculta las líneas de la cuadrícula en el eje X
            },
            ticks: {
              display: false, // Oculta los números en el eje X
            }
          },
          y: {
            display: false, // Oculta el eje Y
            grid: {
              display: false, // Oculta las líneas de la cuadrícula en el eje Y
            },
            ticks: {
              display: false, // Oculta los números en el eje Y
            }
          }
        }
      }
    });
  
    // Eliminar la leyenda
    chart.options.plugins = {
      legend: {
        display: false
      }
    };
  
    // Actualizar la gráfica sin la leyenda
    chart.update();
  }
  
  
  

  addBeforeUnloadListener() {
    window.addEventListener('beforeunload', (event) => {
      event.preventDefault();
      event.returnValue = 'Se perderán los resultados. ¿Estás seguro de recargar la página?';
    });
  }
}
