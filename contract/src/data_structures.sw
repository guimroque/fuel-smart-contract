library;

pub struct Record {
    expiry: u64, //vencimento
    identity: Identity, // identidade que possui nome o registro
    owner: Identity, // identidade que controla o registro
}

impl Record {
    pub fn new(expiry: u64, identity: Identity, owner: Identity) -> Self {
        Self {
            expiry,
            identity,
            owner,
        }
    }
}