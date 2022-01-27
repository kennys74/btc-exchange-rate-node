import express from "express";
const router = express.Router();
import fetch from "node-fetch";

import { createRequestResponse } from "../controllers/userRequests.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Currencies:
 *       type: object
 *       required:
 *         - currency
 *       properties:
 *         currency:
 *           type: string
 *           description: 3 digit code for the currency
 *         rates:
 *           type: array
 *           description: The rates based on the default currency (USD)
 *       example:
 *         currency: BTC
 */

/**
 * @swagger
 * tags:
 *   name: Currencies
 *   description: The live currency exchange rate API
 */

/**
 * @swagger
 * /currencies:
 *   get:
 *     summary: Returns the list of currency exchange rates for default currency USD
 *     tags: [Currencies]
 *     responses:
 *       200:
 *         description: The list of the currencies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Currencies'
 */

router.get("/", (req, res) => {
  fetch("https://api.coinbase.com/v2/exchange-rates")
    .then((res) => res.json())
    .then((json) => {
      const currencies = json;
      if (!currencies) {
        const data = {
          exchangeRateRequest: "Get exchange rates with default currency: USD",
          exchangeRateResponse: "500 status code, service not available",
        };
        createRequestResponse(data);
      } else {
        const data = {
          exchangeRateRequest: "Get exchange rates with default currency: USD",
          exchangeRateResponse: "200 status code, exchange rates available",
        };
        createRequestResponse(data);
      }

      res.send(currencies);
    });
});

/**
 * @swagger
 * /currencies/{currency_code}:
 *   get:
 *     summary: Get the exchange rate for a specific currency
 *     tags: [Currency]
 *     parameters:
 *       - in: path
 *         name: currency_code
 *         schema:
 *           type: string
 *         required: true
 *         description: The currency 3 digit code eg BTC for Bitcoin or ETH for Ethereum. Must be uppercase!
 *     responses:
 *       200:
 *         description: The currency 3 digit code
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Currencies'
 *       404:
 *         description: The currency was not found
 */

router.get("/:currency_code", (req, res) => {
  fetch(
    `https://api.coinbase.com/v2/exchange-rates?currency=${req.params.currency_code}`
  )
    .then((res) => res.json())
    .then((json) => {
      const currencies = json;
      if (!currencies) {
        const data = {
          exchangeRateRequest: `Get exchange rates with currency code: ${req.params.currency_code}`,
          exchangeRateResponse: "404 status code, currency not found",
        };
        createRequestResponse(data);
        res.sendStatus(404);
      } else {
        const data = {
          exchangeRateRequest: `Get exchange rates with currency code: ${req.params.currency_code}`,
          exchangeRateResponse: "200 status code, currency code available",
        };
        createRequestResponse(data);
        res.send(currencies);
      }
    });
});

export default router;
