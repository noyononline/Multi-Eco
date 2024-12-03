import React, { useState } from "react";
import { GrMail } from "react-icons/gr";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import {
  AiFillGithub,
  AiFillHeart,
  AiFillShopping,
  AiOutlineTwitter,
} from "react-icons/ai";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaUser,
  FaLock,
  FaList,
} from "react-icons/fa";
import { IoIosCall } from "react-icons/io";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  get_card_products,
  get_wishlist_products,
} from "../store/reducers/cardReducer";
const Headers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categorys } = useSelector((state) => state.home);
  const { userInfo } = useSelector((state) => state.auth);
  const { card_product_count, wishlist_count } = useSelector(
    (state) => state.card
  );
  const { pathname } = useLocation();

  const [showShidebar, setShowShidebar] = useState(true);
  const [showCategory, setShowCategory] = useState(true);

  const [searchValue, setSearchValue] = useState("");
  const [category, setCategory] = useState("");

  const search = () => {
    navigate(`/products/search?category=${category}&&search=${searchValue}`);
  };

  const redirect_card_page = () => {
    if (userInfo) {
      navigate("/card");
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    dispatch(get_card_products(userInfo.id));
  }, [dispatch, userInfo]);

  useEffect(() => {
    dispatch(get_wishlist_products(userInfo.id));
  }, [dispatch, userInfo]);

  return (
    <div className="w-full bg-white">
      <div className="header-top bg-[#eeeeee] md-lg:hidden">
        <div className="w-[85%] lg:w-[90%] mx-auto">
          <div className="flex w-full justify-between items-center h-[40px] text-slate-500">
            <ul className="flex justify-start items-center gap-8">
              <li className="flex relative justify-center items-center gap-2 text-sm after:absolute after:h-[18px] after:w-[1px] after:bg-[#afafaf] after:-right-[16px]">
                <span>
                  <GrMail />
                </span>
                <span>noyon@example.com</span>
              </li>
              <span>Multi vendor Ecommerce</span>
            </ul>
            <div>
              <div className="flex justify-center items-center gap-10">
                <div className="flex justify-center items-center gap-4">
                  <a href="https://www.facebook.com/akterhossennoyon">
                    <FaFacebookF />
                  </a>
                  <a href="https://www.facebook.com/akterhossennoyon">
                    <AiOutlineTwitter />
                  </a>
                  <a href="https://www.facebook.com/akterhossennoyon">
                    <FaLinkedinIn />
                  </a>
                  <a href="https://www.facebook.com/akterhossennoyon">
                    <AiFillGithub />
                  </a>
                </div>
                <div className="flex group cursor-pointer text-slate-800 text-sm justify-center items-center gap-1 relative after:absolute after:h-[18px] after:w-[1px] after:bg-[#afafaf] after:-right-[16px] before:absolute before:bg-[#afafaf] before:h-[18px] before:w-[1px] before:-left-[20px]">
                  <img src="http://localhost:3000/images/language.png" alt="" />
                  <span>
                    <MdOutlineKeyboardArrowDown />
                  </span>
                  <ul className="absolute invisible transition-all top-12 rounded-sm duration-200 text-white p-2 w-[100ox] flex flex-col gap-3 group-hover:visible group-hover:top-6 group-hover:bg-black">
                    <li>Bangla</li>
                    <li>English</li>
                  </ul>
                </div>
                {userInfo ? (
                  <Link
                    className="flex cursor-pointer justify-center items-center gap-2 text-sm"
                    to="/dashboard"
                  >
                    <span>{userInfo?.name}</span>
                    <span>
                      <FaUser />
                    </span>
                  </Link>
                ) : (
                  <Link
                    to={"/login"}
                    className="flex cursor-pointer justify-center items-center gap-2 text-sm"
                  >
                    <span>
                      <FaLock />
                    </span>
                    <span>Login</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-white">
        <div className="w-[85%] lg:w-[90%] mx-auto">
          <div className="h-[80px] md-lg:h-[100px] flex justify-between items-center flex-wrap">
            <div className="md-lg:w-full w-3/12 md-lg:pt-4">
              <div className="flex justify-between items-center">
                <Link to="/">
                  <img src="http://localhost:3000/images/logo.png" alt="logo" />
                </Link>
                <div
                  className="justify-center items-center w-[30px] h-[30px] bg-white text-slate-600 border border-slate-600 rounded-sm cursor-pointer lg:hidden md-lg:flex xl:hidden hidden"
                  onClick={() => setShowShidebar(false)}
                >
                  <span>
                    <FaList />
                  </span>
                </div>
              </div>
            </div>
            <div className="md-lg:w-full w-9/12">
              <div className="flex justify-between md-lg:justify-center items-center flex-wrap pl-8">
                <ul className="flex justify-start items-start gap-8 text-sm font-bold uppercase md-lg:hidden">
                  <li>
                    <Link
                      className={`p-2 block ${
                        pathname === "/" ? "text-[#7fad39]" : "text-slate-600"
                      }`}
                      to={"/"}
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={`p-2 block ${
                        pathname === "/shops"
                          ? "text-[#7fad39]"
                          : "text-slate-600"
                      }`}
                      to={"/shops"}
                    >
                      Shop
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={`p-2 block ${
                        pathname === "/blog"
                          ? "text-[#7fad39]"
                          : "text-slate-600"
                      }`}
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={`p-2 block ${
                        pathname === "/about"
                          ? "text-[#7fad39]"
                          : "text-slate-600"
                      }`}
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={`p-2 block ${
                        pathname === "/contact"
                          ? "text-[#7fad39]"
                          : "text-slate-600"
                      }`}
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
                <div className="flex md-lg:hidden justify-center items-center gap-5">
                  <div className="flex justify-center gap-5">
                    <Link
                      to={"/dashboard/wishlist"}
                      className="relative flex justify-center items-center cursor-pointer w-[35px] h-[35px] rounded-full bg-[#e2e2e2]"
                    >
                      <span className="text-xl text-red-500">
                        <AiFillHeart />
                      </span>
                      {wishlist_count !== 0 && (
                        <div className="w-[20px] h-[20px] absolute bg-green-500 rounded-full text-white flex justify-center items-center -top-[3px] -right-[5px]">
                          {wishlist_count}
                        </div>
                      )}
                    </Link>
                    <div
                      onClick={redirect_card_page}
                      className="relative flex justify-center items-center cursor-pointer w-[35px] h-[35px] rounded-full bg-[#e2e2e2]"
                    >
                      <span className="text-xl text-red-500">
                        <AiFillShopping />
                      </span>
                      {card_product_count !== 0 && (
                        <div className="w-[20px] h-[20px] absolute bg-green-500 rounded-full text-white flex justify-center items-center -top-[3px] -right-[5px]">
                          {card_product_count}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile device menu start  */}
      <div className="hidden md-lg:block">
        <div
          onClick={() => setShowShidebar(true)}
          className={`fixed duration-200 transition-all ${
            showShidebar ? "invisible" : "visible"
          } hidden md-lg:block w-screen h-screen bg-[rgba(0,0,0,0.5)] top-0 left-0 z-20`}
        ></div>
        <div
          className={`w-[300px] z-[9999] transition-all duration-200 fixed ${
            showShidebar ? "-left-[300px]" : "left-0"
          } top-0 overflow-y-auto bg-white h-screen py-6 px-8`}
        >
          <div className="flex justify-start flex-col gap-6">
            <Link to="/">
              <img src="http://localhost:3000/images/logo.png" alt="logo" />
            </Link>
            <div className="flex justify-start items-center gap-10">
              <div className="flex group cursor-pointer text-slate-800 text-md justify-center items-center gap-1 relative after:absolute after:h-[18px] after:w-[1px] after:bg-[#afafaf] after:-right-[16px]">
                <img src="http://localhost:3000/images/language.png" alt="" />
                <span>
                  <MdOutlineKeyboardArrowDown />
                </span>
                <ul className="absolute invisible transition-all top-12 rounded-sm duration-200 text-white p-2 w-[100ox] flex flex-col gap-3 group-hover:visible group-hover:top-6 group-hover:bg-black">
                  <li>Bangla</li>
                  <li>English</li>
                </ul>
              </div>
              {userInfo ? (
                <Link
                  className="flex cursor-pointer justify-center items-center gap-2 text-sm"
                  to="/dashboard"
                >
                  <span>{userInfo?.name}</span>
                  <span>
                    <FaUser />
                  </span>
                </Link>
              ) : (
                <Link
                  to={"/login"}
                  className="flex cursor-pointer justify-center items-center gap-2 text-sm"
                >
                  <span>
                    <FaLock />
                  </span>
                  <span>Login</span>
                </Link>
              )}
            </div>
            <ul className="flex flex-col justify-start items-start text-md font-semibold uppercase">
              <li>
                <Link
                  to={"/"}
                  className={`py-2 block ${
                    pathname === "/" ? "text-[#7fad39]" : "text-slate-600"
                  }`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to={"/shops"}
                  className={`py-2 block ${
                    pathname === "/shops" ? "text-[#7fad39]" : "text-slate-600"
                  }`}
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to={"/blog"}
                  className={`py-2 block ${
                    pathname === "/blog" ? "text-[#7fad39]" : "text-slate-600"
                  }`}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to={"/about"}
                  className={`py-2 block ${
                    pathname === "/about" ? "text-[#7fad39]" : "text-slate-600"
                  }`}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to={"/contact"}
                  className={`py-2 block ${
                    pathname === "/contact"
                      ? "text-[#7fad39]"
                      : "text-slate-600"
                  }`}
                >
                  Contact
                </Link>
              </li>
            </ul>
            <div className="flex justify-start items-center gap-4">
              <Link to={"https://www.facebook.com/akterhossennoyon"}>
                <FaFacebookF />
              </Link>
              <Link to={"https://www.facebook.com/akterhossennoyon"}>
                <AiOutlineTwitter />
              </Link>
              <Link to={"https://www.facebook.com/akterhossennoyon"}>
                <FaLinkedinIn />
              </Link>
              <Link to={"https://www.facebook.com/akterhossennoyon"}>
                <AiFillGithub />
              </Link>
            </div>
            <div className="w-full flex justify-end md-lg:justify-start gap-3 items-center">
              <div className="w-[48px] h-[48px] rounded-full flex bg-[#f5f5f5] justify-center items-center">
                <span>
                  <IoIosCall />
                </span>
              </div>
              <div className="flex justify-end flex-col gap-1">
                <h2 className="text-sm font-medium text-slate-700">
                  +8801855427839
                </h2>
                <span className="text-xs">Support 24/7 Hours</span>
              </div>
            </div>

            <ul className="flex flex-col justify-start items-start gap-3 text-[#1c1c1c]">
              <li className="flex justify-start items-center gap-2 text-sm">
                <span>
                  <GrMail />
                </span>
                <span>akterhossennoyon@gmail.com</span>
              </li>
              <span className="text-sm">AH Noyon Ecommerce</span>
            </ul>
          </div>
        </div>
      </div>
      {/* Mobile device menu end  */}
      <div className="w-[85%] lg:w-[90%] mx-auto">
        <div className="flex w-full flex-wrap md-lg:gap-8">
          <div className="w-3/12 md-lg:w-full">
            <div className="bg-white relative">
              <div
                onClick={() => setShowCategory(!showCategory)}
                className="h-[50px] bg-violet-400 text-white flex justify-center md-lg:justify-between md-lg:px-6 items-center gap-3 font-bold text-md cursor-pointer"
              >
                <div className="flex justify-center items-center gap-3">
                  <span>
                    <FaList />
                  </span>
                  <span>All Category</span>
                </div>
                <span className="pt-1">
                  <MdOutlineKeyboardArrowDown />
                </span>
              </div>
              <div
                className={`${
                  showCategory ? "h-0" : "h-[400px]"
                } overflow-hidden transition-all md-lg:relative duration-500 absolute z-[99999] bg-white w-full border-x`}
              >
                <ul className="py-2 text-slate-600 font-medium">
                  {categorys?.map((category, i) => {
                    return (
                      <li
                        key={i}
                        className="flex flex-wrap justify-start items-center gap-2 px-[24px] py-[6px]"
                      >
                        <Link
                          key={i}
                          to={`/product/${category.slug}`}
                          className="flex justify-center items-center gap-3"
                        >
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-[40px] h-[40px] rounded-full"
                          />
                          <Link
                            to={`/products?category=${category.name}`}
                            className="text-sm block"
                          >
                            {category.name}
                          </Link>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
          <div className="w-9/12 pl-8 md-lg:pl-0 md-lg:w-full">
            <div className="flex flex-wrap w-full justify-between items-center md-lg:gap-6">
              <div className="w-8/12 md-lg:w-full">
                <div className="flex border h-[50px] items-center relative gap-5">
                  <div className="relative after:absolute after:h-[25px] after:w-[1px] after:bg-[#afafaf] after:-right-[15px] md:hidden">
                    <select
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-[150px] text-slate-600 font-semibold bg-transparent px-2 h-full outline-0 border-none"
                      name=""
                      id=""
                    >
                      <option value="">Select Category</option>
                      {categorys?.map((category, i) => (
                        <option key={i} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <input
                    className="w-full relative bg-transparent text-slate-500 outline-0 px-3 h-full"
                    onChange={(e) => setSearchValue(e.target.value)}
                    type="search"
                    name=""
                    id=""
                    placeholder="What do you need?"
                  />
                  <button
                    type="submit"
                    onClick={search}
                    className="bg-violet-400 right-0 absolute px-8 h-full font-semibold text-white uppercase"
                  >
                    Search
                  </button>
                </div>
              </div>
              <div className="w-4/12 block md-lg:hidden pl-2 md-lg:w-full md-lg:pl-0">
                <div className="w-full flex justify-end md-lg:justify-start gap-3 items-center">
                  <div className="w-[48px] h-[48px] rounded-full flex bg-[#f5f5f5] justify-center items-center">
                    <span>
                      <IoIosCall />
                    </span>
                  </div>
                  <div className="flex justify-end flex-col gap-1">
                    <h2 className="text-md font-bold text-slate-700">
                      +8801855427839
                    </h2>
                    <span className="text-sm">Support 24/7 Hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Headers;
