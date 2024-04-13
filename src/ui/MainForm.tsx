import { useState } from "react";
import toast from "react-hot-toast";

import { Card } from "@tw/Card";
import { SubmitTxButton } from "@components/SubmitTxButton";
import { SecretBox} from "@components/SecretBox";
import { TextField } from "@tw/TextField";
import { useAccount } from "wagmi";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useInitiateDonation } from "hooks/useInitiateDonation";
import { bytesToHex, encodeFunctionData, keccak256} from "viem";
import { MUNUS_ABI } from "constants/abis";


const BTN_ICON_CLASSNAME = "inline w-5 h-5 -mt-1";
export const WITHDRAWAL_GAS = 3850000n;
const WITHDRAWAL_TX_COMPRESSED_SIZE = 2900n;

export function getRandomBytes32(): string {
    return bytesToHex(crypto.getRandomValues(new Uint8Array(32)));
}

export function MainForm({ locked, setLocked, calculators }) {
  const { address, chain } = useAccount();

  const [recipient, setRecipient] = useState("");
  const [secret, _setSecret] = useState(getRandomBytes32());

  const initiateDonation = useInitiateDonation();

  const hash = keccak256(secret);

  return (
    <Card title="ANONYMOUSLY DONATE">
      <TextField
        className="font-telegrama"
        placeholder="Enter the receiving address here."
        value={recipient}
        onChange={(event) => {
          setRecipient(event.target.value);
        }}
        disabled={locked}
      />
      <br/>
      <div className="font-telegrama p-2 border-2 border-slate-800 hover:border-orange-500 hover:shadow-slate-100/20 rounded-md">
          <SecretBox
            className="text-sm text-yellow-900 pb-2"
            secret={secret}
            />
      </div>
      <br/>
      <div className="font-telegrama p-2 border-2 border-slate-800 hover:border-orange-500 hover:shadow-slate-100/20 rounded-md">
          <div className="text-sm text-yellow-900 pb-2">
            Your receipt
          </div>
          <div className="text-sm text-yellow-900 pb-2">
            {hash}
          </div>
      </div>
      <br/>
      <SubmitTxButton
        disabled={
          !address
          || locked
          || recipient === ""
        }
        pendingLabel="DONATING ANONYMOUSLY"
        label={<>DONATE ANONYMOUSLY <PaperAirplaneIcon className={BTN_ICON_CLASSNAME}/></>}
        onClick={() => {
          if (chain === undefined) {
            toast.error("Please connect your wallet to a supported network.");
            return
          } else if (recipient === "") {
            toast.error("Please enter an address.");
            return
          }

          try {
            const data = encodeFunctionData({
               abi: MUNUS_ABI,
               functionName: "trampoline",
               args: [hash, recipient],
             });
            return initiateDonation({
              setRecipient,
              setLocked,
              data,
            });
          } catch(err) {
            toast.error(err.message);
          }
        }}
      />
      <br/>
      <br/>
      <div className="text-sm text-yellow-900 pb-2">
        The recipient address and the donation will be broadcast and publicly visible to the blockchain.
        Only <span className="italic">your identity</span> will be hidden
      </div>
    </Card>
  );
}
