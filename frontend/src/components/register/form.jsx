import PropTypes from "prop-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import zod from "zod";
import { twMerge } from "tailwind-merge";
import { useState } from "react";
import { LoaderIcon } from "../../icons";
import { Link } from "react-router-dom";
import axios from "axios";
import { setCookie } from "../../lib/cookies";
import { useNavigate } from "react-router-dom";

const formSchema = zod.object({
  name: zod.string().min(2),
  email: zod.string().email(),
  password: zod.string().min(8),
});

const Form = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });
  const handleClick = async (data) => {
    setLoading(false);
    try {
      const res = await axios.post(
        "https://subid-das-dobby.onrender.com/api/users/signup",
        data
      );
      const { authToken } = res.data;
      setCookie("token", authToken);
      navigate("/gallery");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen sm:h-full sm:w-auto sm:col-span-4 bg-default">
      <div className="container-custom-xs flex h-full flex-col justify-center gap-6">
        <div className="upper">
          <h2 className="font-montserrat text-4xl font-bold">Register</h2>
          <p className="font-lato">
            Register to create an account and start using our services
          </p>
        </div>
        <div className="form-container">
          <form
            onSubmit={handleSubmit(handleClick)}
            className="flex flex-col gap-4 rounded-[1.25rem] bg-white p-8"
          >
            <div className="input-group flex flex-col gap-2">
              <label htmlFor="name">Name</label>
              <input
                className={twMerge(
                  "font-lato rounded-[0.625rem] border-2 bg-[#EAEAEA] px-4 py-2 outline-none",
                  errors.name ? "border-red-500" : "border-transparent"
                )}
                type="text"
                id="name"
                placeholder="SUBID DAS"
                {...register("name")}
                title={errors.name?.message}
              />
            </div>
            <div className="input-group flex flex-col gap-2">
              <label htmlFor="email">Email</label>
              <input
                className={twMerge(
                  "font-lato rounded-[0.625rem] border-2 bg-[#EAEAEA] px-4 py-2 outline-none",
                  errors.email ? "border-red-500" : "border-transparent"
                )}
                type="email"
                id="email"
                placeholder="abc123"
                {...register("email")}
                title={errors.email?.message}
              />
            </div>
            <div className="input-group flex flex-col gap-2">
              <label htmlFor="password">Password</label>
              <input
                className={twMerge(
                  "font-lato rounded-[0.625rem] border-2 bg-[#EAEAEA] px-4 py-2 outline-none",
                  errors.password ? "border-red-500" : "border-transparent"
                )}
                type="password"
                id="password"
                {...register("password")}
                title={errors.password?.message}
              />
            </div>
            <button
              className="font-montserrat flex items-center justify-center gap-2 rounded-[0.625rem] bg-black py-4 font-bold text-white transition-colors hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading && <LoaderIcon className="mr-2" />}
              Sign In
            </button>
          </form>
          <div className="register text-center mt-4">
            Have an account?{" "}
            <Link to={"/"} className="text-link font-lato">
              Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;

Form.propTypes = {
  isRegister: PropTypes.bool,
};
