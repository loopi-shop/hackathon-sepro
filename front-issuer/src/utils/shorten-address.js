export const shortenAddress = (address, startLength, endLength) => {
  if (!address || address.length < startLength + endLength) {
    return '';
  }

  const start = address.substring(0, startLength);
  const end = address.substring(address.length - endLength);

  return `${start}...${end}`;
};
