import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { number } from 'echarts';
import { FlaskService } from './flask.service';
import { PostBody } from './postbody';
import { PostBodyThreshold } from './postbodyThreshold';
import { StockList } from './stockList';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'ccass-plot-app';
  stocks!: StockList[];
  postbody!: PostBody;
  postbody2!: PostBody;
  postBodyOn = false;
  postTableOn = false;
  threshold! : number;
  
  constructor(private flaskService: FlaskService,
              private fb: FormBuilder,
              private calendar: NgbCalendar, 
              public formatter: NgbDateParserFormatter){

                this.fromDate = calendar.getToday();
                this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
              }

  ngOnInit(){
    this.flaskService.getStockList().subscribe(data =>{ 
        this.stocks = data
      });
  }
  jobForm = this.fb.group({
    stock:'',
    threshold:''
  })
 
  preview: string = '';
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  /////////////////////

  hoveredDate: NgbDate | null = null;

  fromDate!: NgbDate | null;
  toDate!: NgbDate | null;

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) &&
        date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) { return this.toDate && date.after(this.fromDate) && date.before(this.toDate); }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) ||
        this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    console.log(parsed);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  ///////////////////////
  save(result: any) {
    console.log(result);
    const prev = JSON.parse(JSON.stringify(this.jobForm.value.stock));
    const startDate = this.dateString(this.fromDate);
    const endDate = this.dateString(this.toDate);
    const postman = new PostBody(prev['stockName'],prev['stockCode'],startDate,endDate);
    if(this.postbody != postman){
      this.postbody = postman;
      this.postBodyOn = true;
    } 
  }

  save2(result: any) {
    console.log(result);
    const prev = JSON.parse(JSON.stringify(this.jobForm.value.stock));
    const startDate = this.dateString(this.fromDate);
    const endDate = this.dateString(this.toDate);
    let thres = 0;
    if(Number(this.jobForm.value.threshold)!=null || Number(this.jobForm.value.threshold) != 0){
      thres = Number(this.jobForm.value.threshold);
    }
    const postman = new PostBodyThreshold(prev['stockName'],prev['stockCode'],startDate,endDate,thres);
    if(this.postbody2 != postman){
      this.postbody2 = postman;
      this.postTableOn = true;
    } 
  }

  
  dateString(var1:any) : string {
    let month = var1.month.toString();
    let day = var1.day.toString();
    if(String(+var1.month).charAt(0) == var1.month){
      month = '0'+var1.month.toString();
    }
    if(String(+var1.day).charAt(0) == var1.day){
      day = '0'+var1.day.toString();
    }
    
    let date = (var1.year).toString()+"/"+month+"/"+day;
    return date;
  }

  newfunction(){
    this.postBodyOn = false;
  }
}
