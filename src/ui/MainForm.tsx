import { useState } from "react";

import { Card } from "@tw/Card";

import { SubmitTxButton } from "@components/SubmitTxButton";
import { MessageField } from "@components/MessageField";
import { useAccount } from "wagmi";
import { optimismTxCompressedSize } from "utils/gas";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useInitiateDonation } from "hooks/useInitiateDonation";
import { encodeFunctionData, formatUnits } from "viem";
import { MUNUS_ABI } from "constants/abis";


const BTN_ICON_CLASSNAME = "inline w-5 h-5 -mt-1";
export const WITHDRAWAL_GAS = 3850000n;
const WITHDRAWAL_TX_COMPRESSED_SIZE = 2900n;

export function getRandomBytes32(): string {
    const length: number = 64;
    const array: number[] = [...Array(length)];
    const number: string = array.map(() => Math.floor(Math.random() * 16).toString(16)).join("");
    return "0x" + number;
}

export function MainForm({ locked, setLocked, calculators }) {
  const { address, chain } = useAccount();

  const [recipient, setRecipient] = useState("");
  const [secret, _setSecret] = useState(getRandomBytes32());

  const initiateDonation = useInitiateDonation();

  let helper = "";
  if (chain === undefined) {
    helper = "Please connect your wallet to a supported network.";
  } else if (recipient === "") {
    helper = "Please enter a nonempty recipient.";
  }

  return (
    <Card title="ANONYMOUSLY DONATE">
      <div className="text-sm text-yellow-700 pb-2">
        The recipient address and the donation will be broadcast and publicly visible to the blockchain.
        Only <span className="italic">your identity</span> will be hidden
      </div>
      <div className="font-telegrama text-sm text-stone-700 pb-1">
        Recipient address
      </div>
      <MessageField
        error={helper.length > 0}
        helper={helper}
        recipient={recipient}
        setRecipient={setRecipient}
        locked={locked}
        label="Recipient address"
      />
      <div className="text-sm text-yellow-700 pb-2">
        Your secret: {secret}
      </div>
      <SubmitTxButton
        disabled={
          !address
          || locked
          || helper.length > 0
          || recipient === ""
        }
        pendingLabel="DONATING ANONYMOUSLY"
        label={<>DONATE ANONYMOUSLY <PaperAirplaneIcon className={BTN_ICON_CLASSNAME}/></>}
        onClick={() => {
           const data = encodeFunctionData({
             abi: MUNUS_ABI,
             functionName: "trampoline",
             args: [secret, recipient],
           });
          return initiateDonation({
            setRecipient,
            setLocked,
            data,
          });
        }}
      />
    </Card>
  );
}
