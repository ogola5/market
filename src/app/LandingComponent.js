// src/components/LandingComponent.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion'; // Suggestion: Install framer-motion

// Custom colors for a more impactful psychological effect
// Add these to your tailwind.config.js if you want global access:
/*
  module.exports = {
    theme: {
      extend: {
        colors: {
          'primary-dark': '#0A1128', // Deep Navy Blue - Trust, Authority, Depth
          'secondary-accent': '#001F54', // Darker Blue - Stability, Professionalism
          'tertiary-highlight': '#034078', // Medium Blue - Clarity, Intelligence
          'action-light': '#1282A2', // Vibrant Teal - Innovation, Energy, Growth
          'action-dark': '#03254C', // Dark Teal - Subtlety, Elegance
          'text-light': '#F8F8F8', // Off-white for readability on dark backgrounds
          'text-muted': '#B0B0B0', // Lighter grey for secondary text
        },
      },
    },
  };
*/

export const LandingComponent = () => {
  // Simple state for a fade-in effect on initial load
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in after component mounts
    setIsVisible(true);

    // Optional: AOS (Animate On Scroll) initialization if you use it
    // import AOS from 'aos';
    // import 'aos/dist/aos.css';
    // AOS.init({
    //   offset: 100, // offset (in px) from the original trigger point
    //   duration: 800, // values from 0 to 3000, with step 50ms
    //   easing: 'ease-in-out', // default easing for AOS animations
    //   once: true, // whether animation should happen only once - while scrolling down
    // });
  }, []);

  // Framer Motion scroll-based animations (example for parallax)
  // const { scrollYProgress } = useScroll();
  // const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]); // Example parallax on an element

  return (
    <div className="bg-primary-dark text-text-light min-h-screen font-sans">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col lg:flex-row items-center justify-center px-6 md:px-12 py-24 overflow-hidden">
        {/* Background Gradients/Shapes for dynamism */}
        <div className="absolute inset-0 z-0 opacity-20">
            {/* Example: SVG blob or radial gradient */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-tertiary-highlight rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-action-light rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 max-w-3xl text-center lg:text-left mb-16 lg:mb-0 lg:mr-16"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 text-text-light">
            Dominate Your Market with <span className="text-action-light block lg:inline-block">AI-Powered Precision.</span>
          </h1>
          <p className="text-xl mb-8 text-text-muted max-w-prose mx-auto lg:mx-0">
            Unleash the **full potential** of your marketing strategy. Our intelligent dashboard provides **unrivaled insights** for SEO, campaign optimization, and deep user engagement analysis.
          </p>
          <div className="flex justify-center lg:justify-start space-x-4">
            <Link to="/login">
              <button className="bg-action-light text-primary-dark font-bold px-8 py-4 rounded-full shadow-lg hover:bg-action-dark hover:text-text-light transform hover:scale-105 transition-all duration-300 ease-in-out text-lg">
                Start Your Edge Today
              </button>
            </Link>
            <Link to="#features"> {/* Scroll to features section */}
              <button className="border border-action-light text-action-light font-semibold px-8 py-4 rounded-full hover:bg-tertiary-highlight hover:text-text-light transition-all duration-300 ease-in-out text-lg">
                Learn More
              </button>
            </Link>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.9 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative z-10 w-full lg:w-1/2 max-w-3xl"
        >
          {/* Placeholder for a more dynamic dashboard image/animation */}
          <img
            src="https://images.unsplash.com/photo-1559526324-593bc073d938?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
            alt="AI Marketing Dashboard"
            className="w-full rounded-xl shadow-2xl border border-secondary-accent"
          />
          {/* Consider an animated SVG or Lottie animation here for more impact */}
        </motion.div>
      </section>

      {/* Trust Badges/Quick Stats (below hero, before features) */}
      <section className="bg-secondary-accent py-12 px-6 md:px-12 text-center">
          <h2 className="text-2xl font-semibold mb-8 text-text-light">Trusted by Industry Leaders</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {/* Replace with actual client logos or more compelling stats */}
              <div className="text-action-light text-4xl font-bold flex flex-col items-center">
                  <span className="mb-1">100k+</span>
                  <span className="text-sm font-normal text-text-muted">Users</span>
              </div>
              <div className="text-action-light text-4xl font-bold flex flex-col items-center">
                  <span className="mb-1">98%</span>
                  <span className="text-sm font-normal text-text-muted">Satisfaction</span>
              </div>
              <div className="text-action-light text-4xl font-bold flex flex-col items-center">
                  <span className="mb-1">200% ROI</span>
                  <span className="text-sm font-normal text-text-muted">Avg. Client Growth</span>
              </div>
              <div className="text-action-light text-4xl font-bold flex flex-col items-center">
                  <span className="mb-1">5M+</span>
                  <span className="text-sm font-normal text-text-muted">Campaigns Run</span>
              </div>
          </div>
      </section>

      {/* Features Section - Now more benefit-driven and aggressive */}
      <section id="features" className="bg-primary-dark py-20 px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-text-light">Unleash Your Competitive Advantage</h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Our platform isn't just about data; it's about **actionable intelligence** that puts you ahead of the curve.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Feature 1: SEO Domination */}
          <motion.div 
            // data-aos="fade-up" // AOS example
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="bg-secondary-accent p-8 rounded-xl shadow-lg border border-tertiary-highlight transform hover:scale-105 transition-transform duration-300"
          >
            <div className="text-action-light mb-4 text-4xl">📊</div> {/* Icon */}
            <h3 className="text-2xl font-bold mb-3 text-text-light">SEO Domination Engine</h3>
            <p className="text-text-muted leading-relaxed">
              **Conquer search rankings** with real-time, predictive SEO analytics. Identify high-impact keywords, monitor competitor strategies, and **seize untapped organic traffic** with unparalleled precision.
            </p>
          </motion.div>
          {/* Feature 2: Campaign Command Center */}
          <motion.div 
            // data-aos="fade-up" data-aos-delay="200" // AOS example
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-secondary-accent p-8 rounded-xl shadow-lg border border-tertiary-highlight transform hover:scale-105 transition-transform duration-300"
          >
            <div className="text-action-light mb-4 text-4xl">🚀</div> {/* Icon */}
            <h3 className="text-2xl font-bold mb-3 text-text-light">Unrivaled Campaign Command</h3>
            <p className="text-text-muted leading-relaxed">
              Take **absolute control** of your campaigns. Deploy, manage, and optimize across all channels from a single, intuitive dashboard. Maximize ROI and **outmaneuver your competition** effortlessly.
            </p>
          </motion.div>
          {/* Feature 3: Predictive User Intelligence */}
          <motion.div 
            // data-aos="fade-up" data-aos-delay="400" // AOS example
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-secondary-accent p-8 rounded-xl shadow-lg border border-tertiary-highlight transform hover:scale-105 transition-transform duration-300"
          >
            <div className="text-action-light mb-4 text-4xl">🧠</div> {/* Icon */}
            <h3 className="text-2xl font-bold mb-3 text-text-light">Predictive User Intelligence</h3>
            <p className="text-text-muted leading-relaxed">
              Go beyond basic analytics. Our AI analyzes user behavior to provide **predictive insights**, empowering you to tailor experiences, anticipate trends, and **boost engagement with unprecedented accuracy.**
            </p>
          </motion.div>
        </div>
      </section>

      {/* Call to Action - Aggressive and Urgent */}
      <section className="bg-tertiary-highlight py-20 px-6 md:px-12 text-center text-text-light">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Ready to Redefine Your Marketing Success?</h2>
            <p className="text-xl mb-10 max-w-prose mx-auto">
              The competition isn't waiting. Take control with **the most advanced AI marketing agent** on the market.
            </p>
            <Link to="/login">
              <button className="bg-action-light text-primary-dark font-bold px-10 py-5 rounded-full shadow-xl hover:bg-action-dark hover:text-text-light transform hover:scale-105 transition-all duration-300 ease-in-out text-xl uppercase tracking-wider">
                Claim Your Competitive Edge Now
              </button>
            </Link>
          </motion.div>
      </section>

      {/* Testimonials - Enhanced Trust and Social Proof */}
      <section className="bg-primary-dark py-20 px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-text-light">Hear It From The Victors</h2>
          <p className="text-lg text-text-muted">Real results, real testimonials from leaders like you.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Testimonial 1 */}
          <motion.div
            // data-aos="fade-up" // AOS example
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="bg-secondary-accent p-8 rounded-xl shadow-lg border border-action-dark"
          >
            <p className="mb-6 text-text-light italic text-lg leading-relaxed">
              “Our conversion rates surged by 40% within the first month. This isn't just a tool; it's a **game-changer** that delivers measurable impact. Absolutely indispensable.”
            </p>
            <div className="text-sm font-semibold text-action-light">
              — Amina K., <span className="text-text-muted">Head of Growth, TechSolutions Inc.</span>
            </div>
          </motion.div>
          {/* Testimonial 2 */}
          <motion.div
            // data-aos="fade-up" data-aos-delay="200" // AOS example
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-secondary-accent p-8 rounded-xl shadow-lg border border-action-dark"
          >
            <p className="mb-6 text-text-light italic text-lg leading-relaxed">
              “The depth of SEO insights is unparalleled. We've uncovered opportunities our previous tools completely missed. This platform is truly built for **experts by experts**.”
            </p>
            <div className="text-sm font-semibold text-action-light">
              — James W., <span className="text-text-muted">Lead SEO Strategist, Global Digital</span>
            </div>
          </motion.div>
          {/* Testimonial 3 */}
          <motion.div
            // data-aos="fade-up" data-aos-delay="400" // AOS example
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-secondary-accent p-8 rounded-xl shadow-lg border border-action-dark"
          >
            <p className="mb-6 text-text-light italic text-lg leading-relaxed">
              “Finally, a dashboard that truly understands user psychology. Our engagement metrics are soaring, and our marketing spend is more efficient than ever. **Revolutionary.**”
            </p>
            <div className="text-sm font-semibold text-action-light">
              — Stella M., <span className="text-text-muted">Senior UX/Marketing Analyst, Apex Innovations</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Professional and Informative */}
      <footer className="bg-secondary-accent text-text-muted py-12 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-bold text-text-light mb-2">AI Marketing Agent</h3>
            <p className="text-sm">Empowering your marketing, intelligently.</p>
            <p className="text-sm mt-2">© {new Date().getFullYear()} All rights reserved. Built with precision and passion.</p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-4 text-lg">
            <Link to="#" className="hover:text-action-light transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-action-light transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-action-light transition-colors">Support</Link>
            <Link to="#" className="hover:text-action-light transition-colors">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};