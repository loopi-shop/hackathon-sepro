export function getContractLink(contract) {
  return `${process.env.NEXT_PUBLIC_SCAN_URL}${contract}`;
}
