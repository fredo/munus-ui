import { useEffect, useState } from "react";
import { useConfig, usePublicClient, useWatchContractEvent } from "wagmi";
import { getBlock } from "wagmi/actions";
import { decodeEventLog, parseAbiItem } from "viem";

import { formatDistanceTimestamp } from "@utils/datetime";
import { OrderedMutex } from "@utils/mutex";
import { LoadingSpinner } from "components/loading/LoadingSpinner";

import { Card } from "@tw/Card";
import { Grid } from "@tw/Grid";
import { ADDRESSES } from "constants/addresses";
import { MUNUS_ABI } from "constants/abis";
import { CHAIN_PARAMS } from "constants/networks";

const PAGE_SIZE = 100n;

export function MessageLog() {
  const config = useConfig();
  const publicClient = usePublicClient();

  const [pairs, setPairs] = useState([]);
  const [done, setDone] = useState(false);

  const mutex = new OrderedMutex();

  useEffect(() => {
    getBlock(config).then(async (block) => {
      const retrieve = async (page) => {
        // Retrieve donation events, from the most recent to oldest, by PAGE_SIZE blocks.
        let curr_page = BigInt(page);
        let next_page = curr_page + 1n;
        let first_block = block.number - (PAGE_SIZE * curr_page);
        let last_block = block.number - (PAGE_SIZE * next_page) + 1n; // +1n because getLogs is inclusive

        const logs = await publicClient.getLogs({
          address: ADDRESSES["Base"].MUNUS,
          event: parseAbiItem("event DonationReceived(address receiver, bytes32 hash)"),
          fromBlock: last_block,
          toBlock: first_block,
        });
        const updates = await Promise.all(logs.map((log) => {
          const topics = decodeEventLog({
            abi: MUNUS_ABI,
            ...log,
          });
          return getBlock(config, { blockNumber: log.blockNumber }).then((block) => {
            return { ...log, ...topics, ...block }; // push to back of log.
          });
        }));
        await mutex.acquire(page);
        setPairs((pairs) => pairs.concat(updates.reverse())); // concat entire list to front.
        mutex.release();
      }
      for (let i = 0; i < 20; i++) {
        await retrieve(i);
      }
    }).catch((error) => {
      console.error(error);
      // { code: -32005, message: "please limit the query to at most 1000 blocks } // seem to get this on coinbase mobile browser?
      // { code: -32047, message: "Invalid eth_getLogs request. 'fromBlock'-'toBlock' range too large. Max range: 800" } // on WalletConnect
    }).finally(() => {
      setDone(true);
    });
  }, []);

  useWatchContractEvent({
    address: ADDRESSES["Base"].MUNUS,
    abi: MUNUS_ABI,
    eventName: "DonationReceived",
    onLogs(logs) {
      logs.forEach((log) => {
        getBlock(config, { blockNumber: log.blockNumber }).then((block) => {
          setPairs((pairs) => [{ ...log, ...block }, ...pairs]);
        });
      });
    },
  });

  return (
    <Card title="RECENT DONATIONS (past 1 hour)" className="mt-2">
      <div className="pt-2 text-stone-700 text-sm flex">
        { done ? "" : <span>Retrieving donations... <LoadingSpinner className="!h-3.5 !w-3.5 mb-1"/></span> }
      </div>
      <Grid
        cols={{ xs: 1, sm: 1 }}
        gap={4}
        className="text-md text-slate-400 py-2"
      >
        {pairs.length > 0 || !done ?
          pairs.map((pair, i) => {
            return <MessageItem {...pair} key={i}/>;
          }) :
          <span className="pt-2 text-sm text-yellow-700">No donations in the past hour.</span>
        }
      </Grid>
    </Card>
  );
}

function MessageItem({ args, timestamp, transactionHash }) {
  const { message } = args;
  return (
    <a href={`${CHAIN_PARAMS["Base"].blockExplorerUrl}/tx/${transactionHash}#eventlog`} target="_blank">
      <div className="font-telegrama bg-stone-900 p-2 border-2 border-slate-800 hover:border-orange-500 hover:shadow-slate-100/20 rounded-md">
        <div className="text-sm">
          <div className="inline float-right text-amber-500">
            {formatDistanceTimestamp(Number(timestamp))}
          </div>
          {message}
        </div>
      </div>
    </a>
  );
}
