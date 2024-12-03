import React, { forwardRef, useEffect, useState } from "react";
import { BsCurrencyDollar } from "react-icons/bs";
import { FixedSizeList as List } from "react-window";
import { useDispatch, useSelector } from "react-redux";
import {
  get_seller_payment_details,
  messageClear,
  send_withdrowal_request,
} from "../../store/Reducers/paymentReducer";
import moment from "moment";
import toast from "react-hot-toast";

const handleOnWheel = ({ deltaY }) => {
  console.log("handleOnWheel", deltaY);
};
const outerElementType = forwardRef((props, ref) => (
  <div ref={ref} onWheel={handleOnWheel} {...props} />
));

const Payments = () => {
  const [amount, setAmount] = useState(0);
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const {
    totalAmount,
    loader,
    availableAmount,
    withdrowAmount,
    pendingAmount,
    successMessage,
    errorMessage,
    pendingWithdrows,
    successWithdrows,
  } = useSelector((state) => state.payment);

  useEffect(() => {
    dispatch(get_seller_payment_details(userInfo._id));
  }, [userInfo, dispatch]);

  const sendRequest = (e) => {
    e.preventDefault();
    if (availableAmount - amount > 10) {
      dispatch(send_withdrowal_request({ amount, sellerId: userInfo._id }));
      setAmount(0);
    } else {
      toast.error("Insufficient Balance");
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
  }, [errorMessage, successMessage, dispatch]);

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
      </div>
    );
  };

  const Row2 = ({ index, style }) => {
    return (
      <div style={style} className="flex text-[#d0d2d6] text-sm">
        <div className="w-[25%] p-2 whitespace-nowrap">{index + 1}</div>
        <div className="w-[25%] p-2 whitespace-nowrap">
          ${successWithdrows[index]?.amount}
        </div>
        <div className="w-[25%] p-2 whitespace-nowrap">
          <span className="py-[1px] bg-slate-700 text-blue-500 rounded-md text-xs">
            {successWithdrows[index]?.status}
          </span>
        </div>
        <div className="w-[25%] p-2 whitespace-nowrap">
          {moment(successWithdrows[index]?.createdAt).format("ll")}
        </div>
      </div>
    );
  };
  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <div className="flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3">
          <div className="flex flex-col justify-start items-start text-[#d0d2d6]">
            <h2 className="text-lg font-bold">${totalAmount}</h2>
            <span className="text-sm font-normal">Total Sales</span>
          </div>
          <div className="w-[47px] h-[47px] rounded-full bg-[#28c76f1f] flex justify-center items-center text-xl">
            <BsCurrencyDollar className="text-[#28c76f] shadow-lg" />
          </div>
        </div>
        <div className="flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3">
          <div className="flex flex-col justify-start items-start text-[#d0d2d6]">
            <h2 className="text-lg font-bold">${availableAmount}</h2>
            <span className="text-sm font-normal">Available Amount</span>
          </div>
          <div className="w-[47px] h-[47px] rounded-full bg-[#e000e81f] flex justify-center items-center text-xl">
            <BsCurrencyDollar className="text-[#cd00e8] shadow-lg" />
          </div>
        </div>
        <div className="flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3">
          <div className="flex flex-col justify-start items-start text-[#d0d2d6]">
            <h2 className="text-lg font-bold">${withdrowAmount}</h2>
            <span className="text-sm font-normal">Withdrawal Amount</span>
          </div>
          <div className="w-[47px] h-[47px] rounded-full bg-[#00cfe81f] flex justify-center items-center text-xl">
            <BsCurrencyDollar className="text-[#00cfe8] shadow-lg" />
          </div>
        </div>
        <div className="flex justify-between items-center p-5 bg-[#7367f01f] rounded-md gap-3">
          <div className="flex flex-col justify-start items-start text-[#d0d2d6]">
            <h2 className="text-lg font-bold">${pendingAmount}</h2>
            <span className="text-sm font-normal">Pending Amount</span>
          </div>
          <div className="w-[47px] h-[47px] rounded-full bg-[#28c76f1f] flex justify-center items-center text-xl">
            <BsCurrencyDollar className="text-[#7367f0] shadow-lg" />
          </div>
        </div>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
        <div className="bg-[#283046] text-[#d0d2d6] rounded-md p-5">
          <h2 className="text-lg">Send Request</h2>
          <div className="py-5">
            <form onSubmit={sendRequest}>
              <div className="flex gap-3 flex-wrap">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  min={1}
                  placeholder="Enter Amount"
                  className="px-3 py-2 md:w-[79%] focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-sm text-[#d0d2d6]"
                />
                <button
                  disabled={loader}
                  className="px-4 py-2 rounded-sm bg-indigo-500 text-[#ffffff] hover:bg-indigo-500/80 hover:shadow-lg text-sm"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
          <div>
            <h2 className="text-lg pb-4">Pending Request</h2>
            <div className="w-full overflow-x-auto">
              <div className="flex bg-[#101d31] text-[#d0d2d6] uppercase text-xs min-w-[340px]">
                <div className="w-[25%] p-2">No</div>
                <div className="w-[25%] p-2">Amount</div>
                <div className="w-[25%] p-2">Status</div>
                <div className="w-[25%] p-2">Date</div>
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
        <div className="bg-[#283046] text-[#d0d2d6] rounded-md p-5">
          <h2 className="text-lg pb-4">Success Withdrawal</h2>
          <div className="w-full overflow-x-auto">
            <div className="flex bg-[#101d31] text-[#d0d2d6] uppercase text-xs min-w-[340px]">
              <div className="w-[25%] p-2">No</div>
              <div className="w-[25%] p-2">Amount</div>
              <div className="w-[25%] p-2">Status</div>
              <div className="w-[25%] p-2">Date</div>
            </div>
            {
              <List
                style={{ minWidth: "340px", overflowX: "hidden" }}
                className="list"
                height={350}
                itemCount={successWithdrows.length}
                itemSize={35}
                outerElementType={outerElementType}
              >
                {Row2}
              </List>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
