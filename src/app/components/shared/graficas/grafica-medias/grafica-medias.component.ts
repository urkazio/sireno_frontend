import { Component, AfterViewInit, Input, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, registerables, ChartOptions } from 'chart.js';
import { LanguageService } from '../../../../services/languaje.service';
Chart.register(...registerables);

@Component({
  selector: 'app-grafica-medias',
  templateUrl: './grafica-medias.component.html',
  styleUrls: ['./grafica-medias.component.css']
})


export class GraficaMediasComponent implements AfterViewInit {
  @Input() parametros: any;
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  rdo_personales: any;
  rdo_media: any;
  strings: any; // Variable para almacenar los textos


  constructor(
    private languageService: LanguageService, // Servicio de idioma
  ) {}

  ngAfterViewInit() {
    const lang = 'es'; // Idi oma predeterminado
    this.languageService.currentLanguage$.subscribe(lang => { // Suscripción a cambios en el idioma actual
      this.languageService.loadStrings(lang).subscribe( // Carga los strings correspondientes al idioma actual
        data => {
          this.strings = data; // Almacena los textos cargados en la variable 'strings'
          if (this.parametros) {
            const newParametros = this.parametros;
            this.parametros = newParametros;
      
            this.rdo_personales = this.parametros['rdo_personales'];
            this.rdo_media = this.parametros['rdo_media'];

            
            console.log("this.rdo_personales: "+this.rdo_personales)
            console.log("this.rdo_media: "+this.rdo_media)
            
          }
          this.renderChart();
          this.addBeforeUnloadListener();
        },
        error => {
          console.error(`Error loading strings for ${lang}:`, error); // Muestra un mensaje de error si falla la carga de los textos
        }
      );
    });


  }



  renderChart() {
    const data = {
      labels: [22],
      datasets: [
        {
          label: this.strings['personal'],
          data: this.rdo_personales,
          borderColor: 'rgba(255, 132, 0)',
          backgroundColor: 'rgba(255, 188, 102)',
        },
        {
          label: this.strings['comparación'],
          data: this.rdo_media,
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
        aspectRatio: 6, // Ajusta el valor según tu preferencia para hacer el gráfico más achatado
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
