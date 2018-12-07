var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var dotenv = require('dotenv');
var dataUtil = require("./JS/data-util");
var _ = require('underscore');
var Review = require('./model/Review');
var app = express();

dotenv.load();
console.log(process.env.MONGODB);

// Connect to Sandbox MongoDB
mongoose.connect(process.env.MONGODB);
mongoose.connection.on('error',function(err){
    console.log("Connection was unable to take place");
    console.log(err);
    process.exit(1);
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));
app.use("/JS",express.static(__dirname + "/JS"));

app.get('/', function(req, res) {
    Review.find({}, function(err, reviews) {
        if (err) throw err;   
        res.render('home', {review: reviews});
    })
	
});

app.get("/review/authors", function(req, res) {	
	Review.find({}, function(err, reviews) {
		if (err) throw err; 
		all_authors = {};
		
		for (var i=0; i < reviews.length; i++) {
			if (all_authors[reviews[i].author] != null) {
				all_authors[reviews[i].author] += 1;
			} else {
				all_authors[reviews[i].author] = 1;
			}
		}
		res.render('authors', {authors: all_authors})
	})			
})

app.get("/review/books", function(req, res) {
	Review.find({}, function(err, reviews) {
		if (err) throw err; 
		all_authors = {};
		
		for (var i=0; i < reviews.length; i++) {
			if (all_authors[reviews[i].book] != null) {
				all_authors[reviews[i].book] += 1;
			} else {
				all_authors[reviews[i].book] = 1;
			}
		}
		res.render('authors', {authors: all_authors})
	})
})

app.get("/review/users", function(req, res) {
	Review.find({}, function(err, reviews) {
		if (err) throw err; 
		all_authors = {};
		
		for (var i=0; i < reviews.length; i++) {
			if (all_authors[reviews[i].poster] != null) {
				all_authors[reviews[i].poster] += 1;
			} else {
				all_authors[reviews[i].poster] = 1;
			}
		}
		res.render('authors', {authors: all_authors})
	})
})

app.get("/review/random", function(req, res) {
	Review.find({}, function(err, reviews) {
		if (err) throw err; 
		var num = Math.floor(Math.random() * reviews.length) + 1;
		res.render('review', {review: reviews[num]})
	})
})


app.get("/review/rank", function(req, res) {
	Review.find({}, function(err, reviews) {
		if (err) throw err; 
		reviews.sort(dataUtil.rank);
		console.log(reviews)
		res.render('rank', {reviews: reviews});
	})
})

app.post('/api/new-review', function(req, res) {
    // Create new movie
    var new_review = new Review({
    	rating: req.body.rating,
    	comment: req.body.comment,
        poster: req.body.poster,
    	author: req.body.author,
    	book: req.body.book,        
        genre: req.body.genre,
        date: req.body.date
    });

    // Save movie to database
    new_review.save(function(err){
        if (err) throw err; 
        return res.send("Successfully inserted book :)");
    });
});

app.get('/api/reviews', function(req, res) {
	Review.find({}, function(err, reviews) {
        if (err) throw err;   
        return res.send(reviews);
    })
})

app.delete('/api/delete', function(req, res) {
    Review.find({book: req.body.book, poster: req.body.poster}, function(err, review) {
        Review.findByIdAndRemove(review.id, function(err, movie){
        if (err) throw err;
        return res.send("Book "+req.body.id+" was deleted!");
        });
    });
})

app.listen(3000, function() {
    console.log('Book Reviewers listening on port 3000!');
});