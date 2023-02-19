export type AirtableRecord<T> = {
  id: string;
  createdTime: string | Date;
  fields: T;
};

export type Quiz = {
  id?: string;
  city: string;
  question: string;
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
  correctAnswer: string;
  sync: boolean;
};

export type QuizReference = {
  id: string;
  url: string;
}

export type AirtableWebhook = {
  base: { id: string };
  webhook: { id: string };
};

export type WebhooksList = {
  webhooks: {
    id: string;
    specification: {
      options: {
        filters: {
          dataTypes: string[];
          recordChangeScope: string;
        };
      };
    };
    notificationUrl: string;
    cursorForNextPayload: number;
    lastNotificationResult: {
      success: boolean;
      completionTimestamp: Date;
      durationMs: number;
      retryNumber: number;
      error: Error;
      willBeRetried: boolean;
    };
    areNotificationsEnabled: boolean;
    lastSuccessfulNotificationTime: Date;
    isHookEnabled: boolean;
    expirationTime: Date;
  }[];
};

export function isWebhook(payload: AirtableWebhook | unknown): payload is AirtableWebhook {
  const data = payload as AirtableWebhook;
  return (
    data.base !== undefined && data.base.id !== undefined && data.webhook !== undefined && data.webhook.id !== undefined
  );
}

export type WebhookPayload = {
  payloads: {
    timestamp: Date;
    baseTransactionNumber: number;
    actionMetadata: {
      source: string;
    };
    payloadFormat: string;
    changedTablesById: {
      [name: string]: {
        changedRecordsById?: {
          [name: string]: {
            current: {
              cellValuesByFieldId: {
                [name: string]: any
              }
            }
          };
        },
        createdRecordsById?: {
          [name: string]: any;
        };
      };
    };
  }[];
  cursor: number;
  mightHaveMore: boolean;
  payloadFormat: string;
};

export function isWebhookPayload(tableId: string, payload: WebhookPayload | unknown): payload is WebhookPayload {
  const pl = payload as WebhookPayload;
  return (
    pl !== undefined &&
    pl.payloads !== undefined &&
    Array.isArray(pl.payloads) &&
    pl.payloads.length > 0 &&
    pl.payloads[0].changedTablesById !== undefined
  );
}
