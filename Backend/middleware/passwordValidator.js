const passwordValidator = require('password-validator');


const Schema = new passwordValidator();


Schema
.is().min(8)
.is().max(100)
.has().uppercase()
.has().lowercase()
.has().digits(2)
.has().not().spaces()
.is().not().oneOf(['password','Password123','Passw0rd'])

module.exports = Schema