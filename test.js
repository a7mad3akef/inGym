//DB configurations
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = "mongodb://akef:akef@ds233748.mlab.com:33748/ingym";


// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   db.createCollection("users", function(err, res) {
//     if (err) throw err;
//     console.log("Collection created!");
//     db.close();
//   });
// });

var find_or_create_user = function(user_psid, info){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var query = { id: user_psid };
        db.collection("customers").find(query).toArray(function(err, result) {
          if (err) throw err;
          db.close();
          console.log(result.length)
          if (result.length == 0 ){
            console.log('add a customer to the db')
            create_user(user_psid, info);
            } else {
                console.log('found the customer')
                console.log(result);
            }
          return result;
        });
      });
}


function create_user(psid, info){
    MongoClient.connect(url, function(err, db) {
        var myobj = info;
        dbo.collection("users").insertOne(myobj, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
        });
      });
}

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var query = { id: '1714544488606587' };
    db.collection("users").find(query).toArray(function(err, result) {
      if (err) throw err;
      db.close();
      console.log(result.length)
      if (result.length == 0 ){
        console.log('add a customer to the db')
        create_user(user_psid, info);
        } else {
            console.log('found the customer')
            console.log(result);
        }
      return result;
    });
  })