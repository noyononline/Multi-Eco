import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  get_seller,
  seller_status_update,
  messageClear,
} from "../../store/Reducers/sellerReducer";
const SellersDetails = () => {
  const dispatch = useDispatch();
  const { sellerId } = useParams();
  const { seller, successMessage } = useSelector((state) => state.seller);

  const [status, setStatus] = useState("");

  useEffect(() => {
    dispatch(get_seller(sellerId));
  }, [sellerId, dispatch]);

  const submit = (e) => {
    e.preventDefault();
    dispatch(
      seller_status_update({
        sellerId,
        status,
      })
    );
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
  }, [successMessage, dispatch]);

  useEffect(() => {
    if (seller) {
      setStatus(seller.status);
    }
  }, [seller]);
  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="w-full p-4 bg-[#283046] rounded-md">
        <div className="w-full flex flex-wrap text-[#d0d2d6]">
          <div className="w-3/12 flex justify-center items-center py-3">
            <div>
              {seller?.image ? (
                <img className="w-full h-[230px]" src={seller?.image} alt="" />
              ) : (
                <span>Image not upload</span>
              )}
            </div>
          </div>
          <div className="w-4/12">
            <div className="px-0 md:px-5 py-2">
              <div className="py-2 text-lg">
                <h2>Basic Info</h2>
              </div>
              <div className="flex justify-between text-sm flex-col gap-2 p-4 bg-slate-800 rounded-md">
                <div className="flex gap-2">
                  <span>Name : </span>
                  <span>{seller?.name}</span>
                </div>
                <div className="flex gap-2">
                  <span>Email : </span>
                  <span>{seller?.email}</span>
                </div>
                <div className="flex gap-2">
                  <span>Role : </span>
                  <span>{seller?.role}</span>
                </div>
                <div className="flex gap-2">
                  <span>Status : </span>
                  <span>{seller?.status}</span>
                </div>
                <div className="flex gap-2">
                  <span>Payment Account : </span>
                  <span>{seller?.payment}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-4/12">
            <div className="px-0 md:px-5 py-2">
              <div className="py-2 text-lg">
                <h2>Address</h2>
              </div>
              <div className="flex justify-between text-sm flex-col gap-2 p-4 bg-slate-800 rounded-md">
                <div className="flex gap-2">
                  <span>Shop Name : </span>
                  <span>{seller?.shopInfo?.shopName}</span>
                </div>
                <div className="flex gap-2">
                  <span>Division : </span>
                  <span>{seller?.shopInfo?.division}</span>
                </div>
                <div className="flex gap-2">
                  <span>District : </span>
                  <span>{seller?.shopInfo?.district}</span>
                </div>
                <div className="flex gap-2">
                  <span>Sub District : </span>
                  <span>{seller?.shopInfo?.sub_district}</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <form onSubmit={submit}>
              <div className="flex gap-4 py-3">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  name=""
                  id=""
                  required
                  className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                >
                  <option value="">--select status</option>
                  <option value="active">Active</option>
                  <option value="deactive">Deactive</option>
                </select>
                <button className="bg-blue-500 hover:shadow-blue-500/50 hover:shadow-lg text-white rounded-md px-7 py-2 w-[170px]">
                  Submilt
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellersDetails;
