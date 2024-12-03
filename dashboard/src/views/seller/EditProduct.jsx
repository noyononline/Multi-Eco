import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { get_category } from "../../store/Reducers/categoryReducer";
import {
  get_product,
  update_product,
  messageClear,
  product_image_update,
} from "../../store/Reducers/productReducer";
import { PropagateLoader } from "react-spinners";

import toast from "react-hot-toast";

const EditProduct = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const { categorys } = useSelector((state) => state.category);
  const { product, loader, errorMessage, successMessage } = useSelector(
    (state) => state.product
  );

  const [cateShow, setCateShow] = useState(false);
  const [category, setCategory] = useState("");
  const [allCategory, setAllCategory] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const [imageShow, setImageShow] = useState([]);

  const [state, setState] = useState({
    name: "",
    description: "",
    discount: "",
    price: "",
    brand: "",
    stock: "",
  });

  useEffect(() => {
    dispatch(
      get_category({
        searchValue: "",
        perPage: "",
        page: "",
      })
    );
  }, [dispatch]);

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    dispatch(get_product(productId));
  }, [productId, dispatch]);

  useEffect(() => {
    if (categorys.length > 0) {
      setAllCategory(categorys); // Initialize allCategory when categorys change
    }
  }, [categorys]);

  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);

    setCateShow(false); // Close the dropdown
    setSearchValue(""); // Clear the search input
    setAllCategory(categorys); // Reset to the original categories
  };

  const categorySearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value) {
      const filteredCategories = categorys.filter((c) =>
        c.name.toLowerCase().includes(value.toLowerCase())
      );
      setAllCategory(filteredCategories);
    } else {
      setAllCategory(categorys); // Reset to all categories when the search is empty
    }
  };

  // change image to category
  const changeImage = async (img, files) => {
    if (files.length > 0) {
      try {
        const response = await dispatch(
          product_image_update({
            oldImage: img,
            newImage: files[0],
            productId,
          })
        );

        // Assuming product_image_update returns the updated product
        if (response.payload.product) {
          const updatedProduct = response.payload.product;

          // Update all fields with the updated product data
          setState({
            name: updatedProduct.name,
            description: updatedProduct.description,
            discount: updatedProduct.discount,
            price: updatedProduct.price,
            brand: updatedProduct.brand,
            stock: updatedProduct.stock,
          });
          setCategory(updatedProduct.category);
          setImageShow(updatedProduct.images);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (product) {
      setState({
        name: product.name,
        description: product.description,
        discount: product.discount,
        price: product.price,
        brand: product.brand,
        stock: product.stock,
      });
      setCategory(product.category);
      setImageShow(product.images);
    }
  }, [product]);

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
        description: "",
        discount: "",
        price: "",
        brand: "",
        stock: "",
      });
      setCategory("");
      setImageShow([]);
    }
  }, [errorMessage, successMessage, dispatch]);

  const update = (e) => {
    e.preventDefault();
    const obj = {
      name: state.name,
      description: state.description,
      discount: state.discount,
      price: state.price,
      brand: state.brand,
      stock: state.stock,
      productId: productId,
    };
    dispatch(update_product(obj));
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
      <div className="w-full px-4 py-6 bg-[#283046] rounded-md">
        <div className="flex justify-between items-center pb-4">
          <h1 className="text-[#d0d2d6] text-xl font-bold">Edit Product</h1>
          <Link
            to="/seller/dashboard/products"
            className="bg-blue-500 hover:shadow-blue-500/50 hover:shadow-lg text-white rounded-sm px-7 py-2 my-2"
          >
            Products
          </Link>
        </div>
        <div>
          <form onSubmit={update}>
            <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-[#d0d2d6]">
              <div className="flex flex-col w-full gap-1">
                <label htmlFor="name">Product Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  onChange={inputHandle}
                  value={state.name}
                  placeholder="product name"
                  className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                />
              </div>
              <div className="flex flex-col w-full gap-1">
                <label htmlFor="brand">Product Brand</label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  onChange={inputHandle}
                  value={state.brand}
                  placeholder="product Brand"
                  className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                />
              </div>
            </div>
            <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-[#d0d2d6]">
              <div className="flex flex-col w-full gap-1 relative">
                <label htmlFor="category">Category</label>
                <input
                  onClick={() => setCateShow(!cateShow)}
                  type="text"
                  id="category"
                  onChange={inputHandle}
                  value={category}
                  placeholder="--Select Category--"
                  className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                />
                <div
                  className={`absolute top-[101%] bg-slate-800 w-full transition-all ${
                    cateShow ? "scale-100" : "scale-0"
                  }`}
                >
                  <div className="w-full px-4 py-2 fixed">
                    <input
                      onChange={categorySearch}
                      value={searchValue}
                      type="text"
                      className="px-3 py-1 w-full focus:border-indigo-500 outline-none bg-transparent border border-slate-700 rounded-md text-[#d0d2d6] overflow-hidden"
                      placeholder="search"
                    />
                  </div>
                  <div className="pt-14"></div>
                  <div className="flex justify-start items-start flex-col h-[200px] overflow-x-scroll">
                    {allCategory.map((c, i) => (
                      <span
                        key={i}
                        className={`px-4 py-2 hover:bg-indigo-500 hover:text-white hover:shadow-lg w-full cursor-pointer ${
                          category === c.name && "bg-indigo-500"
                        }`}
                        onClick={() => {
                          handleCategorySelect(c.name);
                        }}
                      >
                        {c.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-full gap-1">
                <label htmlFor="stock">Stock</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  min={"0"}
                  onChange={inputHandle}
                  value={state.stock}
                  placeholder="product Stock"
                  className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                />
              </div>
            </div>
            <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-[#d0d2d6]">
              <div className="flex flex-col w-full gap-1">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  onChange={inputHandle}
                  value={state.price}
                  placeholder="product Price"
                  className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                />
              </div>
              <div className="flex flex-col w-full gap-1">
                <label htmlFor="discount">Discount</label>
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  onChange={inputHandle}
                  value={state.discount}
                  placeholder="product Brand"
                  className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 w-full text-[#d0d2d6] mb-5">
              <div className="flex flex-col w-full gap-1">
                <label htmlFor="description">Description</label>
                <textarea
                  className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                  onChange={inputHandle}
                  placeholder="Type your product description"
                  value={state.description}
                  name="description"
                  id="description"
                  rows={"5"}
                ></textarea>
              </div>
            </div>
            <div className="grid lg:grid-cols-4 grid-cols-1 md:grid-cols-3 sm:grid-cols-2 sm:gap-4 md:gap-4 xs:gap-4 gap-3 w-full text-[#d0d2d6] mb-4">
              {imageShow &&
                imageShow.length > 0 &&
                imageShow.map((img, i) => (
                  <div key={i} className="h-[180px] relative">
                    <label htmlFor={i}>
                      <img
                        src={img}
                        className="w-full h-full rounded-sm"
                        alt="product"
                      />
                    </label>
                    <input
                      type="file"
                      onChange={(e) => changeImage(img, e.target.files)}
                      id={i}
                      className="hidden"
                    />
                  </div>
                ))}
            </div>
            <div className="flex">
              <button
                disabled={loader}
                className="bg-blue-500 w-[190px] hover:shadow-lg hover:shadow-blue-700/50 text-white rounded-md px-7 py-2 mb-3"
              >
                {loader ? (
                  <PropagateLoader color="#fff" cssOverride={overrideStyle} />
                ) : (
                  "Update Product"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
