const users = require('./user');
const users2 = require('./user2');

const constructorMethod = (app) => {
  app.use('/user', users);
  app.use('/user', users2);
  app.use('*', (req, res) => {
    res.redirect('/');
  });
};

module.exports = constructorMethod;