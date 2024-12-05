import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaInstagram } from 'react-icons/fa';
import './Footer.css';  // Import the CSS file

const Footer = () => {
  return (
    <div className="footer-container">
      {/* © 2024 Fardin Abdulla */}
      <div style={{ fontWeight: 300 }}>
        <p style={{ margin: 0, fontWeight: 500 }}>© 2024 Fardin Abdulla</p>
      </div>

      {/* Social media icons */}
      <div className="social-icons">
        <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
          <FaGithub size={24} color="#e0dfe3" />
        </a>
        <a href="https://www.linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">
          <FaLinkedin size={24} color="#e0dfe3" />
        </a>
        <a href="mailto:your.email@example.com">
          <FaEnvelope size={24} color="#e0dfe3" />
        </a>
        <a href="https://www.instagram.com/yourusername" target="_blank" rel="noopener noreferrer">
          <FaInstagram size={24} color="#e0dfe3" />
        </a>
      </div>
    </div>
  );
};

export default Footer;
