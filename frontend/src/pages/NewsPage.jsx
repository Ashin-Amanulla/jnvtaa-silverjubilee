import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaArrowRight, FaTag } from "react-icons/fa";
import { HiNewspaper } from "react-icons/hi";
import PageLayout from "../components/shared/PageLayout";

// Sample news data
const newsArticles = [
  {
    id: 1,
    title: "Silver Jubilee 2026 Registrations Now Open!",
    excerpt: "The much-awaited Silver Jubilee celebration is happening on January 25, 2026. We are thrilled to announce that registrations are now open for all alumni. Join us for a day filled with nostalgia, reconnections, and celebrations.",
    content: "Join us for the grand 25-year celebration of JNV Trivandrum alumni...",
    date: "January 5, 2026",
    category: "Event",
    featured: true,
  },
  {
    id: 2,
    title: "JNVTAA Committee Meeting Highlights",
    excerpt: "The executive committee met last month to finalize plans for the upcoming Silver Jubilee. Key decisions were made regarding venue arrangements, cultural programs, and registration fees.",
    date: "December 20, 2025",
    category: "Association",
  },
  {
    id: 3,
    title: "Call for Volunteers - Be Part of the Organizing Team",
    excerpt: "We are looking for enthusiastic alumni to volunteer for organizing the Silver Jubilee 2026. This is a great opportunity to contribute and reconnect with the community.",
    date: "December 15, 2025",
    category: "Announcement",
  },
  {
    id: 4,
    title: "Silver Jubilee Souvenir - Submit Your Memories",
    excerpt: "We are compiling a special souvenir booklet for the Silver Jubilee. Share your favorite memories, photos, and messages to be featured in this commemorative edition.",
    date: "December 10, 2025",
    category: "Announcement",
  },
  {
    id: 5,
    title: "Batch Representatives Confirmed",
    excerpt: "Batch representatives for all graduating years have been confirmed. They will be the point of contact for coordinating batch-specific activities during the Silver Jubilee.",
    date: "December 1, 2025",
    category: "Association",
  },
  {
    id: 6,
    title: "Special Accommodation Rates for Attendees",
    excerpt: "We have partnered with local hotels to offer special discounted rates for Silver Jubilee attendees. Details will be shared with registered participants.",
    date: "November 25, 2025",
    category: "Announcement",
  },
];

// Get unique categories
const categories = ["All", ...new Set(newsArticles.map((a) => a.category))];

const NewsPage = () => {
  const [activeCategory, setActiveCategory] = React.useState("All");

  const filteredNews = activeCategory === "All" 
    ? newsArticles 
    : newsArticles.filter((a) => a.category === activeCategory);

  return (
    <PageLayout showPopup={false}>
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A237E] via-[#303F9F] to-[#3949AB]" />
        
        <div className="absolute inset-0 opacity-10 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 border-2 border-white rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 border-2 border-white rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <HiNewspaper className="text-[#D4AF37]" />
              <span className="text-white/90 text-sm font-semibold uppercase tracking-wider">
                News & Updates
              </span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Latest News
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Stay updated with the latest happenings at JNVTAA. 
              From event announcements to community highlights.
            </p>
          </motion.div>
        </div>
      </section>

      {/* News Content */}
      <section className="py-16 bg-[#FDF4E6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-2 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-[#1A237E] text-white"
                    : "bg-white text-[#4B5563] hover:bg-[#1A237E]/10"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Featured Article */}
          {activeCategory === "All" && (
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl shadow-lg overflow-hidden mb-12 border border-[#D4AF37]/20"
            >
              <div className="grid lg:grid-cols-2">
                <div className="bg-gradient-to-br from-[#1A237E] via-[#303F9F] to-[#3949AB] p-8 lg:p-12 flex items-center">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-[#D4AF37] text-[#1A237E] text-xs font-semibold mb-4">
                      Featured
                    </span>
                    <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-4">
                      {newsArticles[0].title}
                    </h2>
                    <p className="text-white/80 mb-6">
                      {newsArticles[0].excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-white/60 text-sm">
                      <span className="flex items-center gap-2">
                        <FaCalendarAlt />
                        {newsArticles[0].date}
                      </span>
                      <span className="flex items-center gap-2">
                        <FaTag />
                        {newsArticles[0].category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-8 lg:p-12 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-[#1A237E]/10 mx-auto mb-6 flex items-center justify-center">
                      <span className="font-heading text-3xl font-bold text-[#1A237E]">25</span>
                    </div>
                    <h3 className="text-[#1A237E] font-semibold mb-2">Silver Jubilee 2026</h3>
                    <p className="text-[#4B5563] text-sm mb-6">Registrations are now open!</p>
                    <Link to="/register" className="btn-primary inline-flex items-center gap-2">
                      Register Now <FaArrowRight className="text-sm" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.article>
          )}

          {/* News Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.slice(activeCategory === "All" ? 1 : 0).map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow group cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-[#1A237E]/10 text-[#1A237E] text-xs font-semibold">
                    {article.category}
                  </span>
                  <span className="text-[#9CA3AF] text-xs">{article.date}</span>
                </div>
                <h3 className="font-heading text-lg font-semibold text-[#1A237E] mb-3 group-hover:text-[#3949AB] transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-[#4B5563] text-sm line-clamp-3">{article.excerpt}</p>
              </motion.article>
            ))}
          </div>

          {/* No results */}
          {filteredNews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#4B5563]">No news articles in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1A237E] mb-4">
              Want to Stay Updated?
            </h2>
            <p className="text-[#4B5563] mb-8 max-w-xl mx-auto">
              Follow us on social media for the latest news and updates about JNVTAA activities.
            </p>
            <Link to="/contact" className="btn-outline inline-flex items-center gap-2">
              Contact Us
              <FaArrowRight className="text-sm" />
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default NewsPage;
