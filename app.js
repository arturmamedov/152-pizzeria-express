const express = require("express");
const app = express();
const port = 3000;
const appUrl = `http://localhost:${port}`;

// imports
const docsRouter = require("./routers/docs");
const pizzasRouter = require("./routers/pizzas");
const loggerMiddleware = require("./middlewares/logger");
const errorsHandler = require("./middlewares/errorsHandler");
const notFound = require("./middlewares/notFound");

// middlewares
app.use(loggerMiddleware);
app.use(express.static("public"));
app.use(express.json());

// routers
app.use("/docs", docsRouter);
app.use("/pizzas", pizzasRouter);

// errors handler
app.use(notFound);
app.use(errorsHandler);

app.listen(port, () => {
  console.log(`Server listenting on ${appUrl}`);
});
