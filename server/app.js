const express = require('express');
const fs = require('fs');
const app = express();

let log;
let jsonLog = {};
let jsonArr = [];

app.use((req, res, next) => {
// write your logging code here
    
    // Get user info to log.
    jsonLog.Agent = req.header('User-Agent').replace(",", "");
    jsonLog.Time = new Date().toISOString();
    jsonLog.Method = req.method;
    jsonLog.Resource = req.originalUrl;
    jsonLog.Version = ("HTTP/" + req.httpVersion);
    jsonLog.Status = res.statusCode;
    log = (jsonLog.Agent+","+jsonLog.Time+","+jsonLog.Method+","+jsonLog.Resource+","+jsonLog.Version+","+jsonLog.Status+"\n");

    // converts log object to a JSON object and push() to arr
    JSON.stringify(jsonLog);
    jsonArr.push(jsonLog);
    
    console.log(log)

    // adds log to .csv file
    fs.appendFile('log.csv', log, function (err) {
        if (err) {
            console.log("Error:", err);
        }    
    });
    next();  
});

app.get('/', (req, res) => {
    res.sendStatus(200);   
});

app.get('/logs', (req, res) => {
    res.send(jsonArr);
});

module.exports = app;
