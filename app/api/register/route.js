import { NextResponse } from "next/server";
import BigCommerce from "node-bigcommerce";
import GlobalConfig from "./../../GlobalConfig/config";

export async function POST(request) {
  const bigCommerce = new BigCommerce({
    clientId: GlobalConfig.clientId,
    storeHash: GlobalConfig.storeHash,
    accessToken: GlobalConfig.accessToken,
    responseType: GlobalConfig.responseType,
    headers: GlobalConfig.headers,
    apiVersion: GlobalConfig.apiVersion,
  });
  // console.log(request, "req value");
  const res = await request.json();
  console.log(res, "res");
  const registerUsers = await bigCommerce.post("/customers", res);

  return NextResponse.json(registerUsers);
}
