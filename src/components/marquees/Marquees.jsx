import React from "react"
import Marquee from "./Marquee"

const Marquees = () => {
    const images = [
        [
            "marquee9.png",
            "gamez.png",
            "marquee13.png",
            "GGC.jpeg",
            "marquee2.jpeg",
            "marquee8.png",
            "marquee10.png",
            "marquee12.png",
            "marquee8.png",
        ],
        [
            "marquee10.png",
            "marquee2.jpeg",
            "marquee8.png",
            "marquee11.png",
            "tags.png",
            "marquee9.png",
            "marquee10.png",
            "marquee13.png",
            "marquee12.png",
            "marquee7.png",
        ],
    ]
    return (
        <div className="py-20 mt-12 w-full relative overflow-hidden">
            {images.map((item, index) => (
                <Marquee
                    key={index}
                    direction={index === 0 ? "left" : "right"}
                    imagesUrl={item}
                />
            ))}
        </div>
    )
}

export default Marquees
