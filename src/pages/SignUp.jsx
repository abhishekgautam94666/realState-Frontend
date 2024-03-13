import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import OAuth from "../components/OAuth.jsx";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFotmData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // handlerchange
  const handleChange = (e) => {
    setFotmData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post(
        "https://realstate-k1g5.onrender.com/api/v1/users/signUp",
        formData,
        {
          withCredentials: true, // Disable sending credentials
          headers: {
            "Content-Type": "application/json", // Set content-type header to application/json
          },
        }
      );
      
      if (res.data.success === false) {
        setError(res.data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      setError(null);
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
          autoComplete="false"
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have a account</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-600">Sign In</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
};

export default SignUp;
