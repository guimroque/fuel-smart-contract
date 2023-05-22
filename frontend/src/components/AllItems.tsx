import { useState, useEffect } from "react";
import { CounterContractAbi } from "../contracts";
//import {ItemInput, ItemOutput } from "../contracts/CounterContractAbi";

import ItemCard from "./ItemCard";
import { useFuel } from "../hooks/useFuel";
import { Vec } from "../contracts/common";
import { Address } from "fuels/*";

interface AllItemsProps {
  contract: CounterContractAbi | null;
}

export default function AllItems({ contract }: AllItemsProps) {
  //const [items, setItems] = useState<ItemOutput[]>([]);
  const [itemCount, setItemCount] = useState<number>(0);
  const [fuel] = useFuel();
  const [status, setStatus] = useState<'success' | 'loading' | 'error'>('loading');


  useEffect(() => {
    async function getAllItems() {
      console.log('[get_all_items]: ')
      if (contract !== null && contract.account?.address !== null) {
        try {
          const wallet_address = await fuel.currentAccount();
          const wallet = await fuel.getWallet(wallet_address);
          const {value} = await contract.functions.getRecord(1).get();
          console.log(value)
          
          setStatus('success')
        } catch (e) {
          setStatus('error')
          console.log("ERROR:", e);
        }
      }
    }
    getAllItems();
    //getMyItems();
  }, [contract]);

  const getMyItems = async() => {
    try{
      //console.log('[BUSCA MEUS ITEMS]: ')
    // const input = {
    //   Address: await contract?.,
    //   ContractId: contract?.id
    // } as unknown as IdentityInput;



    // console.log('[INPUT]: ', contract?.interface)
    // console.log('[INPUT]: ', contract?.provider)
    
    // const result = await contract?.functions.getMyItems(
    //   input
    // ).get() as unknown as ItemOutput[];
    // console.log('[GET_MY_ITEMS]: ', result)
    // console.log('[GET_MY_ITEMS]', result.forEach((e)=> {
    //   return e
    // }))
    }catch(e){
      console.log(e)
    }
  }

  return (
    <div>
      <h2>All Items</h2>
      {status === 'success' &&
        <div>
          {itemCount === 0 ? (
            <div>Uh oh! No items have been listed yet</div>
          ) : (
            <div>
              <div>Total items: {itemCount}</div>
              {/* <div className="items-container" style={{display: 'flex', flexDirection: 'column'}}>
                  {items.map((item) => (
                  <ItemCard key={item.id} contract={contract} item={item}/>
              ))}
              </div> */}
          </div>
          )}
        </div>
      }
      {status === 'error' && <div>Something went wrong, try reloading the page.</div>}
      {status === 'loading' && <div>Loading...</div>}
    </div>
  );
}
