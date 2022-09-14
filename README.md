# CCASS Plot and Threshold Table App

## The App is working in "http://d1v2o27sf89ntx.cloudfront.net/" please use incognito mode to access this page

## The installation process:
- Install python3 for this application to run
- Install pip3 for this application
- Go to --> flask folder --> type python3 app.py


### The pip packages used here:
- BeautifulSoup4
- pandas
- requests
- flask
- flask_cors


- The backend for this application is real time - it is fetching data from 'https://www3.hkexnews.hk/sdw/search/searchsdw.aspx'
- The request is then processed using pandas dataframe and the result is passed in the form of dictionary to based on the request
- The back is not connected to any data base for storage, it acts as a connection between 'https://www3.hkexnews.hk/sdw/search/searchsdw.aspx' and 'http://d1v2o27sf89ntx.cloudfront.net/'.



Api calls available for this application 'http://35.172.114.212:8000/' - GET, 'http://35.172.114.212:8000/plot' - POST,
'http://35.172.114.212:8000/thershold' = POST
