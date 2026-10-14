export type PaymentMarket = {
  code: string;
  name: string;
  /** Checkout shown first. The payer can still switch to the other provider. */
  provider: "paystack" | "accrue";
};

/**
 * Paystack is the usual checkout in Nigeria, Ghana, Kenya, and South Africa,
 * and for card payments everywhere else. Accrue is suggested where a local
 * wallet is the usual way to pay.
 */
const paystackMarkets: PaymentMarket[] = [
  { code: "GH", name: "Ghana", provider: "paystack" },
  { code: "KE", name: "Kenya", provider: "paystack" },
  { code: "NG", name: "Nigeria", provider: "paystack" },
  { code: "ZA", name: "South Africa", provider: "paystack" },
];

const accrueMarkets: PaymentMarket[] = [
  { code: "DZ", name: "Algeria", provider: "accrue" },
  { code: "BJ", name: "Benin", provider: "accrue" },
  { code: "BW", name: "Botswana", provider: "accrue" },
  { code: "BF", name: "Burkina Faso", provider: "accrue" },
  { code: "CM", name: "Cameroon", provider: "accrue" },
  { code: "CF", name: "Central African Republic", provider: "accrue" },
  { code: "TD", name: "Chad", provider: "accrue" },
  { code: "CN", name: "China", provider: "accrue" },
  { code: "CG", name: "Congo", provider: "accrue" },
  { code: "CD", name: "DR Congo", provider: "accrue" },
  { code: "CI", name: "Côte d'Ivoire", provider: "accrue" },
  { code: "GQ", name: "Equatorial Guinea", provider: "accrue" },
  { code: "ET", name: "Ethiopia", provider: "accrue" },
  { code: "GA", name: "Gabon", provider: "accrue" },
  { code: "MW", name: "Malawi", provider: "accrue" },
  { code: "ML", name: "Mali", provider: "accrue" },
  { code: "MZ", name: "Mozambique", provider: "accrue" },
  { code: "NE", name: "Niger", provider: "accrue" },
  { code: "RW", name: "Rwanda", provider: "accrue" },
  { code: "SL", name: "Sierra Leone", provider: "accrue" },
  { code: "TZ", name: "Tanzania", provider: "accrue" },
  { code: "TG", name: "Togo", provider: "accrue" },
  { code: "ZM", name: "Zambia", provider: "accrue" },
];

const cardCountries: Array<[string, string]> = [
  ["OTHER", "Somewhere else"],
  ["AO", "Angola"],
  ["AU", "Australia"],
  ["AT", "Austria"],
  ["BE", "Belgium"],
  ["BR", "Brazil"],
  ["CA", "Canada"],
  ["EG", "Egypt"],
  ["FR", "France"],
  ["DE", "Germany"],
  ["IN", "India"],
  ["IE", "Ireland"],
  ["IT", "Italy"],
  ["LR", "Liberia"],
  ["MY", "Malaysia"],
  ["MA", "Morocco"],
  ["NL", "Netherlands"],
  ["NO", "Norway"],
  ["QA", "Qatar"],
  ["SA", "Saudi Arabia"],
  ["SN", "Senegal"],
  ["SG", "Singapore"],
  ["ES", "Spain"],
  ["SE", "Sweden"],
  ["CH", "Switzerland"],
  ["AE", "United Arab Emirates"],
  ["GB", "United Kingdom"],
  ["US", "United States"],
  ["UG", "Uganda"],
  ["ZW", "Zimbabwe"],
];

const markets = new Map<string, PaymentMarket>();

for (const market of paystackMarkets) markets.set(market.code, market);
for (const market of accrueMarkets) markets.set(market.code, market);
for (const [code, name] of cardCountries) {
  markets.set(code, { code, name, provider: "paystack" });
}

export function marketFor(code: string): PaymentMarket | null {
  return markets.get(code) ?? null;
}

export function paymentCountries(): PaymentMarket[] {
  return [...markets.values()].sort((a, b) => {
    if (a.code === "OTHER") return 1;
    if (b.code === "OTHER") return -1;
    return a.name.localeCompare(b.name);
  });
}
