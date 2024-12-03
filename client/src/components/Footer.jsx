import React from "react";
import { AiOutlineGithub, AiOutlineTwitter } from "react-icons/ai";
import { FaFacebookF, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className="bg-[#F3F6Fa]">
      <div className="w-[85%] lg:w-[90%] flex flex-wrap mx-auto border-b py-16 md-lg:pb-10 sm:pb-6">
        <div className="w-3/12 lg:w-4/12 sm:w-full">
          <div className="flex flex-col gap-3">
            <img
              className="w-[190px] h-[70px]"
              src="http://localhost:3000/images/logo.png"
              alt="Footer Logo"
            />
            <ul className="flex flex-col gap-2 text-slate-600">
              <li>Address : Khoksha , Kushtia</li>
              <li>Phone : +8801855427839</li>
              <li>Email : akterhossennoyon@gmail.com</li>
            </ul>
          </div>
        </div>
        <div className="w-5/12 lg:w-8/12 sm:w-full">
          <div className="flex justify-center sm:justify-start sm:mt-6 w-full">
            <div>
              <h2 className="font-bold text-lg mb-2">Usefull links</h2>
              <div className="flex justify-between gap-[80px] lg:gap-[40px]">
                <ul className="flex flex-col gap-2 text-slate-600 text-sm">
                  <li>
                    <Link>About Us</Link>
                  </li>
                  <li>
                    <Link>About our Shop</Link>
                  </li>
                  <li>
                    <Link>Secure Shopping</Link>
                  </li>
                  <li>
                    <Link>Delivery Information</Link>
                  </li>
                  <li>
                    <Link>Privacy Policy</Link>
                  </li>
                  <li>
                    <Link>Our Sitemap</Link>
                  </li>
                </ul>
                <ul className="flex flex-col gap-2 text-slate-600 text-sm">
                  <li>
                    <Link>Who We Are</Link>
                  </li>
                  <li>
                    <Link>Our Services</Link>
                  </li>
                  <li>
                    <Link>Project</Link>
                  </li>
                  <li>
                    <Link>Contact</Link>
                  </li>
                  <li>
                    <Link>Innovation</Link>
                  </li>
                  <li>
                    <Link>Testimonials</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="w-4/12 lg:w-full lg:mt-6">
          <div className="w-full flex flex-col justify-start gap-5">
            <h2 className="font-bold text-lg mb-2">Join Our</h2>
            <span>
              Get Email updates about our latest and shop speacials offers
            </span>
            <div className="h-[50px] w-full bg-white border relative">
              <input
                className="h-full bg-transparent w-full px-3 outline-0"
                type="text"
                placeholder="Enter your mail"
              />
              <button className="h-full absolute right-0 bg-indigo-500 text-white uppercase px-4 font-bold text-sm outline-none focus:outline-dotted">
                Subscribe
              </button>
            </div>
            <ul className="flex justify-start items-center gap-3">
              <li>
                <Link
                  className="w-[38px] h-[38px] hover:bg-[#7fad39] hover:text-white flex justify-center items-center bg-white rounded-full"
                  to={"#"}
                >
                  <FaFacebookF />
                </Link>
              </li>
              <li>
                <Link
                  className="w-[38px] h-[38px] hover:bg-[#7fad39] hover:text-white flex justify-center items-center bg-white rounded-full"
                  to={"#"}
                >
                  <AiOutlineTwitter />
                </Link>
              </li>
              <li>
                <Link
                  className="w-[38px] h-[38px] hover:bg-[#7fad39] hover:text-white flex justify-center items-center bg-white rounded-full"
                  to={"#"}
                >
                  <FaLinkedin />
                </Link>
              </li>
              <li>
                <Link
                  className="w-[38px] h-[38px] hover:bg-[#7fad39] hover:text-white flex justify-center items-center bg-white rounded-full"
                  to={"#"}
                >
                  <AiOutlineGithub />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="w-[85%] flex flex-wrap justify-center items-center text-slate-600 mx-auto text-center py-5">
        <span>
          Copywright &copy; 2023 All right reserved | made by{" "}
          <Link
            className="text-blue-500 hover:underline"
            to={"https://www.facebook.com/akterhossennoyon"}
          >
            AH Noyon
          </Link>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
