import CryptoBlock from './CryptoBlock';
import Transaction from './Transaction';

class BlockChain {
  constructor() {
    this.difficulty = 4;
    this.pendingTransactions = [];
    this.miningReward = 10;
    this.blockchain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    const block = new CryptoBlock(
      '01/01/2020',
      [{ msg: 'Initial Block in the Chain' }],
      '0',
    );
    block.proofOfWork(this.difficulty);
    return block;
  }

  getLatestBlock() {
    return this.blockchain[this.blockchain.length - 1];
  }

  // addTransaction(transaction) {
  //   this.pendingTransactions.push(transaction);
  // }
  addTransaction(transaction) {
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error('Transaction must include from and to address');
    }

    // Verify the transactiion
    if (!transaction.isValid()) {
      throw new Error('Cannot add invalid transaction to chain');
    }

    if (transaction.amount <= 0) {
      throw new Error('Transaction amount should be higher than 0');
    }

    // Making sure that the amount sent is not greater than existing balance
    if (
      this.getBalanceOfAddress(transaction.fromAddress) < transaction.amount
    ) {
      throw new Error('Not enough balance');
    }

    this.pendingTransactions.push(transaction);
    // console.log('transaction added: %s', transaction);
  }

  minePendingTransactions(miningRewardAddress) {
    const block = new CryptoBlock(Date.now(), this.pendingTransactions);
    block.previousHash = this.getLatestBlock().hash;
    block.proofOfWork(this.difficulty);

    console.log('💎 Block successfully mined!');
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

  /**
   * Loops over all the blocks in the chain and verify if they are properly
   * linked together and nobody has tampered with the hashes. By checking
   * the blocks it also verifies the (signed) transactions inside of them.
   *
   * @returns {boolean}
   */
  isBlockchainValid() {
    // Check if the Genesis block hasn't been tampered with by comparing
    // the output of createGenesisBlock with the first block on our chain
    const realGenesis = JSON.stringify(this.createGenesisBlock());

    if (realGenesis !== JSON.stringify(this.blockchain[0])) {
      return false;
    }

    // Check the remaining blocks on the chain to see if there hashes and
    // signatures are correct
    for (let i = 0; i < this.blockchain.length; i++) {
      const currentBlock = this.blockchain[i];

      if (
        currentBlock.hash.substring(0, this.difficulty) !==
        Array(this.difficulty + 1).join('0')
      ) {
        return false;
      }

      if (!currentBlock.hasValidTransactions()) {
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

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }

  /**
   * Returns a list of all transactions that happened
   * to and from the given wallet address.
   *
   * @param  {string} address
   * @return {Transaction[]}
   */
  getAllTransactionsForWallet(address) {
    const txs = [];

    for (const block of this.blockchain) {
      for (const tx of block.transactions) {
        if (tx.fromAddress === address || tx.toAddress === address) {
          txs.push(tx);
        }
      }
    }

    return txs;
  }
}

export default BlockChain;
