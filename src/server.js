import { ApiPromise, WsProvider } from "@polkadot/api";
import { websocket_url } from "./config/index.js";
import { sections } from "./constants/index.js";
const provider = new WsProvider(websocket_url);

async function main() {
  try {
    // Create our API with a default connection to the local node
    const api = await ApiPromise.create({ provider });

    // Subscribe to system events via storage
    api.query.system.events((events) => {
      console.log(`\nReceived ${events.length} events:`);

      // Loop through the Vec<EventRecord>
      events.forEach(async (record) => {
        // Extract the phase, event and the event types
        const { event, phase } = record;
        const types = event.typeDef;

        // console.log(event);

        //   {
        //     method: 'RequiresDecision',
        //     section: 'committeeManagement',
        //     index: '0x0e05',
        //     data: { forSession: '557' }
        //   }

        // console.log(event.toHuman());
        //console.log(event);
        if (sections[event.section]) {
          if (event.method === "RequiresDecision") {
            console.log("RequiresDecision");
            try {
              const resp = await fetch(
                "http://142.132.144.174:5000/Call_Extrinsic"
              );
              const result = await resp.json();
              console.log("result", result);
              if (result["Response_Type"] == 1) {
                console.log("The require decision has been passed");
              }
              if (result["Response_Type"] == 0) {
                console.log("The require decision has been FAILED!!!");
              }
            } catch (error) {
              console.log("error", error);
            }
          }
        }
      });
    });
  } catch (error) {
    console.log("error", error);
  }
}

// {
//   method: 'SophiaDecisionAccepted',
//   section: 'elections',
//   index: '0x0c01',
//   data: [ { reserved: [Object], nonReserved: [Object] } ]
// }

main();
// .catch((error) => {
//   console.error(error);
//   process.exit(-1);
// });
