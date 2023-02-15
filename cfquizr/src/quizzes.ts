import { StatusCodes } from "http-status-codes";
import { IRequest } from "itty-router";
import { json, status, text } from "itty-router-extras";
import { extractRowIdsFromWebhook, setAsSynced, tryGetQuiz } from "./airtable";
import { Env } from "./env";
import { Quiz } from "./types";

export async function airtableWebhookHandler(request: IRequest, env: Env): Promise<Response> {
  const rowIds = await extractRowIdsFromWebhook(request as any as Request, env);
  for (let rowId of rowIds) {
    const quiz = await tryGetQuiz(env, rowId);
    if (quiz === undefined) {
      console.log(`Quiz ${rowId} not found, ignoring...`);
      continue;
    }

    if (!quiz.fields.sync) {
      console.log(`Quiz ${rowId} (${quiz.fields.city}) not marked for syncing, ignoring...`);
      continue;
    }

    env.QUIZKV.put(`city:${quiz.fields.city}`, "");
    env.QUIZKV.put(`question:${quiz.fields.city}:${quiz.id}`, JSON.stringify(quiz.fields));

    await setAsSynced(env, rowId);
  }

  return status(StatusCodes.OK);
}

export async function cache(request: IRequest, handler: () => Promise<Response>): Promise<Response> {
  const cacheKey = request as any as Request;
  const cache = caches.default;
  let response = await cache.match(cacheKey);
  if (!response) {
    console.log("Cache miss :(");

    response = await handler();
    response.headers.append("Cache-Control", "s-maxage=60");

    await cache.put(cacheKey, response.clone());
  } else {
    console.log("Cache hit :)");
  }

  return response;
}

export async function getQuizCityNames(request: IRequest, env: Env): Promise<Response> {
  return await cache(request, async () => {
    const cityIds = await env.QUIZKV.list({ prefix: "city:" });
    return json(cityIds.keys.map((k) => k.name.replace("city:", "")));
  });
}

export async function getQuizByCityName(request: IRequest, city: string, env: Env): Promise<Response> {
  return await cache(request, async () => {
    const questions = await env.QUIZKV.list({ prefix: `question:${city}` });
    if (questions.keys.length === 0) {
      return status(StatusCodes.NOT_FOUND, `No quizzes found for city ${city}`);
    }

    const result: Quiz[] = [];
    for (let question of questions.keys) {
      const quiz = await env.QUIZKV.get<Quiz>(question.name, "json");
      if (quiz === null) {
        continue;
      }

      result.push(quiz);
    }

    return json(result);
  });
}
