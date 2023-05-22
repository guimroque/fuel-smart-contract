import { useEffect, useState } from "react";
import { CounterContractAbi } from "../contracts";
import { WalletLocked, bn, Wallet, Address } from "fuels";
import { useFuel } from "../hooks/useFuel";
import { AddressInput, ContractIdInput, IdentityInput } from "../contracts/CounterContractAbi";
interface ListItemsProps {
  contract: CounterContractAbi | null;
}

export default function ListItem({contract}: ListItemsProps){
    const [metadata, setMetadata] = useState<string>("");
    const [price, setPrice] = useState<string>("0");
    const [status, setStatus] = useState<'success' | 'error' | 'loading' | 'none'>('none');
    const [fuel] = useFuel();
    

    useEffect(()=> {
        findByName();
    }, [])


    const findByName = async() => {
        try{
            // const value = await contract?.functions.getRecord(1).call().then((res) => {
            //     console.log('[RES]: ', res)
            //     return res;
            // })
            // console.log(value)
            
        } catch (e) {
            console.log("ERROR:", e);
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        setStatus('loading')
        const account_identity = contract?.account?.address.toString() as unknown as AddressInput;
        const contract_id = contract?.id.toString() as unknown as ContractIdInput;
        if(contract !== null && account_identity !== null){
            try {
                const account = await fuel.currentAccount();
                const walet = await fuel.getWallet(account);
                if(contract !== null){
                    // const { value } = await contract.functions.findByName(await makeString(metadata)).get();
                    // console.log('[ITEM]: ', value)
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

                <div className="form-control">
                    <button type="submit">List item</button>
                </div>
            </form>
            }

            {status === 'success' && <div>Item successfully listed!</div>}
            {status === 'error' && <div>Error listing item. Please try again.</div>}
            {status === 'loading' && <div>Listing item...</div>}
        </div>
    )
}

function identityInput(metadata: string, walletOwner: WalletLocked) {
    throw new Error("Function not implemented.");
}
