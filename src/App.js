import {
  useRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState
} from "react";
import { createPortal } from "react-dom";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react/swiper-react.js";
import { Navigation, Pagination, Mousewheel, Scrollbar } from "swiper";
import images from "./images";
import "swiper/css";
import "swiper/css/scrollbar"; // core Swiper
// import "swiper/modules/navigation/navigation.css"; // Navigation module
// import "swiper/modules/pagination/pagination.css";
// import 'swiper/modules/scrollbar/scrollbar.css';
import "./styles.css";

const PortalActivated = ({ children, className, handleClick }) => {
  const [container] = useState(() => {
    const el = document.createElement("div");
    el.classList.add(className);
    return el;
  });

  const handleClose = useCallback(() => {
    handleClick((x) => false);
  }, [handleClick]);
  useEffect(() => {
    document.body.appendChild(container);
    return () => {
      document.body.removeChild(container);
    };
  }, [container]);
  return createPortal(
    <>
      <button className="modal-button-close" onClick={handleClose}>
        {" "}
        {children}
      </button>
    </>,
    container
  );
};
const Portal = ({ children }) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef();

  const handleClickTrigger = useCallback(
    (e) => {
      if (!open) {
        e.preventDefault();
        setOpen(true);
      }
    },
    [open]
  );
  return (
    <div className="zoom-container">
      {!open ? (
        <>
          {children}
          <button
            className="modal-button-open"
            onClick={handleClickTrigger}
            ref={buttonRef}
          />
        </>
      ) : (
        <PortalActivated handleClick={setOpen} className="zoom-full">
          {children}
        </PortalActivated>
      )}
    </div>
  );
};

const Thumbnail = ({ image, index }) => {
  const swiper = useSwiper();
  const buttonRef = useRef();
  const speed = "1000ms";
  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      if (swiper.activeIndex !== index) {
        swiper.slideTo(index, speed);
      }
    },
    [swiper, index]
  );
  return (
    <li>
      <button
        ref={buttonRef}
        onClick={handleClick}
        className="thumbnail_button"
      >
        <div className="thumbnail_wrapper">
          <div className="image_wrapper">
            <img src={image} alt="" />
          </div>
        </div>
      </button>
    </li>
  );
};

export default function App() {
  const [swiper, setSwiper] = useState();
  const swiperRef = useRef();

  useLayoutEffect(() => {
    console.log(swiperRef.current.swiper.activeIndex);
  }, []);
  const params = {
    direction: "vertical",
    slidesPerView: 1,
    spaceBetween: 30,
    mousewheel: { forceToAxis: true },
    scrollbar: { draggable: true },
    pagination: {
      el: ".swiper-pagination",
      type: "progressbar"
    }
  };
  return (
    <div className="App">
      <div className="container">
        <div className="content">
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Mousewheel, Pagination, Scrollbar]}
            {...params}
          >
            {images.map((img, i) => {
              return (
                <SwiperSlide index={i} key={i}>
                  <Portal>
                    <img src={img} alt="" />
                  </Portal>
                </SwiperSlide>
              );
            })}
            <ul className="thumbnails">
              {images.map((img, i) => {
                return <Thumbnail image={img} key={i} index={i} />;
              })}
            </ul>
          </Swiper>
        </div>
      </div>
    </div>
  );
}
