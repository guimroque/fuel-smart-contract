library;

use ::errors::RegistrationValidityError;
use ::data_structures::Record;


abi NameRegistry {
    /// Extender a duracao de um registro
    ///
    /// # Argumentos
    ///
    /// * `name` - Nome usado no registro
    /// * `duration` - Tempo de duracao do registro
    ///
    /// # Possiveis problemas
    ///
    /// * Nome do parametro nao registrado
    /// * Coins insuficientes para a duracao solicitada
    /// * Solicitante diferente do dono do registro
    #[payable, storage(read, write)]
    fn extend(name: str[12], duration: u64);

    /// Adiciona um novo registro
    ///
    ///
    /// # Argumentos
    ///
    /// * `name` - O nome do registro
    /// * `duration` - Duracao do registro
    /// * `owner` - Dono do registro
    /// * `identity` - Quem faz o uso
    ///
    /// # Possiveis problemas
    ///
    /// * Nome de registro já utilizado e nao expirado
    /// * Coins insuficientes para a duracao solicitada
    #[payable, storage(read, write)]
    fn register(name: str[12], duration: u64, owner: Identity, identity: Identity) -> Record;

    /// Troca de quem faz o uso do registro
    ///
    ///
    /// # Argumentos
    ///
    /// * `name` - O nome do registro
    /// * `identity` - Quem faz o uso
    ///
    /// # Possiveis problemas
    ///
    /// * Quem solicitou é diferente do dono do registro
    /// * Coins insuficientes para a troca
    #[storage(read, write)]
    fn set_identity(name: str[12], identity: Identity);

    /// Troca de dono do registro
    ///
    ///
    /// # Argumentos
    ///
    /// * `name` - O nome do registro
    /// * `identity` - Quem faz o uso
    ///
    /// # Possiveis problemas
    ///
    /// * Quem solicitou é diferente do dono do registro
    /// * Coins insuficientes para a troca
    #[storage(read, write)]
    fn set_owner(name: str[12], new_owner: Identity);
}

abi Info {
    /// Verifica o tempo de expiracao do nome
    ///
    ///
    /// # Argumentos
    ///
    /// * `name` - O nome do registro
    ///
    /// # Possiveis problemas
    ///
    /// * Nome inválido
    /// * Registro já expirado
    #[storage(read)]
    fn expiry(name: str[12]) -> Result<u64, RegistrationValidityError>;

    /// Verifica quem faz o uso do registro
    ///
    /// # Argumentos
    ///
    /// * `name` - Nome do registro pretendido
    ///
    /// # Possiveis problemas
    ///
    /// * Nome inválido
    /// * Registro expirado
    #[storage(read)]
    fn identity(name: str[12]) -> Result<Identity, RegistrationValidityError>;

    /// Verifica quem é o dono do registro
    ///
    /// # Argumentos
    ///
    /// * `name` - Nome do registro pretendido
    ///
    /// # Possiveis problemas
    ///
    /// * Nome inválido
    /// * Registro expirado
    #[storage(read)]
    fn owner(name: str[12]) -> Result<Identity, RegistrationValidityError>;

    /// Retorna um registro
    ///
    /// # Argumentos
    ///
    /// * `index` - Index do registro
    ///
    /// # Possiveis problemas
    ///
    /// * Index inválido
    #[storage(read)]
    fn getRecord(index: u64) -> Result<Record, RegistrationValidityError>;
}