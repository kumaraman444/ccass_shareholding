import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlotList } from './plotList';
import { PostBody } from './postbody';
import { StockList } from './stockList';
import { ThresholdList } from './thresList';

@Injectable({
  providedIn: 'root'
})
export class FlaskService {

  constructor(private http: HttpClient) { }

  getStockList(): Observable<StockList[]>{
    return this.http.get<StockList[]>('http://localhost:8000/');
  }
  getPlotList(postbody:PostBody): Observable<PlotList[]>{
    return this.http.post<PlotList[]>('http://localhost:8000/plot',postbody,{
      headers: new HttpHeaders({
           'Content-Type':  'application/json',
         })
    });
  }
  getThresholdList(postbody:PostBody): Observable<ThresholdList[]>{
    return this.http.post<ThresholdList[]>('http://localhost:8000/threshold', postbody,{
      headers: new HttpHeaders({
           'Content-Type':  'application/json',
         })
    });
  }
}

