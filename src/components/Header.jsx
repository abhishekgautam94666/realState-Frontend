import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  console.log(searchTerm);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className="bg-slate-200 shadow-md ">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <h1 className="font-bold text-lg sm:text-xl flex flex-wrap">
          <span className="text-slate-500">Sahad</span>
          <span className="text-slate-700">Estate</span>
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-3 rounded-lg flex justify-center items-center "
        >
          <input
            type="text"
            placeholder="search...."
            className="bg-transparent focus:outline-none w-24 sm:w-64 "
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <button type="submit">
            <FaSearch className="text-slate-500" />
          </button>
        </form>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline text-lg mx-2 font-medium">
              Home
            </li>
          </Link>

          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline text-lg mx-2 font-medium">
              About
            </li>
          </Link>

          <Link to="/profile">
            {currentUser ? (
              <img
                className="w-9 h-9 rounded-full"
                src={currentUser.data.avatar}
                alt="Profile"
              />
            ) : (
              <li className="text-slate-700 hover:underline text-lg mx-2 font-medium">
                Sign in
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;
