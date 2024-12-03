import React from "react";
import { Link } from "react-router-dom";
import Carousel from "react-multi-carousel";
import {} from "react-multi-carousel/lib/styles.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_banners } from "../store/reducers/homeReducer";
const Banner = () => {
  const dispatch = useDispatch();
  const { banners } = useSelector((state) => state.home);
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  useEffect(() => {
    dispatch(get_banners());
  }, [dispatch]);
  return (
    <div className="w-full md-lg:mt-6">
      <div className="w-[85%] lg:w-[90%] mx-auto">
        <div className="w-full flex flex-wrap md-lg:gap-8">
          <div className="w-full">
            <div className="my-8">
              <Carousel
                autoPlay={true}
                infinite={true}
                arrows={true}
                showDots={true}
                responsive={responsive}
              >
                {banners?.map((b, i) => (
                  <Link
                    className="lg-md:h-[440px] h-auto block w-full"
                    key={i}
                    to={`/product/details/${b.link}`}
                  >
                    <img className="w-full h-full" src={b.banner} alt="" />
                  </Link>
                ))}
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;