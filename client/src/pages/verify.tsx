import React from "react";
import background from "../assets/bg.png";
import logo from "../assets/logo.png";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { apiConstants } from "../constant/apiConstant";
import { toast } from "react-toastify";

const validationSchema = Yup.object({
  otp: Yup.string()
    .required("OTP is required")
    .matches(/^\d{6}$/, "OTP must be a 6-digit number"),
});

const Verify: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const navigate = useNavigate();

  const handleSubmit = async (values: { otp: string }) => {
    // Here you can make an API call or any other action upon successful OTP submission
    console.log("OTP Submitted: ", values.otp);
    try {
      const payload = {
        email,
        otp: values.otp,
      };
      const response = await axios.post(
        `${process.env.REACT_APP_BASEURL}/api/auth/verify`,
        payload
      );
      if (response.status == apiConstants.success) {
        toast.success(response.data?.message);
        navigate(`/signin`);
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
              <img src={logo} alt="Logo" />
              <span className="text-center md:text-left">HD</span>
            </h1>
          </div>
          <h2 className="text-3xl font-bold text-center md:text-left text-gray-900 mb-4">
            Verify
          </h2>
          <p className="text-gray-500 mb-8 text-center md:text-left">
            Enter the One Time Password to verify your account and enjoy the
            features of HD
          </p>

          {/* Formik form */}
          <Formik
            initialValues={{ otp: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-gray-700"
                  >
                    OTP
                  </label>
                  <Field
                    type="text"
                    id="otp"
                    name="otp"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                    placeholder="Enter OTP"
                  />
                  <ErrorMessage
                    name="otp"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting} // Disable button during submission
                  className={`w-full bg-blue-500 text-white rounded-md py-2 hover:bg-blue-600 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Verifying..." : "Submit"}{" "}
                  {/* Conditional text */}
                </button>
              </Form>
            )}
          </Formik>

          {/* Optional Link to Sign-in */}
          {/* <p className="mt-6 text-center text-gray-500">
            Dont have an OTP?
            <a
              href="/signin"
              className="text-blue-500 font-medium hover:underline"
            >
              Sign in
            </a>
          </p> */}
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

export default Verify;
