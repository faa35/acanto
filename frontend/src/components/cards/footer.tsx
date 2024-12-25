import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaInstagram } from 'react-icons/fa';
import './Footer.css'; // Import the CSS file

const Footer = () => {
  return (
    <div className="footer-container">
      {/* Footer Text */}
      <div className="footer-text">
        <p>© 2025 Fardin Abdulla</p>
      </div>

      {/* Social media icons */}
      <div className="social-icons">
        <a href="https://github.com/faa35" target="_blank" rel="noopener noreferrer">
          <FaGithub size={24} className="icon" />
        </a>
        <a href="https://www.linkedin.com/in/fardin-abdulla-acanto-401b6532b/" target="_blank" rel="noopener noreferrer">
          <FaLinkedin size={24} className="icon" />
        </a>
        <a href="mailto:abdullafardin2202@gmail.com">
          <FaEnvelope size={24} className="icon" />
        </a>
        <a href="https://www.instagram.com/acanto_abdulla/" target="_blank" rel="noopener noreferrer">
          <FaInstagram size={24} className="icon" />
        </a>
      </div>
    </div>
  );
};

export default Footer;
