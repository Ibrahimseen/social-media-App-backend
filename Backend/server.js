const app  = require("./app");
const { connectdatabase } = require("./config/database.js");

connectdatabase();

app.listen(process.env.PORT,() => {
    console.log(`Server is running on port ${process.env.PORT}`);
});