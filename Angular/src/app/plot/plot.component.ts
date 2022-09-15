import { Component, Input, OnInit } from '@angular/core';
import { FinalPlotList } from '../finalPlotList';
import { FlaskService } from '../flask.service';
import { PlotList } from '../plotList';
import { PostBody } from '../postbody';
import { EChartsOption } from 'echarts';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-plot',
  templateUrl: './plot.component.html',
  styleUrls: ['./plot.component.css']
})
export class PlotComponent implements OnInit  {
  _charOption! : EChartsOption;
  subscription! : Subscription;

  plotList!: PlotList[];
  data!: PlotList;
  stock1Data: any;
  stockNameList!: Array<string>;
  dataFinal! : FinalPlotList[] ;
  dataPlot1! : any[];
  dataPlot2! : any[];
  dataPlot3! : any[];
  dataPlot4! : any[];
  dataPlot5! : any[];
  dataPlot6! : any[];
  dataPlot7! : any[];
  dataPlot8! : any[];
  dataPlot9! : any[];
  dataPlot10! : any[];
  datePlot! : any[];
  labeling! : string[];
  @Input() postbody!: PostBody;
  public chart: any;

  constructor(private flaskService: FlaskService) { }
  async ngOnInit(): Promise<void> {
    const arr = Array(10).fill("");
    console.log(this.postbody)
    await this.flaskService.getPlotList(this.postbody).subscribe(e => {
      this.dataPlot1 = JSON.parse(e[0]['shareholding']);
      arr[0] = (e[0]['investor']);
      this.dataPlot2 = JSON.parse(e[1]['shareholding']);
      arr[1] = (e[1]['investor']);
      this.dataPlot3 = JSON.parse(e[2]['shareholding']);
      arr[2] = (e[2]['investor']);
      this.dataPlot4 = JSON.parse(e[3]['shareholding']);
      arr[3] = (e[3]['investor']);
      this.dataPlot5 = JSON.parse(e[4]['shareholding']);
      arr[4] = (e[4]['investor']);
      this.dataPlot6 = JSON.parse(e[5]['shareholding']);
      arr[5] = (e[5]['investor']);
      this.dataPlot7 = JSON.parse(e[6]['shareholding']);
      arr[6] = (e[6]['investor']);
      this.dataPlot8 = JSON.parse(e[7]['shareholding']);
      arr[7] = (e[7]['investor']);
      this.dataPlot9 = JSON.parse(e[8]['shareholding']);
      arr[8] = (e[8]['investor']);
      this.dataPlot10 = JSON.parse(e[9]['shareholding']);
      arr[9] = (e[9]['investor']);
      this.datePlot = ((e[0]['date'].replace(/"/,'')).replace("[","").replace("]","").replace(/'/,"")).split(',');
      
      this.labeling = arr;
      // this.dataPlot10 = JSON.parse(e[9]['shareholding']);
      this.plotList = e;
    });
  }
  newClass(val:PlotList[]){
    if(val){
      this.initBasicLineChart();
    }
  }

  initBasicLineChart(){
    this._charOption = {
      tooltip: {
        show: true
      },
      legend: {
        data: this.labeling
      },
      background : 'transparent',
      xAxis: {
        type: 'category',
        data: this.datePlot,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: this.labeling[0],
          data: this.dataPlot1,
          type: 'line'
        },
        {
          name: this.labeling[1],
          data: this.dataPlot2,
          type: 'line',
        },
        {
          name: this.labeling[2],
          data: this.dataPlot3,
          type: 'line',
        },
        {
          name: this.labeling[3],
          data: this.dataPlot4,
          type: 'line',
        },
        {
          name: this.labeling[4],
          data: this.dataPlot5,
          type: 'line',
        },
        {
          name: this.labeling[5],
          data: this.dataPlot6,
          type: 'line',
        },
        {
          name: this.labeling[6],
          data: this.dataPlot7,
          type: 'line',
        },
        {
          name: this.labeling[7],
          data: this.dataPlot8,
          type: 'line',
        },
        {
          name: this.labeling[8],
          data: this.dataPlot9,
          type: 'line',
        },
        {
          name: this.labeling[9],
          data: this.dataPlot10,
          type: 'line',
        }
      ]
    };
  }
}
