export const translations = {
  en: {
    // Header
    title: 'Bitcoin Fee Estimator',
    aboutMenu: 'About',
    explorer: 'Explorer',
    
    // About dialog
    about: {
      description: 'Bitcoin Fee Estimator is a professional-grade tool designed to help you calculate accurate transaction fees across different wallet implementations. Our estimator provides real-time data from the Bitcoin network and adjusts calculations based on specific wallet fee strategies.',
      features: 'Features:\n• Real-time fee estimates from mempool.space\n• Support for popular wallets including Coinbase, Electrum, BlueWallet, and Exodus\n• Network hashrate monitoring\n• Mempool statistics\n• Blockchain information',
      dataSource: 'Data is sourced from mempool.space API and updated in real-time to ensure accuracy. This tool is ideal for both newcomers and experienced Bitcoin users looking to optimize their transaction fees.'
    },
    
    // Calculator
    calculateFee: 'Calculate Transaction Fee',
    selectWallet: 'Select Your Wallet',
    transactionSize: 'Transaction Size (bytes)',
    averageSize: 'Average Bitcoin transaction is ~{size} bytes',
    
    // Fee displays
    fast: 'Fast (10 min)',
    medium: 'Medium (30 min)',
    slow: 'Slow (1+ hour)',
    showFiat: 'Show Fiat Values',
    hideFiat: 'Hide Fiat Values',
    
    // Network Status
    networkStatus: 'Network Status',
    fastFee: 'Fast Fee',
    mediumFee: 'Medium Fee',
    slowFee: 'Slow Fee',
    feeHistory: 'Fee Rate History (Last 15 Minutes)',
    
    // Hashrate
    networkHashrate: 'Network Hashrate',
    timeOptions: {
      '1w': '1 Week',
      '1m': '1 Month',
      '3m': '3 Months',
      '1y': '1 Year',
      '5y': '5 Years',
      all: 'All Time'
    },
    
    // Mempool Stats
    mempoolStats: 'Mempool Statistics',
    mempoolSize: 'Mempool Size',
    pendingTxs: 'Pending Transactions',
    mempoolCapacity: 'Mempool Capacity',
    
    // Blockchain Info
    blockchainInfo: 'Blockchain Info',
    blockHeight: 'Block Height',
    difficultyAdjustment: 'Difficulty Adjustment',
    difficultyProgress: 'Difficulty Adjustment Progress',
    estimatedAdjustment: 'Estimated adjustment: {date}',
    
    // Explorer
    recentBlocks: 'Recent Blocks',
    recentTransactions: 'Recent Transactions',
    height: 'Height',
    time: 'Time',
    size: 'Size',
    transactions: 'Transactions',
    feeRate: 'Fee Rate',
    value: 'Value',
    
    // Footer
    dataProvided: 'Data provided by',
    stayingSovereign: 'stay sovereign',
    designedBy: 'designed and developed by Aydin Gungordu',
    
    // Wallet descriptions
    walletDescriptions: {
      electrum: 'Desktop wallet with advanced fee controls',
      bluewallet: 'Mobile wallet with Lightning support',
      exodus: 'User-friendly desktop & mobile wallet',
      mempool: 'Direct network fee estimates',
      coinbase: 'Popular exchange-linked self-custody wallet'
    },
    
    // Wallet adjustment texts
    walletAdjustments: {
      electrum: 'Electrum adds 10% to fast fees and reduces slow fees by 10% for patient users',
      bluewallet: 'BlueWallet adds 5% to fast fees and 2% to medium fees',
      exodus: 'Exodus adds 15% to fast fees, 10% to medium fees, and 5% to slow fees for higher reliability',
      mempool: 'Direct network fee estimates without adjustments',
      coinbase: 'Coinbase Wallet adds 12% to fast fees, 8% to medium fees, and 4% to slow fees for reliable transactions'
    },
    
    // Error messages
    errors: {
      failedToLoad: 'Failed to load data. Please try again later.',
      failedToFetchFees: 'Failed to fetch fee data',
      failedToFetchMempool: 'Failed to fetch mempool data',
      failedToFetchHashrate: 'Failed to fetch hashrate data',
      failedToFetchBlockchain: 'Failed to fetch blockchain info',
      failedToFetchExchangeRates: 'Failed to fetch exchange rates',
      dataNotAvailable: 'Data not available for selected timespan'
    },

    // Loading states
    loading: 'Loading...',
  },
  no: {
    // Header
    title: 'Bitcoin Gebyr Kalkulator',
    aboutMenu: 'Om',
    explorer: 'Utforsker',
    
    // About dialog
    about: {
      description: 'Bitcoin Gebyr Kalkulator er et profesjonelt verktøy designet for å hjelpe deg med å beregne nøyaktige transaksjonsgebyrer på tvers av forskjellige lommebokimplementasjoner. Vår kalkulator gir sanntidsdata fra Bitcoin-nettverket og justerer beregninger basert på spesifikke lommebokstrategier.',
      features: 'Funksjoner:\n• Sanntids gebyrestimater fra mempool.space\n• Støtte for populære lommebøker inkludert Coinbase, Electrum, BlueWallet og Exodus\n• Nettverks hashrate overvåking\n• Mempool statistikk\n• Blokkjede informasjon',
      dataSource: 'Data kommer fra mempool.space API og oppdateres i sanntid for å sikre nøyaktighet. Dette verktøyet er ideelt for både nybegynnere og erfarne Bitcoin-brukere som ønsker å optimalisere sine transaksjonsgebyrer.'
    },
    
    // Calculator
    calculateFee: 'Beregn Transaksjonsgebyr',
    selectWallet: 'Velg Din Lommebok',
    transactionSize: 'Transaksjonsstørrelse (bytes)',
    averageSize: 'Gjennomsnittlig Bitcoin-transaksjon er ~{size} bytes',
    
    // Fee displays
    fast: 'Rask (10 min)',
    medium: 'Medium (30 min)',
    slow: 'Treg (1+ time)',
    showFiat: 'Vis Fiat-verdier',
    hideFiat: 'Skjul Fiat-verdier',
    
    // Network Status
    networkStatus: 'Nettverksstatus',
    fastFee: 'Raskt Gebyr',
    mediumFee: 'Medium Gebyr',
    slowFee: 'Tregt Gebyr',
    feeHistory: 'Gebyrsats Historikk (Siste 15 Minutter)',
    
    // Hashrate
    networkHashrate: 'Nettverks Hashrate',
    timeOptions: {
      '1w': '1 Uke',
      '1m': '1 Måned',
      '3m': '3 Måneder',
      '1y': '1 År',
      '5y': '5 År',
      all: 'All Tid'
    },
    
    // Mempool Stats
    mempoolStats: 'Mempool Statistikk',
    mempoolSize: 'Mempool Størrelse',
    pendingTxs: 'Ventende Transaksjoner',
    mempoolCapacity: 'Mempool Kapasitet',
    
    // Blockchain Info
    blockchainInfo: 'Blokkjede Info',
    blockHeight: 'Blokkhøyde',
    difficultyAdjustment: 'Vanskelighetsgrad Justering',
    difficultyProgress: 'Vanskelighetsgrad Justerings Fremgang',
    estimatedAdjustment: 'Estimert justering: {date}',
    
    // Explorer
    recentBlocks: 'Nylige Blokker',
    recentTransactions: 'Nylige Transaksjoner',
    height: 'Høyde',
    time: 'Tid',
    size: 'Størrelse',
    transactions: 'Transaksjoner',
    feeRate: 'Gebyrsats',
    value: 'Verdi',
    
    // Footer
    dataProvided: 'Data levert av',
    stayingSovereign: 'forbli suveren',
    designedBy: 'designet og utviklet av Aydin Gungordu',
    
    // Wallet descriptions
    walletDescriptions: {
      electrum: 'Desktop lommebok med avanserte gebyrkontroller',
      bluewallet: 'Mobil lommebok med Lightning-støtte',
      exodus: 'Brukervennlig desktop & mobil lommebok',
      mempool: 'Direkte nettverksgebyr estimater',
      coinbase: 'Populær børstilknyttet selvforvaltende lommebok'
    },
    
    // Wallet adjustment texts
    walletAdjustments: {
      electrum: 'Electrum legger til 10% på raske gebyrer og reduserer trege gebyrer med 10% for tålmodige brukere',
      bluewallet: 'BlueWallet legger til 5% på raske gebyrer og 2% på medium gebyrer',
      exodus: 'Exodus legger til 15% på raske gebyrer, 10% på medium gebyrer, og 5% på trege gebyrer for høyere pålitelighet',
      mempool: 'Direkte nettverksgebyr estimater uten justeringer',
      coinbase: 'Coinbase Wallet legger til 12% på raske gebyrer, 8% på medium gebyrer, og 4% på trege gebyrer for pålitelige transaksjoner'
    },
    
    // Error messages
    errors: {
      failedToLoad: 'Kunne ikke laste data. Vennligst prøv igjen senere.',
      failedToFetchFees: 'Kunne ikke hente gebyrdata',
      failedToFetchMempool: 'Kunne ikke hente mempool-data',
      failedToFetchHashrate: 'Kunne ikke hente hashrate-data',
      failedToFetchBlockchain: 'Kunne ikke hente blokkjede-info',
      failedToFetchExchangeRates: 'Kunne ikke hente valutakurser',
      dataNotAvailable: 'Data ikke tilgjengelig for valgt tidsperiode'
    },

    // Loading states
    loading: 'Laster...',
  }
}; 