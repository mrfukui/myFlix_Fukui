const express = require('express'),
    morgan = require('morgan');

const app = express();

let topMovies = [
    {
        title:  'Howls Moving Castle',
        director:  'Hayao Miyazaki'
    }
];

app.get('/movies', (req, res) => {
    res.json(topMovies);
});

app.get('/', (req, res) => {
    res.send('Welcome to Fukuis Flixes');
});

app.use(express.static('public'));


app.use(morgan('common'));

const bodyParser = require('body-parser'),
    methodOverride = require('method-override');

app.use(bodyParser.urlencoded({
    extended: true
  }));
  
app.use(bodyParser.json());
app.use(methodOverride());
  
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});