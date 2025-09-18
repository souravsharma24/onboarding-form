export interface TableRow {
  offerId: string
  rfqId: string
  tradeType: string
  status: 'pending' | 'completed'
  progress: number
  recDirection: string
  energy: string
  market: string
  settledDate: string
}

export const mockData: TableRow[] = [
  {
    offerId: 'OFF-001',
    rfqId: 'RFQ-001',
    tradeType: 'Buy',
    status: 'pending',
    progress: 35,
    recDirection: 'Forward',
    energy: 'Solar',
    market: 'M-RETS',
    settledDate: '2024-01-15'
  },
  {
    offerId: 'OFF-002',
    rfqId: 'RFQ-002',
    tradeType: 'Sell',
    status: 'completed',
    progress: 100,
    recDirection: 'Backward',
    energy: 'Wind',
    market: 'M-RETS',
    settledDate: '2024-01-10'
  },
  {
    offerId: 'OFF-003',
    rfqId: 'RFQ-003',
    tradeType: 'Buy',
    status: 'pending',
    progress: 75,
    recDirection: 'Forward',
    energy: 'Solar',
    market: 'M-RETS',
    settledDate: '2024-01-20'
  },
  {
    offerId: 'OFF-004',
    rfqId: 'RFQ-004',
    tradeType: 'Sell',
    status: 'completed',
    progress: 100,
    recDirection: 'Backward',
    energy: 'Hydro',
    market: 'M-RETS',
    settledDate: '2024-01-08'
  },
  {
    offerId: 'OFF-005',
    rfqId: 'RFQ-005',
    tradeType: 'Buy',
    status: 'pending',
    progress: 20,
    recDirection: 'Forward',
    energy: 'Solar',
    market: 'M-RETS',
    settledDate: '2024-01-25'
  }
]

export const getMetrics = (activeTab: string) => {
  const baseMetrics = {
    buy: {
      totalSettlements: 8,
      completionRate: 62,
      pendingActions: 3
    },
    sell: {
      totalSettlements: 12,
      completionRate: 75,
      pendingActions: 2
    },
    settle: {
      totalSettlements: 15,
      completionRate: 53,
      pendingActions: 3
    }
  }

  return baseMetrics[activeTab as keyof typeof baseMetrics] || baseMetrics.settle
}


