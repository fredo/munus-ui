import { useState } from "react";
import toast from "react-hot-toast";

import { Card } from "@tw/Card";
import { SecretBox} from "@components/SecretBox";
import { DonationInput } from "@tw/DonationInput";
import { DropDown } from "@tw/DropDown";
import { Button } from "@tw/Button";
import { useAccount } from "wagmi";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useInitiateDonation } from "hooks/useInitiateDonation";
import { bytesToHex, encodeFunctionData, keccak256} from "viem";
import { MUNUS_ABI } from "constants/abis";

export const WITHDRAWAL_GAS = 3850000n;

export function getRandomBytes32(): string {
    return bytesToHex(crypto.getRandomValues(new Uint8Array(32)));
}

export function MainForm({ locked, setLocked, calculators }) {
  const { address, chain } = useAccount();

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState(1);
  const [secret, _setSecret] = useState(getRandomBytes32());
  const [isPending, setIsPending] = useState(false);

  const initiateDonation = useInitiateDonation();

  const hash = keccak256(secret);

  return (
    <Card title="ANONYMOUSLY DONATE">
      <DonationInput
        className="font-telegrama"
        placeholder="Enter the receiving address here."
        value={recipient}
        onChange={(event) => {
          setRecipient(event.target.value);
        }}
        onAmountChange={(event) => {
          setAmount(parseInt(event.target.value));

        }}
        disabled={locked}
      />
      <Button
        disabled={!address || locked || recipient === ""}
        fancy={true}
        className="w-full font-telegrama rounded-lg h-14"
        onClick={async () => {
          if (chain === undefined) {
            toast.error("Please connect your wallet to a supported network.");
            return
          }

          if (recipient === "") {
            toast.error("Please enter an address.");
            return
          }

          setIsPending(true);
          try {
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
                amount
              });
            } catch(err) {
              toast.error(err.message);
            }
          } finally {
            setIsPending(false);
          }
        }}
      >
        {isPending ?
          <>
            <span className="animate-pulse">DONATING ANONYMOUSLY</span>
            {" "}
            <ButtonLoadingSpinner className="-mt-1"/>
          </>
          :
          <span>DONATE ANONYMOUSLY <PaperAirplaneIcon className="inline w-5 h-5 -mt-1"/></span>
        }
      </Button>
      <div className="text-sm text-yellow-900 pb-2">
        The recipient address and the donation will be broadcast and publicly visible to the blockchain.
        Only <span className="italic">your identity</span> will be hidden.
      </div>

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
    </Card>
  );
}
