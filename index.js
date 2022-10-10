const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Score = require('./proposal.model');

app.use(express.json());

// app.use((req, res, next) => {
//     let data = {
//         name: "Rahul",
//         score: {
//             math: 10,
//             english: 15,
//             science: 20
//         }
//     };
//     let score = new Score(data);
//     score.save().then((data) => {
//         console.log(data);
//     }).catch((err) => {
//         console.log(err);
//     })
// })
app.use((req, res, next) => {
    Score.find({
        'score.math':10
    }).then((data) => {
        console.log(data);
    }).catch((err) => {
        console.log(err);
    })
    console.log('finished');
})


mongoose.connect("mongodb://localhost:27017/Redbricks").then(() => {
    app.listen(3000, () => {
        console.log('server is running');
    })
}).catch((err) => {
    console.log(err);
})