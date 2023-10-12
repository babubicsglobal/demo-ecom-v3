export function calculateDiscount(mrpPrice, salePrice) {
  let discount = (((mrpPrice - salePrice) / mrpPrice) * 100).toFixed(2);

  if (discount === discount) {
    return discount.endsWith(".00") ? discount.slice(0, -3) : discount;
  } else {
    return 0;
  }
}
