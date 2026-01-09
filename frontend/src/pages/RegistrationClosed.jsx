import React from "react";

const RegistrationClosed = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-6 sm:p-8 lg:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Registration Closed
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-pink-500 to-magenta-500 rounded-full mx-auto"></div>
          </div>

          {/* Poster Image */}
          <div className="mb-8 flex justify-center">
            <div className="relative max-w-full">
              <img
                src="/images/poster2.jpeg"
                alt="JNVTA Silver Jubilee 2026 Event Poster"
                className="w-full h-auto rounded-2xl shadow-2xl border-4 border-white/30 max-w-2xl mx-auto"
              />
            </div>
          </div>

          {/* Message */}
          <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20">
            <p className="text-lg sm:text-xl text-white/90 mb-4">
              For enquiry contact respective batch representative
            </p>
            <div className="flex items-center justify-center gap-2 text-white/70">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm sm:text-base">
                Jawahar Navodaya Vidyalaya Trivandrum Alumni Association (JNVTA)
              </span>
            </div>
          </div>

          {/* Event Details */}
          <div className="mt-8 text-center">
            <p className="text-2xl sm:text-3xl font-bold text-white mb-2">
              JNVTA Silver Jubilee 2026
            </p>
            <p className="text-lg text-white/80">
              January 25th, 2026 | 9:00 AM - 5:30 PM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationClosed;
