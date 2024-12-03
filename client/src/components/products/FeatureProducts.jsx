import React, { useEffect } from "react";
import { AiFillHeart, AiOutlineShoppingCart } from "react-icons/ai";
import { FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Ratings from "../Ratings";
import { useDispatch, useSelector } from "react-redux";
import {
  add_to_card,
  add_to_wishlist,
  messageClear,
} from "../../store/reducers/cardReducer";
import toast from "react-hot-toast";

const FeatureProducts = ({ products }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { successMessage, errorMessage } = useSelector((state) => state.card);
  const addCard = (id) => {
    if (userInfo) {
      dispatch(
        add_to_card({
          userId: userInfo.id,
          quantity: 1,
          productId: id,
        })
      );
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch]);

  const add_wishlist = (product) => {
    if (userInfo) {
      dispatch(
        add_to_wishlist({
          userId: userInfo.id,
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          discount: product.discount,
          rating: product.rating,
          slug: product.slug,
        })
      );
    } else {
      navigate("/login");
    }
  };
  return (
    <div className="w-[85%] flex flex-wrap mx-auto">
      <div className="w-full">
        <div className="text-center flex justify-center items-center flex-col text-4xl text-slate-600 font-bold relative pb-[45px]">
          <h2>Feature Products</h2>
          <div className="w-[100px] h-[4px] bg-[#7fad39] mt-4"></div>
        </div>
      </div>
      <div className="w-full grid grid-cols-4 md-lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
        {products?.map((product, i) => (
          <div
            key={i}
            className="border group transition-all duration-500 hover:shadow-md hover:translate-y-3"
          >
            <div className="relative overflow-hidden">
              {product?.discount ? (
                <div className="flex justify-center items-center absolute text-white w-[38px] h-[38px] rounded-full bg-red-500 font-semibold text-xs left-2 top-2">
                  {product?.discount}%
                </div>
              ) : (
                ""
              )}
              <img
                className="sm:w-full w-full h-[240px]"
                src={product.images[0]}
                alt="Product"
              />
              <ul className="flex transition-all duration-700 -bottom-10 justify-center items-center gap-2 absolute w-full group-hover:bottom-3">
                <li
                  onClick={() => add_wishlist(product)}
                  className="w-[38px] h-[38px] cursor-pointer bg-white flex justify-center items-center rounded-full hover:bg-[#7fad39] hover:text-white hover:rotate-[720deg] transition-all"
                >
                  <AiFillHeart />
                </li>
                <Link
                  className="w-[38px] h-[38px] cursor-pointer bg-white flex justify-center items-center rounded-full hover:bg-[#7fad39] hover:text-white hover:rotate-[720deg] transition-all"
                  to={`/product/details/${product?.slug}`}
                >
                  <FaEye />
                </Link>
                <li
                  onClick={() => addCard(product._id)}
                  className="w-[38px] h-[38px] cursor-pointer bg-white flex justify-center items-center rounded-full hover:bg-[#7fad39] hover:text-white hover:rotate-[720deg] transition-all"
                >
                  <AiOutlineShoppingCart />
                </li>
              </ul>
            </div>
            <div className="py-3 text-slate-600 px-2 capitalize">
              <h2>{product.name}</h2>
              <div className="flex justify-start items-center gap-3">
                <span className="text-lg font-bold">${product.price}</span>
                <div className="flex">
                  <Ratings ratings={product.rating} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureProducts;
