export class FinalPlotList{
    name : string;
    data : Array<number>;
    date: Array<string>

    constructor(name:string,data:number[],date:string[] ){
        this.name = name;
        this.data = data;
        this.date = date;
    }
}