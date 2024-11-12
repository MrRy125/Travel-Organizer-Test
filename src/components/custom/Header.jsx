// import React from 'react'

import { Button } from "../ui/button"

const Header = () => {
    return (
      <div className="sticky top-0 z-50 bg-fff/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <a href="/">
            <img src="/logo.svg" alt="JournAI Logo" className="h-12 text-[#4DA8DA]"/></a>
          </div>
          <div className="flex items-center gap-6">
            {/* <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-600 hover:text-[#4DA8DA] transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-[#4DA8DA] transition-colors">How it Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-[#4DA8DA] transition-colors">Pricing</a>
            </nav>
            <Button variant="outline" className="mr-2">Log In</Button> */}
            <Button>Sign Up</Button>
          </div>
        </div>
      </div>
    );
  };  

export default Header