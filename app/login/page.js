"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

function Login() {
  const [commerceData, setCommerceData] = useState([]);
  const router = useRouter();

  // form validation rules

  //const EMAIL_REGX = `^(([^<>()\[\]\\.,;:\s@"]+(.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/`;
  // const Valid_REGX = commerceData.is_valid === false;

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Must be a valid email")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };

  const { register, handleSubmit, formState, reset } = useForm(formOptions);
  const { errors } = formState;

  const onSubmit = async (data) => {
    console.log("data", data);
    // const email = data.email;
    // const password = data.password;
    const user = { email: data.email, password: data.password, channel_id: 1 };
    // console.log("user data",user);
    const result = await axios.post("api/users", user);
    if (result.data.is_valid === true) {
      console.log("Success");
      router.push("/Home");
    } else {
      console.log("Failier");
    }
    setCommerceData(result.data);
    sessionStorage.setItem("customer_Number", result.data.customer_id);
    console.log("User Validation Response ", result.data.is_valid);
    reset();
  };

  //   const onSubmit = (data) => console.log(data);
  // const customerValue = commerceData?.customer_id;
  useEffect(() => {
    // getBigcomProducts();
    // if (typeof window !== "undefined") {
    //   // set props data to session storage or local storage
    //   sessionStorage.setItem("customer_Number", customerValue);
    // }
  }, []);
  console.log("bigcommerce user data", commerceData);

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
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
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              action="#"
              onSubmit={handleSubmit(onSubmit)}
              autoComplete="off"
            >
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="username"
                  {...register("email")}
                  id="username"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required=""
                  autoComplete="off"
                />
                <div className="invalid-feedback">{errors.email?.message}</div>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  {...register("password")}
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required=""
                  autoComplete="off"
                />
                <div className="invalid-feedback">
                  {errors.password?.message}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      required=""
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="remember"
                      className="text-gray-500 dark:text-gray-300"
                    >
                      Remember me
                    </label>
                  </div>
                </div>
                <a
                  href="#"
                  className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-500 hover:bg-cyan-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Sign in
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{" "}
                <Link
                  href="/register"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
