const express = require('express'),
    morgan = require('morgan'),
    uuid = require('uuid');

const bodyParser = require('body-parser'),
    methodOverride = require('method-override');

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(methodOverride());

let movies = [
    {
        title:  'Howls Moving Castle',
        director:  'Hayao Miyazaki'
    },
    {
        title: 'Parasite',
        director: 'Bong Joon-ho'
    },
    {
        title: 'Eternal Sunshine of the Spotless Mind',
        director: 'Michael Gondry'
    }
];

let genres = [
    {
        name: 'Thriller',
        description: 'An atmosphere of menace and sudden violence, such as crime and murder, characterize thrillers. The tension usually arises when the character(s) is placed in a dangerous situation, or a trap from which escaping seems impossible.'
    },
    {
        name: 'Fantasy',
        description: 'Fantasy films are films that belong to the fantasy genre with fantastic themes, usually magic, supernatural events, mythology, folklore, or exotic fantasy worlds. The genre is considered a form of speculative fiction alongside science fiction films and horror films, although the genres do overlap.'
    }
];

let directors = [
    {
        name: 'Hayao Miyazaki',
        birthyear: '1941'
    },
    {
        name: 'Bong Joon-ho',
        birthyear: '1969'
    },
    {
        name: 'Michael Gondry',
        birthyear: '1963'
    }
];

let users = [
    {
        username: 'Miguel',
        password: 'Password123',
        favoriteMovies: ['Parasite']
    }
];

app.get('/', (req, res) => {
    res.send('Welcome to Fukuis Flixes');
});

// Return a list of ALL movies to the user
app.get('/movies', (req, res) => {
    res.json(movies);
});

// Return data (description, genre, director, image URL, whether it/'s featured or not) about a single movie by title to the user
app.get('/movies/:title', (req, res) => {
    res.json(movies.find( (movie) =>
    { return movie.title === req.params.title }));
});


// Return data about a genre (description) by name/title (e.g., “Thriller”)
app.get('/movies/genres/:name', (req, res) => {
    res.json(genres.find( (genre) =>
    { return genre.name === req.params.name }));
});

// Return data about a director (bio, birth year, death year) by name
app.get('/movies/directors/:name', (req, res) => {
    res.json(directors.find( (director) =>
    { return director.name === req.params.name }));
});

// Allow new users to register
app.post('/users', (req, res) => {
    let newUser = req.body;

    if (!newUser.username) {
        const message = 'Missing username in request body';
        res.status(400).send(message);
    } else {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).send(newUser);
    }
});

// Allow users to update their user info (username)
app.put('/users/:username', (req, res) => {
    const { username } = req.params;
    const updatedUser = req.body;

    let user = users.find( user => user.username == username);

    if (user) {
        user.password = updatedUser.password;
        res.status(200).json(user);
    } else {
        res.status(400).send('no such user');
    }

});

// Allow users to add a movie to their list of favorites (showing only a text that a movie has been added—more on this later)
app.post('/users/:username/:movieTitle', (req, res) => {
    const { username, movieTitle } = req.params;

    let user = users.find( user => user.username == username );

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send('${movieTitle} has been added to your user ${username}s array');
    } else {
        res.status(400).send('no such user');
    }
});

// Allow users to remove a movie from their list of favorites (showing only a text that a movie has been removed—more on this later)
app.delete('/users/:username/:movieTitle', (req, res) => {
    const { username, movieTitle } = req.params;

    let user = users.find( user => user.username == username);

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
        res.status(200).send('${movieTitle} has been removed from your user ${username}s array');
    } else {
        res.status(400).send('no such user');
    }
});

// Allow existing users to deregister (showing only a text that a user email has been removed—more on this later)
app.delete('/users/:username', (req, res) => {
    const { username } = req.params;

    let user = users.find ( user => user.username == username);

    if (user) {
        users = users.filter( user => user.username !== username);
        res.status(200).send('${username} has been removed from your users array');
    } else {
        res.status(400).send('no such user');
    }
});

app.use(express.static('public'));


app.use(morgan('common'));

app.use(bodyParser.urlencoded({
    extended: true
  }));
  
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});    