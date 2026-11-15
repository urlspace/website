// Mirrors Polar's checkout, which picks the currency from the customer's
// location and falls back to the organization default (GBP).
const euroCountries = new Set([
	"AT",
	"BE",
	"BG",
	"CY",
	"DE",
	"EE",
	"ES",
	"FI",
	"FR",
	"GR",
	"HR",
	"IE",
	"IT",
	"LT",
	"LU",
	"LV",
	"MT",
	"NL",
	"PT",
	"SI",
	"SK",
	"AD",
	"ME",
	"MC",
	"SM",
	"VA",
	"XK",
]);

function getCurrency(country: string | null) {
	if (country === "US") {
		return "USD";
	}
	if (country !== null && euroCountries.has(country)) {
		return "EUR";
	}
	return "GBP";
}

export function getLocalPrice(amount: number, country: string | null) {
	return new Intl.NumberFormat("en-GB", {
		style: "currency",
		currency: getCurrency(country),
		currencyDisplay: "narrowSymbol",
		maximumFractionDigits: 0,
	}).format(amount);
}
