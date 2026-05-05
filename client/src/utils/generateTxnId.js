export const generateTxnId = async (cardId, shopId, month) => {
  // Deterministic unique string based on inputs.
  // We use btoa for simplicity as it's synchronous and works well enough for offline determinism without CryptoAPI async overhead here.
  const rawStr = `${cardId}-${shopId}-${month}`;
  return `TXN-${btoa(rawStr).replace(/[^a-zA-Z0-9]/g, '')}`;
};