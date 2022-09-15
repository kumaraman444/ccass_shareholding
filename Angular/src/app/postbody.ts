export class PostBody{
    stockCode: string;
    stockName: string;
    startDate: string;
    endDate: string;

    constructor(stockCode: string, stockName: string, startDate: string, endDate: string){
    this.stockCode = stockName;
    this.stockName = stockCode;
    this.startDate = startDate;
    this.endDate = endDate;
    }
}