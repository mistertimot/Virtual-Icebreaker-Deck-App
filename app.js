var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"), 
	mongoose = require("mongoose"),
	Card = require("./models/card"), 
	methodOverride = require("method-override");

mongoose.connect("mongodb://localhost/icebreaker", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");


//////////
//ROUTES
//////////

app.get("/", function(req, res){
	res.render("landing");
});

//ROUTE TO VIEW AND SHUFFLE DECK//

app.get("/ice", function(req,res){
	Card.find({}, function(err, foundCard){
		if(err){
			console.log(err);
		} else{
			var shuffledDeck = deckShuffle(foundCard);
			var pickedCard = shuffledDeck[0];
			function deckShuffle(arr){
				var newPos,
					temp;
					for(var i = arr.length - 1; i > 0; i--) {
						newPos = Math.floor(Math.random() * (i + 1));
						temp = arr[i];
						arr[i] = arr[newPos];
						arr[newPos] = temp;
					}
						return arr;
				 };
	res.render("Ice", {card: foundCard, deckShuffle: deckShuffle, pickedCard: pickedCard});
	
		}
	});
});


//VIEW, CREATE, UPDATE, DELETE ROUTES//


//READ//


app.get("/deck", function(req, res){
	Card.find({}, function(err, foundCard){
		if(err){
			console.log(err);
		} else{
			res.render("deck", {card: foundCard});
		}
	});
});

app.get("/deck/new", function(req, res){
	res.render("new");
});

//CREATE//


app.post("/deck", function(req, res){
	var question = req.body.question;
	var category = req.body.category;
	var newCard = {question: question, category: category};
	
	Card.create(newCard, function(err, newCard){
		if(err){
			console.log(err);
		} else{
			res.redirect("/deck");
		}
	});
});

//EDIT & UPDATE//


app.get("/deck/:id/edit", function(req, res){
	Card.findById(req.params.id, function(err, foundCard){
		if(err){
			console.log(err);
		} else{
			res.render("edit", {card: foundCard});
		}
	});
});

app.put("/deck/:id", function(req, res){
	Card.findByIdAndUpdate(req.params.id, req.body.card, function(err, updatedCard){
		if(err){
			res.redirect("/deck");
		} else {
			console.log(updatedCard);
			res.redirect("/deck");
		}
	});
});
//DELETE//


app.delete("/deck/:id", function(req, res){
	Card.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/deck");
		} else {
			res.redirect("/deck");
		}
	});
});


app.listen(8000, function(){
	console.log("Icebreaker server has started!")
});