// src/routes/links.js
import express from "express";
import { createLink, listLinks, getLink, deleteLink } from "../controllers/linksController.js";

const router = express.Router();

router.post("/", createLink);
router.get("/", listLinks);
router.get("/:code", getLink);
router.delete("/:code", deleteLink);

export default router;
