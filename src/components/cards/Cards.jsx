import React from "react";
import Card from "./Card";

const Cards = () => {
    const content = [
        { header: "Up Next: News", title: "Insights and behind the scenes" },
        { header: "Get In Touch", title: "Let's get to it, together." },
    ];

    return (
        <div className="w-full px-4">
            <div className="max-w-screen-xl mx-auto py-10 flex flex-col md:flex-row gap-5">

                {/* main Side Card */}
                <Card
                    width="w-full md:w-2/3"
                    start={true}
                    para={false}
                    hover={true}
                    header={content[1].header}
                    title={content[1].title}
                    locations={[
                        "Jaipur, India",
                        "Mumbai, India",
                        "Patna, India",
                    ]}
                />
            </div>
        </div>
    );
};

export default Cards;
