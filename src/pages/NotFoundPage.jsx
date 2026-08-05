import React from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-premium-navy px-6 pt-16">
      <div className="text-center max-w-xl">
        <span className="eyebrow mb-5 block">404</span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white leading-tight tracking-tight">
          Page Not Found
        </h1>
        <p className="text-neutral-400 mt-6 mb-8 leading-relaxed">
          The page you are looking for does not exist or has been moved.
          Let's get you back on track.
        </p>
        <Link
          to="/"
          className="btn-premium inline-flex items-center justify-center gap-2 px-6 py-3 text-sm sm:text-base"
        >
          <FaArrowLeft className="text-xs" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
