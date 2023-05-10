export default function sumLoan(returns: { amount: number }[]) {
  return returns.reduce((acc, curr) => acc + curr.amount, 0);
}
