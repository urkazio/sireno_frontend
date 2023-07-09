import { Component, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import type { ChartOptions } from 'chart.js'; // Importar ChartOptions correctamente
Chart.register(...registerables);

@Component({
  selector: 'app-barra-porcentaje-respuestas',
  templateUrl: './barra-porcentaje-respuestas.component.html',
  styleUrls: ['./barra-porcentaje-respuestas.component.css']
})
export class BarraPorcentajeRespuestasComponent implements AfterViewInit {

  ngAfterViewInit() {
    this.renderChart();
  }

  renderChart() {
    const originalData = [33, 11, 66, 12, 33];
    const total = originalData.reduce((a, b) => a + b, 0);
    const normalizedData = originalData.map(value => (value / total));

    const data = {
      labels: ['valoración'],
      datasets: [
        {
          label: '1',
          data: [normalizedData[0]],
          backgroundColor: 'rgba(255, 177, 77, 0.7)', // Naranja claro
          borderColor: 'black', // Borde negro
          borderWidth: 1 // Ancho del borde
        },
        {
          label: '2',
          data: [normalizedData[1]],
          backgroundColor: 'rgba(255, 152, 54, 0.7)', // Naranja medio
          borderColor: 'black', // Borde negro
          borderWidth: 1 // Ancho del borde
        },
        {
          label: '3',
          data: [normalizedData[2]],
          backgroundColor: 'rgba(255, 126, 31, 0.7)', // Naranja oscuro
          borderColor: 'black', // Borde negro
          borderWidth: 1 // Ancho del borde
        },
        {
          label: '4',
          data: [normalizedData[3]],
          backgroundColor: 'rgba(255, 101, 9, 0.7)', // Naranja intenso
          borderColor: 'black', // Borde negro
          borderWidth: 1 // Ancho del borde
        },
        {
          label: '5',
          data: [normalizedData[4]],
          backgroundColor: 'rgba(255, 76, 0, 0.7)', // Naranja profundo
        }
      ]
    };

    new Chart('barChartCanvas', {
      type: 'bar',
      data: data,
      options: {
        plugins: {
          legend: {
            display: false // Ocultar la leyenda
          },
          title: {
            display: false // Ocultar el título
          },
          tooltip: {
            enabled: true // Habilitar los tooltips
          }
        },
        responsive: true,
        indexAxis: 'y', // Mostrar el gráfico en horizontal
        scales: {
          x: {
            stacked: true,
            display: false // Ocultar el eje X
          },
          y: {
            stacked: true,
            display: false // Ocultar el eje Y
          }
        },
        barThickness: 50  // Ajustar el grosor de la barra (ajusta el valor según tus necesidades)
      } as ChartOptions<"bar"> // Asegurar el tipo correcto para las opciones del gráfico
    });

    console.log(normalizedData)
  }
}