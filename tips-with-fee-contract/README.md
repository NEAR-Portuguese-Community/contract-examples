# Transações Com Taxa

Para dar deploy na testnet:

```
npx asb
near dev-deploy ./out/main.wasm
```

Para chamar a função da cli:

```
near call CONTRACT-ID buyACoffee '{"receiver": "RECEIVER-NETWORKID"}' --amount AMOUNT-OF-NEAR --account_id YOUR-LOGGED-ACCOUNT-ID
```
