import { GetAllProductsDto } from 'src/products/dto/get-all-products.dto';

export default function featureToArray(
  products: GetAllProductsDto[],
  feature: string,
) {
  let featureArray = products.map((product: GetAllProductsDto) => {
    return product?.[feature];
  });

  featureArray = featureArray.reduce((prev, cur) => {
    prev[cur] = (prev[cur] || 0) + 1;
    return prev;
  }, {});
  return Object.entries(featureArray);
}
