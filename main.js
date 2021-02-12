import CryptoBlock from "./classes/CryptoBlock";
import BlockChain from "./classes/BlockChain";

console.log("CryptoBlock", CryptoBlock);

let econicoin = new BlockChain();

econicoin.addNewBlock(
  new CryptoBlock(1, "02/11/2020", {
    sender: "Alex",
    recipient: "Thomas",
    quantity: 500,
  })
);

econicoin.addNewBlock(
  new CryptoBlock(2, "02/12/2020", {
    sender: "Thomas",
    recipient: "Skyler",
    quantity: 100,
  })
);

console.log(JSON.stringify(econicoin, null, 4));
const valid = econicoin.checkChainValidity();
console.log("valid", valid);
