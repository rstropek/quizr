import { Env } from "./env";
import { AirtableRecord, isWebhook, isWebhookPayload, Quiz, WebhookPayload, WebhooksList } from "./types";
import { StatusError, json, error, status } from "itty-router-extras";
import { StatusCodes } from "http-status-codes";

export async function speakToAirtable<T>(
  env: Env,
  url: string,
  method: string = "GET",
  body: unknown = undefined
): Promise<T> {
  const [success, result] = await trySpeakingToAirtable<T>(env, url, method, body);
  if (!success || result === undefined) {
    throw new StatusError(StatusCodes.INTERNAL_SERVER_ERROR, "Error accessing Airtable");
  }

  return result;
}

export async function trySpeakingToAirtable<T>(
  env: Env,
  url: string,
  method: string = "GET",
  body: unknown = undefined
): Promise<[boolean, T?]> {
  url = `https://api.airtable.com/v0/${url.startsWith("webhooks") ? "bases/" : ""}${env.AIRTABLE_BASE}/${url}`;
  const response = await fetch(url, {
    method: method,
    cf: { cacheTtl: 0 },
    headers: {
      Authorization: `Bearer ${env.AIRTABLE_PAT}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    console.log(
      `Error accessing Airtable (${url}): ${response.status} ${response.statusText} ${await response.text()}`
    );
    return [false, undefined];
  }
  return [true, await response.json()];
}

export async function getWebhookList(env: Env): Promise<Response> {
  const result = await speakToAirtable<WebhooksList>(env, "webhooks");
  return json(result.webhooks);
}

export async function createWebhook(env: Env): Promise<Response> {
  await speakToAirtable(env, "webhooks", "POST", {
    notificationUrl: env.WEBHOOK_URL,
    specification: {
      options: {
        filters: {
          dataTypes: ["tableData"],
          changeTypes: ["add", "update"],
          recordChangeScope: env.AIRTABLE_TABLE,
          watchDataInFieldIds: [env.AIRTABLE_SYNC_COL],
        },
      },
    },
  });

  return status(StatusCodes.CREATED);
}

export async function deleteWebhook(env: Env): Promise<Response> {
  const response = await speakToAirtable<WebhooksList>(env, "webhooks");
  for (let wh of response.webhooks) {
    console.log(`Deleting webhook ${wh.id}...`);
    await speakToAirtable(env, `webhooks/${wh.id}`, "DELETE");
  }
  return status(StatusCodes.NO_CONTENT);
}

export async function extractRowIdsFromWebhook(request: Request, env: Env): Promise<string[]> {
  const res = await request.json();
  if (!isWebhook(res)) {
    console.log(`Not a webhook, ignoring (${JSON.stringify(res)}`);
    return [];
  }

  let cursor = await env.QUIZKV.get("cursor");
  const [success, payload] = await trySpeakingToAirtable<WebhookPayload>(
    env,
    `webhooks/${res.webhook.id}/payloads?cursor=${cursor ?? "1"}`
  );
  if (!success || payload === undefined || !isWebhookPayload(env.AIRTABLE_TABLE, payload)) {
    console.log(`Not a webhook payload, ignoring (${JSON.stringify(payload)}`);
    return [];
  }

  await env.QUIZKV.put("cursor", payload.cursor.toString());

  let records: string[] = [];
  for (let p of payload.payloads) {
    const tableChanges = p.changedTablesById[env.AIRTABLE_TABLE];
    if (tableChanges === undefined) {
      continue;
    }

    if (tableChanges.changedRecordsById !== undefined) {
      for (let recordId of Object.getOwnPropertyNames(tableChanges.changedRecordsById)) {
        const record = tableChanges.changedRecordsById[recordId];
        if (record?.current?.cellValuesByFieldId[env.AIRTABLE_SYNC_COL] === true) {
          records.push(recordId);
        }
      }
    }

    if (tableChanges.createdRecordsById !== undefined) {
      records.push(...Object.getOwnPropertyNames(tableChanges.createdRecordsById));
    }
  }
  records = records.filter((v, i, a) => a.indexOf(v) === i);

  return records;
}

export async function tryGetQuiz(env: Env, id: string): Promise<AirtableRecord<Quiz> | undefined> {
  const [success, quiz] = await trySpeakingToAirtable<AirtableRecord<Quiz>>(env, `${env.AIRTABLE_TABLE}/${id}`);
  if (!success || quiz === undefined) {
    return undefined;
  }

  return quiz;
}

export async function setAsSynced(env: Env, id: string): Promise<void> {
  await speakToAirtable(env, `${env.AIRTABLE_TABLE}/${id}`, "PATCH", {
    fields: {
      sync: false,
    },
  });
}
