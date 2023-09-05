import { NextResponse } from "next/server";
import BigCommerce from "node-bigcommerce";

export async function POST(request) {
  const bigCommerce = new BigCommerce({
    clientId: "c09o8ry9m5rne0da8fbh6u2e26vw7wd",
    storeHash: "uixivqsc47",
    accessToken: "gge1td9hix9d132o9m5156rbwofi6xz",
    responseType: "json",
    headers: { "Accept-Encoding": "*" }, // Override headers (Overriding the default encoding of GZipped is useful in development)
    apiVersion: "v3",
  });
  console.log(request, "req value");
  const res = await request.json();
  console.log(res.cId, "cartId");
  const DeleteCartItem = await bigCommerce.delete(
    `/carts/${res.cId}/items/${res.pId}`
  );
  return NextResponse.json(DeleteCartItem);
}
