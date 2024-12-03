import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  categoryAdd,
  messageClear,
  get_category,
} from "../../store/Reducers/categoryReducer";
import Pagination from "../Pagination"; // Assuming Pagination is being used somewhere else in your component
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BsImage } from "react-icons/bs";
import { GrClose } from "react-icons/gr";
import { PropagateLoader } from "react-spinners";
import Search from "../components/Search";

const Category = () => {
  const dispatch = useDispatch();
  const { loader, errorMessage, successMessage, categorys } = useSelector(
    (state) => state.category
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [perPage, setPerPage] = useState(5);
  const [show, setShow] = useState(false);
  const [imageShow, setImageShow] = useState("");
  const [state, setState] = useState({
    name: "",
    image: null,
  });

  const imageHandle = (e) => {
    const file = e.target.files[0];
    if (file) {
      setState({ ...state, image: file });
      setImageShow(URL.createObjectURL(file));
    }
  };

  const add_category = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", state.name);
    formData.append("image", state.image);

    await dispatch(categoryAdd(formData));
  };

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      setState({
        name: "",
        image: null,
      });
      setImageShow("");
    }
  }, [errorMessage, successMessage, dispatch]);

  useEffect(() => {
    const obj = {
      perPage: parseInt(perPage),
      page: parseInt(currentPage),
      searchValue,
    };
    dispatch(get_category(obj));
  }, [searchValue, currentPage, perPage, dispatch]);

  const overrideStyle = {
    display: "flex",
    margin: "0 auto",
    height: "24px",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="flex lg:hidden justify-between items-center mb-5 p-4 bg-[#283046] rounded-md">
        <h1 className="text-[#d0d2d6] font-semibold text-lg">Category</h1>
        <button
          onClick={() => setShow(true)}
          className="bg-indigo-500 shadow-lg hover:shadow-indigo-500/50 px-4 py-2 cursor-pointer text-white rounded-sm text-sm"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap w-full">
        <div className="w-full lg:w-7/12">
          <div className="w-full p-4 bg-[#283046] rounded-md">
            <Search
              setPerPage={setPerPage}
              setSearchValue={setSearchValue}
              searchValue={searchValue}
            />
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left text-[#d0d2d6]">
                <thead className="text-sm text-[#d0d2d6] uppercase border-b border-slate-700">
                  <tr>
                    <th scope="col" className="py-3 px-4">
                      No
                    </th>
                    <th scope="col" className="py-3 px-4">
                      Image
                    </th>
                    <th scope="col" className="py-3 px-4">
                      Name
                    </th>
                    <th scope="col" className="py-3 px-4">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categorys.map((category, i) => (
                    <tr key={i}>
                      <td className="py-1 font-medium whitespace-nowrap px-4">
                        {i + 1}
                      </td>
                      <td className="py-1 font-medium whitespace-nowrap px-4">
                        <img
                          className="w-[45px] h-[45px]"
                          src={category.image}
                          alt=""
                        />
                      </td>
                      <td className="py-1 font-medium whitespace-nowrap px-4">
                        <span>{category.name}</span>
                      </td>
                      <td className="py-1 font-medium whitespace-nowrap px-4">
                        <div className="flex justify-start items-center gap-4">
                          <Link className="p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50">
                            <FaEdit />
                          </Link>
                          <Link className="p-[6px] bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50">
                            <FaTrash />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="w-full flex justify-end mt-4 bottom-4 right-4">
              <Pagination
                pageNumber={currentPage}
                setPageNumber={setCurrentPage}
                totalItem={50}
                parPage={perPage}
                showItem={1}
              />
            </div>
          </div>
        </div>
        <div
          className={`w-[320px] lg:w-5/12 translate-x-100 lg:relative lg:right-0 fixed ${
            show ? "right-0" : "-right-[340px]"
          } z-[999] top-0 transition-all duration-500`}
        >
          <div className="w-full pl-5">
            <div className="bg-[#283046] h-screen lg:h-auto px-3 py-2 lg:rounded-md text-[#d0d2d6]">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-[#d0d2d6] font-semibold text-xl">
                  Add Category
                </h1>
                <div
                  onClick={() => setShow(false)}
                  className="block text-[#d0d2d6] cursor-pointer lg:hidden"
                >
                  <GrClose />
                </div>
              </div>
              <form onSubmit={add_category}>
                <div className="flex flex-col w-full gap-1 mb-3">
                  <label htmlFor="name">Category Name </label>
                  <input
                    className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="category name..."
                    value={state.name}
                    onChange={(e) =>
                      setState({ ...state, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label
                    className="flex justify-center items-center flex-col h-[238px] cursor-pointer border border-dashed hover:border-indigo-500 w-full border-[#d0d2d6]"
                    htmlFor="image"
                  >
                    {imageShow ? (
                      <img src={imageShow} className="w-full h-full" alt="" />
                    ) : (
                      <>
                        <span>
                          <BsImage />
                        </span>
                        <span>Select Image</span>
                      </>
                    )}
                  </label>
                  <input
                    onChange={imageHandle}
                    className="hidden"
                    type="file"
                    id="image"
                    name="image"
                    placeholder="image..."
                    multiple={false}
                    required
                    accept="image/*"
                  />
                </div>
                <div className="mt-4">
                  <button
                    disabled={loader}
                    className="bg-blue-500 w-full hover:shadow-lg hover:shadow-blue-700/50 text-white rounded-md px-7 py-2 mb-3"
                  >
                    {loader ? (
                      <PropagateLoader
                        color="#fff"
                        cssOverride={overrideStyle}
                      />
                    ) : (
                      "Add Category"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
