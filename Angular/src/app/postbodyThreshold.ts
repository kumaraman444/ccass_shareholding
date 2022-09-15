export class PostBodyThreshold{
    stockCode: string;
    stockName: string;
    startDate: string;
    endDate: string;
    threshold: number;

    constructor(stockCode: string, stockName: string, startDate: string, endDate: string, threshold: number){
    this.stockCode = stockName;
    this.stockName = stockCode;
    this.startDate = startDate;
    this.endDate = endDate;
    this.threshold = threshold;
    }
}