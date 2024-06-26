import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { http } from "viem";
import { useAccount, createConfig, fallback, unstable_connector, WagmiProvider } from "wagmi";
import { CustomToaster } from "@components/toasts/CustomToaster";
import { base } from "viem/chains";
import { injected, walletConnect } from "wagmi/connectors";

import { Grid } from "@tw/Grid";
import { PageHeader } from "@layouts/PageHeader";
import { PageFooter } from "@layouts/PageFooter";
import { NavBar } from "@components/navbar";
import { MainPanel } from "@ui/MainPanel";


export function Main() {
  const account = useAccount();
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (account.isConnected && account.chain !== undefined) {
      toast(
        <span>Switched the chain to <b>{account.chain.name}</b>.</span>
      );
    }
  }, [account]);

  useEffect(() => {
    if (account.address) {
      toast(
        <span>
          Switched account to <code>{account.address.slice(0, 6)}...{account.address.slice(-4)}</code>.
        </span>
      );
    }
  }, [account]);

  return (
    <div className="text-slate-400 bg-stone-800 min-h-screen overflow-hidden">
      <NavBar
        {...{ locked, setLocked }}
      />
      <main className="flex-1 relative z-0 overflow-y-auto h-full focus:outline-none">
        <PageHeader/>
        <div className={`2xl:w-3/4 items-center mt-4 sm:mt-6 mx-auto px-4 sm:px-8 md:px-12 py-8 md:pb-14`}>
          <Grid cols={{ xs: 1 }} className="justify-center place-content-center place-items-center" >
            <div className="max-w-[46.3rem] w-full">
              <MainPanel {...{ locked, setLocked }} />
            </div>
          </Grid>
        </div>
      </main>
      <PageFooter/>
    </div>
  );
}

const queryClient = new QueryClient();

const config = createConfig({
  chains: [base],
  pollingInterval: 10000,
  connectors: [
    injected()
  ],
  transports: {
    [base.id]: fallback([
      unstable_connector(injected),
      http()
    ]),
  },
});


function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <CustomToaster/>
        <Main/>
      </QueryClientProvider>
    </WagmiProvider>
  );
}


export default App;
