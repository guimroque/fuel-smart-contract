import { useState, useEffect, useMemo } from "react";
import { useIsConnected } from "./hooks/useIsConnected";
import { useFuel } from "./hooks/useFuel";
import { WalletLocked } from "fuels";
import { CounterContractAbi__factory } from "./contracts"
import AllItems from "./components/AllItems";
import ListItem from "./components/ListItem";
import "./App.css";

const CONTRACT_ID = "0xad6cb2ea1d3163f7e18577f5351a607c893caac4380abe81d248dd5c374a63f1"

function App() {
  const [wallet, setWallet] = useState<WalletLocked>();
  const [isConnected] = useIsConnected();
  const [fuel] = useFuel();
  const [active, setActive] = useState<'all-items' | 'list-item'>('all-items');

  useEffect(() => {
    async function getAccounts() {
      const currentAccount = await fuel.currentAccount();
      console.log('[CURRENT_ACCOUNT]: ', currentAccount)
      const tempWallet = await fuel.getWallet(currentAccount)

      console.log('[TEMP_WALLET]: ', await tempWallet.address)
      setWallet(tempWallet)
    }
    if (fuel) getAccounts();
  }, [fuel]);

  const contract = useMemo(() => {
    if (fuel && wallet) {
      const contract = CounterContractAbi__factory.connect(CONTRACT_ID, wallet);
      return contract;
    }
    return null;
  }, [fuel, wallet]);


  return (
    <div className="App">
      <header>
        <h1>Sway Marketplace</h1>
      </header>
      <nav>
        <ul>
          <li className={active === 'all-items' ? "active-tab" : ""} onClick={() => setActive('all-items')}>See All Items</li>
          <li className={active === 'list-item' ? "active-tab" : ""} onClick={() => setActive('list-item')}>List an Item</li>
        </ul>
      </nav>

      {fuel ? (
        <div>
          {isConnected ? (
            <div>
              {active === 'all-items' && <AllItems contract={contract} />}
              {active === 'list-item' && <ListItem contract={contract} />}
            </div>
          ) : (
            <div>
              <button onClick={() => fuel.connect()}>Connect Wallet</button>
            </div>
          )}
        </div>
      ) : (
        <div>
          Download the{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://wallet.fuel.network/"
          >
            Fuel Wallet
          </a>{" "}
          to use the app.
        </div>
      )}
    </div>
  );
}

export default App;
