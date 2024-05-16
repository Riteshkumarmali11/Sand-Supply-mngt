import React, { useState } from 'react';
import Workspace from './Workspace';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndustry } from '@fortawesome/free-solid-svg-icons';
import '../static/page.css';
import SalesmanWorkspace from './SalesmanWorkspace';
//import GoogleTranslateWidget from './GoogleTranslateWidget';

const SalesmanNavbar = () => {
    const [open, setOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleMenuClick = (index) => {
        setActiveMenu(activeMenu === index ? null : index);
    };

    const links = [
        {
            name: 'Registration',
            submenu: [
                { name: 'Site Master', link: '/siteregister' },
            ]
        },
        {
            name: 'Services',
            submenu: [
                { name: 'Salesman Quotation', link: '/salesquote' }
            ]
        },
    ];


    return (
        <>
            <nav className='shadow-md w-full fixed top-0 left-0 botom'>
                <div className='md:flex items-center justify-between bg-gray-200 py-4 md:px-10 px-7'>
                    <div className='font-bold text-2xl cursor-pointer flex items-center font-[Poppins] text-gray-800'>
                        <span className='text-3xl text-indigo-600 mr-1 pt-2'>
                            <FontAwesomeIcon icon={faIndustry} style={{ color: 'brown' }} />
                        </span>
                        CCBM
                    </div>

                    <div
                        onClick={() => setOpen(!open)}
                        className='text-3xl absolute right-8 top-6 cursor-pointer md:hidden'
                    >
                        <ion-icon name={open ? 'close' : 'menu'}></ion-icon>
                    </div>

                    <ul
                        className={`md:flex mr-5 md:items-center md:pb-0 pb-12 absolute md:static bg-gray md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${open ? 'top-20' : 'top-[-490px]'
                            }`}
                    >
                        {links.map((link, index) => (
                            <li key={link.name} className='md:ml-8 text-xl md:my-0 my-7 relative'>
                                <div
                                    onClick={() => handleMenuClick(index)}
                                    className={`cursor-pointer text-gray-800 duration-500 ${activeMenu === index ? 'font-bold' : ''}`}
                                >
                                    {link.name}
                                </div>
                                {activeMenu === index && (
                                    <ul className='mt-2 space-y-2 bg-gray-200 shadow-md w-[max-content] absolute left-0'>
                                        {link.submenu.map((item, subIndex) => (
                                            <li key={item.name}>
                                                <Link
                                                    to={item.link}
                                                    className='block px-4 py-2 text-gray-800'
                                                >
                                                    {item.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}

                        <div className="dropdown1">
                            <button
                                className="btn btn-warning ml-5"
                                onClick={() => setDropdownOpen(!isDropdownOpen)}
                            >
                                {username ? (
                                    <span>{username}</span>
                                ) : null}
                                <span className="arrow-icon ">&#9660;</span>
                            </button>
                            {isDropdownOpen && (
                                <div className="dropdown-content1 mt-2">
                                    <button onClick={handleLogout}>Logout</button>
                                </div>
                            )}
                        </div>

                    </ul>
                </div>
            </nav>
            <SalesmanWorkspace/>
        </>
    );
};

export default SalesmanNavbar;
