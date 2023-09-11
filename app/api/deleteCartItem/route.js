import { NextResponse } from "next/server";
import BigCommerce from "node-bigcommerce";
import GlobalConfig from "./../../globalConfig/config";
export async function POST(request) {
  const bigCommerce = new BigCommerce({
    clientId: GlobalConfig.clientId,
    storeHash: GlobalConfig.storeHash,
    accessToken: GlobalConfig.accessToken,
    responseType: GlobalConfig.responseType,
    headers: GlobalConfig.headers,
    apiVersion: GlobalConfig.apiVersion,
  });
  console.log(request, "req value");
  const res = await request.json();
  console.log(res.cId, "cartId");
  const DeleteCartItem = await bigCommerce.delete(
    `/carts/${res.cId}/items/${res.pId}`
  );
  return NextResponse.json(DeleteCartItem);
}
