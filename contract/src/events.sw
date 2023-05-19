library;
// titular -> quem é dono do registro
// identidade -> quem está fazendo uso do registro


/// Troca de identidade
pub struct IdentityChangedEvent {
    name: str[12],
    new_identity: Identity,
    previous_identity: Identity,
}

/// Inclusao de um novo registro
pub struct NameRegisteredEvent {
    expiry: u64,
    name: str[12],
    owner: Identity,
    identity: Identity,
}

/// Troca de titularidade
pub struct OwnerChangedEvent {
    name: str[12],
    new_owner: Identity,
    previous_owner: Identity,
}

/// Extensao de validade de titularidade
pub struct RegistrationExtendedEvent {
    duration: u64,
    name: str[12],
    new_expiry: u64,
}