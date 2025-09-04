export interface Trade {
  _id: string;
  externalId: number,
  price: number,
  qty: number,
  quoteQty: number,
  time: number,
  isBuyerMaker: boolean,
  isBestMatch: boolean,
}
