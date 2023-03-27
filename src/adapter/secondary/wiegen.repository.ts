import mongoose, { Schema } from 'mongoose';
import { Wettkaempfer } from "../../model/wettkaempfer";
import { getLogger } from '../../application/logger';
import dotenv from 'dotenv';
dotenv.config();

const mongourl = process.env.MONGO_URL;
const wkSchema = new Schema<Wettkaempfer>({
  name: String,
  geschlecht: String,
  alter: Number,
  verein: String,
  gewicht: Number});
const wk = mongoose.model('wettkaempfer', wkSchema);
const logger = getLogger('WiegenRepository');
const conn = mongoose.createConnection('mongodb://'+mongourl+'/judo-tournament').asPromise();

export class WiegenRepository {
  
  
  async all(): Promise<Wettkaempfer[]> {
    logger.info("Fetching all wettkaempfer from db");
    return conn.then(() => wk.find());
  }
}