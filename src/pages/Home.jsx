import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [error, setError] = useState(null);
  SwiperCore.use([Navigation]);
  const navigate = useNavigate();

  const fetchRentListings = async () => {
    try {
      const res = await axios.get(`/api/v1/listings/get?type=rent`);
      setRentListings(res.data.data);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchSaleListings = async () => {
    try {
      const res = await axios.get(`/api/v1/listings/get?type=sale&limit=4`);
      setSaleListings(res.data.data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await axios.get(`/api/v1/listings/get?offer=true`);
        setOfferListings(res.data.data);
        fetchRentListings();
        fetchSaleListings();
      } catch (error) {
        setError(error.message);
      }
    };
    fetchOfferListings();
  }, []);

  useEffect(() => {
    const cookieCheching = async () => {
      const res = await axios.get("/api/v1/users/checkCookie");
      if (res.data.data === "tokenExit") {
        return;
      } else {
        navigate("/sign-in");
      }
    };
    cookieCheching();
  });

  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span>
          <br />
          place with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm ">
          Abhishek Estate is the best place to find your next perfect place to
          live
          <br />
          we have a wide range of properties for you to choose from
        </div>
        <Link
          to={"/search"}
          className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
        >
          Let get started...
        </Link>
      </div>

      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide>
              <div
                style={{
                  background: `url(${listing.imageUrls[1]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[500px]"
                key={listing._id}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* listing results for offer, sale and rent */}

      <div className="max-w-6xl mx-auto flex flex-col p-3 gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent offers
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?offer=true"}
              >
                Show more offer
              </Link>
            </div>

            <div className="flex flex-wrap gap-6 ">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for rent
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?type=rent"}
              >
                Show more places for rent
              </Link>
            </div>

            <div className="flex flex-wrap gap-6 ">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {saleListings && saleListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for sale
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?type=sale"}
              >
                Show more places for sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-center ">{error ? error : ""}</p>
    </div>
  );
};

export default Home;
