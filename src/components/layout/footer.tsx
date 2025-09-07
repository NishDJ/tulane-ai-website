"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Github,
  Youtube,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
  id?: string;
}

const footerLinks = {
  about: [
    { title: "Overview", href: "/about" },
    { title: "Leadership", href: "/about/leadership" },
    { title: "History", href: "/about/history" },
    { title: "Careers", href: "/about/careers" },
  ],
  academics: [
    { title: "Graduate Programs", href: "/programs/graduate" },
    { title: "Certificates", href: "/programs/certificates" },
    { title: "Continuing Education", href: "/programs/continuing-education" },
    { title: "Admissions", href: "/programs/admissions" },
  ],
  research: [
    { title: "Projects", href: "/research/projects" },
    { title: "Publications", href: "/research/publications" },
    { title: "Datasets", href: "/resources/datasets" },
    { title: "Collaborations", href: "/research/collaborations" },
  ],
  resources: [
    { title: "Software Tools", href: "/resources/tools" },
    { title: "Documentation", href: "/resources/docs" },
    { title: "News & Events", href: "/news" },
    { title: "Contact", href: "/contact" },
  ],
};

const socialLinks = [
  {
    name: "Twitter",
    href: "https://twitter.com/tulaneai",
    icon: Twitter,
    hoverColor: "hover:text-blue-400",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/tulane-ai",
    icon: Linkedin,
    hoverColor: "hover:text-blue-600",
  },
  {
    name: "GitHub",
    href: "https://github.com/tulane-ai",
    icon: Github,
    hoverColor: "hover:text-gray-900 dark:hover:text-gray-100",
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@tulaneai",
    icon: Youtube,
    hoverColor: "hover:text-red-600",
  },
];

const contactInfo = [
  {
    icon: MapPin,
    label: "Address",
    value: "1430 Tulane Ave, New Orleans, LA 70112",
    href: "https://maps.google.com/?q=1430+Tulane+Ave,+New+Orleans,+LA+70112",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "(504) 988-5263",
    href: "tel:+15049885263",
  },
  {
    icon: Mail,
    label: "Email",
    value: "ai@tulane.edu",
    href: "mailto:ai@tulane.edu",
  },
];

export function Footer({ className, id }: FooterProps) {
  const [email, setEmail] = React.useState("");
  const [isSubscribing, setIsSubscribing] = React.useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    
    // Simulate newsletter subscription
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setEmail("");
    setIsSubscribing(false);
    // In a real app, you would handle the actual subscription here
  };

  return (
    <footer 
      id={id}
      className={cn("bg-gray-50 dark:bg-gray-900 border-t", className)}
      role="contentinfo"
    >
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-6">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="flex items-center space-x-3 transition-transform duration-200 hover:scale-105"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-tulane-green text-white font-bold text-lg">
                T
              </div>
              <div>
                <div className="text-lg font-bold text-tulane-green">
                  Tulane.ai
                </div>
                <div className="text-sm text-muted-foreground">
                  AI & Data Science Division
                </div>
              </div>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Advancing medical research through artificial intelligence and data
              science at Tulane University School of Medicine.
            </p>
            
            {/* Social Links */}
            <div className="mt-6 flex space-x-4" role="list" aria-label="Social media links">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-muted-foreground transition-colors duration-200 hover:bg-tulane-green hover:text-white focus-visible:ring-enhanced touch-manipulation",
                      social.hoverColor
                    )}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`Follow us on ${social.name} (opens in new tab)`}
                    role="listitem"
                  >
                    <Icon className="h-5 w-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Links Sections */}
          <nav className="lg:col-span-3" aria-label="Footer navigation">
            <div className="grid grid-cols-2 gap-6 sm:gap-8 sm:grid-cols-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">About</h3>
                <ul className="mt-4 space-y-2">
                  {footerLinks.about.map((link) => (
                    <li key={link.title}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-tulane-green transition-colors duration-200 focus-visible:ring-enhanced"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground">Academics</h3>
                <ul className="mt-4 space-y-2">
                  {footerLinks.academics.map((link) => (
                    <li key={link.title}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-tulane-green transition-colors duration-200 focus-visible:ring-enhanced"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground">Research</h3>
                <ul className="mt-4 space-y-2">
                  {footerLinks.research.map((link) => (
                    <li key={link.title}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-tulane-green transition-colors duration-200 focus-visible:ring-enhanced"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground">Resources</h3>
                <ul className="mt-4 space-y-2">
                  {footerLinks.resources.map((link) => (
                    <li key={link.title}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-tulane-green transition-colors duration-200 focus-visible:ring-enhanced"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </nav>

          {/* Contact & Newsletter */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold text-foreground">Contact</h3>
            <div className="mt-4 space-y-3">
              {contactInfo.map((contact) => {
                const Icon = contact.icon;
                return (
                  <a
                    key={contact.label}
                    href={contact.href}
                    className="flex items-start space-x-2 text-sm text-muted-foreground hover:text-tulane-green transition-colors duration-200 group"
                    target={contact.href.startsWith("http") ? "_blank" : undefined}
                    rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span className="group-hover:underline">{contact.value}</span>
                    {contact.href.startsWith("http") && (
                      <ExternalLink className="h-3 w-3 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </a>
                );
              })}
            </div>

            {/* Newsletter Signup */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-foreground">Newsletter</h4>
              <form onSubmit={handleNewsletterSubmit} className="mt-2">
                <div className="flex flex-col space-y-2">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address for newsletter
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-tulane-green focus:border-transparent"
                    aria-describedby="newsletter-description"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubscribing}
                    className="w-full focus-visible:ring-enhanced"
                    aria-describedby="newsletter-description"
                  >
                    {isSubscribing ? "Subscribing..." : "Subscribe"}
                  </Button>
                  <p id="newsletter-description" className="sr-only">
                    Subscribe to receive updates about AI and Data Science Division news and events
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
            <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Tulane University School of Medicine.
                All rights reserved.
              </p>
            </div>
            <nav className="flex items-center space-x-4" aria-label="Legal and accessibility links">
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-tulane-green transition-colors duration-200 focus-visible:ring-enhanced"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-tulane-green transition-colors duration-200 focus-visible:ring-enhanced"
              >
                Terms of Use
              </Link>
              <Link
                href="/accessibility"
                className="text-sm text-muted-foreground hover:text-tulane-green transition-colors duration-200 focus-visible:ring-enhanced"
              >
                Accessibility
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}