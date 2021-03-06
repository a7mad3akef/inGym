'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()),
  request = require('request'); // creates express http server

const PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN; 

//DB configurations
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = "mongodb://akef:akef@ds233748.mlab.com:33748/ingym";

var theprogram = ''
var theperiod = ''
var thelevel = ''
// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));


// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {  
    
    let body = req.body;

    // Checks this is an event from a page subscription
    if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

        // Gets the message. entry.messaging is an array, but 
        // will only ever contain one message, so we get index 0
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);
        // Get the sender PSID
        let sender_psid = webhook_event.sender.id;
        console.log('Sender PSID: ' + sender_psid);
        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        if (webhook_event.message) {
            handleMessage(sender_psid, webhook_event.message);        
        } else if (webhook_event.postback) {
            handlePostback(sender_psid, webhook_event.postback);
        }
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
    } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
    }

});

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {
    
    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = "kofa"
    
    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
    
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
    
        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            
            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        
        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);      
        }
    }
});


// Handles messages events
function handleMessage(sender_psid, received_message) {
    let response;
    // getUserInfo(sender_psid,function(body){
    //     console.log(body)
    // });
    // Checks if the message contains text
    if (received_message.text) {    
      // Create the payload for a basic text message, which
      // will be added to the body of our request to the Send API
      if (received_message.text == 'list'){
        console.log('accepting request to display list')
        response = {

                "text": "Here is a quick reply!",
                "quick_replies":[
                  {
                    "content_type":"text",
                    "title":"Search",
                    "payload":"<POSTBACK_PAYLOAD>",
                    "image_url":"http://example.com/img/red.png"
                  },
                  {
                    "content_type":"location"
                  },
                  {
                    "content_type":"text",
                    "title":"Something Else",
                    "payload":"<POSTBACK_PAYLOAD>"
                  }
                ]
            
          }
        
      } else if (received_message.text == 'hi') {
          getUserInfo(sender_psid,function(body){
            response = {
                "text": "Hello "+body.first_name+", I am your trainer bot."+ "\n" +"Please choose your progrm",
                "quick_replies":[
                    {
                      "content_type":"text",
                      "title":"Muscle Gain",
                      "payload":"muscle_gain"
                    },
                    {
                        "content_type":"text",
                        "title":"Weight Loss",
                        "payload":"weight_loss"
                    }
                  ]
              }

              callSendAPI(sender_psid, response);   
          })
          
        } else if (received_message.text == 'Muscle Gain'){
          // update_user_program(sender_psid,'muscle_gain')
          theprogram = 'Muscle Gain'
          response = { "text": "Please choose your level",
                        "quick_replies":[
                          {
                            "content_type":"text",
                            "title":"4 Weeks",
                            "payload":"4_weeks"
                          },
                          {
                              "content_type":"text",
                              "title":"8 Weeks",
                              "payload":"8_weeks"
                          }
                        ] }
        } else if (received_message.text == 'Weight Loss'){
          // update_user_program(sender_psid,'weight_loss')
          theprogram = 'Weight Loss'
          response = { "text": "Please choose your period",
                        "quick_replies":[
                          {
                            "content_type":"text",
                            "title":"4 Weeks",
                            "payload":"4_weeks"
                          },
                          {
                              "content_type":"text",
                              "title":"8 Weeks",
                              "payload":"8_weeks"
                          }
                        ] }
          
        } else if (received_message.text == '4 Weeks'){
          // update_user_program(sender_psid,'muscle_gain')
          theperiod = '4 Weeks'
          response = { "text": "Please choose your level",
          "quick_replies":[
            {
              "content_type":"text",
              "title":"Beginner",
              "payload":"Beginner"
            },
            {
                "content_type":"text",
                "title":"Intermediate",
                "payload":"Intermediate"
            },
            {
              "content_type":"text",
              "title":"Professional",
              "payload":"Professional"
          }
          ] }
        } else if (received_message.text == '8 Weeks'){
          // update_user_program(sender_psid,'weight_loss')
          theperiod = '8 Weeks'
          response = { "text": "Please choose your level",
          "quick_replies":[
            {
              "content_type":"text",
              "title":"Beginner",
              "payload":"Beginner"
            },
            {
                "content_type":"text",
                "title":"Intermediate",
                "payload":"Intermediate"
            },
            {
              "content_type":"text",
              "title":"Professional",
              "payload":"Professional"
          }
          ] }
        }else if (received_message.text == 'Beginner'){
          // update_user_program(sender_psid,'muscle_gain')
          thelevel = 'Beginner'
          response = { "text": "Here is your program for "+theprogram+' and '+theperiod+' and '+thelevel }
        } else if (received_message.text == 'Intermediate'){
          // update_user_program(sender_psid,'weight_loss')
          thelevel = 'Intermediate'
          response = { "text": "Here is your program for "+theprogram+' and '+theperiod+' and '+thelevel }
        }else if (received_message.text == 'Professional'){
          // update_user_program(sender_psid,'weight_loss')
          thelevel = 'Professional'
          response = { "text": "Here is your program for "+theprogram+' and '+theperiod+' and '+thelevel }
        }else {
          response = {
              "text": `You sent the message: "${received_message.text}".`
          }
      }
      
    } else if (received_message.attachments) {
      // Get the URL of the message attachment
      let attachment_url = received_message.attachments[0].payload.url;
      response = {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [{
              "title": "Is this the right picture?",
              "subtitle": "Tap a button to answer.",
              "image_url": attachment_url,
              "buttons": [
                {
                  "type": "postback",
                  "title": "Yes!",
                  "payload": "yes",
                },
                {
                  "type": "postback",
                  "title": "No!",
                  "payload": "no",
                }
              ],
            }]
          }
        }
      }
    } 
    console.log(theprogram)
    // Send the response message
    callSendAPI(sender_psid, response);    
  }

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
    let response;
    
    // Get the payload for the postback
    let payload = received_postback.payload;
  
    // Set the response based on the postback payload
    if (payload === 'yes') {
      response = { "text": "Thanks!" }
    } else if (payload === 'no') {
      response = { "text": "Oops, try sending another image." }
    } 
    // Send the message to acknowledge the postback
    console.log('#############################################################')
    console.log('the program is '+ theprogram)
    callSendAPI(sender_psid, response);
  }

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
      "recipient": {
        "id": sender_psid
      },
      "message": response
    }
  
    // Send the HTTP request to the Messenger Platform
    request({
      "uri": "https://graph.facebook.com/v2.6/me/messages",
      "qs": { "access_token": PAGE_ACCESS_TOKEN },
      "method": "POST",
      "json": request_body
    }, (err, res, body) => {
      if (!err) {
        console.log('message sent!')
      } else {
        console.error("Unable to send message:" + err);
      }
    }); 
  }

function getUserInfo(sender_psid,callback){
    request("https://graph.facebook.com/v2.6/"+sender_psid+"?fields=first_name,last_name,gender,profile_pic&access_token="+PAGE_ACCESS_TOKEN, { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        console.log(body);
        callback(body);
        // find_or_create_user(sender_psid, body);
      });
}  

function create_user(psid, info){
    MongoClient.connect(url, function(err, db) {
        var myobj = info;
        db.collection("users").insertOne(myobj, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
        });
      });
}

var find_or_create_user = function(user_psid, info){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var query = { id: user_psid };
        db.collection("users").find(query).toArray(function(err, result) {
          if (err) throw err;
          db.close();
          console.log('the result #####################################################')
          console.log(result)
          if (result.length == 0 ){
            console.log('add user to the db')
            create_user(user_psid, info);
            } else {
                console.log('found the user')
                console.log(result);
            }
          return result;
        });
      });
}

var update_user_program = function(user_psid, info){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var query = { id: user_psid };
    db.collection("users").find(query).toArray(function(err, result) {
      if (err) throw err;
      db.close();
      result[0].theprogram = info
      var newvalues = result[0]
      console.log('########################################################')
      console.log(newvalues)
      db.collection("users").updateOne(query, newvalues, function(err, res) {
        if (err) throw err;
        console.log("1 document updated");
        db.close();
        return res
      });
    });
  });
}