"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const Register = () => {
  const router = useRouter();

  const [isError, setIsError] = useState(null);

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

  useEffect(() => {
    //Runs only on the first render
  }, []);

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
  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900 md:h-screen">
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center">
          <a
            href="#"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <img
              className="logo"
              src="https://bics-store.vercel.app/images/bg_white_logo.png"
              alt="logo"
            />
          </a>
        </div>
        <div className="w-5/6 lg:w-1/2 mx-auto bg-white rounded shadow">
          <div className="py-4 px-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white my-6">
              Register for a free account
            </h1>
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
                    Email Address<span className="require-star">*</span>
                  </label>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    id="FormField_1_input"
                    {...register("email")}
                    type="text"
                    placeholder="Email Address"
                  />
                  <div className="invalid-feedback">
                    {errors.email?.message}
                  </div>
                </div>
                <div className="w-1/2 ml-1">
                  <label
                    className="block text-grey-darker text-sm mb-2"
                    htmlFor="FormField_2_input"
                  >
                    Password<span className="require-star">*</span>
                  </label>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    id="FormField_2_input"
                    type="password"
                    {...register("password")}
                    placeholder="Password"
                  />
                  <div className="invalid-feedback">
                    {errors.password?.message}
                  </div>
                </div>
              </div>
              <div className="flex mb-4">
                <div className="w-1/2 mr-1">
                  <label
                    className="block text-grey-darker text-sm mb-2"
                    htmlFor="FormField_3_input"
                  >
                    Confirm Password<span className="require-star">*</span>
                  </label>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    id="FormField_3_input"
                    {...register("cpassword")}
                    type="text"
                    placeholder="Confirm Password"
                  />
                  <div className="invalid-feedback">
                    {errors.cpassword?.message}
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
                    Address Line 1<span className="require-star">*</span>
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
                  <div className="invalid-feedback">{errors.city?.message}</div>
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
                    State/Province<span className="require-star">*</span>
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
                <button
                  type="submit"
                  className="w-full text-white bg-blue-500 hover:bg-cyan-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
