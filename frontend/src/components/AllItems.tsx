import { useState, useEffect } from "react";
import { CounterContractAbi } from "../contracts";
//import {ItemInput, ItemOutput } from "../contracts/CounterContractAbi";

import ItemCard from "./ItemCard";
import { useFuel } from "../hooks/useFuel";
import { RecordOutput } from "../contracts/CounterContractAbi";

interface AllItemsProps {
  contract: CounterContractAbi | null;
}

interface Item {
  Ok: RecordOutput
}

export default function AllItems({ contract }: AllItemsProps) {
  const [items, setItems] = useState<Item[] | undefined>([]);
  const [itemCount, setItemCount] = useState<number>(0);
  const [fuel] = useFuel();
  const [status, setStatus] = useState<'success' | 'loading' | 'error'>('loading');
  const [inputValue, setInputValue] = useState<boolean>(false)

  useEffect(() => {
    async function getAllItems() {
      if (contract !== null && contract.account?.address !== null) {
        try {
          const wallet_address = await fuel.currentAccount();
          const {value} = await contract.functions.getRecordCount().get();
          let formattedValue = parseFloat(value.format()) * 1_000_000_000;
          let list = []
          setItemCount(formattedValue);
          for (let i=1; i <= formattedValue; i++){
            const result = await contract.functions.getRecord(i).get();
            list.push(result.value)
          }
          setItems( inputValue ? await getMyItems(list) : list )
          setStatus('success')
        } catch (e) {
          setStatus('error')
          console.log("ERROR:", e);
        }
      }
    }
    getAllItems();
  }, [inputValue]);


  const getMyItems = async(item: Item[]) => {
    try{
        const myItems = !!items && items.length>0 ? items.filter((e) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            return e['Ok'].owner.Address?.value.toString() === contract?.account?.address.toB256()
        }) : []
        console.log(myItems)
        return myItems
    }catch(e){
      console.log(e)
    }
  }

  return (
    <div>
      <h2>All Items</h2>
      {status === 'success' &&
        <div>
          {!!items && items.length>0 && items.length <= 0 ? (
            <div>Uh oh! No items have been listed yet</div>
          ) : (
            <div >
              <div>Total items: {itemCount}</div>
              <div>My items </div>
              <input type="radio" checked={inputValue} onClick={() => setInputValue(!inputValue)}/>
              <div className="items-container" style={{display: 'flex', flexDirection: 'column'}}>
                  {!!items && items.length>0 && items.map((item) => (
                    <ItemCard contract={contract} item={item.Ok}/>
                  ))}
              </div>
          </div>
          )}
        </div>
      }
      {status === 'error' && <div>Something went wrong, try reloading the page.</div>}
      {status === 'loading' && <div>Loading...</div>}
    </div>
  );
}
