import Link from "next/link";
import { usePathname } from "next/navigation";

const NavBarCard = () => {
  const pathname = usePathname();

  return (
    <div className="navbar-container">
      <div className="navbar flex justify-end items-center px-6 py-4">
        <button className={`nav-button ${pathname === "/" ? "active" : ""}`}>
          <Link href="/">Home</Link>
        </button>
        <button className={`nav-button ${pathname === "/projects" ? "active" : ""}`}>
          <Link href="/projects">Projects</Link>
        </button>
      </div>
      <style jsx>{`
        .navbar-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 999;
          backdrop-filter: blur(100px);
          -webkit-backdrop-filter: blur(100px);
          box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
        }
        .navbar {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding: 12px 320px;
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
          transition: color 0.3s ease;
          margin-left: 16px;
        }
        .nav-button.active {
          color: #fff;
        }
        .nav-button.active::after {
          content: "";
          position: absolute;
          bottom: -4px; /* Slightly lower for distinction */
          left: 0;
          width: 100%; /* Full width */
          height: 4px; /* Wider line for active state */
          background-color: #fff;
        }
        .nav-button::after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background-color: #fff;
          transition: width 0.3s ease, height 0.3s ease;
        }
        .nav-button:hover::after {
          width: 100%;
          height: 2px; /* Hover line remains thinner */
        }
      `}</style>
    </div>
  );
};

export default NavBarCard;
