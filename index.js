const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
let data = {
  0: {
    name: "felkru",
    exercises: [
      {
        description: "running",
        duration: 30,
        date: "Wed Feb 02 2023",
      },
      {
        description: "running",
        duration: 60,
        date: "Wed Feb 06 2023",
      },
      {
        description: "running",
        duration: 60,
        date: "Wed Mar 01 2023",
      },
      {
        description: "running",
        duration: 90,
        date: "Wed Mar 07 2023",
      },
    ],
  },
  1: {
    name: "paukru",
    exercises: [
      {
        description: "running",
        duration: 30,
        date: "Wed Feb 02 2023",
      },
    ],
  },
};

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/api/users", (req, res) => {
  let userlist = Object.keys(data).map((e) => ({
    _id: e,
    username: data[e].name,
  }));
  res.json(userlist);
});

app.post("/api/users", (req, res) => {
  let name = req.body.username;
  let id = Object.keys(data).length + 1;
  data[id] = {
    name: name,
    exercises: [],
  };
  res.json({
    username: name,
    _id: id,
  });
});

app.post("/api/users/:id/exercises", (req, res) => {
  let id = Number(req.params.id);
  let duration = Number(req.body.duration);
  let { description, date } = req.body;
  date = date || new Date().toDateString();
  let user = data[id];
  user.exercises.push({
    description: description,
    duration: duration,
    date: new Date(date).toDateString(),
  });
  let response = {
    _id: id,
    username: user.name,
    date: new Date(date).toDateString(),
    duration: duration,
    description: description,
  };
  res.json(response);
});

app.get("/api/users/:id/logs", (req, res) => {
  let { from, to, limit } = req.query;
  let id = req.params.id;
  let user = data[id];
  console.log(req.query, req.params);
  // add exercises to logs when date is between from and to and limit is not reached
  let count = 0;
  let logs = user.exercises.filter((e) => {
    if (limit && count >= limit) return false;
    console.log(e.date);
    if (from && new Date(e.date).getTime() < new Date(from).getTime()) {
      return false;
    }
    if (to && new Date(e.date).getTime() > new Date(to).getTime()) {
      return false;
    }
    count++;
    return true;
  });
  console.log(data[id], logs, limit, from, to);
  console.log("--------------------");
  res.json({
    username: user.name,
    count: user.exercises.length,
    _id: id,
    log: logs,
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(
    "Your app is listening at https://localhost:" + listener.address().port
  );
});
