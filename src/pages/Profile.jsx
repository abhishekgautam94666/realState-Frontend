import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from "../redux/user/userSlice.js";
import axios from "axios";

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileuploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  // handle update ----------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // handleSubmit --------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await axios.post(
        `https://realstate-k1g5.onrender.com/api/v1/users1/update/${currentUser.data._id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json", // Set content-type header to application/json
          },
          withCredentials: true,
        }
      );
      console.log("res:", res.data);
      if (res.data.success === false) {
        dispatch(updateUserFailure(res.data.message));
        return;
      }
      dispatch(updateUserSuccess(res.data));
      setUpdateSuccess(true);
    } catch (err) {
      console.log("err:", err);
      dispatch(updateUserFailure(err.message));
    }
  };

  // handle delete user ----------------------
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await axios.delete(
        `https://realstate-k1g5.onrender.com/api/v1/users1/delete/${currentUser.data._id}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success === false) {
        return;
      }
      dispatch(deleteUserSuccess(res.data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  // handle sign out ---------------
  const handleSignOutUser = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await axios.get(
        "https://realstate-k1g5.onrender.com/api/v1/users/signOut",
        {
          withCredentials: true,
        }
      );
      if (res.data.success === false) {
        dispatch(signOutUserFailure(res.data.message));
        return;
      }
      dispatch(signOutUserSuccess(res.data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  //-------------- show listing ------------------------
  const handleShowListing = async () => {
    try {
      setShowListingsError(false);
      const res = await axios.get(
        `https://realstate-k1g5.onrender.com/api/v1/listings/listing/${currentUser.data._id}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success == false) {
        setShowListingsError(true);
      }
      setShowListingsError(false);
      setUserListings(res.data.data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  // ----------- listing delete ------------
  const handleListingDelete = async (listId) => {
    try {
      console.log(listId);
      const res = await axios.delete(
        `https://realstate-k1g5.onrender.com/api/v1/listings/delete/${listId}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success == false) {
        console.log(res.data.message);
      }
      setUserListings((prevListings) =>
        prevListings.filter((listing) => listing._id !== listId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-3 mx-auto max-w-lg">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          hidden
          ref={fileRef}
        />
        <img
          onClick={() => fileRef.current.click()}
          className="w-24 h-24 rounded-full object-cover cursor-pointer self-center mt-2"
          src={formData.avatar || currentUser.data.avatar}
          alt="Profile"
        />
        <p className="text-md self-center">
          {fileuploadError ? (
            <span className="text-red-700">ERROR IMAGE UPLOADED</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">`Uploading ${filePerc}%`</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700"> IMAGE successfully UPLOADED</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg "
          defaultValue={currentUser.data.username}
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          defaultValue={currentUser.data.email}
          placeholder="email"
          className="border p-3 rounded-lg "
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg "
          id="password"
          onChange={handleChange}
        />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-85">
          {loading ? "...Loading" : " update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          Crreate Listing
        </Link>
      </form>
      <div className="flex justify-between p-3">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
        <span
          onClick={handleSignOutUser}
          className="text-red-700 cursor-pointer"
        >
          sign Out
        </span>
      </div>
      <p className="text-red-700">{error ? error : ""}</p>
      <p className="text-green-700">
        {updateSuccess ? "User is updated successfully!" : ""}
      </p>
      <button onClick={handleShowListing} className="text-green-700 w-full">
        {showListingsError ? "Error showing listing" : "Show Listing"}
      </button>
      <p className="text-red-700 mt-5">
        {showListingsError ? "Error showing listings" : ""}
      </p>

      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center my-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => {
            return (
              <div
                key={listing._id}
                className="border rounded-lg p-3 flex justify-between items-center gap-4"
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0]}
                    alt="listing Cover"
                    className="h-16 w-16 object-contain"
                  />
                </Link>
                <Link
                  className="text-slate-700 font-semibold  hover:underline truncate flex-1"
                  to={`/listing/${listing._id}`}
                >
                  <p>{listing.name}</p>
                </Link>

                <div className="flex flex-col items-center">
                  <button
                    onClick={() => handleListingDelete(listing._id)}
                    className="text-red-700 uppercase"
                  >
                    Delete
                  </button>
                  <Link to={`/update-listing/${listing._id}`}>
                    <button className="text-green-700 uppercase">Edit</button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Profile;
