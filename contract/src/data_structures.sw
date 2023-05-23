library;

pub struct Record {
    expiry: u64, //vencimento
    identity: Identity, // identidade que possui nome o registro
    owner: Identity, // identidade que controla o registro
    name: str[12],
}

impl Record {
    pub fn new(expiry: u64, identity: Identity, owner: Identity, name: str[12]) -> Self {
        Self {
            expiry,
            identity,
            owner,
            name,
        }
    }
}