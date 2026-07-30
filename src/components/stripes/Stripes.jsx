import React from "react";
import Stripe from "./Stripe";

const Stripes = () => {
    const data = [
        { url: "stripe1.png" },
        { url: "stripe1.png" },
        { url: "stripe1.png" },
        { url: "stripe1.png" },
        { url: "stripe1.png" },
        { url: "stripe1.png" },
    ];

    return (
        <div className="flex flex-wrap justify-center items-center gap-0 mt-16 mb-14 px-2">
            {data.map((elem, index) => (
                <Stripe key={index} val={elem} />
            ))}
        </div>
    );
};

export default Stripes;
