import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { createRegistration } from "../api/registration.api";

const JNVTASilverReunionForm = ({ isAdminMode = false }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guests, setGuests] = useState([]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      // Personal Details
      name: "",
      email: "",
      mobile: "",
      gender: "",
      batch: "",
      rollNumber: "",
      willAttend: "",

      // Event Preferences
      foodChoice: "",
      expectedArrivalTime: "",
      overnightAccommodation: "",

      // Volunteer & Event Participation
      volunteerInterest: {
        interested: false,
        programs: [],
      },
      committeeInterest: {
        interested: false,
        committees: [],
      },
      sponsorInterest: {
        interested: false,
        details: "",
      },
      programIdeas: "",
      skills: "",

      // Attendees
      attendees: {
        adults: 1,
        children: 0,
        infants: 0,
      },

      // Payment
      contributionAmount: 0,
      paymentTransactionId: "",
    },
  });

  const watchedValues = watch();
  const willAttend = watchedValues.willAttend;
  const adultCount = watchedValues.attendees?.adults || 0;
  const childCount = watchedValues.attendees?.children || 0;
  const infantCount = watchedValues.attendees?.infants || 0;

  useEffect(() => {
    // Only require at least 1 adult if attending
    if (willAttend === "Yes" && adultCount < 1) {
      setValue("attendees.adults", 1);
    }
    // If not attending, reset attendees to 0
    if (willAttend === "No") {
      setValue("attendees.adults", 0);
      setValue("attendees.children", 0);
      setValue("attendees.infants", 0);
      setValue("foodChoice", "");
      setValue("expectedArrivalTime", "");
      setValue("overnightAccommodation", "");
    }
  }, [willAttend, adultCount, setValue]);

  // Calculate payment amount based on batch and attendees (only if attending)
  useEffect(() => {
    if (willAttend === "Yes" && watchedValues.batch) {
      const batchNumber = parseInt(watchedValues.batch.split(" ")[1]);
      const isFreeBatch = batchNumber >= 15 && batchNumber <= 18;

      const billableAdultCount = Math.max(adultCount, 1);
      const additionalAdults = Math.max(billableAdultCount - 1, 0);

      let total = 0;

      // Calculate adult charges
      if (isFreeBatch) {
        // First adult is free for batches 15-18
        total += additionalAdults * 200;
      } else {
        // First adult costs 300
        total += 300 + additionalAdults * 200;
      }

      // Children (6-17 years) - FREE for Silver Jubilee
      // total += childCount * 0;

      // Infants are free (no charge)

      setValue("contributionAmount", total);
    } else if (willAttend === "No") {
      // If not attending, allow custom contribution amount (default 0)
      // User can still contribute/sponsor
      if (
        !watchedValues.contributionAmount ||
        watchedValues.contributionAmount === 0
      ) {
        setValue("contributionAmount", 0);
      }
    }
  }, [
    willAttend,
    watchedValues.batch,
    adultCount,
    childCount,
    setValue,
    watchedValues.contributionAmount,
  ]);

  // Handle form submission
  const onSubmit = async (data) => {
    // Only require at least one adult if attending
    if (data.willAttend === "Yes") {
      const submittedAdultCount = parseInt(data.attendees?.adults, 10) || 0;
      if (submittedAdultCount < 1) {
        toast.error("At least one adult attendee is required if attending.");
        setValue("attendees.adults", 1);
        return;
      }
    }

    try {
      setIsSubmitting(true);

      // Prepare data for API
      const registrationData = {
        ...data,
        attendees: {
          adults: parseInt(data.attendees?.adults) || 0,
          children: parseInt(data.attendees?.children) || 0,
          infants: parseInt(data.attendees?.infants) || 0,
        },
        guests: data.willAttend === "Yes" ? guests : [], // No guests if not attending
        contributionAmount: parseInt(data.contributionAmount) || 0,
        // Clear event preferences if not attending
        foodChoice: data.willAttend === "Yes" ? data.foodChoice : "",
        expectedArrivalTime:
          data.willAttend === "Yes" ? data.expectedArrivalTime : "",
        overnightAccommodation:
          data.willAttend === "Yes" ? data.overnightAccommodation : "",
      };

      const response = await createRegistration(registrationData);

      if (response.success === true) {
        toast.success(
          `🎉 Registration Successful! ID: ${response.data.registrationId}`,
          { autoClose: 3000 }
        );

        if (isAdminMode) {
          // In admin mode, reset form and stay in dashboard
          reset({
            name: "",
            email: "",
            mobile: "",
            gender: "",
            batch: "",
            rollNumber: "",
            willAttend: "",
            foodChoice: "",
            expectedArrivalTime: "",
            overnightAccommodation: "",
            volunteerInterest: {
              interested: false,
              programs: [],
            },
            committeeInterest: {
              interested: false,
              committees: [],
            },
            sponsorInterest: {
              interested: false,
              details: "",
            },
            programIdeas: "",
            skills: "",
            attendees: {
              adults: 1,
              children: 0,
              infants: 0,
            },
            contributionAmount: 0,
            paymentTransactionId: "",
          });
          setGuests([]);
        } else {
          // Redirect to success page with registration data
          setTimeout(() => {
            navigate("/registration-success", {
              state: {
                registrationId: response.data.registrationId,
                name: data.name,
                email: data.email,
                batch: data.batch,
                contributionAmount: data.contributionAmount,
                attendees: {
                  adults: parseInt(data.attendees?.adults) || 0,
                  children: parseInt(data.attendees?.children) || 0,
                  infants: parseInt(data.attendees?.infants) || 0,
                },
                guests: guests,
                totalAttendees: response.data.totalAttendees,
              },
            });
          }, 1500);
        }
      } else {
        toast.error(response.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);

      // Display detailed error messages from backend
      if (
        error.errors &&
        Array.isArray(error.errors) &&
        error.errors.length > 0
      ) {
        // Show all validation errors
        error.errors.forEach((errorMsg, index) => {
          setTimeout(() => {
            toast.error(errorMsg, {
              autoClose: 5000,
              position: "top-right",
            });
          }, index * 100); // Stagger the toasts slightly
        });
      } else if (error.message) {
        // Show the main error message
        toast.error(error.message, {
          autoClose: 5000,
        });
      } else {
        // Fallback error message
        toast.error(
          "Registration failed. Please check all fields and try again.",
          {
            autoClose: 5000,
          }
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add guest
  const addGuest = () => {
    setGuests([
      ...guests,
      { name: "", gender: "", foodChoice: "", ageCategory: "" },
    ]);
  };

  // Remove guest
  const removeGuest = (index) => {
    setGuests(guests.filter((_, i) => i !== index));
  };

  // Update guest
  const updateGuest = (index, field, value) => {
    const updatedGuests = [...guests];
    updatedGuests[index][field] = value;
    setGuests(updatedGuests);
  };

  return (
    <div
      className={
        isAdminMode
          ? "w-full"
          : "min-h-screen py-4 sm:py-8 relative overflow-hidden"
      }
    >
      {/* Vintage Texture Overlay - Only show in public mode */}
      {!isAdminMode && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[#FDF4E6]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
           {/* Gradient Overlay for depth */}
           <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-[#FDF4E6]/50 to-[#FDF4E6]" />

          {/* Decorative corner elements - Gold Accents */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-[#D4AF37]/10 to-transparent blur-3xl opacity-60" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[#1A237E]/5 to-transparent blur-3xl opacity-60" />
        </div>
      )}

      {/* Content Container */}
      <div
        className={
          isAdminMode
            ? "w-full"
            : "max-w-5xl mx-auto px-3 sm:px-4 lg:px-8 relative z-10"
        }
      >
        {/* Header - Only show in public mode */}
        {!isAdminMode && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            {/* Event Poster */}
            <div className="mb-8">
              <div className="relative overflow-hidden rounded-xl shadow-2xl bg-white">
                <img
                  src="/images/poster.jpg"
                  alt="JNVTA Silver Jubilee - Alumni Reunion 2026"
                  className="w-full h-auto max-h-[500px] sm:max-h-[600px] md:max-h-[700px] object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1642]/80 via-transparent to-transparent"></div>
              </div>
            </div>

            {/* Title Section */}
            <div className="mb-8 relative">
              <div className="inline-block">
                <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-[#1A237E]">
                  Silver Reunion - Celebrating 25 Years
                </h1>
                <div className="section-divider" />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm sm:text-base mt-6">
                <div className="flex items-center gap-2 text-[#0D1642]">
                  <svg
                    className="w-5 h-5 text-[#D4AF37]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="font-body font-semibold">
                    January 25, 2026 | 9:00 AM - 5:30 PM
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#0D1642]">
                  <svg
                    className="w-5 h-5 text-[#D4AF37]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="font-body font-semibold">
                    JNV Campus, Trivandrum
                  </span>
                </div>
              </div>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-[#1A237E] relative">
                <p className="font-body text-[#1A237E] text-lg sm:text-xl leading-relaxed text-center italic">
                  "25 years of cherished memories, lifelong friendships, and
                  shared dreams. Let's celebrate this milestone together and
                  create new memories to treasure!"
                </p>
              </div>
              <p className="font-body text-[#283593] text-base leading-relaxed">
                Join us for the Silver Jubilee celebration of JNVTA! Reconnect
                with old friends, relive precious memories, and celebrate 25
                years of excellence. Be part of this memorable reunion.
              </p>
            </div>
          </motion.div>
        )}

        {/* Admin Mode Header */}
        {isAdminMode && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#5D3A1A]">
              New Registration
            </h2>
            <p className="text-[#704214] mt-1">Onsite quick registration</p>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Details Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={
              isAdminMode
                ? "bg-white rounded-lg border border-gray-200 shadow-sm p-6"
                : "bg-white rounded-xl shadow-2xl p-6 sm:p-10 relative overflow-hidden"
            }
          >
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#1A237E] rounded-full flex items-center justify-center mr-4 shadow-lg text-white">
                  <svg
                    className="w-6 h-6 text-[#FDF5E6]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1A237E]">
                    Personal Information
                  </h2>
                  <p className="font-body text-sm text-[#283593] mt-1">
                    Let us know who you are
                  </p>
                </div>
              </div>
              <div className="h-1 w-24 bg-gradient-to-r from-[#B8860B] to-[#DAA520] rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
              <div className="group">
                <label className="block text-sm font-body font-semibold text-[#1A237E] mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Name is required" }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A237E] focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 ${
                        errors.name
                          ? "border-red-500 focus:ring-red-200"
                          : ""
                      }`}
                      placeholder="Write your name here..."
                    />
                  )}
                />
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-[#800020] flex items-center gap-1 font-body"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.name.message}
                  </motion.p>
                )}
              </div>

              <div className="group">
                <label className="block text-sm font-body font-semibold text-[#1A237E] mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="email"
                      className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A237E] focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 ${
                        errors.email
                          ? "border-red-500 focus:ring-red-200"
                          : ""
                      }`}
                      placeholder="your.email@example.com"
                    />
                  )}
                />
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-[#800020] flex items-center gap-1 font-body"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.email.message}
                  </motion.p>
                )}
              </div>

              <div className="group">
                <label className="block text-sm font-body font-semibold text-[#1A237E] mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="mobile"
                  control={control}
                  rules={{
                    required: "Mobile number is required",
                    pattern: {
                      message: "Please enter your mobile number",
                    },
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="tel"
                      className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A237E] focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 ${
                        errors.mobile
                          ? "border-red-500 focus:ring-red-200"
                          : ""
                      }`}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  )}
                />
                {errors.mobile && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-[#800020] flex items-center gap-1 font-body"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.mobile.message}
                  </motion.p>
                )}
              </div>

              <div className="group">
                <label className="block text-sm font-body font-semibold text-[#1A237E] mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="gender"
                  control={control}
                  rules={{ required: "Gender is required" }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A237E] focus:border-transparent transition-all duration-200 text-gray-700 ${
                        errors.gender
                          ? "border-red-500 focus:ring-red-200"
                          : ""
                      }`}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  )}
                />
                {errors.gender && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-[#800020] flex items-center gap-1 font-body"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.gender.message}
                  </motion.p>
                )}
              </div>

              <div className="group">
                <label className="block text-sm font-body font-semibold text-[#1A237E] mb-1">
                  Batch <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="batch"
                  control={control}
                  rules={{ required: "Batch is required" }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A237E] focus:border-transparent transition-all duration-200 text-gray-700 ${
                        errors.batch
                          ? "border-red-500 focus:ring-red-200"
                          : ""
                      }`}
                    >
                      <option value="">Select your batch</option>
                      {Array.from({ length: 18 }, (_, i) => (
                        <option key={i + 1} value={`Batch ${i + 1}`}>
                          Batch {i + 1}{" "}
                          {i + 1 >= 15 && i + 1 <= 18 ? "🎉 (Free Entry)" : ""}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.batch && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-[#800020] flex items-center gap-1 font-body"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.batch.message}
                  </motion.p>
                )}
              </div>

              <div className="group">
                <label className="block text-sm font-body font-body font-semibold text-[#5D3A1A] mb-2.5">
                  Roll Number{" "}
                  <span className="text-[#283593]/70 text-xs font-normal">(Optional)</span>
                </label>
                <Controller
                  name="rollNumber"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A237E] focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                      placeholder="Enter your roll number (optional)"
                    />
                  )}
                />
              </div>

              <div className="group lg:col-span-2">
                <label className="block text-sm font-body font-semibold text-[#1A237E] mb-3">
                  Will you be attending the event?{" "}
                  <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="willAttend"
                  control={control}
                  rules={{
                    required: "Please indicate if you will be attending",
                  }}
                  render={({ field }) => (
                    <div className="flex gap-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          {...field}
                          type="radio"
                          value="Yes"
                          className="w-5 h-5 text-[#1A237E] border-gray-300 focus:ring-[#1A237E]"
                        />
                        <span className="ml-2 text-base text-[#0D1642] font-medium">
                          Yes, I will attend
                        </span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          {...field}
                          type="radio"
                          value="No"
                          className="w-5 h-5 text-[#1A237E] border-gray-300 focus:ring-[#1A237E]"
                        />
                        <span className="ml-2 text-base text-[#0D1642] font-medium">
                          No, but I'd like to support (virtual help,
                          sponsorship, etc.)
                        </span>
                      </label>
                    </div>
                  )}
                />
                {errors.willAttend && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-[#800020] flex items-center gap-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.willAttend.message}
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Event Preferences Section - Only show if attending */}
          {willAttend === "Yes" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className={
                isAdminMode
                  ? "bg-white rounded-lg border border-gray-200 shadow-sm p-6"
                  : "bg-[#FDF5E6] rounded-sm p-6 sm:p-8 lg:p-10 transition-all duration-300 shadow-xl border-l-4 border-[#1A237E] relative"
              }
            >
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center mr-4 shadow-lg text-white">
                    <svg
                      className="w-6 h-6 text-[#FDF5E6]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1A237E]">
                      Event Preferences
                    </h2>
                    <p className="font-body text-sm text-[#283593] mt-1">
                      Help us plan better for you
                    </p>
                  </div>
                </div>
                <div className="h-0.5 w-full bg-[#1A237E]/20 mb-2"></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
                <div className="group">
                  <label className="block text-sm font-body font-semibold text-[#1A237E] mb-1">
                    Food Choice <span className="text-[#800020]">*</span>
                  </label>
                  <Controller
                    name="foodChoice"
                    control={control}
                    rules={{ required: "Food choice is required" }}
                    render={({ field }) => (
                      <select
                        {...field}
                        className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A237E] focus:border-transparent transition-all duration-200 text-gray-700 ${
                          errors.foodChoice
                            ? "border-red-500 focus:ring-red-200"
                            : ""
                        }`}
                      >
                        <option value="">Select food preference</option>
                        <option value="Veg">🥗 Vegetarian</option>
                        <option value="Non-Veg">🍗 Non-Vegetarian</option>
                      </select>
                    )}
                  />
                  {errors.foodChoice && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-[#800020] flex items-center gap-1"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.foodChoice.message}
                    </motion.p>
                  )}
                </div>

                <div className="group">
                  <label className="block text-sm font-body font-semibold text-[#1A237E] mb-1">
                    Expected Arrival Time{" "}
                    <span className="text-[#800020]">*</span>
                  </label>
                  <Controller
                    name="expectedArrivalTime"
                    control={control}
                    rules={{ required: "Expected arrival time is required" }}
                    render={({ field }) => (
                      <select
                        {...field}
                        className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A237E] focus:border-transparent transition-all duration-200 text-gray-700 ${
                          errors.expectedArrivalTime
                            ? "border-red-500 focus:ring-red-200"
                            : ""
                        }`}
                      >
                        <option value="">Select arrival time</option>
                        <option value="8-11">🌅 8:00 AM - 11:00 AM</option>
                        <option value="11-14">☀️ 11:00 AM - 2:00 PM</option>
                        <option value="14-17">🌤️ 2:00 PM - 5:00 PM</option>
                        <option value="17-20">🌆 5:00 PM - 8:00 PM</option>
                      </select>
                    )}
                  />
                  {errors.expectedArrivalTime && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-[#800020] flex items-center gap-1"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.expectedArrivalTime.message}
                    </motion.p>
                  )}
                </div>

                <div className="group">
                  <label className="block text-sm font-body font-semibold text-[#1A237E] mb-1">
                    Overnight Accommodation{" "}
                    <span className="text-[#800020]">*</span>
                  </label>
                  <Controller
                    name="overnightAccommodation"
                    control={control}
                    rules={{
                      required:
                        "Overnight accommodation preference is required",
                    }}
                    render={({ field }) => (
                      <select
                        {...field}
                        className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A237E] focus:border-transparent transition-all duration-200 text-gray-700 ${
                          errors.overnightAccommodation
                            ? "border-red-500 focus:ring-red-200"
                            : ""
                        }`}
                      >
                        <option value="">Select preference</option>
                        <option value="Yes">
                          🛏️ Yes, I need accommodation
                        </option>
                        <option value="No">
                          🏠 No, I don't need accommodation
                        </option>
                      </select>
                    )}
                  />
                  {errors.overnightAccommodation && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-[#800020] flex items-center gap-1"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.overnightAccommodation.message}
                    </motion.p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Volunteer & Event Participation Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className={
              isAdminMode
                ? "bg-white rounded-lg border border-gray-200 shadow-sm p-6"
                : "bg-[#FDF5E6] rounded-sm p-6 sm:p-8 lg:p-10 transition-all duration-300 shadow-xl border-l-4 border-[#1A237E] relative mt-8"
            }
          >
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#1A237E] rounded-full flex items-center justify-center mr-4 shadow-lg text-white">
                  <svg
                    className="w-6 h-6 text-[#FDF5E6]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1A237E]">
                    Volunteer & Event Participation
                  </h2>
                  <p className="font-body text-sm text-[#283593] mt-1">
                    Help us make this event memorable
                  </p>
                </div>
              </div>
              <div className="h-0.5 w-full bg-[#1A237E]/20 mb-2"></div>
            </div>

            <div className="space-y-8">
              {/* Volunteer Interest */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-base font-body font-semibold text-[#1A237E]">
                    Would you like to volunteer for any program?
                  </label>
                  <Controller
                    name="volunteerInterest.interested"
                    control={control}
                    render={({ field }) => (
                      <button
                        type="button"
                        onClick={() => {
                          const newValue = !field.value;
                          field.onChange(newValue);
                          if (!newValue) {
                            setValue("volunteerInterest.programs", []);
                          }
                        }}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                          field.value ? "bg-indigo-600" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                            field.value ? "translate-x-7" : "translate-x-1"
                          }`}
                        />
                      </button>
                    )}
                  />
                </div>

                {watchedValues.volunteerInterest?.interested && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    <p className="text-sm text-[#704214] mb-3">
                      Select the programs you'd like to volunteer for:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {[
                        "Cultural Program",
                        "Sports Event",
                        "Photography/Videography",
                        "Alumni Talk/Session",
                        "Technical Support",
                        "Other",
                      ].map((program) => (
                        <label
                          key={program}
                          className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-xl border-2 border-indigo-100 hover:border-indigo-300 cursor-pointer transition-all"
                        >
                          <Controller
                            name="volunteerInterest.programs"
                            control={control}
                            render={({ field }) => (
                              <input
                                type="checkbox"
                                checked={
                                  field.value?.includes(program) || false
                                }
                                onChange={(e) => {
                                  const currentPrograms = field.value || [];
                                  if (e.target.checked) {
                                    field.onChange([
                                      ...currentPrograms,
                                      program,
                                    ]);
                                  } else {
                                    field.onChange(
                                      currentPrograms.filter(
                                        (p) => p !== program
                                      )
                                    );
                                  }
                                }}
                                className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                              />
                            )}
                          />
                          <span className="text-sm font-medium text-[#5D3A1A]">
                            {program}
                          </span>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Committee Interest */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-base font-body font-semibold text-[#1A237E]">
                    Would you like to be part of event committees?
                  </label>
                  <Controller
                    name="committeeInterest.interested"
                    control={control}
                    render={({ field }) => (
                      <button
                        type="button"
                        onClick={() => {
                          const newValue = !field.value;
                          field.onChange(newValue);
                          if (!newValue) {
                            setValue("committeeInterest.committees", []);
                          }
                        }}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                          field.value ? "bg-indigo-600" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                            field.value ? "translate-x-7" : "translate-x-1"
                          }`}
                        />
                      </button>
                    )}
                  />
                </div>

                {watchedValues.committeeInterest?.interested && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    <p className="text-sm text-[#704214] mb-3">
                      Select the committees you'd like to join:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {[
                        "Cultural Committee",
                        "Registration Committee",
                        "Food & Catering Committee",
                        "Logistics Committee",
                        "Photography Committee",
                        "Hospitality Committee",
                        "Other",
                      ].map((committee) => (
                        <label
                          key={committee}
                          className="flex items-center space-x-3 p-3 bg-purple-50 rounded-xl border-2 border-purple-100 hover:border-purple-300 cursor-pointer transition-all"
                        >
                          <Controller
                            name="committeeInterest.committees"
                            control={control}
                            render={({ field }) => (
                              <input
                                type="checkbox"
                                checked={
                                  field.value?.includes(committee) || false
                                }
                                onChange={(e) => {
                                  const currentCommittees = field.value || [];
                                  if (e.target.checked) {
                                    field.onChange([
                                      ...currentCommittees,
                                      committee,
                                    ]);
                                  } else {
                                    field.onChange(
                                      currentCommittees.filter(
                                        (c) => c !== committee
                                      )
                                    );
                                  }
                                }}
                                className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                              />
                            )}
                          />
                          <span className="text-sm font-medium text-[#5D3A1A]">
                            {committee}
                          </span>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Sponsor Interest */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-base font-body font-semibold text-[#1A237E]">
                    Are you interested in sponsoring the event?
                  </label>
                  <Controller
                    name="sponsorInterest.interested"
                    control={control}
                    render={({ field }) => (
                      <button
                        type="button"
                        onClick={() => {
                          const newValue = !field.value;
                          field.onChange(newValue);
                          if (!newValue) {
                            setValue("sponsorInterest.details", "");
                          }
                        }}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                          field.value ? "bg-indigo-600" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                            field.value ? "translate-x-7" : "translate-x-1"
                          }`}
                        />
                      </button>
                    )}
                  />
                </div>

                {watchedValues.sponsorInterest?.interested && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    <Controller
                      name="sponsorInterest.details"
                      control={control}
                      render={({ field }) => (
                        <textarea
                          {...field}
                          rows={4}
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A237E] focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 resize-none"
                          placeholder="Please provide details about your sponsorship interest (e.g., sponsorship level, type, contact information, etc.)"
                        />
                      )}
                    />
                  </motion.div>
                )}
              </div>

              {/* Program Ideas */}
              <div className="space-y-3">
                <label className="block text-base font-body font-semibold text-[#1A237E]">
                  Do you have any program/event ideas?
                </label>
                <Controller
                  name="programIdeas"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      rows={4}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A237E] focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 resize-none"
                      placeholder="Share your creative ideas for programs, activities, or events that could make the reunion more memorable..."
                    />
                  )}
                />
              </div>

              {/* Skills/Expertise */}
              <div className="space-y-3">
                <label className="block text-base font-body font-semibold text-[#1A237E]">
                  What skills or expertise can you contribute?
                </label>
                <Controller
                  name="skills"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      rows={4}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A237E] focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 resize-none"
                      placeholder="Tell us about your skills, expertise, or resources you can contribute (e.g., photography, event management, technical skills, etc.)"
                    />
                  )}
                />
              </div>
            </div>
          </motion.div>

          {/* Number of Attendees Section - Only show if attending */}
          {willAttend === "Yes" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className={
                isAdminMode
                  ? "bg-white rounded-lg border border-gray-200 shadow-sm p-6"
                  : "bg-[#FDF5E6] rounded-sm p-6 sm:p-8 lg:p-10 transition-all duration-300 shadow-xl border-l-4 border-[#1A237E] relative mt-8"
              }
            >
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-[#1A237E] rounded-full flex items-center justify-center mr-4 shadow-lg text-white">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#1A237E]">
                      Number of Attendees
                    </h2>
                    <p className="text-sm text-[#704214] mt-1">
                      How many people will join you?
                    </p>
                  </div>
                </div>
                 <div className="h-0.5 w-full bg-[#1A237E]/20 mb-2"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-100 hover:border-purple-300 transition-all duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-bold text-gray-800">👨‍👩‍👧‍👦 Adults</h5>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                      18+ years
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <span className="text-sm text-[#704214] block">
                      {(() => {
                        const batchNumber = parseInt(
                          watchedValues.batch?.split(" ")[1]
                        );
                        const isFreeBatch =
                          batchNumber >= 15 && batchNumber <= 18;
                        if (isFreeBatch)
                          return "🎉 ₹0 for 1st adult (Batches 15-18)";
                        return "₹300 for 1st adult";
                      })()}
                    </span>
                    <span className="text-sm text-[#704214] block">
                      ₹200 for each additional
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => {
                        if (adultCount > 1) {
                          setValue("attendees.adults", adultCount - 1);
                        }
                      }}
                      disabled={adultCount <= 1}
                      className="w-12 h-12 bg-white border-2 border-purple-200 text-purple-600 rounded-xl hover:bg-purple-50 hover:border-purple-400 transition-all duration-200 flex items-center justify-center shadow-sm active:shadow-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-400"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M20 12H4"
                        />
                      </svg>
                    </motion.button>
                    <div className="min-w-[60px] text-center">
                      <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {watchedValues.attendees?.adults || 0}
                      </span>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => {
                        const current = watchedValues.attendees?.adults || 0;
                        setValue("attendees.adults", current + 1);
                      }}
                      className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center shadow-lg active:shadow-md"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </motion.button>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border-2 border-blue-100 hover:border-blue-300 transition-all duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-bold text-gray-800">👦👧 Children</h5>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                      6-17 years
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <span className="text-sm font-bold text-blue-600 block">
                      🎁 FREE
                    </span>
                    <span className="text-sm text-gray-400 block">
                      Silver Jubilee Special
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => {
                        const current = watchedValues.attendees?.children || 0;
                        if (current > 0) {
                          setValue("attendees.children", current - 1);
                        }
                      }}
                      className="w-12 h-12 bg-white border-2 border-blue-200 text-blue-600 rounded-xl hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 flex items-center justify-center shadow-sm active:shadow-none"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M20 12H4"
                        />
                      </svg>
                    </motion.button>
                    <div className="min-w-[60px] text-center">
                      <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        {watchedValues.attendees?.children || 0}
                      </span>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => {
                        const current = watchedValues.attendees?.children || 0;
                        setValue("attendees.children", current + 1);
                      }}
                      className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 flex items-center justify-center shadow-lg active:shadow-md"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </motion.button>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border-2 border-emerald-100 hover:border-emerald-300 transition-all duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-bold text-gray-800">👶 Infants</h5>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
                      0-5 years
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <span className="text-sm font-bold text-emerald-600 block">
                      🎁 FREE
                    </span>
                    <span className="text-sm text-gray-400 block">&nbsp;</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => {
                        const current = watchedValues.attendees?.infants || 0;
                        if (current > 0) {
                          setValue("attendees.infants", current - 1);
                        }
                      }}
                      className="w-12 h-12 bg-white border-2 border-emerald-200 text-emerald-600 rounded-xl hover:bg-emerald-50 hover:border-emerald-400 transition-all duration-200 flex items-center justify-center shadow-sm active:shadow-none"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M20 12H4"
                        />
                      </svg>
                    </motion.button>
                    <div className="min-w-[60px] text-center">
                      <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        {watchedValues.attendees?.infants || 0}
                      </span>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => {
                        const current = watchedValues.attendees?.infants || 0;
                        setValue("attendees.infants", current + 1);
                      }}
                      className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 flex items-center justify-center shadow-lg active:shadow-md"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Family Information Section - Only show if attending and total attendees > 1 */}
          {willAttend === "Yes" && (
            <AnimatePresence>
              {(() => {
                const totalAttendees =
                  (watchedValues.attendees?.adults || 0) +
                  (watchedValues.attendees?.children || 0) +
                  (watchedValues.attendees?.infants || 0);

                return totalAttendees > 1 ? (
                  <motion.div
                    key="family-info"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className={
                      isAdminMode
                        ? "bg-white rounded-lg border border-gray-200 shadow-sm p-6"
                        : "bg-[#FDF5E6] rounded-sm p-6 sm:p-8 lg:p-10 transition-all duration-300 shadow-xl border-l-4 border-[#1A237E] relative mt-8"
                    }
                  >
                    <div className="mb-8">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-[#1A237E] rounded-full flex items-center justify-center mr-4 shadow-lg text-white">
                            <svg
                              className="w-6 h-6 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A237E]">
                              Family Information
                            </h2>
                            <p className="text-sm text-[#704214] mt-1">
                              Add your family members (optional)
                            </p>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={addGuest}
                          className="px-5 py-3 bg-[#1A237E] text-white rounded-lg hover:bg-[#283593] transition-all duration-200 flex items-center space-x-2 shadow-lg font-heading"
                        >
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
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                          <span className="font-semibold">
                            Add Family Member
                          </span>
                        </motion.button>
                      </div>
                      <div className="h-0.5 w-full bg-[#1A237E]/20 mb-2"></div>
                    </div>

                    {guests.length === 0 ? (
                      <div className="text-center py-12 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border-2 border-dashed border-orange-200">
                        <svg
                          className="w-16 h-16 mx-auto text-orange-300 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        <p className="text-gray-500 text-base">
                          No family members added yet.
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          Click "Add Family Member" to include additional
                          attendees.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <AnimatePresence>
                          {guests.map((guest, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: -100 }}
                              className="bg-gradient-to-r from-orange-50 to-amber-50 p-5 rounded-2xl border-2 border-orange-100 hover:border-orange-300 transition-all duration-200"
                            >
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                                  <span className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                                    {index + 1}
                                  </span>
                                  Family Member {index + 1}
                                </h4>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  type="button"
                                  onClick={() => removeGuest(index)}
                                  className="p-2 text-[#800020] hover:bg-red-50 rounded-lg transition-colors"
                                >
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
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </motion.button>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="group">
                                  <label className="block text-sm font-body font-semibold text-[#5D3A1A] mb-2">
                                    Name
                                  </label>
                                  <input
                                    type="text"
                                    value={guest.name}
                                    onChange={(e) =>
                                      updateGuest(index, "name", e.target.value)
                                    }
                                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 placeholder-gray-400"
                                    placeholder="Name"
                                  />
                                </div>
                                <div className="group">
                                  <label className="block text-sm font-body font-semibold text-[#5D3A1A] mb-2">
                                    Gender
                                  </label>
                                  <select
                                    value={guest.gender}
                                    onChange={(e) =>
                                      updateGuest(
                                        index,
                                        "gender",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-4 py-2.5 bg-white/70 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 group-hover:border-orange-300"
                                  >
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                  </select>
                                </div>
                                <div className="group">
                                  <label className="block text-sm font-body font-semibold text-[#5D3A1A] mb-2">
                                    Food
                                  </label>
                                  <select
                                    value={guest.foodChoice}
                                    onChange={(e) =>
                                      updateGuest(
                                        index,
                                        "foodChoice",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-4 py-2.5 bg-white/70 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 group-hover:border-orange-300"
                                  >
                                    <option value="">Select</option>
                                    <option value="Veg">🥗 Veg</option>
                                    <option value="Non-Veg">🍗 Non-Veg</option>
                                  </select>
                                </div>
                                <div className="group">
                                  <label className="block text-sm font-body font-semibold text-[#5D3A1A] mb-2">
                                    Age Category
                                  </label>
                                  <select
                                    value={guest.ageCategory}
                                    onChange={(e) =>
                                      updateGuest(
                                        index,
                                        "ageCategory",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-4 py-2.5 bg-white/70 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 group-hover:border-orange-300"
                                  >
                                    <option value="">Select</option>
                                    <option value="Adult">Adult (18+)</option>
                                    <option value="Child">Child (6-17)</option>
                                    <option value="Infant">Infant (0-5)</option>
                                  </select>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                  </motion.div>
                ) : null;
              })()}
            </AnimatePresence>
          )}

          {/* Payment Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className={
              isAdminMode
                ? "bg-white rounded-lg border border-gray-200 shadow-sm p-6"
                : "bg-[#FDF5E6] rounded-sm p-6 sm:p-8 lg:p-10 transition-all duration-300 shadow-xl border-l-4 border-[#1A237E] relative mt-8"
            }
          >
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#1A237E] rounded-full flex items-center justify-center mr-4 shadow-lg text-white">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#1A237E]">
                    Payment Details
                  </h2>
                  <p className="text-sm text-[#704214] mt-1">
                    Complete your registration payment
                  </p>
                </div>
              </div>
              <div className="h-0.5 w-full bg-[#1A237E]/20 mb-2"></div>
            </div>

            <div className="space-y-6">
              {/* Payment Information */}
              <div className="bg-gradient-to-br from-slate-50 to-amber-50 border-2 border-slate-100 rounded-2xl p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xl font-bold text-[#1A237E]">
                    💰 Payment Summary
                  </h4>
                  <span className="px-4 py-2 bg-amber-100 text-amber-700 font-bold rounded-full text-lg">
                    ₹{watchedValues.contributionAmount || 0}
                  </span>
                </div>

                <div className="space-y-4">
                  {willAttend === "No" ? (
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                      <p className="text-sm text-blue-800 mb-3">
                        💝 Thank you for your support! Even though you won't be
                        attending, you can still contribute to make this event
                        memorable through sponsorship or virtual support.
                      </p>
                      <div className="flex items-center gap-3">
                        <label className="text-sm font-body font-semibold text-[#5D3A1A]">
                          Contribution Amount (₹):
                        </label>
                        <Controller
                          name="contributionAmount"
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="number"
                              min="0"
                              step="100"
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 0;
                                field.onChange(value);
                                setValue("contributionAmount", value);
                              }}
                              className="w-32 px-3 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="0"
                            />
                          )}
                        />
                      </div>
                      <p className="text-xs text-blue-600 mt-2">
                        * You can enter any amount you'd like to contribute.
                        Minimum ₹0.
                      </p>
                    </div>
                  ) : (
                    <>
                      {(() => {
                        const batchNumber = parseInt(
                          watchedValues.batch?.split(" ")[1],
                          10
                        );
                        const isFreeBatch =
                          batchNumber >= 28 && batchNumber <= 32;
                        const billableAdultCount = Math.max(adultCount, 1);
                        const additionalAdultsForBilling = Math.max(
                          billableAdultCount - 1,
                          0
                        );
                        const additionalAdultsForDisplay = Math.max(
                          adultCount - 1,
                          0
                        );

                        return (
                          <>
                            {/* Adults breakdown */}
                            <div className="bg-white/70 rounded-xl p-4 space-y-2">
                              {isFreeBatch ? (
                                <>
                                  <div className="flex justify-between items-center">
                                    <span className="text-[#5D3A1A]">
                                      👨‍👩‍👧‍👦 Adults (1st) - Batch {batchNumber}
                                    </span>
                                    <span className="font-bold text-[#B8860B]">
                                      1 × ₹0 = ₹0
                                    </span>
                                  </div>
                                  {additionalAdultsForDisplay > 0 && (
                                    <div className="flex justify-between items-center">
                                      <span className="text-[#5D3A1A]">
                                        👥 Additional Adults
                                      </span>
                                      <span className="font-bold text-[#5D3A1A]">
                                        {additionalAdultsForDisplay} × ₹200 = ₹
                                        {additionalAdultsForBilling * 200}
                                      </span>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <>
                                  <div className="flex justify-between items-center">
                                    <span className="text-[#5D3A1A]">
                                      👨‍👩‍👧‍👦 Adults (1st)
                                    </span>
                                    <span className="font-bold text-[#5D3A1A]">
                                      1 × ₹300 = ₹300
                                    </span>
                                  </div>
                                  {additionalAdultsForDisplay > 0 && (
                                    <div className="flex justify-between items-center">
                                      <span className="text-[#5D3A1A]">
                                        👥 Additional Adults
                                      </span>
                                      <span className="font-bold text-[#5D3A1A]">
                                        {additionalAdultsForDisplay} × ₹200 = ₹
                                        {additionalAdultsForBilling * 200}
                                      </span>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>

                            <div className="bg-white/70 rounded-xl p-4 space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-[#5D3A1A]">
                                  👦👧 Children (6-17 years)
                                </span>
                                <span className="font-bold text-blue-600">
                                  {childCount} × FREE = FREE
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-[#5D3A1A]">
                                  👶 Infants (0-5 years)
                                </span>
                                <span className="font-bold text-[#B8860B]">
                                  {infantCount} × FREE = FREE
                                </span>
                              </div>
                            </div>

                            {isFreeBatch && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-gradient-to-r from-amber-100 to-yellow-100 p-4 rounded-xl border-2 border-amber-200"
                              >
                                <p className="text-sm text-amber-800 flex items-center font-medium">
                                  <svg
                                    className="w-5 h-5 mr-2 flex-shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  🎉 Free registration for Batches 15-18! Only
                                  additional adults pay ₹200 each. All children
                                  FREE!
                                </p>
                              </motion.div>
                            )}

                            <div className="bg-gradient-to-r from-slate-600 to-amber-600 rounded-2xl p-5 text-white">
                              <div className="flex justify-between items-center">
                                <span className="text-lg font-bold">
                                  Total Amount Payable
                                </span>
                                <span className="text-3xl font-extrabold">
                                  ₹{watchedValues.contributionAmount || 0}
                                </span>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </>
                  )}
                </div>
              </div>

              {/* Bank Details */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 sm:p-8 rounded-2xl border-2 border-blue-200">
                <h5 className="font-bold text-blue-900 mb-6 text-center text-xl flex items-center justify-center gap-2">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  Bank Details for Payment
                </h5>

                {/* UPI QR Code Image */}
                <div className="mb-6 text-center">
                  <div className="bg-white p-5 rounded-2xl border-2 border-blue-200 inline-block shadow-xl">
                    <img
                      src="/images/upi.jpeg"
                      alt="UPI QR Code for Payment"
                      className="w-56 h-56 mx-auto rounded-xl shadow-lg"
                    />
                  </div>
                  <p className="text-base text-blue-700 mt-3 font-bold flex items-center justify-center gap-2">
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
                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                      />
                    </svg>
                    Scan QR Code to Pay
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-blue-100 shadow-lg">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-blue-900">
                    <div className="space-y-3">
                      <p className="flex items-start gap-2">
                        <strong className="min-w-[110px]">Bank:</strong>
                        <span>Federal Bank</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <strong className="min-w-[110px]">
                          Account Holder:
                        </strong>
                        <span>MANU J</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <strong className="min-w-[110px]">UPI ID:</strong>
                        <span className="font-mono bg-blue-100 px-2 py-1 rounded">
                          manujayendran@okaxis
                        </span>
                      </p>
                      <p className="flex items-start gap-2">
                        <strong className="min-w-[110px]">Mobile:</strong>
                        <span className="font-mono">+91 95397 53410</span>
                      </p>
                    </div>
                    <div className="space-y-3">
                      <p className="flex items-start gap-2">
                        <strong className="min-w-[110px]">Account No:</strong>
                        <span className="font-mono">99980102794869</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <strong className="min-w-[110px]">IFSC Code:</strong>
                        <span className="font-mono bg-blue-100 px-2 py-1 rounded">
                          FDRL0001249
                        </span>
                      </p>
                      <p className="flex items-start gap-2">
                        <strong className="min-w-[110px]">Method:</strong>
                        <span>UPI / Bank Transfer</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl">
                    <p className="text-sm text-amber-900 flex items-start gap-2 font-medium">
                      <svg
                        className="w-5 h-5 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        <strong>Important:</strong> Please mention your
                        name/batch number in the payment description for easy
                        verification.
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-bold text-[#1A237E] mb-3">
                  Payment Transaction ID/Reference Number{" "}
                  <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="paymentTransactionId"
                  control={control}
                  rules={{ required: "Payment transaction ID is required" }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className={`w-full px-5 py-4 bg-[#FDF5E6] border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8860B]/30 focus:border-[#B8860B] transition-all duration-200 text-base placeholder:text-[#8B4513]/50 font-mono ${
                        errors.paymentTransactionId
                          ? "border-[#800020] focus:border-[#800020] focus:ring-[#800020]/20"
                          : "border-[#B8860B]/30 group-hover:border-[#B8860B]/50"
                      }`}
                      placeholder="Enter transaction ID (e.g., UTR/UPI Reference Number)"
                    />
                  )}
                />
                {errors.paymentTransactionId && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-[#800020] flex items-center gap-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.paymentTransactionId.message}
                  </motion.p>
                )}
                <p className="mt-2 text-sm text-[#704214] flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Enter the transaction ID from your payment confirmation
                  message/email
                </p>
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="pt-6"
          >
            <motion.button
              whileHover={!isSubmitting && isValid ? { scale: 1.02 } : {}}
              whileTap={!isSubmitting && isValid ? { scale: 0.98 } : {}}
              type="submit"
              disabled={isSubmitting || !isValid}
              className={`group relative w-full py-5 px-6 text-base sm:text-lg font-heading font-bold rounded-lg transition-all duration-300 overflow-hidden ${
                isSubmitting || !isValid
                  ? "bg-[#8B4513]/30 text-[#8B4513]/50 cursor-not-allowed"
                  : "btn-vintage"
              }`}
            >
              {!isSubmitting && isValid && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#800020]/20 via-[#B8860B]/20 to-[#800020]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              )}

              <div className="relative z-10">
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent"></div>
                    <span className="text-sm sm:text-base">
                      Submitting Your Registration...
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Complete Registration for Silver Jubilee 2026</span>
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </motion.button>
          </motion.div>

          {/* Crafted by Xyvin Technologies - Mobile Friendly */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-full px-4 sm:px-6 py-2.5 sm:py-3 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200">
              <span className="text-xs sm:text-sm text-[#704214]">
                Crafted with
              </span>
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#800020] animate-pulse"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs sm:text-sm text-[#704214]">by</span>
              <a
                href="https://www.xyvin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-sm sm:text-base text-[#B8860B] hover:text-amber-700 transition-colors inline-flex items-center gap-1 group"
              >
                Xyvin Technologies
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </motion.div>
        </form>

        {/* Simple Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center mt-12 sm:mt-16 space-y-4 sm:space-y-6"
        >
          <div className="flex items-center justify-center gap-3 text-xl sm:text-2xl font-bold">
            <span className="bg-gradient-to-r from-slate-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
              Celebrating 25 Years of Excellence!
            </span>
            <span className="text-2xl sm:text-3xl animate-bounce">🎊</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-[#704214]">
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4 text-slate-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <a
                href="mailto:contact@jnvta.org"
                className="hover:text-[#B8860B] transition-colors"
              >
                contact@jnvta.org
              </a>
            </div>
            <span className="hidden sm:inline text-gray-400">•</span>
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4 text-[#B8860B]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <a
                href="tel:+919876543210"
                className="hover:text-[#B8860B] transition-colors"
              >
                +91 98765 43210
              </a>
            </div>
          </div>

          <p className="text-xs text-gray-500">
            © 2026 JNVTA - Jawahar Navodaya Vidyalaya Trivandrum Alumni
            Association. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default JNVTASilverReunionForm;
