import { ApiPromise, WsProvider } from "@polkadot/api";
const provider = new WsProvider("ws://78.46.41.94:9987");

const sections = { committeeManagement: "committeeManagement" };

async function main() {
  // Create our API with a default connection to the local node
  const api = await ApiPromise.create({ provider });

  // Subscribe to system events via storage
  api.query.system.events((events) => {
    console.log(`\nReceived ${events.length} events:`);

    // Loop through the Vec<EventRecord>
    events.forEach((record) => {
      // Extract the phase, event and the event types
      const { event, phase } = record;
      const types = event.typeDef;

      //   {
      //     method: 'RequiresDecision',
      //     section: 'committeeManagement',
      //     index: '0x0e05',
      //     data: { forSession: '557' }
      //   }

      if (sections[event.section]) {
        console.log(event.toHuman());

        console.log(event);
      }
    });
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
