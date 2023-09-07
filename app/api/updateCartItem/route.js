import { NextResponse } from "next/server";
import BigCommerce from "node-bigcommerce";
import GlobalConfig from "../../GlobalConfig/config";
export async function POST(request) {
  const res = await request.json();

  const bigCommerce = new BigCommerce({
    clientId: GlobalConfig.clientId,
    storeHash: GlobalConfig.storeHash,
    accessToken: GlobalConfig.accessToken,
    responseType: GlobalConfig.responseType,
    headers: GlobalConfig.headers,
    apiVersion: GlobalConfig.apiVersion,
  });

  console.log(res, "carts");
  const UpdateItemCart = await bigCommerce.put(
    `/carts/${res.cartId}/items/${res.itemId}`,
    res
  );

  return NextResponse.json(UpdateItemCart);
}
