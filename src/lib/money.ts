// Amounts are euro cents. Whole euros drop the cents ("€29"); anything else
// keeps them ("€29.50"). The web app still shows "€29.00".
export const euro = (cents: number) =>
  cents % 100 === 0 ? `€${(cents / 100).toLocaleString('en-GB')}` : `€${(cents / 100).toFixed(2)}`

/** Same as euro(); kept for map pins */
export const euroShort = euro
