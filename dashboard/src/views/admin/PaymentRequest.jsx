import React, { forwardRef, useEffect, useState } from "react";
import { FixedSizeList as List } from "react-window";
import toast from "react-hot-toast";
import moment from "moment";

import { useDispatch, useSelector } from "react-redux";
import {
  confirm_payment_request,
  get_payment_request_admin,
  messageClear,
} from "../../store/Reducers/paymentReducer";

const handleOnWheel = ({ deltaY }) => {
  console.log("handleOnWheel", deltaY);
};
const outerElementType = forwardRef((props, ref) => (
  <div ref={ref} onWheel={handleOnWheel} {...props} />
));
const PaymentRequest = () => {
  const dispatch = useDispatch();
  const { successMessage, errorMessage, loader, pendingWithdrows } =
    useSelector((state) => state.payment);
  const [paymentId, setPaymentId] = useState("");

  useEffect(() => {
    dispatch(get_payment_request_admin());
  }, [dispatch]);

  const confirm_request = (id) => {
    setPaymentId(id);
    dispatch(confirm_payment_request(id));
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

  const Row = ({ index, style }) => {
    return (
      <div style={style} className="flex text-[#d0d2d6] text-sm">
        <div className="w-[25%] p-2 whitespace-nowrap">{index + 1}</div>
        <div className="w-[25%] p-2 whitespace-nowrap">
          ${pendingWithdrows[index]?.amount}
        </div>
        <div className="w-[25%] p-2 whitespace-nowrap">
          <span className="py-[1px] bg-slate-700 text-blue-500 rounded-md text-xs">
            {pendingWithdrows[index]?.status}
          </span>
        </div>
        <div className="w-[25%] p-2 whitespace-nowrap">
          {moment(pendingWithdrows[index]?.createdAt).format("ll")}
        </div>
        <div className="w-[25%] p-2 whitespace-nowrap">
          <button
            disabled={loader}
            onClick={() => confirm_request(pendingWithdrows[index]?._id)}
            className="bg-indigo-500 shadow-lg hover:shadow-indigo-500/50 px-3 py-[2px] cursor-pointer text-white rounded-sm text-sm"
          >
            {loader && paymentId === pendingWithdrows[index]?._id
              ? "Loading..."
              : "Confirm"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="w-full p-4 bg-[#283046] rounded-md">
        <h2 className="text-xl font-medium pb-5 text-[#d0d2d6]">
          Withdrawal Request
        </h2>
        <div className="w-full">
          <div className="w-full overflow-x-auto">
            <div className="flex bg-[#101d31] text-[#d0d2d6] uppercase text-xs min-w-[340px]">
              <div className="w-[25%] p-2">No</div>
              <div className="w-[25%] p-2">Amount</div>
              <div className="w-[25%] p-2">Status</div>
              <div className="w-[25%] p-2">Date</div>
              <div className="w-[25%] p-2">Action</div>
            </div>
            {
              <List
                style={{ minWidth: "340px", overflowX: "hidden" }}
                className="list"
                height={350}
                itemCount={pendingWithdrows.length}
                itemSize={35}
                outerElementType={outerElementType}
              >
                {Row}
              </List>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentRequest;
