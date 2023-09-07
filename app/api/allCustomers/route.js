import { NextResponse } from "next/server";
import BigCommerce from "node-bigcommerce";
import GlobalConfig from "../../GlobalConfig/config";

export async function GET(request) {
  const bigCommerce = new BigCommerce({
    clientId: GlobalConfig.clientId,
    storeHash: GlobalConfig.storeHash,
    accessToken: GlobalConfig.accessToken,
    responseType: GlobalConfig.responseType,
    headers: GlobalConfig.headers,
    apiVersion: GlobalConfig.apiVersion,
  });
  // console.log(request, "req value");
  // const res = await request.json();
  // console.log(res, "res");
  const customers = await bigCommerce.get("/customers");

  return NextResponse.json(customers);
}
