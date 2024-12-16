
// D:\Fall 24\my website\personalweb\frontend\src\components\cards\navbar-card.tsx
import Link from "next/link";
import { usePathname } from 'next/navigation';  // Import usePathname to detect current route

const NavBarCard = () => {
  const pathname = usePathname();  // Get the current path

  return (
    <div className="navbar-container">
      <div className="navbar flex justify-end items-center px-6 py-4">
        <button className={`nav-button ${pathname === '/' ? 'active' : ''}`}>
          <Link href="/">Home</Link> {/* Home Button */}
        </button>
        <button className={`nav-button ${pathname === '/projects' ? 'active' : ''}`}>
          <Link href="/projects">Projects</Link> {/* Projects Button */}
        </button>
        {/* <button className={`nav-button ${pathname === '/blog' ? 'active' : ''}`}>
          <Link href="/blog">Blog</Link> 
        </button> */}
      </div>
      <style jsx>{`
        .navbar-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 999;  /* Ensure the navbar is on top */
          background: rgba(3, 4, 3, 0.9); /* Slightly opaque white background */
          box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3); /* Optional shadow */
        }
        .navbar {
          display: flex;
          justify-content: flex-end; /* Align the buttons to the right */
          align-items: center;
          padding: 12px 320px; /* nav button positioninggg */
          
        }
        .nav-button {
          position: relative;
          padding: 10px 20px;
          font-size: 16px;
          font-weight: bold;
          color: #fff;
          background: transparent;
          border: none;
          cursor: pointer;
          border-radius: 4px;
          transition: color 0.3s ease, border-bottom 0.3s ease;
          margin-left: 16px; /* Add space between the buttons */
        }
        .nav-button.active {
          color: #fff; /* Blue color for active link */
        }
        .nav-button.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: #fff; /* Blue line under the active button */
        }
        .nav-button:hover {
          background: #444;
        }
      `}</style>
    </div>
  );
};

export default NavBarCard;

