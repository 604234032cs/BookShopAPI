var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');


//Firebase Real Time
var firebase = require("firebase-admin");
var serviceAccount = require("./comscibookshop-6d25d.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://comscibookshop-6d25d.firebaseio.com"
});

var db = firebase.database();

var port = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/books', function (req, res) {
  	
	res.setHeader('Content-Type', 'application/json');

	var booksReference = db.ref("books");

	//Attach an asynchronous callback to read the data
	booksReference.on("value", 
			  function(snapshot) {					
					res.json(snapshot.val());
					booksReference.off("value");
					}, 
			  function (errorObject) {
					res.send("The read failed: " + errorObject.code);
			 });
});

app.get('/book/:bookid', function (req, res) {
  	
	res.setHeader('Content-Type', 'application/json');

	var bookid = Number(req.params.bookid);

	var booksReference = db.ref("books");

	//Attach an asynchronous callback to read the data
	booksReference.orderByChild("bookid").equalTo(bookid).on("child_added", 
	  function(snapshot) {
			console.log(snapshot.val());
			res.json(snapshot.val());
			booksReference.off("value");
			}, 
	  function (errorObject) {
			console.log("The read failed: " + errorObject.code);
			res.send("The read failed: " + errorObject.code);
 			});


});




app.post('/book', function (req, res) {
   console.log("HTTP Post");
	
});

app.delete('/book', function (req, res) {
   console.log("HTTP Delete");  	
});

app.listen(port, function () {
    console.log("Server is up and running...");
});