import {Router} from 'express';
import * as botController from "../controller/bot";

export const route = Router();

route.get("/bot/sendAll", botController.sendAll);
route.post("/bot/reply", botController.reply);
