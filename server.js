const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Chatkit = require("@pusher/chatkit-server");

const app = express();

const chatkit = new Chatkit.default({
  instanceLocator: "v1:us1:be883a3d-9227-450e-b386-e28cdb560205",
  key:
    "5a41e66a-b61d-4201-84ed-1b0395f90f5d:idHLe4vpHvlolSoGh00uLkg2eGQHB3y8OkMjangM8Dc="
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.post("/users", (req, res) => {
  const { username } = req.body;

  chatkit
    .createUser({
      id: username,
      name: username
    })
    .then(() => {
      res.sendStatus(200);
    })
    .catch(error => {
      if (error.error === "services/chatkit/user_already_exists") {
        res.status(200).send("User Exists!");
      } else {
        res.status(error.status).json(error);
      }
    });
});

// Example using Express
app.post("/authenticate", (req, res) => {
  const authData = chatkit.authenticate({
    userId: req.query.user_id
  });

  res.status(authData.status).send(authData.body);
});

var port = process.env.PORT || 3001;
app.listen(port, err => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Running on port ${port}`);
  }
});
