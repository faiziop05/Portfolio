import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaCopy,
  FaPaperPlane,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { usePortfolio } from "../Context/PortfolioContext";

const Contact = () => {
  const { profile } = usePortfolio();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactEmail = profile?.email || "faizanhanif577@gmail.com";
  const contactGithub = profile?.github || "https://github.com/faiziop05";
  const contactLinkedin = profile?.linkedin || "https://linkedin.com/in/faizanhanif";
  const contactLocation = profile?.location || "Worldwide / Remote";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contactEmail);
    toast.success("Email address copied to clipboard!");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const mailtoUrl = `mailto:${contactEmail}?subject=${encodeURIComponent(
        formData.subject || `Inquiry from ${formData.name}`
      )}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      )}`;
      window.location.href = mailtoUrl;
      toast.success("Redirecting to your mail client...");
    }, 400);
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 max-w-5xl space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-indigo-300 text-xs font-mono font-semibold uppercase tracking-wider">
          Contact & Inquiries
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Let&apos;s Connect
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Have an engineering opening, consulting project, or system architecture question? My inbox is always open.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Contact Cards & Info */}
        <div className="lg:col-span-5 space-y-4">
          {/* Quick 1-Click Copy Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase text-slate-400">
                Primary Email
              </span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Active
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <FaEnvelope className="text-indigo-400 flex-shrink-0 text-sm" />
                <span className="font-mono text-xs sm:text-sm text-white truncate">
                  {contactEmail}
                </span>
              </div>
              <button
                onClick={handleCopyEmail}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all ml-2 flex-shrink-0 cursor-pointer"
                title="Copy Email"
              >
                <FaCopy className="text-xs" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-400 font-mono">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <FaClock className="text-indigo-400 text-xs" /> Response Time
                </div>
                <div className="text-emerald-400 font-semibold">Within 24 Hours</div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <FaMapMarkerAlt className="text-rose-400 text-xs" /> Location
                </div>
                <div className="text-white font-semibold truncate">{contactLocation}</div>
              </div>
            </div>
          </div>

          {/* Social Profiles Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-mono font-semibold uppercase text-slate-400">
              Profiles & Networks
            </h3>

            <div className="space-y-2">
              <a
                href={contactGithub}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition-all text-xs group"
              >
                <div className="flex items-center gap-3">
                  <FaGithub className="text-base text-white group-hover:scale-105 transition-transform" />
                  <div>
                    <div className="font-semibold text-white">GitHub</div>
                    <div className="text-[11px] text-slate-400">Open Source & Repositories</div>
                  </div>
                </div>
                <span className="text-indigo-400 font-mono text-[11px]">Visit ➔</span>
              </a>

              <a
                href={contactLinkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition-all text-xs group"
              >
                <div className="flex items-center gap-3">
                  <FaLinkedin className="text-base text-blue-400 group-hover:scale-105 transition-transform" />
                  <div>
                    <div className="font-semibold text-white">LinkedIn</div>
                    <div className="text-[11px] text-slate-400">Professional Experience</div>
                  </div>
                </div>
                <span className="text-indigo-400 font-mono text-[11px]">Connect ➔</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl"
        >
          <div className="border-b border-slate-800 pb-4 mb-6">
            <h2 className="text-xl font-bold text-white">Send a Message</h2>
            <p className="text-xs text-slate-400 mt-1">
              Have a project, job inquiry, or question? Leave your message below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Alex Mercer"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="alex@company.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. Full-Stack Engineering Role / Project Inquiry"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                placeholder="Describe your requirements, role, or message..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none font-sans leading-relaxed"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              <FaPaperPlane className="text-xs" />
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;

