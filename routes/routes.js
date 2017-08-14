const blabla = require('./blabla'),
    deBahn = require("./deBahn");

module.exports = function posts(router){
  router.get("/get/blabla", blabla.get);  
  router.get("/get/deBahn", deBahn.get);  
}
