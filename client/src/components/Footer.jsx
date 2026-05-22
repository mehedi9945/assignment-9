import { Link } from 'react-router-dom';
import { PawPrint, Mail, Phone, MapPin } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-base-300 text-base-content border-t border-base-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div className="space-y-4 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <div className="p-2 bg-primary/10 rounded-xl">
              <PawPrint className="h-6 w-6 text-primary" />
            </div>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FurEver Home
            </span>
          </Link>
          <p className="text-sm text-base-content/70 leading-relaxed">
            Connecting loving families with pets in need of a forever home. Adopt, care, and share the love.
          </p>
          <div className="flex gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-circle btn-sm text-primary hover:bg-primary/10">
              <FaFacebook className="h-5 w-5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-circle btn-sm text-primary hover:bg-primary/10">
              <FaTwitter className="h-5 w-5" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-circle btn-sm text-primary hover:bg-primary/10">
              <FaInstagram className="h-5 w-5" />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-circle btn-sm text-primary hover:bg-primary/10">
              <FaGithub className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-lg mb-4 text-base-content">Quick Links</h3>
          <ul className="space-y-2 text-sm text-base-content/70">
            <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li><Link to="/all-pets" className="hover:text-primary transition-colors">Browse Pets</Link></li>
            <li><Link to="/dashboard/my-requests" className="hover:text-primary transition-colors">My Requests</Link></li>
            <li><Link to="/dashboard/add-pet" className="hover:text-primary transition-colors">Add Pet</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="font-semibold text-lg mb-4 text-base-content">Resources</h3>
          <ul className="space-y-2 text-sm text-base-content/70">
            <li><a href="#why-adopt" className="hover:text-primary transition-colors">Why Adopt?</a></li>
            <li><a href="#care-tips" className="hover:text-primary transition-colors">Pet Care Tips</a></li>
            <li><a href="#success-stories" className="hover:text-primary transition-colors">Success Stories</a></li>
            <li><a href="#timeline" className="hover:text-primary transition-colors">Adoption Process</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg mb-4 text-base-content">Get In Touch</h3>
          <div className="flex items-center gap-3 text-sm text-base-content/70">
            <MapPin className="h-4 w-4 text-primary shrink-0" />
            <span>123 Companion Way, Suite 400, Petville</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-base-content/70">
            <Phone className="h-4 w-4 text-primary shrink-0" />
            <span>+1 (555) 234-5678</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-base-content/70">
            <Mail className="h-4 w-4 text-primary shrink-0" />
            <span>support@fureverhome.org</span>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-base-200 py-6 text-center text-sm text-base-content/60 bg-base-300/50">
        <p>© {new Date().getFullYear()} FurEver Home. All rights reserved. Designed for Recruiter Review.</p>
      </div>
    </footer>
  );
};

export default Footer;
