var mongoose=require('mongoose');
var crypto = require('crypto');

mongoose.connect('mongodb://localhost:27017/trivia', {useNewUrlParser: true});

var Schema = mongoose.Schema;

var userSchema= new Schema({
    username: String,
    salt:String,
    hash:String,
    score:Number
});

var userModel=mongoose.model('users', userSchema);
module.exports.userModel=userModel;


module.exports.getUsers=async function(){
  return new Promise(resolve =>{
        resolve(userModel.find({}).then(function(users){
          return users;
        })
      );
    });
}



module.exports.getUser=async function(username){
  return new Promise(resolve =>{
        resolve(userModel.find({username:username}).then(function(user){
          return user;
        })
      );
    });
}

module.exports.updateScore= async function(username, newscore){
  return new Promise(resolve =>{
        resolve(userModel.updateOne({"username":username},{
    $set: {
      "score": newscore
    }
  }).then(function(data){
          //console.log(data);
          return data;
        })
      );
    });
}



module.exports.addUser =async function(user){
  var salt = this.generateSalt(user.password);
  var hash = this.getHash(user.password,salt);
  // console.log("salt",salt);
  // console.log("hash",hash);
  var score = 0;
  var newUser = {"username":user.username,
        "salt":salt,
        "hash":hash,
        "score":score };
  return new Promise(resolve =>{
        resolve(userModel.collection.insertOne(newUser).then(function(data){
          return data;
        })
      );
    });
}
//generating hash for given salt and password
module.exports.getHash = function(password,salt) {
    var hash = crypto.pbkdf2Sync(password,salt, 1000, 64, 'sha512').toString('hex');
    return hash;
};

module.exports.generateSalt = function(password) {
 // Creating a unique salt for a particular user
    var salt = crypto.randomBytes(16).toString('hex');
    return salt;
};


































// //rsvp values for default printing
// var rsvp = {
//     Yes: "Yes",
//     No: "No",
//     Maybe: "Maybe",
// };
//
//

// module.exports.getUsers = function () {   //return all users
//     let users = [];
//     for (let i = 0; i < userdata.length; i++) {
//         let user =  User.userDetails(
//             userdata[i].userId,
//             userdata[i].firstName,
//             userdata[i].lastName,
//             userdata[i].emailAddress,
//             userdata[i].address1,
//             userdata[i].address2,
//             userdata[i].city,
//             userdata[i].state,
//             userdata[i].zipCode,
//             userdata[i].country);
//
//             users.push(user);
//
//     }
//     return users;
// };
//
// var UserConnection1 =  UserConnection.userConnection(
//     connectionDB.getConnection('A3').connectionName,
//     rsvp.Yes,
//     connectionDB.getConnection('A3').connectionTopic,
//     connectionDB.getConnection('A3').connectionID,
//     1
// );
// var UserConnection2 = UserConnection.userConnection(
//   connectionDB.getConnection('B2').connectionName,
//   rsvp.No,
//   connectionDB.getConnection('B2').connectionTopic,
//   connectionDB.getConnection('B2').connectionID,
//   1
// );
//
// var connections = [UserConnection1, UserConnection2]; //hardcoding some connection details for userprofile
// //var defaultConnections = [];
//
// //Default user and default UserProfile
// var DefaultUser = User.userDetails("0",
//  "Joker",
//  "Joker",
//  "joker@gmail.com",
//  "128",
//  "F",
//  "New york",
//  "NY",
//  "23456",
//  "US");
// module.exports.DefaultProfile = new UserProfile(DefaultUser.userId, connections);// Default user profile
// module.exports.connections = connections;
//
//
//
// module.exports.getSize = function () {
//     return userdata.length;
// }
