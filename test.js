//const mongoose = require('mongoose');
var crypto = require('crypto');

// const UserSchema = mongoose.Schema({
//     name : {
//         type : String,
//         required : true
//     },
//     email : {
//         type : String,
//         required : true
//     },
//     hash : String,
//     salt : String
// });
//generating hash for given salt and password
// module.exports.getHash = function(password,salt) {
//     var hash = crypto.pbkdf2Sync(password,salt, 1000, 64, 'sha512').toString('hex');
//     return hash;
// };
//
// module.exports.generateSalt = function(password) {
//  // Creating a unique salt for a particular user
//     var salt = crypto.randomBytes(16).toString('hex');
//     return salt;
// };
generateHashandSalt = function(password) {
 // Creating a unique salt for a particular user
    this.salt = crypto.randomBytes(16).toString('hex');
    console.log("salt",this.salt);
    // Hashing user's salt and password with 1000 iterations,
    //64 length and sha512 digest
    this.hash = crypto.pbkdf2Sync(password, this.salt,1000, 64, 'sha512').toString('hex');
    console.log("hash",this.hash);
    return salt,hash;
};

generateHashandSalt('Rubix1');
generateHashandSalt('Azure2');


---header
--> <div>
            <% if(user){%><a href="/newQuestion">Add a new question</a><%} %>
            <% if(user){%><a href="/scoreDashboard">View scores</a><%} %>
             <% if(user){%><a href="/signout">Sign out</a><%} %>
          </div>

          <!-- <div>
            <% if(user){%><span>Welcome <%=user.username%> !!!!! <%} %></span>
          </div> -->
