export default function featureToArray(products: {}[], feature: string) {
  let featureArray = products.map((product: {}) => {
    return product?.[feature];
  });

  featureArray = featureArray.reduce((prev, cur) => {
    prev[cur] = (prev[cur] || 0) + 1;
    return prev;
  }, {});
  return Object.entries(featureArray);
}
