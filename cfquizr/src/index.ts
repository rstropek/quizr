import { StatusCodes } from "http-status-codes";
import { IRequest } from "itty-router";
import { status, ThrowableRouter } from "itty-router-extras";
import { getWebhookList, createWebhook, deleteWebhook } from "./airtable";
import { Env } from "./env";
import { airtableWebhookHandler, getQuestionById, getQuizByCityName, getQuizCityNames, getQuizQuestionIdsByCityName } from "./quizzes";

const router = ThrowableRouter();

router
  .post("/quiz-hook", airtableWebhookHandler)
  .get("/hooks", async (_, env: Env) => await getWebhookList(env))
  .post("/hooks", async (_, env: Env) => await createWebhook(env))
  .delete("/hooks", async (_, env: Env) => await deleteWebhook(env))
  .get("/quizzes/cities", async (request: IRequest, env: Env) => await getQuizCityNames(request, env))
  .get("/quizzes/cities/:city", async (request: IRequest, env: Env) => await getQuizByCityName(request, request.params.city, env))
  .get("/quizzes/cities/:city/questions", async (request: IRequest, env: Env) => await getQuizQuestionIdsByCityName(request, request.params.city, env))
  .get("/quizzes/cities/:city/questions/:id", async (request: IRequest, env: Env) => await getQuestionById(request, request.params.city, request.params.id, env))
  .all("*", () => status(StatusCodes.NOT_FOUND));

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return await router.handle(request, env);
  },
};
