import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signInSuccess, signInFailure } from "../redux/user/userSlice.js";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // method google Authentication
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const res = await axios.post("/api/v1/users/google", {
        username: result.user.displayName,
        email: result.user.email,
        photoUrl: result.user.photoURL,
      });

      console.log("res :", res);
      if (res.data.success === false) {
        dispatch(signInFailure(res.data.message));
        return;
      }
      dispatch(signInSuccess(res.data));
      navigate("/");
    } catch (error) {
      console.log("colud not sign in with google", error);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-red-700  w-full p-3 text-white rounded-lg uppercase hover:opacity-95"
    >
      Continue with google
    </button>
  );
};

export default OAuth;
