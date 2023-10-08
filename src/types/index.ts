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