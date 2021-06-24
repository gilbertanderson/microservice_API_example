const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const express = require("express");
const app = express();

app.get("/cars", (req, res) => {
  admin
      .firestore()
      .collection("cars")
      .get()
      .then((data) => {
        const cars = [];
        data.forEach((doc) => {
          cars.push(doc.data());
        });
        return res.json(cars);
      })
      .catch((err) => console.error(err));
});

exports.createCar = functions.https.onRequest((req, res) => {
  if (req.method !== "POST") {
    return res.status(400).json({error: "Method not allowed"});
  }
  const newCar = {
    make: req.body.make,
    model: req.body.model,
    package: req.body.package,
    color: req.body.color,
    year: admin.firestore.Timestamp.fromDate(new Date()),
    category: req.body.category,
    mileage: req.body.mileage,
    price: req.body.price,
    id: req.body.id,
  };

  admin.firestore()
      .collection("cars")
      .add(newCar)
      .then((doc) => {
        res.json({message: `document ${doc.id} created successfully`});
      })
      .catch((err) => {
        res.status(500).json({error: "something went wrong"});
        console.error(err);
      });
});

exports.api = functions.https.onRequest(app);
