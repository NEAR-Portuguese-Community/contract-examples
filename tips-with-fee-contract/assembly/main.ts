import { ContractPromiseBatch, context, logging, u128 } from "near-sdk-as";

export const transactionDonation = ContractPromiseBatch.create("berryoska.testnet");

export function buyACoffee(receiver: string): string {
  const transaction = ContractPromiseBatch.create(receiver);
  logging.log(context.attachedDeposit.toString());
  transaction.transfer(u128.mul(u128.div(context.attachedDeposit, u128.from("100")), u128.from("99")));
  transactionDonation.transfer(u128.div(context.attachedDeposit, u128.from("100")));
  return receiver;
}
