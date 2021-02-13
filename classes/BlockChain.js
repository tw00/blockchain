import CryptoBlock from "./CryptoBlock";
import Transaction from "./Transaction";

class BlockChain {
  constructor() {
    this.difficulty = 4;
    this.pendingTransactions = [];
    this.miningReward = 10;
    this.blockchain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    const block = new CryptoBlock(
      "01/01/2020",
      [{ msg: "Initial Block in the Chain" }],
      "0"
    );
    block.proofOfWork(this.difficulty);
    return block;
  }

  getLatestBlock() {
    return this.blockchain[this.blockchain.length - 1];
  }

  addTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  minePendingTransactions(miningRewardAddress) {
    const block = new CryptoBlock(Date.now(), this.pendingTransactions);
    block.previousHash = this.getLatestBlock().hash;
    block.proofOfWork(this.difficulty);

    console.log("💎 Block successfully mined!");
    this.blockchain.push(block);

    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward),
    ];
  }

  addNewBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    //newBlock.hash = newBlock.computeHash();
    newBlock.proofOfWork(this.difficulty);
    this.blockchain.push(newBlock);
  }

  getBalanceOfAddress(address) {
    let balance = 0;
    for (const block of this.blockchain) {
      for (const transaction of block.transactions || []) {
        if (transaction.fromAddress === address) {
          balance -= transaction.amount;
        }

        if (transaction.toAddress === address) {
          balance += transaction.amount;
        }
      }
    }
    return balance;
  }

  isBlockchainValid() {
    for (let i = 0; i < this.blockchain.length; i++) {
      const currentBlock = this.blockchain[i];
      if (
        currentBlock.hash.substring(0, this.difficulty) !==
        Array(this.difficulty + 1).join("0")
      ) {
        return false;
      }

      // Check nonce value
      if (currentBlock.computeHash() !== currentBlock.hash) {
        return false;
      }
    }

    for (let i = 1; i < this.blockchain.length; i++) {
      const currentBlock = this.blockchain[i];
      const previousBlock = this.blockchain[i - 1];

      // if (currentBlock.hash !== currentBlock.computeHash()) {
      //   return false;
      // }
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

export default BlockChain;
