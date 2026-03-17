export function formatTimestamp(timestamp: bigint | string | number): string {
  if (!timestamp) return 'N/A';
  return new Date(Number(timestamp) * 1000).toLocaleString();
}

export function truncateAddress(address: string, length = 10): string {
  if (!address) return '';
  if (address.length <= length * 2) return address;
  return `${address.substring(0, length)}...`;
}
