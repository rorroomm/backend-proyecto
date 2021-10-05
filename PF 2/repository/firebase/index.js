var admin = require("firebase-admin");

var serviceAccount = require("./coderbackend-42658-firebase-adminsdk-d0ftq-81a339b402.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://coderbackend-42658.firebaseio.com',
});

console.log('Connected!')