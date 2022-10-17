const users = require('./user');

const constructorMethod = (app) => {
  app.use('/user', users);
  app.use('*', (req, res) => {
    res.redirect('/');
  });
};

module.exports = constructorMethod;