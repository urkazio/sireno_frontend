import { Component, AfterViewInit, Input, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, registerables, ChartOptions } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-grafica-linear',
  templateUrl: './grafica-linear.component.html',
  styleUrls: ['./grafica-linear.component.css']
})
export class GraficaLinearComponent implements AfterViewInit {
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

      this.año_curso = this.info_respuestas.map((item:any) => item.año_curso);
      this.media = this.info_respuestas.map((item:any) => item.media_respuestas);

      this.renderChart();
      this.addBeforeUnloadListener();
    }
  }



  renderChart() {

    const data = {
      labels: this.año_curso,
      datasets: [
        {
          label: this.cod_pregunta + ' - ' + this.texto_pregunta,
          data: this.media,
          borderColor: 'rgba(255, 177, 77, 0.7)',
          backgroundColor: 'rgba(255, 177, 77, 0.7)',
          pointStyle: 'circle',
          pointRadius: 10,
          pointHoverRadius: 15
        }
      ]
    };

    new Chart(this.canvasRef.nativeElement, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
      }
    });
  }

  addBeforeUnloadListener() {
    window.addEventListener('beforeunload', (event) => {
      event.preventDefault();
      event.returnValue = 'Se perderán los resultados. ¿Estás seguro de recargar la página?';
    });
  }
}
