import CryptoBlock from "./CryptoBlock";

class BlockChain {
  constructor() {
    this.blockchain = [this.createGenesisBlock()];
    this.difficulty = 4;
  }

  createGenesisBlock() {
    return new CryptoBlock(0, "01/01/2020", "Initial Block in the Chain", "0");
  }

  getLatestBlock() {
    return this.blockchain[this.blockchain.length - 1];
  }

  // addNewBlock(newBlock) {
  //   newBlock.precedingHash = this.getLatestBlock().hash;
  //   newBlock.hash = newBlock.computeHash();
  //   this.blockchain.push(newBlock);
  // }

  addNewBlock(newBlock) {
    newBlock.precedingHash = this.getLatestBlock().hash;
    //newBlock.hash = newBlock.computeHash();
    newBlock.proofOfWork(this.difficulty);
    this.blockchain.push(newBlock);
  }

  checkChainValidity() {
    for (let i = 1; i < this.blockchain.length; i++) {
      const currentBlock = this.blockchain[i];
      const precedingBlock = this.blockchain[i - 1];

      if (currentBlock.hash !== currentBlock.computeHash()) {
        return false;
      }
      if (currentBlock.precedingHash !== precedingBlock.hash) return false;
    }
    return true;
  }
}

export default BlockChain;
