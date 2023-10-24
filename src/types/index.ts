export interface ITransaction {
    readonly id?: number
    amount: number
    currency: string
    date_paid: string
    subscription: number
}

export interface ISubscription {
    readonly id?: number
    subscription_name: string
    description: string
    currency: string
    amount_per_frequency: number
    frequency: string
    frequency_detail: string
    payment_method: string
    category: string
    discretionary: boolean
    fixed: boolean
    active: boolean
    cancellation_url?: string
    company_logo_url: string
    transaction_history: Array<ITransaction>
}

export interface ITransaction {
    readonly id?: number
    details: string | undefined
    currency: string
    date: string
    description: string
    payee: string | undefined
    payor: string | undefined
    category: string | undefined
    amount: number
    type: string
    balance: number | undefined
    isRecurring: boolean
    account_id_id: number
}

export interface ISecurityPrice {
    readonly id?: number
    security?: number
    date: string
    open: string
    high: string
    low: string
    close: string
    volume: number
}

export interface ISecurity {
    readonly id?: number
    symbol: string
    name: string
    currency: string
    time_zone: string
    last_refreshed: string
    price_history: Array<ISecurityPrice>
}