import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import background from "../assets/bg.png";
import logo from "../assets/logo.png";
import axios from "axios";
import { toast } from "react-toastify";
import { apiConstants } from "../constant/apiConstant";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  dob: Yup.date().required("Date of birth is required").nullable(),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least 8 characters, including uppercase, lowercase, a number, and a special character."
    )
    .required("Password is required"),
});

const SignUp: React.FC = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const toggleShow = () => {
    setShow((prev) => !prev);
  };

  const handleSubmit = async (values: {
    name: string;
    dob: string;
    email: string;
    password: string;
  }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASEURL}/api/auth/signup`,
        values
      );
      if (response.status == apiConstants.success) {
        toast.success(response.data?.message);
        navigate(`/verify?email=${encodeURIComponent(values.email)}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Something went wrong");
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="flex-1 flex flex-col items-center bg-white p-6 lg:px-20">
        <div className="w-full max-w-md">
          <div className="mb-8 md:mb-16 flex justify-center md:justify-start">
            <h1 className="text-2xl font-semibold text-gray-800 flex items-center space-x-2">
              <img src={logo} alt="" />
              <span className="text-center md:text-left">HD</span>
            </h1>
          </div>
          <h2 className="text-3xl font-bold text-center md:text-left text-gray-900 mb-4">
            Sign up
          </h2>
          <p className="text-gray-500 mb-8 text-center md:text-left">
            Sign up to enjoy the feature of HD
          </p>

          <Formik
            initialValues={{
              name: "",
              dob: "",
              email: "",
              password: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Your Name
                  </label>
                  <Field
                    type="text"
                    id="name"
                    name="name"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                    placeholder="John"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="dob"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Date of Birth
                  </label>
                  <Field
                    type="date"
                    id="dob"
                    name="dob"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                  />
                  <ErrorMessage
                    name="dob"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                    placeholder="john@gmail.com"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Field
                      type={show ? "text" : "password"}
                      id="password"
                      name="password"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 pr-10"
                      placeholder="********"
                    />
                    <span
                      className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                      onClick={toggleShow}
                    >
                      {show ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="h-5 w-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="h-5 w-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                        </svg>
                      )}
                    </span>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-blue-500 text-white rounded-md py-2 hover:bg-blue-600 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Sign up"}{" "}
                </button>
              </Form>
            )}
          </Formik>

          <div className="flex items-center my-6">
            <div className="w-full h-px bg-gray-300"></div>
            <span className="mx-4 text-gray-500">or</span>
            <div className="w-full h-px bg-gray-300"></div>
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center border border-gray-300 rounded-md py-2 text-gray-700 hover:bg-gray-100"
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
              className="h-5 w-5 mr-2"
            />
            Continue with Google
          </button>

          <p className="mt-6 text-center text-gray-500">
            Already have an account?{" "}
            <a
              href="/signin"
              className="text-blue-500 hover:text-blue-700 font-semibold"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 h-fit bg-cover bg-no-repeat">
        <img
          src={background}
          alt="Background"
          className="object-cover w-full h-full rounded-l-lg"
        />
      </div>
    </div>
  );
};

export default SignUp;
