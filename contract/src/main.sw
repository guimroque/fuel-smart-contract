contract;

mod data_structures;
mod errors;
mod events;
mod interface;

use ::data_structures::Record;
use ::errors::{AssetError, AuthorisationError, RegistrationValidityError};
use ::events::{
    IdentityChangedEvent,
    NameRegisteredEvent,
    OwnerChangedEvent,
    RegistrationExtendedEvent,
};
use ::interface::{Info, NameRegistry};
use std::{auth::msg_sender, block::timestamp, call_frames::msg_asset_id, context::msg_amount};
/// Parametros configuráveis do contrato
///
/// - ASSET_ID: Chave privada do dono deste contrato [0x00...0]
/// - PRICE_PER: Preço por unidade de tempo [gas]
/// - UNITY_TIME: Unidade de tempo [ms -> 100ms = 100]
configurable {
    ASSET_ID: ContractId = ContractId::from(0x0000000000000000000000000000000000000000000000000000000000000000),
    PRICE_PER_HUNDRED: u64 = 1,
    UNITY_TIME: u64 = 100,
}

storage {
    /// Armazenamento de todos os nomes de registro usados
    names: StorageMap<str[12], Record> = StorageMap {},
    indexes: StorageMap<u64, str[12]> = StorageMap {},
    indexex_counter: u64 = 0,
}

impl NameRegistry for Contract {
    #[payable]
    #[storage(read, write)]
    fn extend(name: str[12], duration: u64) {
        require(storage.names.get(name).is_some(), RegistrationValidityError::NameNotRegistered);
        require(msg_asset_id() == ASSET_ID, AssetError::IncorrectAssetSent);
        require((duration / UNITY_TIME) * PRICE_PER_HUNDRED <= msg_amount(), AssetError::InsufficientPayment);

        let mut record = storage.names.get(name).unwrap();
        record.expiry = record.expiry + duration;

        storage.names.insert(name, record);

        log(RegistrationExtendedEvent {
            duration,
            name,
            new_expiry: record.expiry,
        });
    }

    #[payable]
    #[storage(read, write)]
    fn register(
        name: str[12],
        duration: u64,
        owner: Identity,
        identity: Identity,
    ) -> Record {
        if storage.names.get(name).is_some() {
            let record = storage.names.get(name).unwrap();
            require(timestamp() > record.expiry, RegistrationValidityError::NameNotExpired);
        }

        require(msg_asset_id() == ASSET_ID, AssetError::IncorrectAssetSent);
        require((duration / UNITY_TIME) * PRICE_PER_HUNDRED <= msg_amount(), AssetError::InsufficientPayment);

        let record = Record::new(timestamp() + duration, identity, owner, name);
        storage.names.insert(name, record);
        storage.indexes.insert(storage.indexex_counter+1, name);
        storage.indexex_counter = storage.indexex_counter + 1;


        log(NameRegisteredEvent {
            expiry: record.expiry,
            name,
            owner,
            identity,
        });

        return record
    }

    #[storage(read, write)]
    fn set_identity(name: str[12], identity: Identity) {
        require(storage.names.get(name).is_some(), RegistrationValidityError::NameNotRegistered);
        let previous_record = storage.names.get(name).unwrap();
        require(timestamp() < previous_record.expiry, RegistrationValidityError::NameExpired);
        require(previous_record.owner == msg_sender().unwrap(), AuthorisationError::SenderNotOwner);

        let new_record = Record::new(previous_record.expiry, identity, previous_record.owner, previous_record.name);

        storage.names.insert(name, new_record);

        log(IdentityChangedEvent {
            name,
            new_identity: new_record.identity,
            previous_identity: previous_record.identity,
        });
    }

    #[storage(read, write)]
    fn set_owner(name: str[12], owner: Identity) {
        require(storage.names.get(name).is_some(), RegistrationValidityError::NameNotRegistered);
        let previous_record = storage.names.get(name).unwrap();
        require(timestamp() < previous_record.expiry, RegistrationValidityError::NameExpired);
        require(previous_record.owner == msg_sender().unwrap(), AuthorisationError::SenderNotOwner);

        let new_record = Record::new(previous_record.expiry, previous_record.identity, owner, previous_record.name);

        storage.names.insert(name, new_record);

        log(OwnerChangedEvent {
            name,
            new_owner: new_record.owner,
            previous_owner: previous_record.owner,
        });
    }
}

impl Info for Contract {
    #[storage(read)]
    fn expiry(name: str[12]) -> Result<u64, RegistrationValidityError> {
        match storage.names.get(name) {
            Option::Some(record) => {
                match timestamp() < record.expiry {
                    true => Result::Ok(record.expiry),
                    false => Result::Err(RegistrationValidityError::NameExpired),
                }
            },
            Option::None => Result::Err(RegistrationValidityError::NameNotRegistered),
        }
    }

    #[storage(read)]
    fn recordByName(name: str[12]) -> Result<Record, RegistrationValidityError> {
        match storage.names.get(name) {
            Option::Some(item) => {
                Result::Ok(item)
            }
            Option::None => Result::Err(RegistrationValidityError::NameNotRegistered),
        }
    }

    #[storage(read)]
    fn identity(name: str[12]) -> Result<Identity, RegistrationValidityError> {
        match storage.names.get(name) {
            Option::Some(record) => {
                match timestamp() < record.expiry {
                    true => Result::Ok(record.identity),
                    false => Result::Err(RegistrationValidityError::NameExpired),
                }
            },
            Option::None => Result::Err(RegistrationValidityError::NameNotRegistered),
        }
    }

    #[storage(read)]
    fn owner(name: str[12]) -> Result<Identity, RegistrationValidityError> {
        match storage.names.get(name) {
            Option::Some(record) => {
                match timestamp() < record.expiry {
                    true => Result::Ok(record.owner),
                    false => Result::Err(RegistrationValidityError::NameExpired),
                }
            },
            Option::None => Result::Err(RegistrationValidityError::NameNotRegistered),
        }
    }

    //todo: make an filter, receving any booleans (myItems, expired, )
    #[storage(read)]
    fn getRecord(index: u64) -> Result<Record, RegistrationValidityError> {
            
            match storage.indexes.get(index) {
                Option::Some(record) => {
                    match storage.names.get(record) {
                        Option::Some(item) => {
                            Result::Ok(item)
                        },
                        Option::None => Result::Err(RegistrationValidityError::NameNotRegistered),
                    }
                }
                Option::None => Result::Err(RegistrationValidityError::NameNotRegistered),
            }
    }

    #[storage(read)]
    fn getRecordCount() -> u64 {
        return storage.indexex_counter;
    }
}
    
