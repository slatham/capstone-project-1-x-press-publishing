const express = require('express');
const app = express();

module.export = app;

const PORT = process.env.PORT || 4000;




app.listen(PORT,() => {

console.log(`Listening on port ${PORT}`);

});