"use client"; // This is a client component
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import ListingImage from "../../components/orderDetail/orderlListImage";

function OrderPage() {
  const [orderList, setOrderList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  console.log("orderList", orderList);
  const getOrderDetails = async () => {
    let customerId = +sessionStorage.getItem("customer_Number");
    console.log("customerId", customerId);
    const request = {
      id: sessionStorage.getItem("customer_Number"),
    };
    console.log("request", request);
    const result = await axios.post("api/order", request);
    console.log("products", result.data);
    const newproducts = result.data.filter(
      (item) => item.customer_id === customerId
    );
    console.log("newproducts", newproducts);
    setLoading(true);
    setOrderList(newproducts);
  };

  const goToDetailPage = (id) => {
    sessionStorage.setItem("orderid", id);
    console.log("id", id);
    router.push("/orderDetail");
  };

  useEffect(() => {
    getOrderDetails();
  }, []);

  if (isLoading)
    return (
      <div className="container mx-auto p-4">
        {orderList.length > 0 ? (
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">CustomerDetails</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">ViewDetails</th>
              </tr>
            </thead>
            <tbody>
              {orderList.map((item, index) => (
                <tr key={item.id} className="border-b">
                  <td className="border px-4 py-2 text-center">
                    <ListingImage order_id={item.id} />
                  </td>
                  <td className="border px-4 py-2 text-left">
                    <b>Name:</b>
                    {item.billing_address.first_name}
                    <br />
                    <b>Email_Id:</b>
                    {item.billing_address.email}
                    <br />
                    <b>Mobile:</b>
                    {item.billing_address.phone}
                    <br />
                    <b>Address: </b>
                    {item.billing_address.street_1},
                    {item.billing_address.street_2},{item.billing_address.city},
                    {item.billing_address.state},{item.billing_address.country},
                    zip: {item.billing_address.zip}.
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {item.status}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => goToDetailPage(item.id)}
                      className="flex ml-auto text-white bg-blue-900 border-0 py-2 px-6 rounded"
                    >
                      View Order Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col justify-center items-center h-screen-100">
            <img
              src="/noOrder.png"
              alt="Centered Image"
              className="h-60 w-60" // Adjust the height and width as needed
            />
            <p className="text-center text-xl">
              Looks like you haven't placed an order in the last 3 months.
            </p>
          </div>
        )}
      </div>
    );
}

export default OrderPage;
