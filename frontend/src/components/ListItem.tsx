import { useEffect, useState } from "react";
import { CounterContractAbi } from "../contracts";
import { useFuel } from "../hooks/useFuel";
import { AddressInput, RecordOutput } from "../contracts/CounterContractAbi";
import ItemCard from "./ItemCard";
interface ListItemsProps {
  contract: CounterContractAbi | null;
}
interface Item {
    Ok: RecordOutput
}

export default function ListItem({contract}: ListItemsProps){
    const [metadata, setMetadata] = useState<string>("");
    const [nameUsed, setNameUsed] = useState<Item>()
    const [price, setPrice] = useState<string>("0");
    const [status, setStatus] = useState<'success' | 'error' | 'loading' | 'none'>('none');
    const [fuel] = useFuel();
    

    useEffect(()=> {
        if(metadata.length > 0){
            findByName();
        }
    }, [metadata])

    

    const findByName = async() => {
        try{
            const value = await contract?.functions.recordByName(await makeString(metadata)).get()
            console.log(value?.value)
            if(value?.value['Ok']){
                setNameUsed(value.value)
            }else if(value?.value['Err']){
                setNameUsed(undefined)
            }
        } catch (e) {
            console.log("ERROR:", e);
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        setStatus('loading')
        const account_identity = contract?.account?.address.toString() as unknown as AddressInput;
        
        if(contract !== null && account_identity !== null){
            try {
                const account = await fuel.currentAccount();
                const walet = await fuel.getWallet(account);
                if(contract !== null){
                    const {value} = await contract.functions.register(
                        await makeString(metadata),
                        price,
                        {
                            Address:{
                                value: walet.address.toB256(),
                            }
                        },
                        {
                            Address:{
                                value: walet.address.toB256(),
                            }
                        }
                    ).call();
                    console.log(value)
                }
            } catch (e) {
                console.log("ERROR:", e);
                setStatus('error')
            }
        } else {
            console.log("ERROR: Contract is null");
        }
    }
    
    const makeString = async(str: string) => {
        let world = str
        if(world.length < 12){
            while(world.length < 12){
                world += ".";
            }
        }
        return world
    }

    return (
        <div>
            <h2>List an Item</h2>
            {status === 'none' &&
            <form onSubmit={handleSubmit}>
                <div className="form-control">
                    <label htmlFor="metadata">Nome de registro:</label>
                    <input 
                        id="metadata" 
                        type="text" 
                        // pattern="\w{20}" 
                        // title="The metatdata must be 20 characters"
                        required 
                        onChange={(e) => setMetadata(e.target.value)}
                    />
                </div>

                <div className="form-control">
                    <label htmlFor="price">Duração[ms]: </label>
                    <input
                        id="price"
                        type="number"
                        required
                        min="0"
                        step="any"
                        inputMode="decimal"
                        placeholder="0.00"
                        onChange={(e) => {
                          setPrice(e.target.value);
                        }}
                      />
                </div>

                {
                    nameUsed == undefined &&<div className="form-control">
                        <button type="submit">List item</button>
                    </div>
                }
            </form>
            }
            {
                !!nameUsed &&
                <div className="items-container">
                    <ItemCard contract={contract} item={nameUsed.Ok}/>
                </div>
            }
            {status === 'success' && <div>Item successfully listed!</div>}
            {status === 'error' && <div>Error listing item. Please try again.</div>}
            {status === 'loading' && <div>Listing item...</div>}
        </div>
    )
}
