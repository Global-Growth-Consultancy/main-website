import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Product from "./Product";
import { motion } from "framer-motion";

// Video imports
import About from "../../../public/videos/About.mp4";
import Programs from "../../../public/videos/Programs.mp4";
import Collegelist from "../../../public/videos/Collegelist.mp4";
import Nischay from "../../../public/videos/7nischay.mp4";

const Products = () => {
    const products = [
        { title: "About-Us", description: "Global Growth Consultancy guides students to top global universities with expert counseling, personalized support, and end-to-end admission assistance, helping them achieve their academic and career goals.", link: "/about-us" },
        { title: "Courses", description: "We guide students in selecting the best courses and programs at top colleges and universities worldwide, ensuring they find the right fit for their academic and career aspirations.", link: "/courses" },
        { title: "Collegelist", description: "Global Growth Consultancy helps students secure admissions to 260+ top colleges and universities in India and abroad. We provide expert guidance in choosing the best institutions based on academic goals, career aspirations, and personal preferences.", link: "/Colleges" },
        { title: "7Nischay", description: "7 Nischay is a key initiative by the Bihar Government focused on youth empowerment, education, employment, and infrastructure development to enhance the state's growth and quality of life.", link: "/7Nischay" },
    ];

    const videos = [About, Programs, Collegelist, Nischay];
    const [pos, setPos] = useState(0);
    const [currentVideo, setCurrentVideo] = useState(About); // Default to first video

    useEffect(() => {
        setCurrentVideo(videos[0]); // Ensure first video plays on load
    }, []);

    const handleHover = (index) => {
        setPos(index * 20);
        setCurrentVideo(videos[index]);
    };

    return (
        <div className="mt-6 relative">
            {/* Laptop Mode */}
            <div className="hidden md:block">
                {products.map((item, index) => (
                    <div 
                        key={index} 
                        className="mb-8 flex items-center justify-center"
                        onMouseEnter={() => handleHover(index)}
                    >
                        <Product val={item} />
                        <Link to={item.link} className="px-4 py-2 text-white bg-slate-600 mt-5 hover:bg-green-700 rounded-md transition duration-200">
                            Click Here
                        </Link>
                    </div>
                ))}

                <div className="absolute top-0 w-full h-full pointer-events-none">
                    <motion.div
                        initial={{ y: pos, x: "-50%" }}
                        animate={{ y: pos + "rem" }}
                        transition={{ ease: [0.76, 0, 0.24, 1], duration: 0.6 }}
                        className="window absolute w-[30rem] h-[20rem] bg-white left-[44%] overflow-hidden"
                    >
                        <video key={currentVideo} autoPlay muted loop className="w-full h-full">
                            <source src={currentVideo} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </motion.div>
                </div>
            </div>

            {/* Mobile Mode */}
            <div className="md:hidden flex flex-col items-center space-y-6 mt-20">
                {products.map((item, index) => (
                    <div key={index} className="w-full text-center p-4">
                        <h2 className="text-white text-xl font-bold">{item.title}</h2>
                        <video autoPlay muted loop className="w-full rounded-lg my-2">
                            <source src={videos[index]} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        <p className="text-white m-4">{item.description}</p> {/* Added margin-top */}
                        <Link 
                            to={item.link} 
                            className="mt-2 px-4 py-2 text-white bg-gray-600 hover:bg-green-700 rounded-md transition duration-200"
                        >
                            Click Here
                        </Link>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default Products;
