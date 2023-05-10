# Fuel smart contract [DEV]


Documentação: https://fuelbook.fuel.network/master/quickstart/developer-quickstart.html

- Instale [Rust](https://www.rust-lang.org/tools/install) e [Fuel toolchain](https://github.com/FuelLabs/fuelup)

- Inicia o pacote de ferramentas: ```fuelup default beta-3```
- Gera o build do contrato: ```forc build```
- Crie os testes: ```cargo install cargo-generate```

    1. Codifique seus testes no arquivo ```tests/harness```
    2. Para rodar testes: ```cargo test```
- Executa o contrato localmente: ```fuel-core run --ip 127.0.0.1 --port 4001 --chain ./chainConfig.json --db-path ./.fueldb```
    1. Edite no arquivo ```chainConfig.json```os valores de inicializacao da rede incluindo carteiras e coins quando necessarios
- Faça deploy localmente: ```forc deploy --node-url 127.0.0.1:4001  --unsigned```
- Acesse o link [NETWORK_EXPLORER](https://fuellabs.github.io/block-explorer-v2/beta-3/) configure o apontamento para a rede local para ter acesso as transações executadas localmente
