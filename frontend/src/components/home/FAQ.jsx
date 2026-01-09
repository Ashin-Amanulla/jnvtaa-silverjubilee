import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronDown, HiQuestionMarkCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

const faqData = [
  {
    question: "When and where is the Silver Jubilee Reunion?",
    answer:
      "The reunion is scheduled for January 25, 2026 at the JNV Campus, Trivandrum, Kerala. The event will start at 9:00 AM and continue throughout the day with various programs.",
  },
  {
    question: "How do I register for the event?",
    answer:
      "You can register by clicking the 'Register Now' button on this page. Fill out the registration form with your details, select your attendance preferences, and complete the payment process. You'll receive a confirmation email once your registration is complete.",
  },
  {
    question: "What is the registration fee?",
    answer:
      "The registration fee is ₹300 for alumni (first adult). Additional adults are ₹200 each. Children (6-17 years) are FREE for this Silver Jubilee celebration. Batches 15-18 have discounted registration at ₹100 for the first adult. You can also contribute more to support the event.",
  },
  {
    question: "Is accommodation available?",
    answer:
      "Yes, overnight accommodation is available on campus. Please indicate your accommodation preference during registration. Limited rooms are available on a first-come, first-served basis.",
  },
  {
    question: "Can I bring my family?",
    answer:
      "Absolutely! Family members are welcome to join the celebration. During registration, you can add the number of adults, children, and infants accompanying you.",
  },
  {
    question: "What should I wear?",
    answer:
      "We recommend smart casual attire. Since this is a nostalgic reunion, feel free to wear your old school/batch colors if you wish! Comfortable footwear is recommended as there will be campus tours.",
  },
  {
    question: "Will food be provided?",
    answer:
      "Yes, lunch and dinner will be provided for all registered attendees. During registration, you can specify your food preference (Vegetarian or Non-Vegetarian).",
  },
  {
    question: "How can I contribute as a volunteer or sponsor?",
    answer:
      "During registration, you can indicate your interest in volunteering for various programs or sponsoring the event. Our organizing committee will reach out to you with more details.",
  },
  {
    question: "What if I can't attend but want to contribute?",
    answer:
      "You can still register and select 'No' for attendance. You'll have the option to make a contribution or sponsor the event to support your fellow alumni.",
  },
  {
    question: "Who can I contact for more information?",
    answer:
      "For any queries, please reach out to our organizing committee through the contact details provided at the bottom of this page. You can also email us or call us directly.",
  },
];

const FAQItem = ({ question, answer, isOpen, onClick, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`glass-panel-dark rounded-xl overflow-hidden mb-4 border transition-all duration-300 ${
        isOpen ? "border-[#D4AF37]/50 shadow-[0_0_15px_rgba(212,175,55,0.1)]" : "border-white/5 hover:border-white/10"
      }`}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-5 sm:p-6 text-left transition-colors"
      >
        <span className={`font-heading text-lg sm:text-xl pr-4 transition-colors ${
            isOpen ? "text-[#D4AF37]" : "text-white group-hover:text-blue-200"
        }`}>
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <div className={`p-2 rounded-full ${isOpen ? "bg-[#D4AF37]/20" : "bg-white/5"}`}>
             <HiChevronDown className={`w-5 h-5 ${isOpen ? "text-[#D4AF37]" : "text-blue-300"}`} />
          </div>
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-5 sm:px-6 pb-6 pt-0">
               <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />
              <p className="font-body text-blue-100/80 leading-relaxed">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="relative py-20 sm:py-28 overflow-hidden bg-[#05091A]"
    >
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <HiQuestionMarkCircle className="text-3xl text-[#D4AF37]" />
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="section-divider-modern" />
          <p className="font-body text-blue-200 text-lg max-w-2xl mx-auto">
            Find answers to common questions about our Silver Jubilee Reunion
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => toggleFAQ(index)}
              index={index}
            />
          ))}
        </div>

        {/* Still have questions? */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <p className="font-body text-blue-300 mb-6 font-medium">
            Still have questions? We're here to help.
          </p>
          <Link to="/register">
            <button
              className="btn-outline px-8 py-3 text-white border-blue-500/30 hover:border-blue-400 hover:bg-blue-900/20"
            >
              Contact Support
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
