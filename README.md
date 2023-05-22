# Fuel smart contract [DEV]


Documentação: https://fuelbook.fuel.network/master/quickstart/developer-quickstart.html

- Instale [Rust](https://www.rust-lang.org/tools/install) e [Fuel toolchain](https://github.com/FuelLabs/fuelup)

- Inicia o pacote de ferramentas: ```fuelup default beta-3```
- Gera o build do contrato: ```forc build```
- Crie os testes: ```cargo install cargo-generate```

    1. Codifique seus testes no arquivo ```tests/harness```
    2. Para rodar testes: ```cargo test```
- Executa o contrato localmente: ```fuel-core run --ip 127.0.0.1 --port 4000 --chain ./chainConfig.json --db-path ./.fueldb```
    1. Edite no arquivo ```chainConfig.json```os valores de inicializacao da rede incluindo carteiras e coins quando necessarios
- Faça deploy localmente: ```forc deploy --node-url 127.0.0.1:4000  --unsigned```
- Acesse o link [NETWORK_EXPLORER](https://fuellabs.github.io/block-explorer-v2/beta-3/) configure o apontamento para a rede local para ter acesso as transações executadas localmente

- Agora para rodar o front
    1. Acesse a pasta ```cd ui```
    2. Instale o sdk da fuel ```npm install fuels@0.38.0 @fuel-wallet/sdk --save```
    3. Gere os metodos do contrato dentro do projeto do frontend ```npx fuels typegen -i ../<NOME_DO_CONTRATO/>/out/debug/*-abi.json -o ./src/contracts```
    4. Insira o valor para a chave ```CONTRACT_ID``` com o ID de contrato gerado no item de deploy.
    5. Execute o frontend ```npm start``` e seu projeto estará rodando na porta 3001


- Connect na sua [wallet](https://wallet.fuel.network/docs/install/)
    1. Adicione uma nova conta a partir de uma chave privada ```0xa449b1ffee0e2205fa924c6740cc48b3b473aa28587df6dab12abc245d1f5298```

- Gerenciamento da sua wallet via terminal
    1. Com sua wallet criada, crie uma nova conta dentro da wallet: ```forc-wallet account```
    2. Liste suas contas: ```forc-wallet accounts```
    3. Obter chave privada: ```forc-wallet account <INDEX_CONTA/> private-key```
    4. Obter chave pública: ```forc-wallet account <INDEX_CONTA/> public-key```