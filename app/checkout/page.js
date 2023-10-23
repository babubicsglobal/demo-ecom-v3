"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Link from "next/link";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import OrderSummaryCartList from "./../../components/orderSummary/CartList";
import { useSession, signOut } from "next-auth/react";
import { Countries, States } from "../utils/countryData";
import OrderSuccessModal from "../../components/orderSuccessModal/orderSuccessModal";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

const CheckoutPage = () => {
  const [isError, setIsError] = useState(false);
  const [customerData, setCustomerData] = useState([]);
  const [getSessionID, setSessionID] = useState("");
  const [getCusValue, setCusValue] = useState([]);
  const [cartItem, setCartItem] = useState([]);
  const { data } = useSession();
  const [shippingAddress, setShippingAddress] = useState({});
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [selectedState, setSelectedState] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(true);
  const [phonenumber , setphonenumber] = useState("")
  
  const [stateOptions, setStateOptions] = useState(States["US"]);

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handlePhoneSelect = (phone, country) => {
    console.log(`Selected phone: ${phone}`);
    console.log(`Selected country: ${country.countryCode}`);
    setphonenumber(phone);
    setSelectedCountry(country.countryCode.toUpperCase())
    if(States[country.countryCode.toUpperCase()]){
      setSelectedState(States[selectedCountry])
    }else{
      setSelectedState([])
    }
  };



  const onSubmit = async (data) => {
    console.log("subkmt");
    let shippingAddress = {
      email: data.email,
      city: data.city,
      company: data.companyname,
      country_iso2: selectedCountry.toUpperCase(),
      first_name: data.first_name,
      last_name: data.last_name,
      phone: phonenumber,
      zip: data.postal_code,
      state: data.state_or_province,
      street_1: data.address1,
      street_2: data.address2,
    };

    handlePlaceOrder(shippingAddress);
  };

  const countryOptions = Countries.map((country) => (
    <option key={country.code} value={country.code}>
      {country.name}
    </option>
  ));

  

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    setSelectedState("");
  };

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
  };

  // form validation rules
  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required")
      .matches(
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
        "Invalid email address"
      )
      .required("Email is required"),
    first_name: Yup.string().required("first name is required"),
    last_name: Yup.string().required("last name is required"),
    /*phonenumber: Yup.string().required("Phone number is required").test(
      "is-numeric-between-4-and-10-digits",
      "Phone number must be a numeric value between 4 and 10 digits",
      (value) => /^[0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]*$/.test(value)
    ),*/
    address1: Yup.string().required("address is required"),
    city: Yup.string().required("city is required"),
    state_or_province: Yup.string().required("State/Province is required"),
 
    postal_code: Yup.string().test(
      "is-numeric-between-4-and-9-digits",
      "Postal code must be a numeric value between 4 and 9 digits",
      (value) => /^[0-9]{4,9}$/.test(value)
    ),
    //country_code: Yup.string().required("Country is required"),
  });
  const formOptions = {
    resolver: yupResolver(validationSchema),
  };

  const {
    register,
    handleSubmit,
    setValue,
   
    watch,
    formState,
    reset,
    getValues,
    onChange,
  } = useForm(formOptions);
  const { errors } = formState;

  console.log("errors", errors);

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

  const getCustomerDetails = async (customerId) => {
    const request = {
      id: customerId,
    };
    const result = await axios
      .post("../api/getCustomerDetails", request)
      .then(function (response) {
        const customerData = response.data.data;
        console.log("Customer Address", response.data.data);
        if (customerData.length > 0) {
          setCustomerData(customerData[0]);
        }
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
    getCustomerDetails(+sessionStorage.getItem("customer_Number"));
    setSessionID(+sessionStorage.getItem("customer_Number"));
    getCartDetails(sessionStorage.getItem("cart_id"));
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    router.push("/orderListing");
  };

  const handlePlaceOrder = async (shippingAddress) => {
    if (Object.keys(shippingAddress).length > 0) {
      var productsData = [];
      for (let i = 0; i < cartItem.length; i++) {
        let product = {
          product_id: cartItem[i]?.product_id,
          quantity: cartItem[i]?.quantity,
          variant_id: cartItem[i]?.variant_id,
        };
        console.log("product", product);
        productsData.push(product);
      }

      var billingAddress = {};

      if (isChecked === true) {
        billingAddress = {
          first_name: shippingAddress.first_name,
          last_name: shippingAddress.last_name,
          street_1: shippingAddress.street_1,
          street_2: shippingAddress.street_2,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zip: shippingAddress.zip,
          country: shippingAddress.country,
          country_iso2: shippingAddress.country_iso2,
          email: shippingAddress.email,
        };
      } else {
        billingAddress = {
          first_name: customerData.first_name,
          last_name: customerData.last_name,
          street_1: customerData?.addresses[0]?.address1,
          street_2: customerData?.addresses[0]?.address2,
          city: customerData?.addresses[0]?.city,
          state: customerData?.addresses[0]?.state_or_province,
          zip: customerData?.addresses[0]?.postal_code,
          country: customerData?.addresses[0]?.country,
          country_iso2: customerData?.addresses[0]?.country_code,
          email: customerData.email,
        };
      }

      const CreateOrder = {
        status_id: 0,
        customer_id: getSessionID,
        products: productsData,
        billing_address: billingAddress,
        shipping_addresses: [shippingAddress],
        payment_method: "Test Payment Gateway",
      };

      console.log("CreateOrder", CreateOrder);

      const result = await axios
        .post("../api/createOrder", CreateOrder)
        .then(function (response) {
          console.log("Order Response", response.data);
          // createToken(response.data.id);
          sessionStorage.removeItem("cart_id");
         // router.push("/orderConfirmation")
         // <OrderConfirmation orderId={response.data.id} orderTotal={""} shippingAddress={shippingAddress} />
          
          setIsModalOpen(true);
        })
        .catch(function (error) {
          console.log(error);
          //setIsError(true);
        });
    } else {
      alert("Please enter shipping address");
    }
  };

  const createToken = async (orderId) => {
    let requestData = {
      order: {
        id: orderId,
        is_recurring: false,
      },
    };
    console.log("createToken", requestData);
    const result = await axios
      .post("../api/createToken", requestData)
      .then(function (response) {
        console.log("Token Resssponse", response.data);
        console.log("PAT", response.data.data.id);
        handlePayment(response.data.data.id);
      })
      .catch(function (error) {
        console.log(error);
        //setIsError(true);
      });
  };

  return (
    <div>
      <section className="bg-gray-100 min-h-screen">
        <div className="container mx-auto ">
          <div className="grid grid-cols-3 gap-4 py-6 mt-3 h-full ">
            <div className="col-span-2 px-3 bg-white">
              <div id="accordionExample" className="my-6">
                <div className="rounded-t-lg border-b-2 border-neutral-200 bg-white dark:border-neutral-600 dark:bg-neutral-800">
                  <div className="flex checkout-view-header py-2 px-5">
                    <h2 className="mb-0 mt-0 text-2xl font-bold leading-tight text-primary">
                      Customer
                    </h2>
                    <div className="px-5 py-1">
                      <div className="checkout-step optimizedCheckout-checkoutStep checkout-step--customer">
                        <div className="loading-skeleton">
                          {data?.user ? (
                            <span className="font-semibold text-blue-800">
                              {data?.user?.email}
                            </span>
                          ) : (
                            <form>
                              <div className="grid gap-6 mb-6 md:grid-cols-2">
                                <div>
                                  <input
                                    type="text"
                                    id="first_name"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Email"
                                  />
                                </div>
                                <div>
                                  <button
                                    type="submit1"
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                  >
                                    Continue
                                  </button>
                                </div>
                              </div>
                            </form>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-b-2 border-neutral-200 bg-white dark:border-neutral-600 dark:bg-neutral-800">
                  <h2 className="mb-0" id="headingOne">
                    <button
                      className="group relative flex w-full items-center rounded-t-[15px] border-0 bg-white px-5 py-4 text-left text-base text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 dark:text-white "
                      type="button"
                      data-te-collapse-init
                      data-te-target="#collapseOne"
                      aria-controls="collapseOne"
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
                    id="collapseOne"
                    data-te-collapse-item
                    aria-labelledby="headingOne"
                    data-te-parent="#accordionExample"
                  >
                    <div className="px-5 py-4">
                      <form
                        className="space-y-4 md:space-y-6"
                        action="#"
                        onSubmit={handleSubmit(onSubmit)}
                        autoComplete="off"
                      >
                        <div className="flex mb-4">
                          <div className="w-1/2 mr-1">
                            <label
                              className="block text-grey-darker text-sm mb-2"
                              htmlFor="FormField_1_input"
                            >
                              Email Address
                              <span className="require-star">*</span>
                            </label>
                            <input
                              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              id="FormField_1_input"
                              {...register("email")}
                              type="text"
                              placeholder="Email Address"
                              //value={getCusValue?.email || ""}
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
                              // value={getCusValue?.first_name || ""}
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
                              // value={getCusValue?.last_name || ""}
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
                              // value={getCusValue?.company || ""}
                            />
                          </div>
                        </div>
                        
                        <div className="flex mb-4">
                          <div className="w-1/2 mr-1">
                            <label
                              className="block text-grey-darker text-sm mb-2"
                              htmlFor="phonenumber"
                            >
                              Phone Number
                              <span className="require-star">*</span>
                            </label>
                            <PhoneInput 
                           className="w-full ml-1"
                           id="phonenumber"
                           name="phonenumber"
                          
                      country={'us'} 
          value={phonenumber} 
          {...register("phonenumber")}
          onChange={(phone ,country) => setValue('phonenumber',  handlePhoneSelect(phone,country))}
        /> 
                           
                             <div className="invalid-feedback">
                              {errors.phonenumber?.message}
                            </div>
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
                              htmlFor="FormField_12_input"
                            >
                              State/Province
                              <span className="require-star">*</span>
                            </label>
                            <select
                              id="state"
                              name="state"
                              value={selectedState}
                              {...register("state_or_province")}
                              onChange={(e) => setValue('state_or_province',    e.target.value , { shouldValidate: true },setSelectedState(e.target.value))} // Using setValue
       
                              //onChange={handleStateChange}
                              autoComplete="off"
                              className="mt-1 block w-full py-2.5 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                              <option value="">Select</option>
                              { stateOptions.map((state) => (
                                <option key={state} value={state}>
                                  {state}
                                </option>
                              ))  }
                            </select>
                            <div className="invalid-feedback">
                           {errors.state_or_province?.message}
                            </div>
                          </div>
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
                              checked={isChecked}
                              onChange={handleCheckboxChange}
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
                              <p className="mt-1 text-sm text-gray-500">
                                $5.00
                              </p>
                            </div>
                            <div className="rounded-md bg-white border p-6">
                              {" "}
                              <div className="flex justify-between text-base text-gray-900 flex-col">
                                <h3 className="font-medium">
                                  <a href="#">Express</a>
                                </h3>
                                <p className="ml-0">2–5 business days</p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">
                                $15.00
                              </p>
                            </div>
                          </div>
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
                    aria-controls="collapse"
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
                  <h2 className="accordion-header mb-0" id="headingTwo">
                    <button
                      className="group relative flex w-full items-center rounded-t-[15px] border-0 bg-white px-5 py-4 text-left text-base text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 dark:text-white "
                      type="button"
                      data-te-collapse-init
                      data-te-collapse-collapsed
                      data-te-target="#collapseTwo"
                      aria-expanded="true"
                      aria-controls="collapseTwo"
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
                    id="collapseTwo"
                    className="!visible hidden"
                    data-te-collapse-item
                    aria-labelledby="headingTwo"
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
              <div className="flex mb-4">
                <button
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                  className="w-full text-white bg-blue-500 hover:bg-cyan-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Place Order
                </button>
              </div>
            </div>
            <div className="col-span-1 px-3 bg-white">
              <OrderSummaryCartList
                cartListData={cartItem ?? []}
                customerId={getSessionID ?? ""}
                customerData={customerData}
                shippingAddress={shippingAddress}
                errors={errors}
              />
            </div>
          </div>
        </div>
      </section>
       <OrderSuccessModal isOpen={isModalOpen} onClose={handleCloseModal} />

    </div>
  );
};

export default CheckoutPage;
