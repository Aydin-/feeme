export const WALLET_CONFIGS = {
  electrum: {
    name: "Electrum",
    description: "Desktop wallet with advanced fee controls",
    feeCalculation: (networkFees) => ({
      fast: parseFloat(networkFees.fast) * 1.1, // Electrum adds ~10% margin
      medium: parseFloat(networkFees.medium),
      slow: parseFloat(networkFees.slow) * 0.9 // Electrum allows lower fees for patient users
    })
  },
  bluewallet: {
    name: "BlueWallet",
    description: "Mobile wallet with Lightning support",
    feeCalculation: (networkFees) => ({
      fast: parseFloat(networkFees.fast) * 1.05, // BlueWallet adds ~5% margin
      medium: parseFloat(networkFees.medium) * 1.02,
      slow: parseFloat(networkFees.slow)
    })
  },
  exodus: {
    name: "Exodus",
    description: "User-friendly desktop & mobile wallet",
    feeCalculation: (networkFees) => ({
      fast: parseFloat(networkFees.fast) * 1.15, // Exodus adds higher margins for reliability
      medium: parseFloat(networkFees.medium) * 1.1,
      slow: parseFloat(networkFees.slow) * 1.05
    })
  },
  mempool: {
    name: "Mempool Estimate",
    description: "Direct network fee estimates",
    feeCalculation: (networkFees) => ({
      fast: parseFloat(networkFees.fast),
      medium: parseFloat(networkFees.medium),
      slow: parseFloat(networkFees.slow)
    })
  },
  coinbase: {
    name: "Coinbase Wallet",
    description: "Popular exchange-linked self-custody wallet",
    feeCalculation: (networkFees) => ({
      fast: parseFloat(networkFees.fast) * 1.12, // Coinbase adds ~12% margin for fast
      medium: parseFloat(networkFees.medium) * 1.08, // 8% for medium
      slow: parseFloat(networkFees.slow) * 1.04 // 4% for slow
    })
  }
};

export const getWalletAdjustmentText = (wallet) => {
  switch(wallet) {
    case 'electrum':
      return "Electrum adds 10% to fast fees and reduces slow fees by 10% for patient users";
    case 'bluewallet':
      return "BlueWallet adds 5% to fast fees and 2% to medium fees";
    case 'exodus':
      return "Exodus adds 15% to fast fees, 10% to medium fees, and 5% to slow fees for higher reliability";
    case 'mempool':
      return "Direct network fee estimates without adjustments";
    case 'coinbase':
      return "Coinbase Wallet adds 12% to fast fees, 8% to medium fees, and 4% to slow fees for reliable transactions";
    default:
      return "";
  }
}; 