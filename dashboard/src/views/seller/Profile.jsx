import React, { useEffect, useState } from "react";
import { BsImages } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { FadeLoader, PropagateLoader } from "react-spinners";
import { useSelector, useDispatch } from "react-redux";
import {
  profile_image_upload,
  messageClear,
  profile_info_add,
} from "../../store/Reducers/authReducer";
import toast from "react-hot-toast";
import { create_stripe_connect_account } from "../../store/Reducers/sellerReducer";
const Profile = () => {
  const dispatch = useDispatch();
  const { userInfo, loader, successMessage, errorMessage } = useSelector(
    (state) => state.auth
  );

  const [state, setState] = useState({
    division: "",
    district: "",
    shopName: "",
    sub_district: "",
  });

  const add_image = (e) => {
    if (e.target.files.length > 0) {
      const formData = new FormData();
      formData.append("image", e.target.files[0]);

      dispatch(profile_image_upload(formData));
    }
  };

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
  });

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };
  const profileInfoAdd = (e) => {
    e.preventDefault();
    dispatch(profile_info_add(state));
  };
  const overrideStyle = {
    display: "flex",
    margin: "0 auto",
    height: "24px",
    justifyContent: "center",
    alignItems: "center",
  };
  return (
    <div className="px-2 lg:px-7 py-5">
      <div className="w-full flex flex-wrap">
        <div className="w-full md:w-6/12">
          <div className="w-full p-4 bg-[#283046] rounded-md text-[#d0d2d6]">
            <div className="flex justify-center items-center py-3">
              {userInfo?.image ? (
                <label
                  htmlFor="img"
                  className="h-[210px] w-[300px] cursor-pointer p-3 relative overflow-hidden"
                >
                  <img
                    className="w-full h-full object-cover"
                    src={userInfo.image}
                    alt=""
                  />
                  {loader && (
                    <div className="bg-slate-600 absolute left-0 top-0 w-full h-full opacity-70 flex justify-center items-center z-20">
                      <span>
                        <FadeLoader />
                      </span>
                    </div>
                  )}
                </label>
              ) : (
                <label
                  htmlFor="img"
                  className="flex justify-center items-center flex-col h-[210px] w-[300px] cursor-pointer border border-dashed hover:border-indigo-500 border-[#d0d2d6] relative"
                >
                  <span>
                    <BsImages />
                  </span>
                  <span>Select Image</span>
                  {loader && (
                    <div className="bg-slate-600 absolute left-0 top-0 w-full h-full opacity-70 flex justify-center items-center z-20">
                      <span>
                        <FadeLoader />
                      </span>
                    </div>
                  )}
                </label>
              )}
              <input
                onChange={add_image}
                type="file"
                name="img"
                id="img"
                className="hidden"
              />
            </div>
            <div className="px-0 md:px-5 py-2">
              <div className="flex justify-between text-sm flex-col gap-2 p-4 bg-slate-800 rounded-md relative">
                <span className="p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50 absolute right-2 top-2 cursor-pointer">
                  <FaEdit />
                </span>
                <div className="flex gap-2">
                  <span>Name : </span>
                  <span>{userInfo.name}</span>
                </div>
                <div className="flex gap-2">
                  <span>Email : </span>
                  <span>{userInfo.email}</span>
                </div>
                <div className="flex gap-2">
                  <span>Role : </span>
                  <span>{userInfo.role}</span>
                </div>
                <div className="flex gap-2">
                  <span>Status : </span>
                  <span>{userInfo.status}</span>
                </div>
                <div className="flex gap-2">
                  <span>Payment Account : </span>
                  <p>
                    {userInfo.payment === "active" ? (
                      <span className="bg-red-500 text-white text-xs cursor-pointer font-normal ml-2 px-2 py-0.5 rounded ">
                        {userInfo.payment}
                      </span>
                    ) : (
                      <button
                        onClick={() =>
                          dispatch(create_stripe_connect_account())
                        }
                        className="bg-blue-500 text-white text-xs cursor-pointer font-normal ml-2 px-2 py-0.5 rounded "
                      >
                        click active
                      </button>
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="px-0 md:px-5 py-2">
              {userInfo?.shopInfo ? (
                <div className="flex justify-between text-sm flex-col gap-2 p-4 bg-slate-800 rounded-md relative">
                  <span className="p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50 absolute right-2 top-2 cursor-pointer">
                    <FaEdit />
                  </span>
                  <div className="flex gap-2">
                    <span>Shop Name : </span>
                    <span>{userInfo?.shopInfo?.shopName}</span>
                  </div>
                  <div className="flex gap-2">
                    <span>Divition : </span>
                    <span>{userInfo?.shopInfo?.division}</span>
                  </div>
                  <div className="flex gap-2">
                    <span>District : </span>
                    <span>{userInfo?.shopInfo?.district}</span>
                  </div>
                  <div className="flex gap-2">
                    <span>Sub District : </span>
                    <span>{userInfo?.shopInfo?.sub_district}</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={profileInfoAdd}>
                  <div className="flex flex-col w-full gap-1 mb-3">
                    <label htmlFor="shopName">Shop Name</label>
                    <input
                      type="text"
                      id="shopName"
                      name="shopName"
                      value={state.shopName}
                      onChange={inputHandle}
                      placeholder="product name"
                      className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                    />
                  </div>
                  <div className="flex flex-col w-full gap-1 mb-3">
                    <label htmlFor="division">Divition</label>
                    <input
                      type="text"
                      id="division"
                      value={state.division}
                      onChange={inputHandle}
                      name="division"
                      placeholder="Divition"
                      className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                    />
                  </div>
                  <div className="flex flex-col w-full gap-1 mb-3">
                    <label htmlFor="district">District</label>
                    <input
                      type="text"
                      id="district"
                      value={state.district}
                      onChange={inputHandle}
                      name="district"
                      placeholder="District"
                      className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                    />
                  </div>
                  <div className="flex flex-col w-full gap-1 mb-3">
                    <label htmlFor="sub_district">Sub District</label>
                    <input
                      type="text"
                      value={state.sub_district}
                      onChange={inputHandle}
                      id="sub_district"
                      name="sub_district"
                      placeholder="Sub District"
                      className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                    />
                  </div>
                  <button
                    disabled={loader}
                    className="bg-blue-500 w-[190px] hover:shadow-lg hover:shadow-blue-700/50 text-white rounded-md px-7 py-2 mb-3"
                  >
                    {loader ? (
                      <PropagateLoader
                        color="#fff"
                        cssOverride={overrideStyle}
                      />
                    ) : (
                      "save"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
        <div className="w-full md:w-6/12">
          <div className="w-full  pl-0 md:pl-7 mt-5 md:mt-0">
            <div className="text-[#d0d2d6] rounded-md bg-[#283046] p-4">
              <h1 className="text-[#d0d2d6] text-xl font-bold pb-5">
                Change Password
              </h1>
              <form>
                <div className="flex flex-col w-full gap-1 mb-3">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                  />
                </div>
                <div className="flex flex-col w-full gap-1 mb-3">
                  <label htmlFor="oldpassword">Old Password</label>
                  <input
                    type="password"
                    id="oldpassword"
                    name="oldpassword"
                    placeholder="Old Password"
                    className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                  />
                </div>
                <div className="flex flex-col w-full gap-1 mb-3">
                  <label htmlFor="newpassword">New Password</label>
                  <input
                    type="password"
                    id="newpassword"
                    name="newpassword"
                    placeholder="New Password"
                    className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                  />
                </div>

                <button className="bg-blue-500 hover:shadow-blue-500/50 hover:shadow-lg text-white rounded-md px-12 py-2 my-2">
                  Update
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
