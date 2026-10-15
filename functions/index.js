import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import { initializeApp } from "firebase-admin/app";
import dotenv from "dotenv";

dotenv.config();
initializeApp();

/**
 * Cloud Function triggered whenever a new contact message document is created in Firestore.
 * Logs the message submission details.
 */
export const onContactMessageCreated = onDocumentCreated(
  {
    document: "contactMessages/{messageId}",
    region: "us-central1",
  },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      logger.warn("No snapshot associated with Firestore event. Skipping.");
      return;
    }

    const data = snapshot.data();
    if (!data) {
      logger.warn("Document data is empty. Skipping.");
      return;
    }

    const messageId = event.params.messageId;
    const name = data.name || "Anonymous";
    const email = data.email || "";
    const subject = data.subject || "No Subject";

    logger.info(`New contact message received [${messageId}] from: ${name} <${email}> — Subject: ${subject}`);
  }
);
