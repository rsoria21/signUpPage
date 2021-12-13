const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

const app = express();

const API_KEY_VALUE = process.env.API_KEY_VALUE;
const LIST_ID = process.env.LIST_ID;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// send them to main file
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});
// gather info from form
app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  // mailchimp data set to recieve information
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  // json sent to mailchimp
  const jsonData = JSON.stringify(data);
  // *****LIST IDE IS IN HERE AND SO IS API KEY NUMBER AFTER 'US', CREATE CONST
  const url = "https://us2.api.mailchimp.com/3.0/lists/" + LIST_ID;

  // ****MAKE CONST, API KEY IS HERE
  const options = {
    method: "POST",
    auth: "ricardo1:" + API_KEY_VALUE,
  };

  const request = https.request(url, options, function (response) {
    // sends to success page, or failed page(if, else)
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  // sends information to mailchimp and ends request
  request.write(jsonData);
  request.end();
});

// this will reroute to home page to try again
app.post("/failure", function (req, res) {
  res.redirect("/");
});

// app.listen(3000, function () {
//   console.log("Server Working fine");
// });
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// api key
// b0c815c5077d1a009a881bf71abc4cd7 - us2

// e100221302
