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

app.put('/book', function (req, res) {
  
	console.log("HTTP Put Request");

	var bookid = req.body.bookid;
	var title = req.body.title;
	var author = req.body.author;
	var isbn=req.body.isbn;
	var pageCount=req.body.pageCount;
	var publishedDate=req.body.publishedDate;
	var thumbnailUrl=req.body.thumbnailUrl;
	var shortDescription=req.body.shortDescription;
	var category=req.body.category;

	var referencePath = '/books/'+bookid+'/';
	

	//Update to Firebase
	var bookReference = db.ref(referencePath);
	if(bookReference !== null) {

	bookReference.set({bookid:bookid, title: title, author: author, isbn: isbn, pageCount: pageCount, publishedDate: publishedDate, thumbnailUrl: thumbnailUrl, shortDescription: shortDescription, category: category}, 
				 function(error) {
					if (error) {
						res.send("Data could not be saved." + error);
					} 
					else {
						res.send("Update book successfully." );
					}
			});
	}


});

app.post('/book', function (req, res) {
  
	var bookid = req.body.bookid;
	var title = req.body.title;
	var author = req.body.author;
	var isbn=req.body.isbn;
	var pageCount=req.body.pageCount;
	var publishedDate=req.body.publishedDate;
	var thumbnailUrl=req.body.thumbnailUrl;
	var shortDescription=req.body.shortDescription;
	var category=req.body.category;

	var referencePath = '/books/'+bookid+'/';
	

	//Add to Firebase
	var bookReference = db.ref(referencePath);
	if(bookReference !== null) {

	bookReference.update({bookid:bookid, title: title, author: author, isbn: isbn, pageCount: pageCount, publishedDate: publishedDate, thumbnailUrl: thumbnailUrl, shortDescription: shortDescription, category: category}, 
				 function(error) {
					if (error) {
						res.send("Data could not be saved." + error);
					} 
					else {
						res.send("Add book successfully." );
					}
			});
	}
});

app.delete('/book/:bookid', function (req, res) {
  	var bookid = req.body.bookid;
	var bookid = Number(req.params.bookid);
	var referencePath = '/books/'+bookid+'/';
	
	//Delete to Firebase
	var bookReference = db.ref(referencePath);
	if(bookReference !== null) {
		bookReference.remove();
		res.send("Delete book successfully." );
	}
});

app.listen(port, function () {
    console.log("Server is up and running...");
});