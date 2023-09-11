"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { CustomerAPI } from "./../api/customer/getCustomerAPI";
import OrderSummaryCartList from "./../../components/orderSummary/CartList";

const CheckoutPage = () => {
  const [isError, setIsError] = useState(false);
  const [customerData, setCustomerData] = useState([]);
  const [getSessionID, setSessionID] = useState("");
  const [getCusValue, setCusValue] = useState([]);
  const [cartItem, setCartItem] = useState([]);

  const onSubmit = async (data) => {
    console.log("request.email.data", data);
    const RegisterUser = [
      {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        company: data.companyname,
        phone: data.phonenumber,
        notes: "",
        tax_exempt_category: "",
        customer_group_id: 0,
        addresses: [
          {
            address1: data.address1,
            address2: data.address2,
            address_type: "residential",
            city: data.city,
            company: data.companyname,
            country_code: "US",
            first_name: data.first_name,
            last_name: data.last_name,
            phone: data.phonenumber,
            postal_code: data.postal_code,
            state_or_province: data.state_or_province,
            form_fields: [{ name: "test", value: "test" }],
          },
        ],
        authentication: {
          force_password_reset: true,
          new_password: data.password,
        },
        accepts_product_review_abandoned_cart_emails: true,
        store_credit_amounts: [{ amount: 43.15 }],
        origin_channel_id: 1,
        channel_ids: [1],
        form_fields: [{ name: "test", value: "test" }],
      },
    ];

    const result = await axios
      .post("api/register", RegisterUser)
      .then(function (response) {
        router.push("/login");
        console.log("Success");
        console.log("response", response.data);
        setIsError(false);
      })
      .catch(function (error) {
        console.log(error);
        setIsError(true);
      });
    // console.log("result", result.data);
    // if (result.data.id > 0) {
    //   console.log("Success");

    // } else {
    //   console.log("Failier");
    // }
    //setCommerceData(result.data.data);
  };

  // form validation rules
  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email address is required"),
    password: Yup.string()
      .required("Password is required")
      .min(4, "Password length should be at least 4 characters")
      .max(12, "Password cannot exceed more than 12 characters"),
    cpassword: Yup.string()
      .required("Confirm Password is required")
      .min(4, "Password length should be at least 4 characters")
      .max(12, "Password cannot exceed more than 12 characters")
      .oneOf([Yup.ref("password")], "Passwords do not match"),
    first_name: Yup.string().required("first name is required"),
    last_name: Yup.string().required("last name is required"),
    address1: Yup.string().required("address is required"),
    city: Yup.string().required("city is required"),
    state_or_province: Yup.string().required("State/Province is required"),
    postal_code: Yup.string().required("Postal code is required"),
    country_code: Yup.string().required("Country is required"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  const { register, handleSubmit, watch, formState, reset, getValues } =
    useForm(formOptions);
  const { errors } = formState;

  console.log("errors", errors);

  const getCustomerDetails = async (customerId) => {
    const getCustomerItem = customerData?.find((item) => {
      return getSessionID === item?.id;
    });
    console.log("cus product", getCustomerItem);
    // setCusValue(cusValue);

    setCusValue(getCustomerItem);
  };

  const getCartDetails = async (cartId) => {
    const request = {
      id: cartId,
    };
    const result = await axios
      .post("../api/getCart", request)
      .then(function (response) {
        setCartItem(response.data.data.line_items.physical_items);
      })
      .catch(function (error) {
        console.log(error);
        //setIsError(true);
      });
  };

  useEffect(() => {
    const initTE = async () => {
      const { initTE } = await import("tw-elements");
      const { Collapse } = await import("tw-elements"); // Import the Collapse component if needed
      initTE({ Collapse }); // Call the initTE function with the Collapse component
    };
    initTE();

    getCartDetails(sessionStorage.getItem("cart_id"));
    var config = { "Access-Control-Allow-Origin": "*" };
    CustomerAPI(
      config,
      (response) => {
        setCustomerData(response.data.data);
      },
      (err) => {
        //error
        console.log(err);
      }
    );
    setSessionID(+sessionStorage.getItem("customer_Number"));
    getCustomerDetails(sessionStorage.getItem("customer_Number"));
  }, []);

  /*useEffect(() => {
    getCartDetails(sessionStorage.getItem("cart_id"));
    var config = { "Access-Control-Allow-Origin": "*" };
    CustomerAPI(
      config,
      (response) => {
        setCustomerData(response.data.data);
      },
      (err) => {
        //error
        console.log(err);
      }
    );
    setSessionID(+sessionStorage.getItem("customer_Number"));
  }, []);

  useEffect(() => {
    initTE({ Collapse });
    getCustomerDetails();
  }, [customerData, getSessionID]);
  console.log("customerData", customerData, getSessionID, getCusValue);*/

  return (
    <section className="bg-gray-100 min-h-screen">
      <div className="container mx-auto ">
        <div className="grid grid-cols-3 gap-4 py-6 mt-3 h-full ">
          <div className="col-span-2 px-3 bg-white">
            <div id="accordionExample" className="my-6">
              <div className="rounded-t-lg border-b-2 border-neutral-200 bg-white dark:border-neutral-600 dark:bg-neutral-800">
                <h2 className="mb-0" id="headingOne">
                  <button
                    className="group relative flex w-full items-center rounded-t-[15px] border-0 bg-white px-5 py-4 text-left text-base text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 dark:text-white "
                    type="button"
                    data-te-collapse-init
                    data-te-target="#collapseOne"
                    aria-expanded="true"
                    aria-controls="collapseOne"
                  >
                    <div className="checkout-view-header py-2">
                      <h2 className="mb-0 mt-0 text-2xl font-bold leading-tight text-primary">
                        Customer
                      </h2>
                    </div>
                    <span className="ml-auto h-5 w-5 shrink-0 rotate-[-180deg] fill-[#336dec] transition-transform duration-200 ease-in-out group-[[data-te-collapse-collapsed]]:rotate-0 group-[[data-te-collapse-collapsed]]:fill-[#212529] motion-reduce:transition-none dark:fill-blue-300 dark:group-[[data-te-collapse-collapsed]]:fill-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </span>
                  </button>
                </h2>
                <div
                  id="collapseOne"
                  className="!visible"
                  data-te-collapse-item
                  data-te-collapse-show
                  aria-labelledby="headingOne"
                  data-te-parent="#accordionExample"
                >
                  <div className="px-5 py-4">
                    <div className="checkout-step optimizedCheckout-checkoutStep checkout-step--customer">
                      <div className="loading-skeleton">
                        <form>
                          <div className="grid gap-6 mb-6 md:grid-cols-2">
                            <div>
                              <input
                                type="text"
                                id="first_name"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Email"
                              />
                            </div>
                            <div>
                              <button
                                type="submit"
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                              >
                                Continue
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-b-2 border-neutral-200 bg-white dark:border-neutral-600 dark:bg-neutral-800">
                <h2 className="mb-0" id="headingTwo">
                  <button
                    className="group relative flex w-full items-center rounded-t-[15px] border-0 bg-white px-5 py-4 text-left text-base text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 dark:text-white "
                    type="button"
                    data-te-collapse-init
                    data-te-collapse-collapsed
                    data-te-target="#collapseTwo"
                    aria-expanded="false"
                    aria-controls="collapseTwo"
                  >
                    <div className="checkout-view-header py-2">
                      <h2 className="mb-0 mt-0 text-2xl font-bold leading-tight text-primary">
                        Shipping
                      </h2>
                    </div>
                    <span className="-mr-1 ml-auto h-5 w-5 shrink-0 rotate-[-180deg] fill-[#336dec] transition-transform duration-200 ease-in-out group-[[data-te-collapse-collapsed]]:mr-0 group-[[data-te-collapse-collapsed]]:rotate-0 group-[[data-te-collapse-collapsed]]:fill-[#212529] motion-reduce:transition-none dark:fill-blue-300 dark:group-[[data-te-collapse-collapsed]]:fill-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </span>
                  </button>
                </h2>
                <div
                  id="collapseTwo"
                  className="!visible hidden"
                  data-te-collapse-item
                  aria-labelledby="headingTwo"
                  data-te-parent="#accordionExample"
                >
                  <div className="px-5 py-4">
                    <form
                      className="space-y-4 md:space-y-6"
                      action="#"
                      onSubmit={() => handleSubmit(onSubmit)}
                      autoComplete="off"
                    >
                      <div className="flex mb-4">
                        <div className="w-1/2 mr-1">
                          <label
                            className="block text-grey-darker text-sm mb-2"
                            htmlFor="FormField_1_input"
                          >
                            Email Address<span className="require-star">*</span>
                          </label>
                          <input
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            id="FormField_1_input"
                            {...register("email")}
                            type="text"
                            placeholder="Email Address"
                            value={getCusValue?.email || ""}
                          />
                          <div className="invalid-feedback">
                            {errors.email?.message}
                          </div>
                        </div>
                        <div className="w-1/2 ml-1">
                          <label
                            className="block text-grey-darker text-sm mb-2"
                            htmlFor="FormField_4_input"
                          >
                            First Name<span className="require-star">*</span>
                          </label>
                          <input
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            id="FormField_4_input"
                            {...register("first_name")}
                            type="text"
                            placeholder="First Name"
                            value={getCusValue?.first_name || ""}
                          />
                          <div className="invalid-feedback">
                            {errors.first_name?.message}
                          </div>
                        </div>
                      </div>

                      <div className="flex mb-4">
                        <div className="w-1/2 mr-1">
                          <label
                            className="block text-grey-darker text-sm mb-2"
                            htmlFor="FormField_5_input"
                          >
                            Last Name<span className="require-star">*</span>
                          </label>
                          <input
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            id="FormField_5_input"
                            {...register("last_name")}
                            type="text"
                            placeholder="Last Name"
                            value={getCusValue?.last_name || ""}
                          />
                          <div className="invalid-feedback">
                            {errors.last_name?.message}
                          </div>
                        </div>
                        <div className="w-1/2 ml-1">
                          <label
                            className="block text-grey-darker text-sm mb-2"
                            htmlFor="FormField_6_input"
                          >
                            Company Name
                          </label>
                          <input
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            id="FormField_6_input"
                            {...register("companyname")}
                            type="text"
                            placeholder="Company Name"
                            value={getCusValue?.company || ""}
                          />
                        </div>
                      </div>
                      <div className="flex mb-4">
                        <div className="w-1/2 mr-1">
                          <label
                            className="block text-grey-darker text-sm mb-2"
                            htmlFor="FormField_7_input"
                          >
                            Phone Number
                          </label>
                          <input
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            id="FormField_7_input"
                            {...register("phonenumber")}
                            type="text"
                            placeholder="Phone Number"
                          />
                        </div>
                        <div className="w-1/2 ml-1">
                          <label
                            className="block text-grey-darker text-sm mb-2"
                            htmlFor="FormField_8_input"
                          >
                            Address Line 1
                            <span className="require-star">*</span>
                          </label>
                          <input
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            id="FormField_8_input"
                            {...register("address1")}
                            type="text"
                            placeholder="Address Line"
                          />
                          <div className="invalid-feedback">
                            {errors.address1?.message}
                          </div>
                        </div>
                      </div>
                      <div className="flex mb-4">
                        <div className="w-1/2 mr-1">
                          <label
                            className="block text-grey-darker text-sm mb-2"
                            htmlFor="FormField_9_input"
                          >
                            Address Line 2
                          </label>
                          <input
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            id="FormField_9_input"
                            {...register("address2")}
                            type="text"
                            placeholder="Address Line"
                          />
                        </div>
                        <div className="w-1/2 ml-1">
                          <label
                            className="block text-grey-darker text-sm mb-2"
                            htmlFor="FormField_10_input"
                          >
                            Suburb/City<span className="require-star">*</span>
                          </label>
                          <input
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            id="FormField_10_input"
                            {...register("city")}
                            type="text"
                            placeholder="City"
                          />
                          <div className="invalid-feedback">
                            {errors.city?.message}
                          </div>
                        </div>
                      </div>
                      <div className="flex mb-4">
                        <div className="w-1/2 mr-1">
                          <label
                            className="block text-grey-darker text-sm mb-2"
                            htmlFor="FormField_11_input"
                          >
                            Country<span className="require-star">*</span>
                          </label>
                          <input
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            id="FormField_11_input"
                            {...register("country_code")}
                            type="text"
                            placeholder="Country"
                          />
                          <div className="invalid-feedback">
                            {errors.country_code?.message}
                          </div>
                        </div>
                        <div className="w-1/2 ml-1">
                          <label
                            className="block text-grey-darker text-sm mb-2"
                            htmlFor="FormField_12_input"
                          >
                            State/Province
                            <span className="require-star">*</span>
                          </label>
                          <input
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            id="FormField_12_input"
                            {...register("state_or_province")}
                            type="text"
                            placeholder="State/Province"
                          />
                          <div className="invalid-feedback">
                            {errors.state_or_province?.message}
                          </div>
                        </div>
                      </div>
                      <div className="flex mb-4">
                        <div className="w-1/2 ml-1">
                          <label
                            className="block text-grey-darker text-sm mb-2"
                            htmlFor="FormField_13_input"
                          >
                            Postal Code<span className="require-star">*</span>
                          </label>
                          <input
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            id="FormField_13_input"
                            {...register("postal_code")}
                            type="text"
                            placeholder="Postal Code"
                          />
                          <div className="invalid-feedback">
                            {errors.postal_code?.message}
                          </div>
                        </div>
                      </div>
                      <div className="flex mb-4">
                        <div className="flex items-center">
                          <input
                            // checked
                            id="checked-checkbox"
                            type="checkbox"
                            value=""
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label
                            htmlFor="checked-checkbox"
                            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                          >
                            My billing address is the same as my shipping
                            address.
                          </label>
                        </div>
                      </div>
                      <div className="flex mb-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="rounded-md bg-white border p-6">
                            <div className="flex justify-between text-base text-gray-900 flex-col">
                              <h3 className="font-medium">
                                <a href="#">Standard</a>
                              </h3>
                              <p className="ml-0">4–10 business days</p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">$5.00</p>
                          </div>
                          <div className="rounded-md bg-white border p-6">
                            {" "}
                            <div className="flex justify-between text-base text-gray-900 flex-col">
                              <h3 className="font-medium">
                                <a href="#">Express</a>
                              </h3>
                              <p className="ml-0">2–5 business days</p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">$15.00</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex mb-4">
                        <button
                          type="submit"
                          className="w-full text-white bg-blue-500 hover:bg-cyan-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                        >
                          Continue
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              {/* <div className="border-b-2 border-neutral-200 bg-white dark:border-neutral-600 dark:bg-neutral-800">
                <h2 className="mb-0" id="headingFour">
                  <button
                    className="group relative flex w-full items-center rounded-t-[15px] border-0 bg-white px-5 py-4 text-left text-base text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 dark:text-white "
                    type="button"
                    data-te-collapse-init
                    data-te-collapse-collapsed
                    data-te-target="#collapseFour"
                    aria-expanded="false"
                    aria-controls="collapseTwo"
                  >
                    <div className="checkout-view-header py-2">
                      <h2 className="mb-0 mt-0 text-2xl font-bold leading-tight text-primary">
                        Billing
                      </h2>
                    </div>
                    <span className="-mr-1 ml-auto h-5 w-5 shrink-0 rotate-[-180deg] fill-[#336dec] transition-transform duration-200 ease-in-out group-[[data-te-collapse-collapsed]]:mr-0 group-[[data-te-collapse-collapsed]]:rotate-0 group-[[data-te-collapse-collapsed]]:fill-[#212529] motion-reduce:transition-none dark:fill-blue-300 dark:group-[[data-te-collapse-collapsed]]:fill-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </span>
                  </button>
                </h2>
                <div
                  id="collapseFour"
                  className="!visible hidden"
                  data-te-collapse-item
                  aria-labelledby="headingFour"
                  data-te-parent="#accordionExample"
                >
                  <div className="px-5 py-4">
                    <strong>This is the second item's accordion body.</strong>{" "}
                    It is hidden by default, until the collapse plugin adds the
                    appropriate classes that we use to style each element. These
                    classes control the overall appearance, as well as the
                    showing and hiding via CSS transitions. You can modify any
                    of this with custom CSS or overriding our default variables.
                    It's also worth noting that just about any HTML can go
                    within the <code>.accordion-body</code>, though the
                    transition does limit overflow.
                  </div>
                </div>
              </div> */}
              <div className=" border-b-2 border-neutral-200 bg-white dark:border-neutral-600 dark:bg-neutral-800">
                <h2 className="accordion-header mb-0" id="headingThree">
                  <button
                    className="group relative flex w-full items-center rounded-t-[15px] border-0 bg-white px-5 py-4 text-left text-base text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 dark:text-white "
                    type="button"
                    data-te-collapse-init
                    data-te-collapse-collapsed
                    data-te-target="#collapseThree"
                    aria-expanded="false"
                    aria-controls="collapseThree"
                  >
                    <div className="checkout-view-header py-2">
                      <h2 className="mb-0 mt-0 text-2xl font-bold leading-tight text-primary">
                        Payment
                      </h2>
                    </div>
                    <span className="-mr-1 ml-auto h-5 w-5 shrink-0 rotate-[-180deg] fill-[#336dec] transition-transform duration-200 ease-in-out group-[[data-te-collapse-collapsed]]:mr-0 group-[[data-te-collapse-collapsed]]:rotate-0 group-[[data-te-collapse-collapsed]]:fill-[#212529] motion-reduce:transition-none dark:fill-blue-300 dark:group-[[data-te-collapse-collapsed]]:fill-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </span>
                  </button>
                </h2>
                <div
                  id="collapseThree"
                  className="!visible hidden"
                  data-te-collapse-item
                  aria-labelledby="headingThree"
                  data-te-parent="#accordionExample"
                >
                  <div className="px-5 py-4">
                    <div className="payment-container">
                      <div className="flex items-center mb-4">
                        <div className="mr-4">
                          <input
                            id="default-radio-1"
                            type="radio"
                            value=""
                            name="default-radio"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label
                            htmlFor="default-radio-1"
                            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                          >
                            Credit Card
                          </label>
                        </div>
                        <div>
                          <input
                            id="default-radio-2"
                            type="radio"
                            value=""
                            name="default-radio"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label
                            htmlFor="default-radio-2"
                            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                          >
                            Paypal
                          </label>
                        </div>
                      </div>
                      <div className="flex mb-4">
                        <div>
                          <label
                            htmlFor="company"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Card Number
                          </label>
                          <input
                            type="text"
                            id="card"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="card"
                          />
                        </div>
                      </div>
                      <div className="flex mb-4">
                        <div>
                          <label
                            htmlFor="company"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Name on card
                          </label>
                          <input
                            type="text"
                            id="name"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="name"
                          />
                        </div>
                      </div>
                      <div className="flex mb-4 grid grid-cols-3 gap-4">
                        <div>
                          <label
                            htmlFor="company"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Expiration date (MM/YY)
                          </label>
                          <input
                            type="text"
                            id="card"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder=""
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="company"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            CVC
                          </label>
                          <input
                            type="text"
                            id="card"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="card"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1 px-3 bg-white">
            <OrderSummaryCartList
              cartListData={cartItem ?? []}
              customerId={getSessionID ?? ""}
              customerData={getCusValue ?? {}}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
