import { useState } from "react";
//import { ItemOutput, ItemStatusInput } from "../contracts/CounterContractAbi";
import { CounterContractAbi } from "../contracts";

interface ItemCardProps {
  contract: CounterContractAbi | null;
  //item: ItemOutput;
}

const assetId = "0x0000000000000000000000000000000000000000000000000000000000000000"

export default function ItemCard({ contract }: ItemCardProps) {
  const [status, setStatus] = useState<'success' | 'error' | 'loading' | 'none'>('none');

  // async function handleBuyItem() {
  //   if (contract !== null) {
  //     setStatus('loading')
  //     try {
  //       await contract.functions.buy_item(item.id)
  //       .txParams({ variableOutputs: 1 })
  //       .callParams({
  //           forward: [item.price, assetId],
  //         })
  //       .call()
  //       setStatus("success");
  //     } catch (e) {
  //       console.log("ERROR:", e);
  //     }
  //   }
  // }

  return (
    <div className="item-card" style={{width: '80vw', border: `1px solid red`}}>
      {/* <div>Id: {item.id}</div>
      <div>Nome: {item.name.split('').filter(e => e != '.').join('')}</div>
      <div>Price: {parseFloat(item.price.format())} ETH</div>
      <div>Criador: {item.owner}<div/>
      <div>Status: {ItemStatusInput[item.status]}</div> 
      {status === 'success' && <div>Purchased ✅</div>}
      {status === 'error' && <div>Something went wrong ❌</div>}
      {status === 'none' &&  <button onClick={handleBuyItem}>Buy Item</button>} 
      {status === 'loading' && <div>Buying item..</div>} 
      */}
    </div>
    //</div>
  );
}
