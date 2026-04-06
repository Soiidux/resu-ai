import React from "react";
import { Link } from "react-router";
import { usePuterStore } from "~/lib/puter";
export default function Navbar() {
  const { auth } = usePuterStore();
  return (
    <nav className="navbar">
      <Link to="/">
        <p className="text-2xl font-bold text-gradient">ResuAI</p>
      </Link>
      <div className="flex flex-row gap-2">
        <Link to="/upload" className="primary-button w-fit">
          Upload Resume
        </Link>
        <button className="primary-button w-fit" onClick={async (e) => { e.preventDefault(); await auth.signOut(); }}>
          Logout
        </button>
      </div>
    </nav>
  );
}
