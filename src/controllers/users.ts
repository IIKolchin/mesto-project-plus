// // controllers/users.js

// const User = require('../models/user');

// module.exports.createUser = (req, res) => {
//   // хешируем пароль
//   bcrypt.hash(req.body.password, 10)
//     .then(hash => User.create({
//       email: req.body.email,
//       password: hash, // записываем хеш в базу
//     }))
//     .then((user) => res.send(user))
//     .catch((err) => res.status(400).send(err));
// };
