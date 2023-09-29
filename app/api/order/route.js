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
    apiVersion: 'v2',
  });
  console.log(request, "req value");
  const res = await request.json();
  // console.log(res.id, "order");
  const getOrderData = await bigCommerce.get(`/orders`);

  return NextResponse.json(getOrderData);
}
