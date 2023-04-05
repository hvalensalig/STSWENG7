require('dotenv/config');

const express = require('express');
const exphbs = require('express-handlebars');

const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const db = require('./models/db');

const routes = require('./routes/routes');
const authRouter = require('./routes/auth');

const session = require('express-session');
const connectMongo = require('connect-mongo');
const MongoStore = require('connect-mongo');

const flash = require('connect-flash');

const port = process.env.PORT;

const app = express();

app.engine("hbs", exphbs.engine({extname: 'hbs'}));
app.set("view engine", "hbs");
app.set("views", "./views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`public`));
app.use(fileUpload());

db.connect();

app.use(session({
    secret: 'RECIPEISTHEKEY',
    store: MongoStore.create({mongoUrl: 'mongodb+srv://ReciepWebApp:w33mWQOxeHVC3S2s@recipewebapp.fgdw6pq.mongodb.net/?retryWrites=true&w=majority'}),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 * 7 },
}));

app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.success_msg1 = req.flash('success_msg1');
    res.locals.error_msg1 = req.flash('error_msg1');
    res.locals.success_msg2 = req.flash('success_msg2');
    res.locals.error_msg2 = req.flash('error_msg2');
    res.locals.search_error = req.flash('search_error')
    next();
});

app.use('/', authRouter);
app.use(`/`, routes);

app.listen(port, function () {
    console.log(`Server is running at:`);
    console.log(`http://localhost:` + port);
});
