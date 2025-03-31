import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { HiMenu, HiX } from "react-icons/hi";

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className='relative bg-white shadow-sm'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between items-center h-16'>
                    {/* Logo */}
                    <div className='flex-shrink-0'>
                        <Link to='/'>
                            <img
                                src="src/assets/health_icon.png" alt="logo"
                                className='w-10 h-10 cursor-pointer transition-all duration-200 hover:scale-105'
                            />
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className='hidden md:flex md:items-center md:space-x-8'>
                        <Link to='/dashboard' className='text-gray-700 hover:text-indigo-600 transition-colors duration-200'>
                            Dashboard
                        </Link>
                        <Link to='/nutrition' className='text-gray-700 hover:text-indigo-600 transition-colors duration-200'>
                            Nutrition
                        </Link>
                        <Link to='/exercise' className='text-gray-700 hover:text-indigo-600 transition-colors duration-200'>
                            Exercise
                        </Link>
                        <Link to='/sleep' className='text-gray-700 hover:text-indigo-600 transition-colors duration-200'>
                            Sleep
                        </Link>
                        <Link to='/reports' className='text-gray-700 hover:text-indigo-600 transition-colors duration-200'>
                            Reports
                        </Link>
                    </div>

                    {/* Profile Icon */}
                    <div className='flex items-center'>
                        <Link to='/login'>
                            <CgProfile className='w-8 h-8 cursor-pointer text-gray-700 transition-all duration-200 hover:scale-105 hover:text-indigo-600'/>
                        </Link>
                        {/* Mobile menu button */}
                        <button 
                            onClick={() => setIsOpen(!isOpen)}
                            className='md:hidden ml-2 p-2'
                        >
                            {isOpen ? (
                                <HiX className='h-6 w-6 text-gray-700'/>
                            ) : (
                                <HiMenu className='h-6 w-6 text-gray-700'/>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className='md:hidden'>
                    <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg'>
                        <Link to='/dashboard' className='block px-3 py-2 text-gray-700 hover:text-indigo-600 transition-colors duration-200'>
                            Dashboard
                        </Link>
                        <Link to='/nutrition' className='block px-3 py-2 text-gray-700 hover:text-indigo-600 transition-colors duration-200'>
                            Nutrition
                        </Link>
                        <Link to='/exercise' className='block px-3 py-2 text-gray-700 hover:text-indigo-600 transition-colors duration-200'>
                            Exercise
                        </Link>
                        <Link to='/sleep' className='block px-3 py-2 text-gray-700 hover:text-indigo-600 transition-colors duration-200'>
                            Sleep
                        </Link>
                        <Link to='/reports' className='block px-3 py-2 text-gray-700 hover:text-indigo-600 transition-colors duration-200'>
                            Reports
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default NavBar