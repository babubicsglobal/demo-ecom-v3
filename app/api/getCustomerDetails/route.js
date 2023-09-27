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
    apiVersion: GlobalConfig.apiVersion,
  });

  const res = await request.json();

  const PaymentMethods = await bigCommerce.get(
    `/customers?include=addresses&id:in=${res.id}`
  );

  return NextResponse.json(PaymentMethods);
}
