import { model, Schema, Document } from 'mongoose';
import { Trade } from '@interfaces/trades.interface';

const tradeSchema: Schema = new Schema({
  a: { type: Number, required: true, unique: true },
  p: String, // Price
  q: String,
  f: Number,
  l: Number,
  T: Number,
  m: Boolean,
  M: Boolean,
});

const tradeModel = model<Trade & Document>('Trade', tradeSchema);

export default tradeModel;
