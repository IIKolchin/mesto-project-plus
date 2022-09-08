import { Router } from "express";
import { getCards, createCard } from "../controllers/cards";

const router = Router();

router.get("/", getCards);
router.post("/", createCard);

export default router;
