import React from "react";
import { BsChevronDoubleLeft, BsChevronDoubleRight } from "react-icons/bs";

const Pagination = ({
  pageNumber,
  setPageNumber,
  totalItem,
  perPage,
  showItem,
}) => {
  let totalPage = Math.ceil(totalItem / perPage);
  let startPage = pageNumber;

  let dif = totalPage - pageNumber;

  if (dif <= showItem) {
    startPage = totalPage - showItem;
  }
  let endPage = startPage < 0 ? showItem : showItem + startPage;
  if (startPage <= 0) {
    startPage = 1;
  }
  const createBtn = () => {
    let arr = [];
    for (let i = startPage; i <= endPage; i++) {
      arr.push(i);
    }
    return arr.map((item) => {
      return (
        <li
          key={item}
          className={`w-[33px] h-[33px] rounded-full flex justify-center items-center cursor-pointer text-[#d0d2d6] ${
            item === pageNumber
              ? "bg-indigo-500 shadow-lg shadow-indigo-500/50"
              : "bg-slate-700 hover:bg-indigo-500 hover:shadow-indigo-500/50"
          }`}
          onClick={() => setPageNumber(item)}
        >
          {item}
        </li>
      );
    });
  };
  return (
    <ul className="flex gap-3">
      {pageNumber > 1 && (
        <li
          onClick={() => setPageNumber(pageNumber - 1)}
          className="w-[33px] h-[33px] rounded-full flex justify-center items-center bg-slate-700 text-[#d0d2d6] cursor-pointer"
        >
          <BsChevronDoubleLeft />
        </li>
      )}
      {createBtn()}
      {pageNumber < totalPage && (
        <li
          onClick={() => setPageNumber(pageNumber + 1)}
          className="w-[33px] h-[33px] rounded-full flex justify-center items-center bg-slate-700 text-[#d0d2d6] cursor-pointer"
        >
          <BsChevronDoubleRight />
        </li>
      )}
    </ul>
  );
};

export default Pagination;
