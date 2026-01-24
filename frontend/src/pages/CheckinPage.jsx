import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  searchForCheckin,
  selfCheckin,
  addGuestsToRegistration,
} from "../api/registration.api";

const CheckinPage = () => {
  const navigate = useNavigate();
  const [searchEmail, setSearchEmail] = useState("");
  const [searchMobile, setSearchMobile] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [registration, setRegistration] = useState(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [showAddGuests, setShowAddGuests] = useState(false);
  const [isAddingGuests, setIsAddingGuests] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [guestsAdded, setGuestsAdded] = useState(false);

  // Guest form state
  const [newGuests, setNewGuests] = useState([
    {
      name: "",
      gender: "",
      foodChoice: "",
      ageCategory: "",
    },
  ]);

  // Search for registration
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchEmail && !searchMobile) {
      toast.error("Please enter email or mobile number");
      return;
    }

    setIsSearching(true);
    try {
      const response = await searchForCheckin(searchEmail, searchMobile);
      if (response.success) {
        setRegistration(response.data);
        setCheckedIn(response.data.attendance);
        setGuestsAdded(false);
        toast.success("Registration found!");
      }
    } catch (error) {
      toast.error(error.message || "Registration not found");
      setRegistration(null);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle self check-in
  const handleCheckin = async () => {
    if (!registration) return;

    setIsCheckingIn(true);
    try {
      const response = await selfCheckin(registration.id);
      if (response.success) {
        setCheckedIn(true);
        setRegistration({ ...registration, attendance: true });
        toast.success("Check-in successful! Welcome to the event.");
      }
    } catch (error) {
      toast.error(error.message || "Check-in failed");
    } finally {
      setIsCheckingIn(false);
    }
  };

  // Add guest to form
  const addGuestField = () => {
    setNewGuests([
      ...newGuests,
      {
        name: "",
        gender: "",
        foodChoice: "",
        ageCategory: "",
      },
    ]);
  };

  // Remove guest field
  const removeGuestField = (index) => {
    if (newGuests.length > 1) {
      setNewGuests(newGuests.filter((_, i) => i !== index));
    }
  };

  // Update guest field
  const updateGuestField = (index, field, value) => {
    const updated = [...newGuests];
    updated[index][field] = value;
    setNewGuests(updated);
  };

  // Calculate additional payment for new guests
  const calculateAdditionalAmount = () => {
    let amount = 0;
    newGuests.forEach((guest) => {
      if (guest.ageCategory === "Adult") {
        amount += 200;
      } else if (guest.ageCategory === "Child") {
        amount += 150;
      }
      // Infants are free
    });
    return amount;
  };

  // Handle add guests
  const handleAddGuests = async () => {
    // Validate guests
    const validGuests = newGuests.filter(
      (g) => g.name && g.gender && g.foodChoice && g.ageCategory
    );

    if (validGuests.length === 0) {
      toast.error("Please fill at least one guest's details");
      return;
    }

    // Check for incomplete guests
    const incompleteGuests = newGuests.filter(
      (g) =>
        (g.name && !g.gender) ||
        (g.name && !g.foodChoice) ||
        (g.name && !g.ageCategory)
    );

    if (incompleteGuests.length > 0) {
      toast.error("Please complete all fields for each guest");
      return;
    }

    setIsAddingGuests(true);
    try {
      const response = await addGuestsToRegistration(registration.id, validGuests);
      if (response.success) {
        setRegistration(response.data);
        setGuestsAdded(true);
        setShowAddGuests(false);
        setNewGuests([
          {
            name: "",
            gender: "",
            foodChoice: "",
            ageCategory: "",
          },
        ]);
        toast.success(
          `Successfully added ${validGuests.length} guest(s). Amount due: ₹${response.data.amountDue}`
        );
      }
    } catch (error) {
      toast.error(error.message || "Failed to add guests");
      if (error.errors) {
        error.errors.forEach((err) => toast.error(err));
      }
    } finally {
      setIsAddingGuests(false);
    }
  };

  // Reset search
  const handleReset = () => {
    setRegistration(null);
    setSearchEmail("");
    setSearchMobile("");
    setCheckedIn(false);
    setGuestsAdded(false);
    setShowAddGuests(false);
    setNewGuests([
      {
        name: "",
        gender: "",
        foodChoice: "",
        ageCategory: "",
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-[#FDF4E6] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A237E] mb-2">
            JNVTA 2026
          </h1>
          <p className="text-lg text-[#4B5563]">Self Check-in Kiosk</p>
        </div>

        {/* Search Form */}
        {!registration && (
          <div className="glass-panel rounded-2xl p-6 md:p-8 mb-6 animate-fade-in-up">
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1A237E] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-[#1A237E] focus:outline-none bg-white/80"
                />
              </div>
              <div className="text-center text-[#4B5563] font-medium">OR</div>
              <div>
                <label className="block text-sm font-medium text-[#1A237E] mb-2">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={searchMobile}
                  onChange={(e) => setSearchMobile(e.target.value)}
                  placeholder="Enter your mobile number"
                  className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-[#1A237E] focus:outline-none bg-white/80"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="w-full btn-primary py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? "Searching..." : "Search Registration"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-blue-200">
              <p className="text-center text-[#4B5563] mb-4">
                Not registered yet?
              </p>
              <button
                onClick={() => navigate("/register")}
                className="w-full btn-outline py-3 rounded-xl"
              >
                Register Now
              </button>
            </div>
          </div>
        )}

        {/* Registration Details */}
        {registration && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Registration Card */}
            <div className="glass-panel rounded-2xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-[#1A237E]">
                  Welcome, {registration.name}!
                </h2>
                <button
                  onClick={handleReset}
                  className="text-[#4B5563] hover:text-[#1A237E] transition-colors"
                >
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-[#4B5563]">
                  <span className="font-medium">Registration ID:</span>
                  <span className="font-mono bg-blue-100 px-2 py-1 rounded">
                    {registration.registrationId}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#4B5563]">
                  <span className="font-medium">Batch:</span>
                  <span>{registration.batch}</span>
                </div>
                <div className="flex items-center gap-2 text-[#4B5563]">
                  <span className="font-medium">Status:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      checkedIn
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {checkedIn ? "Checked In" : "Not Checked In"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#4B5563]">
                  <span className="font-medium">Total Attendees:</span>
                  <span className="font-semibold text-[#1A237E]">
                    {registration.totalAttendees}
                  </span>
                </div>
                {registration.guests && registration.guests.length > 0 && (
                  <div className="mt-4">
                    <p className="font-medium text-[#1A237E] mb-2">Guests:</p>
                    <div className="space-y-2">
                      {registration.guests.map((guest, idx) => (
                        <div
                          key={idx}
                          className="bg-blue-50 p-3 rounded-lg text-sm"
                        >
                          <span className="font-medium">{guest.name}</span> -{" "}
                          {guest.ageCategory} ({guest.foodChoice})
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Check-in Button */}
              {!checkedIn && (
                <button
                  onClick={handleCheckin}
                  disabled={isCheckingIn}
                  className="w-full btn-primary py-3 rounded-xl mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCheckingIn ? "Checking In..." : "Check In Now"}
                </button>
              )}

              {/* Add Guests Section */}
              <div className="mt-6 pt-6 border-t border-blue-200">
                <button
                  onClick={() => setShowAddGuests(!showAddGuests)}
                  className="w-full flex items-center justify-between text-left p-3 rounded-xl hover:bg-blue-50 transition-colors"
                >
                  <span className="font-medium text-[#1A237E]">
                    Add More Guests
                  </span>
                  <svg
                    className={`w-5 h-5 text-[#1A237E] transition-transform ${
                      showAddGuests ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showAddGuests && (
                  <div className="mt-4 space-y-4 animate-slide-up">
                    {newGuests.map((guest, index) => (
                      <div
                        key={index}
                        className="bg-white/60 p-4 rounded-xl border border-blue-100"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-[#1A237E]">
                            Guest {index + 1}
                          </h4>
                          {newGuests.length > 1 && (
                            <button
                              onClick={() => removeGuestField(index)}
                              className="text-red-500 hover:text-red-700"
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
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-[#4B5563] mb-1">
                              Name
                            </label>
                            <input
                              type="text"
                              value={guest.name}
                              onChange={(e) =>
                                updateGuestField(index, "name", e.target.value)
                              }
                              placeholder="Guest name"
                              className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:border-[#1A237E] focus:outline-none bg-white text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-[#4B5563] mb-1">
                              Gender
                            </label>
                            <select
                              value={guest.gender}
                              onChange={(e) =>
                                updateGuestField(index, "gender", e.target.value)
                              }
                              className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:border-[#1A237E] focus:outline-none bg-white text-sm"
                            >
                              <option value="">Select</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-[#4B5563] mb-1">
                              Food Choice
                            </label>
                            <select
                              value={guest.foodChoice}
                              onChange={(e) =>
                                updateGuestField(
                                  index,
                                  "foodChoice",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:border-[#1A237E] focus:outline-none bg-white text-sm"
                            >
                              <option value="">Select</option>
                              <option value="Veg">Veg</option>
                              <option value="Non-Veg">Non-Veg</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-[#4B5563] mb-1">
                              Age Category
                            </label>
                            <select
                              value={guest.ageCategory}
                              onChange={(e) =>
                                updateGuestField(
                                  index,
                                  "ageCategory",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:border-[#1A237E] focus:outline-none bg-white text-sm"
                            >
                              <option value="">Select</option>
                              <option value="Adult">Adult (₹200)</option>
                              <option value="Child">Child (₹150)</option>
                              <option value="Infant">Infant (Free)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={addGuestField}
                      className="w-full py-2 text-[#1A237E] border-2 border-[#1A237E] rounded-xl hover:bg-[#1A237E] hover:text-white transition-colors text-sm font-medium"
                    >
                      + Add Another Guest
                    </button>
                    {calculateAdditionalAmount() > 0 && (
                      <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                        <p className="text-sm text-amber-900 font-medium">
                          Additional Amount Due: ₹{calculateAdditionalAmount()}
                        </p>
                        <p className="text-xs text-amber-700 mt-1">
                          (Pay at registration desk)
                        </p>
                      </div>
                    )}
                    <button
                      onClick={handleAddGuests}
                      disabled={isAddingGuests}
                      className="w-full btn-primary py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAddingGuests ? "Adding Guests..." : "Add Guests"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Success Message */}
            {checkedIn && (
              <div className="glass-panel rounded-2xl p-6 bg-green-50 border-2 border-green-200 animate-scale-in">
                <div className="flex items-center gap-3 mb-2">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-xl font-bold text-green-800">
                    Check-in Successful!
                  </h3>
                </div>
                <p className="text-green-700">
                  You have successfully checked in. Welcome to JNVTA 2026!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckinPage;
