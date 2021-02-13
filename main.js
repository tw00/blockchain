import BlockChain from "./classes/BlockChain";
import Transaction from "./classes/Transaction";

console.clear();
console.log("🪙🚀 econicoin - to the moon");
console.log("---------------------------");

let econicoin = new BlockChain();

econicoin.addTransaction(new Transaction("Alex", "Thomas", 500));
econicoin.addTransaction(new Transaction("Thomas", "Skyler", 100));
console.log("💸 Making transactions");
econicoin.pendingTransactions.forEach((t) =>
  console.log(`  - ${t.fromAddress} ➟ ${t.toAddress}: Ĕ ${t.amount}`)
);

console.log("⛏️ Starting mining...");
econicoin.minePendingTransactions("Thomas");

console.log("⛏️ Starting mining...");
econicoin.minePendingTransactions("Thomas");

console.log("💰 Thomas' Balance: Ĕ", econicoin.getBalanceOfAddress("Thomas"));
console.log("💰 Alex' Balance:   Ĕ", econicoin.getBalanceOfAddress("Alex"));

const valid = econicoin.isBlockchainValid();
console.log("💔 is chain valid?", valid);

console.log("BLOCKCHAIN", JSON.stringify(econicoin.blockchain, null, 2));
