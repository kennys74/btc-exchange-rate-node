import express from "express";
import UserRequest from "../models/userRequest.js";
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Requests:
 *       type: object
 *       example:
 */

/**
 * @swagger
 * tags:
 *   name: User API Requests
 *   description: The list of API requests stored in the Mongo db
 */

/**
 * @swagger
 * /requests:
 *   get:
 *     summary: Returns the list of API requests stored in the Mongo db
 *     tags: [User API Requests]
 *     responses:
 *       200:
 *         description: The list of the requests and respective responses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Requests'
 */

router.get("/", async (req, res) => {
  try {
    const allUserRequests = await UserRequest.find();
    res.status(200).json(allUserRequests);
  } catch (error) {
    res.sendStatus(500);
  }
});

export default router;
