const express = require("express");
const app = express();
const PORT = 4000;
const bodyParser = require("body-parser");
const passwordHash = require("password-hash");

app.use(bodyParser.urlencoded({ extended: true }));

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
var serviceAccount = require("./key.json");

app.use(express.static("vedic"));

initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore();

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/vedic/" + index.html);
});

app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/vedic/" + signup.html);
});

app.get("/SignupSubmit", (req, res) => {
  const email = req.query.email;
  const name = req.query.name;
  const password = req.query.Password;

  try {
    const hashedPassword = passwordHash.generate(password);
    db.collection("Login_Signup")
      .where("email", "==", email)
      .get()
      .then((docs) => {
        if (docs.size >= 1) {
          res.json({
            error: "Email is already in use. Please use a different email",
          });
        } else {
          db.collection("Login_Signup")
            .add({
              name: name,
              email: email,
              password: hashedPassword,
            })
            .then(() => {
              res.json({
                message: "Successfully signed up. You have created an account.",
              });
            });
        }
      });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/file", (req, res) => {
  res.sendFile(__dirname + "/vedic/file.html");
});

app.get("/LoginSubmit", (req, res) => {
  const email = req.query.email;
  const password = req.query.password;

  try {
    db.collection("Login_Signup")
      .where("email", "==", email)
      .get()
      .then((docs) => {
        if (docs.size >= 1) {
          const userDoc = docs.docs[0];
          const hashedPassword = userDoc.data().password;

          if (passwordHash.verify(password, hashedPassword)) {
            res.json({ message: "Login Successful" });
          } else {
            res.json({ error: "Please enter a valid email and password" });
          }
        } else {
          res.json({ error: "Please enter a valid email and password" });
        }
      });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log("listening at " + PORT);
});
