var express = require("express"),
	bodyParser = require("body-parser"),
	path = require("path"),
	_ = require("underscore"),
	nodemon = require("nodemon"),
	db = require("./models"),
	session = require("express-session");

var app = express();
	views = path.join(__dirname, "views"),
	public = path.join(__dirname, "public");

app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
	secret: "super secret",
	resave: false,
	saveUninitialized: true
}))
app.use(express.static(__dirname + '/public'));

app.use("/", function (req, res, next) {

    req.login = function (user) {
      req.session.userId = user._id;
      console.log(user);
    };

    // fetches the user associated with
    //the current session
    req.currentUser = function (cb) {
       db.User.
        findOne({
        	_id: req.session.userId
        },
        function (err, user) {
          req.user = user;
          console.log(user);
          cb(null, user);
        })
    };

    req.logout = function () {
      req.session.userId = null;
      req.user = null;
    }

    next(); 
});

app.get("/", function (req, res) {

	var homePath = path.join(views, "home.html");

	res.sendFile(homePath);
});

app.get("/profile", function (req, res) {

	var profilePath = path.join(views, "profile.html");

	res.sendFile(profilePath);
});

// app.get("/users/:userId/groceries", function(req, res) {
// 	// get all groceries and stringify and send to render function
// 	db.User.
// 		findOne({_id: req.params.userId}, function (err, result) {
// 			if (err) {
// 				res.status(404);
// 			} else {
// 			res.send(result.groceries);
// 			}
// 		});
// });

app.get("/groceries", function (req, res){
	db.Grocery.find({}, function (err, results) {
		console.log("results", results);
		// render groceries index as JSON
		res.send(JSON.stringify(results));
    })
});

app.post("/groceries", function(req, res){
	var groceriesParams = req.body.grocery;
	console.log(groceriesParams);
	db.Grocery.create(groceriesParams);
	res.send(JSON.stringify(groceriesParams));
});

// app.get("/groceries/:_id", function(req, res) {
// 	// find a particular grocery based on its _id
// })

app.post("/signup", function (req, res) {
	//create secure
	var user = req.body.user;
	console.log(user);
	db.User.
		createSecure(user.email, user.password,
			function (err, user) { // runs after db.User.create finishes
				// sends the response back to the user
				if (err) {
					res.status(404);
				} else {
					req.login(user);
					res.redirect("/profile");
				}
			});
	console.log("This is the signup button");
});

app.post("/login", function (req, res) {
	// authenticate
	var user = req.body.user;
	db.User.
		authenticate(user.email, user.password,
			function (err, user) {
				console.log("LOGGING IN!");
				req.login(user);
				res.redirect("/profile");
			})
		console.log("This is the login button");
});

app.delete("/users/:userId/groceries", function (req, res){
	db.Groceries.delete({_id: req.params.userId}, function (err, results) {
		if(err){
			res.status(500).send({ error: "DB Fuckup"});
		} else {
			res.status(200).send();
		}
	});
});

app.listen(3000, function () {

	console.log("WORKING");
});

// app.listen(process.env.PORT || 3000, function (req, res) {

// 	console.log("WORKING");
// });
