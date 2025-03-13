export const translations = {
  en: {
    // Header
    title: 'Bitcoin Nomad',
    aboutMenu: 'About',
    explorer: 'Explorer',
    
    // Navigation
    Fees: 'Fee Calculator',
    'Price History': 'Price History',
    'BTC Price': 'BTC Price',
    
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
      '1d': '24 Hours',
      '7d': '7 Days',
      '30d': '30 Days',
      '90d': '90 Days',
      '365d': '1 Year'
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
    designedBy: 'Designed and developed by Aydin Gungordu',
    
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

    // New translations
    'Portfolio': 'Portfolio',
    'Coin Name': 'Coin Name',
    'Amount': 'Amount',
    'Add Coin': 'Add Coin',
    'Your Holdings': 'Your Holdings',
    'Total Value': 'Total Value',
    switchToDarkMode: 'Switch to Dark Mode',
    switchToLightMode: 'Switch to Light Mode',
    'Add New Coin': 'Add New Coin',
    'Select Coin': 'Select Coin',
    'Wallet Holdings': 'Wallet Holdings',
    'Premium Features': 'Premium Features',
    'Unlock the full potential of our fee calculator': 'Unlock the full potential of our fee calculator',
    'Advanced Analytics': 'Advanced Analytics',
    'Get detailed fee predictions and network analysis': 'Get detailed fee predictions and network analysis',
    'Historical Data': 'Historical Data',
    'Access historical fee data and trends': 'Access historical fee data and trends',
    'API Access': 'API Access',
    'Integrate our API into your applications': 'Integrate our API into your applications',
    'Enterprise': 'Enterprise',
    'Custom solutions for businesses': 'Custom solutions for businesses',
    'Priority Support': 'Priority Support',
    'No Ads': 'No Ads',
    'Early Access': 'Early Access',
    'Subscribe Now': 'Subscribe Now',
    'Contact us': 'Contact us',
    'Premium': 'Premium',
    'Why Choose Premium?': 'Why Choose Premium?',
    'Professional Grade Tools': 'Professional Grade Tools',
    'Access advanced analytics and professional-grade tools designed for serious traders and developers.': 'Access advanced analytics and professional-grade tools designed for serious traders and developers.',
    'Real-time Data': 'Real-time Data',
    'Get instant access to real-time market data, network statistics, and historical trends.': 'Get instant access to real-time market data, network statistics, and historical trends.',
    'Priority Support': 'Priority Support',
    'Receive dedicated support and early access to new features as they become available.': 'Receive dedicated support and early access to new features as they become available.',
    'Bitcoin Inspiration': 'Bitcoin Inspiration',
    'Discover the latest insights, news, and discussions from the Bitcoin community': 'Discover the latest insights, news, and discussions from the Bitcoin community',
    'Tweets': 'Tweets',
    'Articles': 'Articles',
    'Videos': 'Videos',
    'View': 'View',
    'Save for later': 'Save for later',
    'Remove from saved': 'Remove from saved',
    'Share': 'Share'
  },
  no: {
    // Header
    title: 'Bitcoin Nomad',
    aboutMenu: 'Om',
    explorer: 'Utforsker',
    
    // Navigation
    Fees: 'Gebyrkalkulator',
    'Price History': 'Prishistorikk',
    'BTC Price': 'BTC Pris',
    
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
      '1d': '24 Timer',
      '7d': '7 Dager',
      '30d': '30 Dager',
      '90d': '90 Dager',
      '365d': '1 År'
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
    designedBy: 'Designet og utviklet av Aydin Gungordu',
    
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

    // New translations
    'Portfolio': 'Portefølje',
    'Coin Name': 'Myntnavn',
    'Amount': 'Mengde',
    'Add Coin': 'Legg til mynt',
    'Your Holdings': 'Dine beholdninger',
    'Total Value': 'Total verdi',
    switchToDarkMode: 'Bytt til Mørkt Modus',
    switchToLightMode: 'Bytt til Lyst Modus',
    'Add New Coin': 'Legg til ny mynt',
    'Select Coin': 'Velg mynt',
    'Wallet Holdings': 'Lommebok beholdninger',
    'Premium Features': 'Premium Funksjoner',
    'Unlock the full potential of our fee calculator': 'Utnytt full potensial av vår gebyrkalkulator',
    'Advanced Analytics': 'Avansert Analyse',
    'Get detailed fee predictions and network analysis': 'Få detaljerte gebyrprediksjoner og nettverksanalyse',
    'Historical Data': 'Historiske Data',
    'Access historical fee data and trends': 'Tilgang til historiske gebyrdata og trender',
    'API Access': 'API Tilgang',
    'Integrate our API into your applications': 'Integrer vår API i dine applikasjoner',
    'Enterprise': 'Bedriftsløsninger',
    'Custom solutions for businesses': 'Tilpassede løsninger for bedrifter',
    'Priority Support': 'Prioritert Støtte',
    'No Ads': 'Ingen Annonser',
    'Early Access': 'Tidlig Tilgang',
    'Subscribe Now': 'Abonner Nå',
    'Contact us': 'Kontakt oss',
    'Premium': 'Premium',
    'Why Choose Premium?': 'Hvorfor Velge Premium?',
    'Professional Grade Tools': 'Profesjonelle Verktøy',
    'Access advanced analytics and professional-grade tools designed for serious traders and developers.': 'Tilgang til avanserte analyser og profesjonelle verktøy designet for seriøse handelsmenn og utviklere.',
    'Real-time Data': 'Sanntidsdata',
    'Get instant access to real-time market data, network statistics, and historical trends.': 'Få umiddelbar tilgang til sanntids markedsdata, nettverksstatistikk og historiske trender.',
    'Priority Support': 'Prioritert Støtte',
    'Receive dedicated support and early access to new features as they become available.': 'Motta dedikert støtte og tidlig tilgang til nye funksjoner når de blir tilgjengelige.',
    'Bitcoin Inspiration': 'Bitcoin Inspirasjon',
    'Discover the latest insights, news, and discussions from the Bitcoin community': 'Oppdag de nyeste innsiktene, nyhetene og diskusjonene fra Bitcoin-samfunnet',
    'Tweets': 'Tweets',
    'Articles': 'Artikler',
    'Videos': 'Videoer',
    'View': 'Vis',
    'Save for later': 'Lagre for senere',
    'Remove from saved': 'Fjern fra lagrede',
    'Share': 'Del'
  }
}; 