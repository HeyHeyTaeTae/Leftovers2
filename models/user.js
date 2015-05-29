var mongoose = require("mongoose"),
    bcrypt = require("bcrypt");

var grocerySchema = new mongoose.Schema ({

					groceryItem: {
						type: String,
						default: ""
					},

					expirationDate: {
						type: Date,
						default: Date.now()
					},

					});

var userSchema = new mongoose.Schema({

				email: {
					type: String,
          default: "",
          lowercase: true,
          unique: true
				},

				passwordDigest: {
					type: String,
					default: ""
				},

				groceries: [grocerySchema]

				});

userSchema.statics.createSecure = function (email, password, cb) {
  var that = this;
  bcrypt.genSalt(function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {
      console.log(hash);
      that.create({
        email: email,
        passwordDigest: hash
       }, cb)
    });
  })
};

userSchema.statics.encryptPassword = function (password) {
   var hash = bcrypt.hashSync(password, salt);
   return hash;
 };


userSchema.statics.authenticate = function(email, password, cb) {
  this.findOne({
     email: email
    }, 
    function(err, user){
      console.log(user);
      if (user === null){
        throw new Error("Username does not exist");
      } else if (user.checkPassword(password)){
        cb(null, user);
      }

    })
 }
userSchema.methods.checkPassword= function(password) {
        return bcrypt.compareSync(password, this.passwordDigest);
};

var User = mongoose.model("User", userSchema);
var Grocery = mongoose.model("Grocery", grocerySchema);

module.exports.User = User;
module.exports.Grocery = Grocery;