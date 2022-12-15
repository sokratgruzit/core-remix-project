## Remix Simulator

[![npm version](https://badge.fury.io/js/%40remix-project%2Fremix-simulator.svg)](https://www.npmjs.com/package/@remix-project/remix-simulator)
[![npm](https://img.shields.io/npm/dt/@remix-project/remix-simulator.svg?label=Total%20Downloads)](https://www.npmjs.com/package/@remix-project/remix-simulator)
[![npm](https://img.shields.io/npm/dw/@remix-project/remix-simulator.svg)](https://www.npmjs.com/package/@remix-project/remix-simulator)
[![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/ethereum/remix-project/tree/master/libs/remix-simulator)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/ethereum/remix-project/issues)

`@remix-project/remix-simulator` is a web3 wrapper for different kind of providers. It is used in `remix-tests` library and in Apeirogon IDE codebase.

### Installation

`@remix-project/remix-simulator` is an NPM package and can be installed using NPM as:

`yarn add @remix-project/remix-simulator`

### How to use

`@remix-project/remix-simulator` implements:

- [x] web3_clientVersion
- [x] web3_sha3
- [x] net_version
- [x] net_listening
- [x] net_peerCount
- [x] eth_protocolVersion
- [x] eth_syncing
- [x] eth_coinbase
- [x] eth_mining
- [x] eth_hashrate
- [~] eth_gasPrice
- [~] eth_accounts
- [x] eth_blockNumber
- [x] eth_getBalance
- [~] eth_getStorageAt
- [x] eth_getTransactionCount
- [x] eth_getBlockTransactionCountByHash
- [x] eth_getBlockTransactionCountByNumber
- [~] eth_getUncleCountByBlockHash
- [~] eth_getUncleCountByBlockNumber
- [x] eth_getCode
- [~] eth_sign
- [x] eth_sendTransaction
- [_] eth_sendRawTransaction
- [x] eth_call
- [~] eth_estimateGas
- [x] eth_getBlockByHash
- [x] eth_getBlockByNumber
- [x] eth_getTransactionByHash
- [x] eth_getTransactionByBlockHashAndIndex
- [x] eth_getTransactionByBlockNumberAndIndex
- [x] eth_getTransactionReceipt
- [_] eth_getUncleByBlockHashAndIndex
- [_] eth_getUncleByBlockNumberAndIndex
- [x] eth_getCompilers (DEPRECATED)
- [x] eth_compileSolidity (DEPRECATED)
- [x] eth_compileLLL (DEPRECATED)
- [x] eth_compileSerpent (DEPRECATED)
- [x] eth_newFilter
- [x] eth_newBlockFilter
- [x] eth_newPendingTransactionFilter
- [x] eth_uninstallFilter
- [~] eth_getFilterChanges
- [~] eth_getFilterLogs
- [x] eth_getLogs
- [_] eth_getWork
- [_] eth_submitWork
- [_] eth_submitHashrate
- [_] eth_getProof
- [_] db_putString
- [_] db_getString
- [_] db_putHex
- [_] db_getHex
- [_] debug_traceTransaction
- [x] eth_subscribe
- [x] eth_unsubscribe
- [_] miner_start
- [_] miner_stop
- [_] personal_listAccounts
- [_] personal_lockAccount
- [_] personal_newAccount
- [_] personal_importRawKey
- [_] personal_unlockAccount
- [_] personal_sendTransaction
- [_] rpc_modules

### Contribute

Please feel free to open an issue or a pull request.

In case you want to add some code, do have a look to our contribution guidelnes [here](https://github.com/ethereum/remix-project/blob/master/CONTRIBUTING.md). Reach us on [Gitter](https://gitter.im/ethereum/remix) in case of any queries.

### License

MIT © 2018-21 Remix Team
