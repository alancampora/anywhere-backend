var blabla = require('./blabla'); 

module.exports = function posts(router){
  router.get('/get/blabla', blabla.get);  
}
