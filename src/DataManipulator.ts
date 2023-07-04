import { ServerRespond as ExternalServerRespond } from './DataStreamer';

interface ServerRespond extends ExternalServerRespond {
 price: number;
}

export interface Row {
  value: number;
  price_abc: number,
  price_def: number,
  ratio: number,
  timestamp: Date,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined,
}

export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]): Row[] {
    const priceABC = (serverResponds[0].top_ask.price + serverResponds[0].top_bid.price) / 2;
    const priceDEF = (serverResponds[1].top_ask.price + serverResponds[1].top_bid.price) / 2;
    const ratio = priceABC / priceDEF;
    const upperBound = 1 + 0.05;
    const lowerBound = 1 - 0.05;
    return serverResponds.map((serverRespond) => {
      const serverRatio = serverRespond.price / 100;
      return {
        value: serverRatio,
        price_abc: priceABC,
        price_def: priceDEF,
        ratio,
        timestamp: serverRespond.timestamp,
        upper_bound: upperBound,
        lower_bound: lowerBound,
        trigger_alert: (serverRatio > upperBound || serverRatio < lowerBound) ? serverRatio : undefined,
      };
    });
  }
}