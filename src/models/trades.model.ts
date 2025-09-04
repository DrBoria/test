import { model, Schema, Document } from 'mongoose';
import { Trade } from '@interfaces/trades.interface';

const tradeSchema: Schema = new Schema({
  externalId: Number,
  price: Number,
  qty: Number,
  quoteQty: Number,
  time: Number,
  isBuyerMaker: Boolean,
  isBestMatch: Boolean,
});

const tradeModel = model<Trade & Document>('Trade', tradeSchema);

export default tradeModel;
