import { useState } from "react";
//import { ItemOutput, ItemStatusInput } from "../contracts/CounterContractAbi";
import { CounterContractAbi } from "../contracts";
import { RecordOutput } from "../contracts/CounterContractAbi";

interface ItemCardProps {
  contract: CounterContractAbi | null;
  item: RecordOutput;
  //item: ItemOutput;
}

const assetId = "0x0000000000000000000000000000000000000000000000000000000000000000"

export default function ItemCard({ contract, item }: ItemCardProps) {
  const [status, setStatus] = useState<'success' | 'error' | 'loading' | 'none'>('none');

  const convertTime = (num: string) => {
    const time = BigInt(num) - BigInt(Math.pow(2, 62)) - BigInt(10);
    const date = new Date(Number(time) * 1000);
    return `${date.toDateString()} - ${date.toLocaleTimeString()}`
  }

  return (
    <div className="item-card" style={{width: '80vw', border: `1px solid #054a9f`}}>
      <div>Nome: {item.name.split('').filter(e => e != '.').join('')}</div>
      <div>Dono: {item.owner.Address?.value}</div>
      <div>Comprador: {item.identity.Address?.value}</div>
      <div>Expira: {convertTime(item.expiry.toString())}</div>

     
    </div>
    //</div>
  );
}
