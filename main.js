import BlockChain from './classes/BlockChain';
import Transaction from './classes/Transaction';
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const displayAddress = (addr) => (addr ? addr.substring(0, 16) + '...' : 'n/a');
const displayTransactions = (transactions) => {
  transactions.forEach((t) =>
    console.log(
      `  - ${displayAddress(t.fromAddress)} ➟ ${displayAddress(
        t.toAddress,
      )}: Ĕ ${t.amount}`,
    ),
  );
};

console.clear();
console.log('🪙🚀 econicoin - to the moon');
console.log('---------------------------');

let econicoin = new BlockChain();

// Your private key goes here
const myKey = ec.keyFromPrivate(
  '7c4c45907dec40c91bab3480c39032e90049f1a44f3e18c3e07c23e3273995cf',
);

// From that we can calculate your public key (which doubles as your wallet address)
const myWalletAddress = myKey.getPublic('hex');

// Get some coins first
console.log('⛏️ Starting mining...');
econicoin.minePendingTransactions(myWalletAddress);
econicoin.minePendingTransactions(myWalletAddress);

// Create a transaction & sign it with your key
const tx1 = new Transaction(myWalletAddress, 'Alex', 8);
tx1.signTransaction(myKey);
econicoin.addTransaction(tx1);

console.log('💸 Making transactions');
displayTransactions(econicoin.pendingTransactions);

console.log('⛏️ Starting mining...');
econicoin.minePendingTransactions(myWalletAddress);

console.log('⛏️ Starting mining...');
econicoin.minePendingTransactions(myWalletAddress);

console.log(
  "💰 Thomas' Balance: Ĕ",
  econicoin.getBalanceOfAddress(myWalletAddress),
);
console.log("💰 Alex' Balance:   Ĕ", econicoin.getBalanceOfAddress('Alex'));

const myTxList = econicoin.getAllTransactionsForWallet(myWalletAddress);
console.log('🔀 My transactions:');
displayTransactions(myTxList);

const valid = econicoin.isBlockchainValid();
console.log('💔 is chain valid?', valid);

// console.log('BLOCKCHAIN', JSON.stringify(econicoin.blockchain, null, 2));
