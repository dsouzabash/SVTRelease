var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

app.use(express.static(__dirname + '/public'));

var sql = require("mssql");
    // config for your database
var config = {
	user: 'SchedAdmin',
	password: '$VTS0lut!ons1',
	server: '10.10.16.40', 
	database: 'Schedule' 
};
sql.connect(config, function (err) {
		console.log('Inside connect function');
		//res.sendFile(__dirname + '/public/index.html');
		//console.log(config);
        if (err) console.log(err);

        // create Request object
        //var request = new sql.Request();

        // query to the database and get the records
});

app.get('/resources/schedule', function (req, res) {
//	console.log('Inside app.get schedule');
	var request = new sql.Request();
	request.query('SELECT result.[name], pm.[VCHARName] as projectManager, result.[client], result.[SO],result.[startDate],result.[endDate],result.[city],result.[state],result.[travel] FROM (SELECT res.[VCHARName] as name,sched.[GUIDPM] as projectManager,cust.[VCHARName] as client,sched.[INTSO] as SO,sched.[DATEStartDate] as startDate,sched.[DATEEndDate] as endDate,custSite.[VCHARCity] as city,custSite.[VCHARState] as state,travel.[VCHARTravelType] as travel FROM [Schedule].[dbo].[tblSchedule] sched JOIN [Schedule].[dbo].[tblResources] res ON sched.[GuidRes] = res.[PKResource] JOIN [Schedule].[dbo].[tblCust] cust ON sched.[GUIDCust] = cust.[PKCust] JOIN [Schedule].[dbo].[tblCustSite] custSite ON sched.[GUIDCustSite] = custSite.[PKCustSite] JOIN [Schedule].[dbo].[tbltraveltype] travel ON sched.[GUIDTravel] = travel.[PKTravel]) result JOIN [Schedule].[dbo].[tblResources] pm ON result.[projectManager] = pm.[PKResource] ORDER BY result.[startDate]', function (err, recordset) {
//			console.log('Inside request query');
            if (err) console.log(err)
			// send records as a response;
			res.send(recordset);			
	});
});

app.get('/resources/resNames', function (req, res) {
	//console.log('Inside app.get resName');
	var request = new sql.Request();
	request.query('SELECT res.[VCHARName] as name FROM [Schedule].[dbo].[tblResources] res JOIN [Schedule].[dbo].[tblResType] resType ON res.[GUIDResType] = resType.[PKResType] WHERE resType.[VCHARResTypeName] = \'SE\' ' , function (err, recordset) {
	//		console.log('Inside request query');
            if (err) console.log(err)
			// send records as a response;
			res.send(recordset);			
	});
});
app.get('/resources/pmNames', function (req, res) {
	//console.log('Inside app.get pmNames');
	var request = new sql.Request();
	request.query('SELECT res.[VCHARName] as projectManager FROM [Schedule].[dbo].[tblResources] res JOIN [Schedule].[dbo].[tblResType] resType ON res.[GUIDResType] = resType.[PKResType] WHERE resType.[VCHARResTypeName] = \'PM\' ' , function (err, recordset) {
//			console.log('Inside request query');
            if (err) console.log(err)
			// send records as a response;
			res.send(recordset);			
	});
});
app.get('/resources/clientNames', function (req, res) {
//	console.log('Inside app.get clientNames');
	var request = new sql.Request();
	request.query('SELECT cust.[VCHARName] as client FROM [Schedule].[dbo].[tblCust] cust' , function (err, recordset) {
//			console.log('Inside request query');
            if (err) console.log(err)
			// send records as a response;
			res.send(recordset);			
	});
});
app.get('/resources/soNums', function (req, res) {
//	console.log('Inside app.get soNums');
	var request = new sql.Request();
	request.query('SELECT sched.INTSO as SO FROM [Schedule].[dbo].[tblSchedule] sched' , function (err, recordset) {
//			console.log('Inside request query');
            if (err) console.log(err)
			// send records as a response;
			res.send(recordset);			
	});
});
app.get('/resources/appln', function (req, res) {
//	console.log('Inside app.get apps');
	var request = new sql.Request();
	request.query('SELECT appVer.[VCHARAppVersion] as appVersion, app.[VCHARAppName] as appName FROM [Schedule].[dbo].[tblAppVersion] appVer JOIN [Schedule].[dbo].[tblApp] app ON appVer.[GUIDApp] = app.[PKApp]' , function (err, recordset) {
//			console.log('Inside request query');
            if (err) console.log(err)
			// send records as a response;
			res.send(recordset);			
	});
});
app.get('/resources/travelType', function (req, res) {
//	console.log('Inside app.get apps');
	var request = new sql.Request();
	request.query('SELECT travelType.[VCHARTravelType] as travelTypeName FROM [Schedule].[dbo].[tbltraveltype] travelType' , function (err, recordset) {
//			console.log('Inside request query');
            if (err) console.log(err)
			// send records as a response;
			res.send(recordset);			
	});
});

app.get('/resources/billType', function (req, res) {
//	console.log('Inside app.get apps');
	var request = new sql.Request();
	request.query('SELECT billType.[VCHARBillableName] as billTypeName, billRate.[monRate] as billRate FROM [Schedule].[dbo].[tblBillable] billType JOIN [Schedule].[dbo].[tblRate] billRate ON billType.[PKBillable] = billRate.[GUIDBillable]' , function (err, recordset) {
//			console.log('Inside request query');
            if (err) console.log(err)
			// send records as a response;
			res.send(recordset);			
	});
});

app.get('/resources/dashboard', function (req, res) {
	//console.log('Inside app.get dashboard');
	var request = new sql.Request();
	request.query('SELECT result.[name], pm.[VCHARName] as projectManager, result.[client], result.[SO],result.[startDate],result.[endDate],result.[city],result.[state],result.[travel] FROM (SELECT res.[VCHARName] as name,sched.[GUIDPM] as projectManager,cust.[VCHARName] as client,sched.[INTSO] as SO,sched.[DATEStartDate] as startDate,sched.[DATEEndDate] as endDate,custSite.[VCHARCity] as city,custSite.[VCHARState] as state,travel.[VCHARTravelType] as travel FROM [Schedule].[dbo].[tblSchedule] sched JOIN [Schedule].[dbo].[tblResources] res ON sched.[GuidRes] = res.[PKResource] JOIN [Schedule].[dbo].[tblCust] cust ON sched.[GUIDCust] = cust.[PKCust] JOIN [Schedule].[dbo].[tblCustSite] custSite ON sched.[GUIDCustSite] = custSite.[PKCustSite] JOIN [Schedule].[dbo].[tbltraveltype] travel ON sched.[GUIDTravel] = travel.[PKTravel]) result JOIN [Schedule].[dbo].[tblResources] pm ON result.[projectManager] = pm.[PKResource] WHERE result.[startDate] >= DATEADD(MONTH,-2,GETDATE()) AND result.[startDate] <= DATEADD(MONTH,2,GETDATE()) ORDER BY result.[startDate]', function (err, recordset) {
	//		console.log('Inside request query');
			//console.log(recordset)
            if (err) console.log(err)
			
			//console.log(typeOf(recordset));
			// send records as a response;
			res.send(recordset);
			//res.end();
			
	});
//	console.log('Inside resources');
});

var server = app.listen(5000, function () {
    console.log('Server is running..');
});