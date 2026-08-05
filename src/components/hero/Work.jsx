import React, { useState } from "react";
import { useScroll } from "framer-motion";

const Work = () => {
  const [images, setImages] = useState([
    {
      url: "/oldisgold.jpeg",
      top: "50%",
      left: "50%",
      isActive: false,
    },
    {
      url: "/main.png",
      top: "56%",
      left: "44%",
      isActive: false,
    },
    {
      url: "/GGC RED.jpeg",
      top: "45%",
      left: "56%",
      isActive: false,
    },
    {
      url: "/background.PNG",
      top: "60%",
      left: "53%",
      isActive: false,
    },
    {
      url: "/gamez.png",
      top: "43%",
      left: "40%",
      isActive: false,
    },
    {
      url: "/main.png",
      top: "65%",
      left: "55%",
      isActive: false,
    },
  ]);

  const { scrollYProgress } = useScroll();

  scrollYProgress.on("change", (data) => {
    function showImages(arr) {
      setImages((prev) =>
        prev.map((item, index) =>
          arr.includes(index)
            ? { ...item, isActive: true }
            : { ...item, isActive: false }
        )
      );
    }

    switch (Math.floor(data * 100)) {
      case 0:
        showImages([]);
        break;
      case 2:
        showImages([0]);
        break;
      case 3:
        showImages([0, 1]);
        break;
      case 5:
        showImages([0, 1, 2]);
        break;
      case 6:
        showImages([0, 1, 2, 3]);
        break;
      case 8:
        showImages([0, 1, 2, 3, 4]);
        break;
      case 9:
        showImages([0, 1, 2, 3, 4, 5]);
        break;
    }
  });

  return (
    <div className="w-full mt-14">
      <div className="relative max-w-screen-xl mx-auto text-center">
        <h1 className="text-[30vw] leading-none font-semibold select-none">
          GGC
          <p className="text-[5.9vw] leading-none font-semibold underline-offset-2 select-none">
            Global Growth Consultancy
          </p>
        </h1>

        <div className="absolute top-0 w-full h-full">
          {images.map(
            (elem, index) =>
              elem.isActive && (
                <img
                  key={index}
                  className="absolute rounded-lg -translate-x-[50%] -translate-y-[50%]"
                  src={elem.url}
                  style={{
                    top: elem.top,
                    left: elem.left,
                    width: window.innerWidth < 768 ? "30vw" : "12vw",
                  }}
                  alt=""
                />
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default Work;
