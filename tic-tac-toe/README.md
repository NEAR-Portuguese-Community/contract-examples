# Tic-Tac-Toe as a NEAR contract

## Install dependencies
```
yarn
```

## Build and Deploy the contract
```
npx asb
near dev-deploy ./out/main.wasm
# save the contract id in yout clipboard
```

## Run the game
**Create a game**
```
near call <contract-id> createGame '{"player2": "murilo.testnet"}' --account_id <account-id>
```

**Play the game**
```
near call <contract-id> play '{"gameId": 3101680713, "lin": 2}' --account_id <account-id>
```
