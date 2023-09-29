import { NextResponse } from "next/server";
import BigCommerce from "node-bigcommerce";
import GlobalConfig from "../../globalConfig/config";
export async function POST(request) {
  const bigCommerce = new BigCommerce({
    clientId: GlobalConfig.clientId,
    storeHash: GlobalConfig.storeHash,
    accessToken: GlobalConfig.accessToken,
    responseType: GlobalConfig.responseType,
    headers: GlobalConfig.headers,
    apiVersion: 'v3',
  });
  console.log(request, "req value");
  const res = await request.json();
  console.log(res.id, "product");
  const getproductimageData = await bigCommerce.get(`/catalog/products/${res.id}?include=images`);

  return NextResponse.json(getproductimageData);
}
