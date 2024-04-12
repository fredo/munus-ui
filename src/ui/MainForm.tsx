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

  let gas = 0n;
  if (chain?.name === "Base") {
    const l2Gas = WITHDRAWAL_GAS;
    const txCompressedSize = WITHDRAWAL_TX_COMPRESSED_SIZE + optimismTxCompressedSize(data);
    gas = calculators["Base"](l2Gas, txCompressedSize);
  }

  let helper = "";
  if (chain === undefined)
    helper = "Please connect your wallet to a supported network.";
  // will need an error case for non-flask.
  else if (recipient === "")
    helper = "Please enter a nonempty message.";

  const tip = Math.round(parseFloat(formatUnits(gas, 15)));
  const message = `Your donation will cost ${(tip / 1000).toFixed(3)} ETH in gas.`;
  return (
    <Card title="ANONYMOUSLY DONATE">
      <div className="text-sm text-yellow-700 pb-2">
        The message you enter and broadcast below will be public, and visible permanently on the blockchain.
        Only <span className="italic">your identity</span> will be hidden; your message will not be. This action cannot be undone.
      </div>
      <div className="font-telegrama text-sm text-stone-700 pb-1">
        Address
      </div>
      <MessageField
        error={helper.length > 0}
        helper={helper}
        recipient={recipient}
        setRecipient={setRecipient}
        locked={locked}
        label="Receiving Address"
      />
      <div className="text-sm text-yellow-700 pb-2">
        Your secret: {secret}
      </div>
      <div className="pb-2 text-sm text-stone-700">
        {message}
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
             args: [recipient, secret],
           });
          return initiateDonation({
            setRecipient,
            setLocked,
            data,
            tip,
          });
        }}
      />
    </Card>
  );
}
