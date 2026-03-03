const express = require("express");
const app = express();
const port = 3000;
const appUrl = `http://localhost:${port}`;

// imports
const docsRouter = require("./routers/docs");
const pizzasRouter = require("./routers/pizzas");

// middlewares
app.use(express.static("public"));

// routers
app.use("/docs", docsRouter);
app.use("/pizzas", pizzasRouter);

app.listen(port, () => {
  console.log(`Server listenting on ${appUrl}`);
});
