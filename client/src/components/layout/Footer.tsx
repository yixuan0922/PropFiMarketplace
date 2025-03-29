import React from 'react';
import { Link } from 'wouter';
import { Facebook, Twitter, Instagram, Linkedin, Home, DollarSign, Users, MessageSquare, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <svg
                className="h-8 w-auto text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
                <path d="M5 8a10 10 0 0 1 14 0" />
              </svg>
              <span className="ml-2 text-xl font-semibold text-white">PropFi</span>
            </div>
            <p className="text-neutral-400 text-sm">
              A marketplace for fractional property ownership, connecting homebuyers and investors.
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white">
                <Facebook size={18} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <Twitter size={18} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <Instagram size={18} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <Linkedin size={18} />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">For Homebuyers</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/how-it-works" className="text-neutral-400 hover:text-white text-sm">How It Works</Link>
              </li>
              <li>
                <Link href="/marketplace" className="text-neutral-400 hover:text-white text-sm">Browse Properties</Link>
              </li>
              <li>
                <Link href="/calculator" className="text-neutral-400 hover:text-white text-sm">Mortgage Calculator</Link>
              </li>
              <li>
                <Link href="/ownership-guide" className="text-neutral-400 hover:text-white text-sm">Ownership Guide</Link>
              </li>
              <li>
                <Link href="/testimonials" className="text-neutral-400 hover:text-white text-sm">Testimonials</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">For Investors</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/invest" className="text-neutral-400 hover:text-white text-sm">Investment Opportunities</Link>
              </li>
              <li>
                <Link href="/invest/calculator" className="text-neutral-400 hover:text-white text-sm">Returns Calculator</Link>
              </li>
              <li>
                <Link href="/token-guide" className="text-neutral-400 hover:text-white text-sm">Property Token Guide</Link>
              </li>
              <li>
                <Link href="/risk" className="text-neutral-400 hover:text-white text-sm">Risk Assessment</Link>
              </li>
              <li>
                <Link href="/success-stories" className="text-neutral-400 hover:text-white text-sm">Success Stories</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-neutral-400 hover:text-white text-sm">About Us</Link>
              </li>
              <li>
                <Link href="/careers" className="text-neutral-400 hover:text-white text-sm">Careers</Link>
              </li>
              <li>
                <Link href="/press" className="text-neutral-400 hover:text-white text-sm">Press</Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-400 hover:text-white text-sm">Contact</Link>
              </li>
              <li>
                <Link href="/legal" className="text-neutral-400 hover:text-white text-sm">Legal & Privacy</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-400 text-sm">© 2023 PropFi. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <Link href="/terms" className="text-neutral-400 hover:text-white text-sm">Terms of Service</Link>
            <Link href="/privacy" className="text-neutral-400 hover:text-white text-sm">Privacy Policy</Link>
            <Link href="/cookies" className="text-neutral-400 hover:text-white text-sm">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
