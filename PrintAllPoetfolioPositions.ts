/* Example: Print all portfolio positions to console. */

import { IBApi, EventName, ErrorCode, Contract, SecType, OptionType } from "@stoqey/ib";

// create IBApi object

const ib = new IBApi({
  // clientId: 0,
  // host: '127.0.0.1',
  port: 4002,
});

// register event handler

let positionsCount = 0;

const contract = {
  symbol: 'AAPL',
  secType: SecType.OPT,
  exchange: 'SMART',
  currency: 'USD',
  lastTradeDateOrContractMonth: '20230306',
  strike: 150,
  right: OptionType.Put,
  multiplier: 100
};

ib.on(EventName.error, (err: Error, code: ErrorCode, reqId: number) => {
  console.error(`${err.message} - code: ${code} - reqId: ${reqId}`);
})
  .on(
    EventName.position,
    (account: string, contract: Contract, pos: number, avgCost?: number) => {
      console.log(`${account}: ${pos} x ${contract.symbol} @ ${avgCost}`);
      positionsCount++;
    }
  )
  .once(EventName.fundamentalData, () => {
    console.log(`Total: ${positionsCount} positions.`);
    ib.disconnect();
  }).on(EventName.connected,()=>{
    ib.reqContractDetails(1,contract)
  }).on(EventName.contractDetails,(reqId, contractDetails)=>{
    console.log(`Contract detail is ${JSON.stringify(contractDetails)}`)
    ib.reqMarketDataType(3);
    ib.reqMktData(4, contract, '', true, false);
  })
  // .on(EventName.tickOptionComputation,(tickerId, tickTyoe,delta)=>{
  //   console.log(`Delta: ${delta}`);
  // })
  .on(
    EventName.tickPrice,(tickerId,tickType,price)=>{
      console.log(`Tick Price: ${price}`);
    }
  );
// call API functions

ib.connect();
ib.reqPositions();

