import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgChartsAngularModule } from 'ag-charts-angular';
import { AgChartOptions, time } from 'ag-charts-community';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, AgChartsAngularModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './report.component.html',
})
export class ReportComponent implements OnInit {
  public options: AgChartOptions;

  constructor() {
    this.options = {
      autoSize: true,
      data: this.getData(),
      theme: {
        baseTheme: 'ag-default-dark',
        palette: {
          fills: ['#38bdf8', '#34d399'],
          strokes: ['#075985', '#047857'],
        },
        overrides: {
          common: {
            title: { fontFamily: 'Chart Font' },
          },
          area: {
            tooltip: {
              class: 'bg-black',
            },
            background: {
              fill: 'transparent',
            },
            series: {
              marker: { enabled: true },
              highlightStyle: {
                series: {
                  dimOpacity: 0.2,
                },
              },
              tooltip: {
                renderer: ({ xValue, yValue }) => {
                  const date = Intl.DateTimeFormat('en-GB', {
                    month: 'long',
                    year: 'numeric',
                  }).format(xValue);
                  return {
                    content: `${date}: ${Math.round(yValue / 100) / 10 + 'k'}`,
                  };
                },
              },
            },
          },
        },
      },
      series: [
        {
          type: 'area',
          xKey: 'date',
          stacked: true,
          yKey: 'Expenses',
          yName: 'Expenses',
        },
        {
          type: 'area',
          xKey: 'date',
          stacked: true,
          yKey: 'Income',
          yName: 'Income',
        },
      ],
      axes: [
        {
          type: 'time',
          position: 'bottom',
          label: {
            format: '%b',
            autoRotate: true,
          },
          tick: {
            interval: time.month,
          },
        },
        {
          type: 'number',
          position: 'left',

          label: {
            formatter: (params) => {
              return params.value / 1000 + 'k';
            },
          },
        },
      ],
    };
  }

  ngOnInit() {}
  getData(): any[] {
    return [
      {
        date: new Date(Date.UTC(2019, 0, 1)),
        Expenses: 2378,
        Income: 3256,
      },
      {
        date: new Date(Date.UTC(2019, 1, 1)),
        Expenses: 2720,
        Income: 4954,
      },
      {
        date: new Date(Date.UTC(2019, 2, 1)),
        Expenses: 2857,
        Income: 3500,
      },
      {
        date: new Date(Date.UTC(2019, 3, 1)),
        Expenses: 3148,
        Income: 3657,
      },
      {
        date: new Date(Date.UTC(2019, 4, 1)),
        Expenses: 2297,
        Income: 3049,
      },
      {
        date: new Date(Date.UTC(2019, 5, 1)),
        Expenses: 2410,
        Income: 2901,
      },
      {
        date: new Date(Date.UTC(2019, 6, 1)),
        Expenses: 3549,
        Income: 4719,
      },
      {
        date: new Date(Date.UTC(2019, 7, 1)),
        Expenses: 3637,
        Income: 5108,
      },
      {
        date: new Date(Date.UTC(2019, 8, 1)),
        Expenses: 1963,
        Income: 2946,
      },
      {
        date: new Date(Date.UTC(2019, 9, 1)),
        Expenses: 3127,
        Income: 4288,
      },
      {
        date: new Date(Date.UTC(2019, 10, 1)),
        Expenses: 2549,
        Income: 2974,
      },
      {
        date: new Date(Date.UTC(2019, 11, 1)),
        Expenses: 2378,
        Income: 2634,
      },
    ];
  }
}
