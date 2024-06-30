const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60000 }); 

module.exports = cache;


