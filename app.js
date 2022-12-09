const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const { urlencoded, json } = require("body-parser");
const app = express();
app.use(express.static("public"));
const https = require("https");
const { url } = require("inspector");

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});
app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  console.log(firstName, lastName, email);

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
  const jsonData = JSON.stringify(data);

  const url = "https://us8.api.mailchimp.com/3.0/lists/{list_ID}";
  const options = {
    method: "POST",
    auth: "anystring:{YourMailChimpAPIKey}",
  };
  const request = https.request(url, options, function (response) {
    console.log(response.statusCode);
    response.on("data", function (data) {
      var mailchimpData = JSON.parse(data);
      console.log(mailchimpData.errors);

      mailchimpData.errors.length === 0
        ? res.sendFile(__dirname + "/succes.html")
        : res.sendFile(__dirname + "/failure.html");
    });
  });

  request.write(jsonData);
  request.end();
  app.post("/failure", function (req, res) {
    res.redirect("/");
  });
});
app.listen(3000, function () {
  console.log("server started in port 3000");
});
