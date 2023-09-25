import { NextResponse } from "next/server";
import BigCommerce from "node-bigcommerce";
import GlobalConfig from "../../globalConfig/config";
export async function POST(request) {
  const bigCommerce = new BigCommerce({
    clientId: GlobalConfig.clientId,
    storeHash: GlobalConfig.storeHash,
    accessToken: GlobalConfig.accessToken,
    responseType: GlobalConfig.responseType,
    headers: {
      Authorization: `PAT eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2OTQ3OTI4NDYsIm5iZiI6MTY5NDc4OTI0NiwiaXNzIjoicGF5bWVudHMuYmlnY29tbWVyY2UuY29tIiwic3ViIjoiYXBkYWsxcmFkYyIsImp0aSI6IjRmYTliZjhhLTNjYzctNGExMC1hMGRhLWQxMjhiZDRkNDNiOSIsImlhdCI6MTY5NDc4OTI0NiwiZGF0YSI6eyJzdG9yZV9pZCI6IjEwMDMwMDkzNjIiLCJvcmRlcl9pZCI6IjE0NyIsImFtb3VudCI6ODk4NSwiY3VycmVuY3kiOiJJTlIifX0.A0HwfGyQlaoan2u1u6zdVMz7L8zumI5bIcKb3hygMxc`,
      Accept: "application/vnd.bc.v1+json",
      "X-Auth-Token": "jkywdw9bj1gq0mb69lbyrrdmjon0m32",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",

      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept, Authorization",
      "Access-Control-Request-Method": "GET, POST, DELETE, PUT, OPTIONS",
    },
    // apiVersion: GlobalConfig.apiVersion,
  });

  const res = await request.json();
  console.log(res, "Pat request");
  const CreateToken = await bigCommerce.post(
    `https://payments.bigcommerce.com/stores/3bkf9t8exj/payments`,
    res
  );

  return NextResponse.json(CreateToken);
}
