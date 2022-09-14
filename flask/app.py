from distutils.log import error
import requests
from bs4 import BeautifulSoup
import pandas as pd
import re
from datetime import date, timedelta
import json
from flask import Flask, render_template, request
from flask_cors import CORS, cross_origin

def GetDictionary(df,participants):
    df = df[df['participantID'].isin(participants)]
    return df.to_dict('records')

def dictList(newlist):
    listShare = []
    listDate = []
    listDictionary = []
    id = newlist[0]['participantID']
    inv = newlist[0]['investor']
    for dict in newlist:
        share = int(dict['Shareholding'].replace(',', ''))
        if id == dict['participantID']:
            listShare.append(share)
            listDate.append(dict['date'])
        else:
            dictionary = {'investorId': id,'investor':inv,'date':str(listDate), 'shareholding': str(listShare)}
            id = dict['participantID']
            inv = dict['investor']
            listShare.clear()
            listDate.clear()
            listShare.append(share)
            listDate.append(dict['date'])
            listDictionary.append(dictionary)
    dictionary = {'investorId': id,'investor':inv,'date':str(listDate), 'shareholding': str(listShare)}
    listDictionary.append(dictionary)
    
    return listDictionary

def ProcessDataFrame(df):
    k = df.columns.unique()
    var = 'Name of CCASS Participant(* for Consenting Investor Participants )'
    var1 = 'Participant ID'
    var2 = '% of the total number of Issued Shares/ Warrants/ Units'
    var3 = 'Shareholding'
    
    for i in k:
        j = i+': '
        df[i] = df[i].str.replace(j, '', regex=False)
    df[var] = df[var].str[69:]
    df[var2] = df[var2].str[:-1]
    df.rename(columns={var:'investor'}, inplace=True)
    df.rename(columns={var1:'participantID'}, inplace=True)
    df.rename(columns={var2:'tSharePercent'}, inplace=True)
    df.rename(columns={var3:'Shareholding'}, inplace=True)
    df = df.drop('Address', axis=1)
    return df

def ProcessDataFrame2(df_new,date,df_old):
    dt = df_new.copy()
    dt['date'] = date
    dt['thresholdChange'] = df_new['tSharePercent'].astype(float) - df_old['tSharePercent'].astype(float)
    return dt

def Main(code,name,today):
    with requests.Session() as req:
        r = requests.get('https://www3.hkexnews.hk/sdw/search/searchsdw.aspx')
        soup = BeautifulSoup(r.content, 'html.parser')
        times = [item.get("value") for item in soup.findAll(
            "option", value=re.compile(r"\d{6}"))]
        #print(times)
        vs = soup.find("input", id="__VIEWSTATE").get('value')
        vsg = soup.find("input", id="__VIEWSTATEGENERATOR").get('value')
        ut = soup.find("input", id="ctl00_cph1_hidStartUtc")
        #for time in times:
        data = {
            '__EVENTTARGET': 'btnSearch',
            '__EVENTARGUMENT': '',
            '__VIEWSTATE': vs,
            '__VIEWSTATEGENERATOR': vsg,
            'today': '',
            'sortBy': 'Shareholding',
            'sortDirection': 'desc',
            'alertMsg':'', 
            'txtShareholdingDate': today,
            'txtStockCode': code,
            'txtStockName': name,
            'txtParticipantID': '',
            'txtParticipantName': '',
            'txtSelPartID': ''
            }
        try :
            r = req.post('https://www3.hkexnews.hk/sdw/search/searchsdw.aspx', data=data)
            df = pd.read_html(r.content)[0]
            return df
        except:
            return "Please check the date field"
        # r = req.post('https://www3.hkexnews.hk/sdw/search/searchsdw.aspx', data=data)
        # df = pd.read_html(r.content)[0]
        # return df

def recur_dictify(frame):
    if len(frame.columns) == 1:
        if frame.values.size == 1: return frame.values[0][0]
        return frame.values.squeeze()
    grouped = frame.groupby(frame.columns[0])
    d = {k: recur_dictify(g.loc[:,1:]) for k,g in grouped}
    return d

def CallTheFirstStock(code,name,date):
    df = Main(code,name,date)
    return ProcessDataFrame(df)

def SecondApi(startDate,endDate,df,code,name):
    dateRange = pd.date_range(start =startDate,
         end = endDate, freq ='d')
    stockListPlot = []
    listInvestors = []
    participants = df.head(10)[['participantID','investor']].to_dict('records')
    for part in participants:
        listInvestors.append(part['participantID'])

    for date in dateRange:
        date_time = date.strftime("%Y/%m/%d")
        df_check = Main(code,name,date_time)
        df_check = ProcessDataFrame(df_check)
        df_check['date'] = date_time
        val = GetDictionary(df_check,listInvestors) 
        stockListPlot = stockListPlot + val
        # newlist = sorted(stockListPlot, key=lambda d: d['participantID'])
        # #print(newlist)
    return dictList(sorted(stockListPlot, key=lambda d: d['participantID']))

def ThirdApiCall(startDate,endDate,df,code,name):
    dateRange = pd.date_range(start =startDate, 
         end = endDate, freq ='d')
    stockThresList = []
    df_oldCheck = df
    for date in dateRange:
        date_time = date.strftime("%Y/%m/%d")
        df_check = ProcessDataFrame(Main(code,name,date_time))
        df_newCheck = ProcessDataFrame2(df_check,date_time,df_oldCheck)
        df_newCheck = df_newCheck[df_newCheck['thresholdChange']!=0]
        df_newCheck = df_newCheck[df_newCheck['thresholdChange'].notna()]
        df_newCheck['thresholdChange'] = df_newCheck['thresholdChange'].round(2)
        val = df_newCheck.to_dict('records')
        df_oldCheck = df_check
        stockThresList = stockThresList + val
        newlist = sorted(stockThresList, key=lambda d: d['participantID'])
    return(newlist)
    
app = Flask(__name__)
cors = CORS(app, resources={r"*": {"origins": "*"}})
# app.config['CORS_HEADERS'] = 'Content-Type'
@app.route('/')
def index():
    #Extract all stocknames
    formattedToday = date.today().strftime('%Y%m%d')
    today = date.today().strftime('%Y/%m/%d')
    url = 'https://www3.hkexnews.hk/sdw/search/stocklist.aspx?sortby=stockcode&shareholdingdate='+formattedToday
    s = requests.get(url).json()

    stockListFinal = []
    for i in s:
        dictionary = {'stockCode':i['c'], 'stockName':i['n']}
        stockListFinal.append(dictionary)

    return json.dumps(stockListFinal)

@app.route('/plot' , methods=['POST'])
@cross_origin()
def plot():
    data = request.json
    df = CallTheFirstStock(data['stockCode'],data['stockName'],data['endDate'])
    listStockPlot = SecondApi(data['startDate'],data['endDate'],df,data['stockCode'],data['stockName'])
    return json.dumps(listStockPlot)

@app.route('/threshold' , methods=['POST'])
@cross_origin(origin='*')
def threshold():

    data = request.json
    df = CallTheFirstStock(data['stockCode'],data['stockName'],data['startDate'])
    listStockThres = ThirdApiCall(data['startDate'],data['endDate'],df,data['stockCode'],data['stockName'])
    finalList=[]
    if(data['threshold'] != 0):
        for i in listStockThres:
            if abs(i['thresholdChange']) > data['threshold']:
                finalList.append(i)
    else:
        finalList = listStockThres

    return json.dumps(finalList)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
