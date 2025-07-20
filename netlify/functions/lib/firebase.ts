import admin from "firebase-admin";
import type { CommodityData, CommodityType } from "./types";
import { COLLECTION_NAME, INTERVAL } from "./types";

/**
 * Gets a reference to the Firestore database
 */
const getFirestore = (): FirebaseFirestore.Firestore => {
  return admin.firestore();
};

/**
 * Builds the document path for a commodity
 * Structure: /commodities/{commodity}_{interval}
 */
const buildDocumentPath = (commodity: CommodityType): string => {
  return `${COLLECTION_NAME}/${commodity}_${INTERVAL}`;
};

/**
 * Reads commodity data from Firestore
 */
export const readCommodityData = async (
  commodity: CommodityType
): Promise<CommodityData | null> => {
  const db = getFirestore();
  const docPath = buildDocumentPath(commodity);

  console.log(`Reading commodity data from Firestore: ${docPath}`);

  try {
    const docRef = db.doc(docPath);
    const doc = await docRef.get();

    if (!doc.exists) {
      console.log(`No data found in Firestore for ${commodity}`);
      return null;
    }

    const data = doc.data() as CommodityData;
    console.log(
      `✅ Found stored data for ${commodity} with ${data.dataCount} data points`
    );

    return data;
  } catch (error) {
    console.error(`❌ Failed to read commodity data for ${commodity}:`, error);
    throw error;
  }
};

/**
 * Writes commodity data to Firestore
 */
export const writeCommodityData = async (
  commodity: CommodityType,
  data: CommodityData
): Promise<void> => {
  const db = getFirestore();
  const docPath = buildDocumentPath(commodity);

  console.log(`Writing commodity data to Firestore: ${docPath}`);
  console.log(`Data contains ${data.dataCount} data points`);

  try {
    const docRef = db.doc(docPath);
    await docRef.set(data);

    console.log(`✅ Successfully wrote ${commodity} data to Firestore`);
  } catch (error) {
    console.error(`❌ Failed to write commodity data for ${commodity}:`, error);
    throw error;
  }
};

/**
 * Checks if a commodity document exists in Firestore
 */
export const commodityExists = async (
  commodity: CommodityType
): Promise<boolean> => {
  const db = getFirestore();
  const docPath = buildDocumentPath(commodity);

  try {
    const docRef = db.doc(docPath);
    const doc = await docRef.get();

    return doc.exists;
  } catch (error) {
    console.error(
      `❌ Failed to check if commodity exists for ${commodity}:`,
      error
    );
    return false;
  }
};
