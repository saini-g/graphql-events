const express = require('express');
const bodyParser = require('body-parser');
const expressGraphql = require('express-graphql');
const mongoose = require('mongoose');

const graphqlSchema = require('./graphql/schema/main');
const graphqlResolvers = require('./graphql/resolvers/main');
const authMiddleware = require('./middleware/auth');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(authMiddleware);

app.use('/graphql', expressGraphql({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true
}));

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);

mongoose.connect('mongodb+srv://gaurav-saini:gaurav-saini@slackedge-test-skasp.mongodb.net/graphql-demo?retryWrites=true')
    .then(() => {
        console.log('mongo db connected...');
        app.listen(8000, () => console.log('server started...'));
    })
    .catch(err => console.log(err));