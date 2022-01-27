import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import flatCache from "flat-cache";
import mongoose from "mongoose";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import currencyRouter from "./routes/currencies.js";
import requestsRouter from "./routes/requests.js";

const app = express();
dotenv.config();
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
const PORT = process.env.PORT || 8001;

const cache = flatCache.load("currencyCache");

// create flat cache routes
const flatCacheMiddleware = (req, res, next) => {
  const key = "__express__" + req.originalUrl || req.url;
  const cacheContent = cache.getKey(key);
  if (cacheContent) {
    res.send(cacheContent);
  } else {
    res.sendResponse = res.send;
    res.send = (body) => {
      cache.setKey(key, body);
      cache.save();
      res.sendResponse(body);
    };
    next();
  }
};

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Coinbase API",
      version: "1.0.0",
      description: "Express API to view live exchange rates",
    },
    servers: [
      {
        url: "http://localhost:8001",
      },
      {
        url: "https://btc-exchange-rate.herokuapp.com",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use("/currencies", flatCacheMiddleware, currencyRouter);
app.use("/requests", requestsRouter);

app.get("/", (req, res) => {
  res.status(200).send("Hello world");
});

mongoose
  .connect(process.env.CONNECTION_URL)
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
  )
  .catch((error) => console.log(error.message));
