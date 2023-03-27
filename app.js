const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/judo-tournament', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const participantSchema = new mongoose.Schema({
    name: String,
    weight: Number,
    age: Number,
    club: String
});

const Participant = mongoose.model('Participant', participantSchema);

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/participants', function(req, res) {
    Participant.find(function(err, participants) {
        if (err) {
            console.log(err);
        } else {
            res.render('participants', { participants: participants });
        }
    });
});

app.post('/participants', function(req, res) {
    const participant = new Participant({
        name: req.body.name,
        weight: req.body.weight,
        age: req.body.age,
        club: req.body.club
    });
    participant.save();
    res.redirect('/participants');
});

app.listen(3000, function() {
    console.log('Server started on port 3000');
});
