import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaArrowRight, FaTag } from "react-icons/fa";
import PageLayout from "../components/shared/PageLayout";
import { KineticText } from "../components/artistic";

// Sample news data
const newsArticles = [
  {
    id: 1,
    title: "Silver Jubilee Inaugural - A Grand Success!",
    excerpt: "The Silver Jubilee Inaugural event on January 25, 2026 was a resounding success! Over 500 alumni gathered at JNV Campus to kick off our year-long celebration.",
    date: "January 26, 2026",
    category: "Event",
    featured: true,
  },
  {
    id: 2,
    title: "JNVTAA Committee Meeting Highlights",
    excerpt: "The executive committee met last month to finalize plans for the upcoming Silver Jubilee. Key decisions were made regarding venue arrangements and cultural programs.",
    date: "December 20, 2025",
    category: "Association",
  },
  {
    id: 3,
    title: "Call for Volunteers - Be Part of the Organizing Team",
    excerpt: "We are looking for enthusiastic alumni to volunteer for organizing the Silver Jubilee 2026. This is a great opportunity to contribute and reconnect.",
    date: "December 15, 2025",
    category: "Announcement",
  },
  {
    id: 4,
    title: "Silver Jubilee Souvenir - Submit Your Memories",
    excerpt: "We are compiling a special souvenir booklet for the Silver Jubilee. Share your favorite memories, photos, and messages to be featured.",
    date: "December 10, 2025",
    category: "Announcement",
  },
  {
    id: 5,
    title: "Batch Representatives Confirmed",
    excerpt: "Batch representatives for all graduating years have been confirmed. They will be the point of contact for coordinating batch-specific activities.",
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
      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-[var(--color-bg-primary)]">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-[15%] right-[8%] w-72 h-72 rounded-full border border-[var(--color-accent-coral)]/20"
            animate={{ rotate: -360 }}
            transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="container-asymmetric relative z-10 py-32">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-3 mb-8"
            >
              <span className="w-12 h-[2px] bg-[var(--color-accent-coral)]" />
              <span className="text-[var(--color-accent-coral)] font-display text-sm tracking-[0.3em] uppercase">
                News & Updates
              </span>
            </motion.div>

            <div className="space-y-2 mb-8">
              <KineticText
                as="h1"
                variant="words"
                delay={0.3}
                className="font-display text-display text-[var(--color-text-primary)] leading-[0.9]"
              >
                NEWS
              </KineticText>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg md:text-xl text-[var(--color-text-muted)] max-w-2xl leading-relaxed"
            >
              Stay updated with the latest happenings at JNVTAA. 
              From event announcements to community highlights.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ============================================
          NEWS CONTENT
          ============================================ */}
      <section className="py-20 bg-[var(--color-bg-secondary)]">
        <div className="container-asymmetric">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-3 mb-16"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 font-display text-sm tracking-wider transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-[var(--color-accent-coral)] text-[var(--color-bg-primary)]"
                    : "bg-transparent border border-[var(--color-text-primary)]/20 text-[var(--color-text-primary)] hover:border-[var(--color-accent-coral)]"
                }`}
              >
                {category.toUpperCase()}
              </button>
            ))}
          </motion.div>

          {/* Featured Article */}
          {activeCategory === "All" && (
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card-brutal p-0 overflow-hidden mb-16"
            >
              <div className="grid lg:grid-cols-2">
                <div className="bg-[var(--color-accent-coral)] p-10 lg:p-14 flex items-center">
                  <div>
                    <span className="inline-block px-4 py-1 bg-[var(--color-bg-primary)] text-[var(--color-accent-coral)] font-display text-xs tracking-wider mb-6">
                      FEATURED
                    </span>
                    <h2 className="font-display text-3xl lg:text-4xl text-[var(--color-bg-primary)] mb-6">
                      {newsArticles[0].title.toUpperCase()}
                    </h2>
                    <p className="text-[var(--color-bg-primary)]/80 text-lg leading-relaxed mb-6">
                      {newsArticles[0].excerpt}
                    </p>
                    <div className="flex items-center gap-6 text-[var(--color-bg-primary)]/60 text-sm">
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
                <div className="bg-[var(--color-bg-primary)] p-10 lg:p-14 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-28 h-28 bg-[var(--color-accent-coral)] mx-auto mb-6 flex items-center justify-center">
                      <span className="font-display text-4xl text-[var(--color-bg-primary)]">25</span>
                    </div>
                    <h3 className="text-[var(--color-text-primary)] font-display text-xl mb-2">
                      25TH YEAR CELEBRATION
                    </h3>
                    <p className="text-[var(--color-text-muted)] text-sm mb-8">
                      Year-long events & programs!
                    </p>
                    <Link to="/gallery">
                      <button className="btn-primary">
                        <span>VIEW GALLERY</span>
                        <FaArrowRight />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.article>
          )}

          {/* News Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.slice(activeCategory === "All" ? 1 : 0).map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-brutal p-8 cursor-pointer hover:-translate-y-2 group"
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 border border-[var(--color-text-primary)]/20 text-[var(--color-text-muted)] text-xs font-display tracking-wider">
                    {article.category.toUpperCase()}
                  </span>
                  <span className="text-[var(--color-text-muted)]/50 text-xs">{article.date}</span>
                </div>
                <h3 className="font-display text-xl text-[var(--color-text-primary)] mb-4 group-hover:text-[var(--color-accent-coral)] transition-colors line-clamp-2">
                  {article.title.toUpperCase()}
                </h3>
                <p className="text-[var(--color-text-muted)] text-base leading-relaxed line-clamp-3">
                  {article.excerpt}
                </p>
              </motion.article>
            ))}
          </div>

          {/* No results */}
          {filteredNews.length === 0 && (
            <div className="text-center py-20">
              <p className="text-[var(--color-text-muted)] font-display text-lg">
                NO NEWS ARTICLES IN THIS CATEGORY YET.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ============================================
          CTA SECTION
          ============================================ */}
      <section className="py-32 bg-[var(--color-bg-primary)]">
        <div className="container-asymmetric text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="font-display text-heading text-[var(--color-text-primary)] mb-6">
              STAY<br />
              <span className="text-gradient-sunset">UPDATED</span>
            </h2>
            <p className="text-[var(--color-text-muted)] text-xl leading-relaxed mb-10">
              Follow us on social media for the latest news and updates about JNVTAA activities.
            </p>
            <Link to="/contact">
              <motion.button
                className="btn-outline text-lg px-10 py-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                CONTACT US
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default NewsPage;
