import React, { useEffect } from "react";
import { AiFillHeart, AiOutlineShoppingCart } from "react-icons/ai";
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import Ratings from "../Ratings";
import { useDispatch, useSelector } from "react-redux";
import {
  get_wishlist_products,
  remove_wishlist,
  messageClear,
} from "../../store/reducers/cardReducer";
import toast from "react-hot-toast";

const Wishlist = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { wishlists, successMessage } = useSelector((state) => state.card);

  useEffect(() => {
    dispatch(get_wishlist_products(userInfo.id));
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
  }, [dispatch, successMessage]);
  return (
    <div className="w-full grid grid-cols-4 md-lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
      {wishlists?.map((product, i) => (
        <div
          key={i}
          className="border group transition-all bg-white duration-500 hover:shadow-md hover:translate-y-3"
        >
          <div className="relative overflow-hidden">
            {product?.discount !== 0 && (
              <div className="flex justify-center items-center absolute text-white w-[38px] h-[38px] rounded-full bg-red-500 font-semibold text-xs left-2 top-2">
                {product.discount}%
              </div>
            )}

            <img
              className="sm:w-full w-full h-[240px]"
              src={product.image}
              alt="Product"
            />
            <ul className="flex transition-all duration-700 -bottom-10 justify-center items-center gap-2 absolute w-full group-hover:bottom-3">
              <li
                onClick={() => dispatch(remove_wishlist(product._id))}
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
              <li className="w-[38px] h-[38px] cursor-pointer bg-white flex justify-center items-center rounded-full hover:bg-[#7fad39] hover:text-white hover:rotate-[720deg] transition-all">
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
  );
};

export default Wishlist;
