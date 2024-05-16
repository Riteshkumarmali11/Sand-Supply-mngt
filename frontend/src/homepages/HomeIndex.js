import React, { useState } from "react";
import "../static/Homepage.css";
import Home from "./Home";
import Products from "./Products";

function HomeIndex() {
    const [active, setActive] = useState("nav__menu");
    const [icon, setIcon] = useState("nav__toggler");
    const [signInDropdown, setSignInDropdown] = useState(false);

    const navToggle = () => {
        setActive(active === "nav__menu" ? "nav__menu nav__active" : "nav__menu");
        setIcon(icon === "nav__toggler" ? "nav__toggler toggle" : "nav__toggler");
    };

    const toggleSignInDropdown = () => {
        setSignInDropdown(!signInDropdown);
    };

    return (
        <>
            <nav className="nav">
                <a href="#" className="nav__brand" style={{ fontSize: '30px', animation: 'moveLeftRight 2s infinite' }}>
                    Mahalaxmi Resalers
                </a>
                <ul className={active}>
                    <li className="nav__item">
                        <a href="#" className="nav__link">
                            Home
                        </a>
                    </li>
                   
                    <li className="nav__item dropdown">
                        <button onClick={toggleSignInDropdown} className="nav__link">
                            Sign In
                        </button>
                        {signInDropdown && (
                            <div className="dropdown-content">
                                {/* Your sign-in dropdown content goes here */}
                                <ul>
                                    <li><a href="/login">Admin</a></li>
                                    <li><a href="/salesmanLogin">Salesman</a></li>
                                    <li><a href="/driverLogin">Driver</a></li>
                                </ul>
                            </div>
                        )}
                    </li>
                </ul>
                <div onClick={navToggle} className={icon}>
                    <div className="line1"></div>
                    <div className="line2"></div>
                    <div className="line3"></div>
                </div>
            </nav>
            <Home />

            {/* Our Products */}
            <Products />

            <div className="mt-20" style={{ textAlign: 'center', fontSize: '30px', fontWeight: 'bolder' }}>Contact Us For More Details</div>

            <div class="more-info reservation-info mt-20">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-4 col-sm-10">
                            <div class="info-item">
                                <i class="fa fa-phone"></i>
                                <h4>Make a Phone Call</h4>
                                <a href="#">+91 8788935767</a>
                            </div>
                        </div>
                        <div class="col-lg-4 col-sm-10">
                            <div class="info-item">
                                <i class="fa fa-envelope"></i>
                                <h4>Contact Us via Email</h4>
                                <a href="#">mahalaxmiresalers@gmail.com</a>
                            </div>
                        </div>
                        <div class="col-lg-4 col-sm-10">
                            <div class="info-item">
                                <i class="fa fa-map-marker"></i>
                                <h4>Visit Our Offices</h4>
                                <a href="#">Grand Signet Building,Rajaram Rd,kolhapur,Maharashtra,416122</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="reservation-form">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-12">
                            <div id="map">
                                <iframe src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d122289.6529310486!2d74.16447350709107!3d16.69930452425167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x3bc101badc15aaef%3A0x591f1c80e625a127!2sMAHALAXMI%20RESALERS%20Upper%20Ground%20Floor%2C%20Grand%20Signet%20Building%2C%20Rajaram%20Rd%2C%20Kolhapur%20416008%2C%20kolhapur%2C%20Maharashtra%2C%20416122!3m2!1d16.6991564!2d74.2468768!5e0!3m2!1sen!2sin!4v1710848932341!5m2!1sen!2sin" width="100%" height="450px" frameborder="0"
                                    style={{ border: '0' }} allowfullscreen=""></iframe>
                            </div>
                        </div>
                        <div class="col-lg-12">
                            
                        </div>
                    </div>
                </div>
            </div>

            <footer>
                <div class="container">
                    <div class="row">
                        <div class="col-lg-12">
                            <p>Copyright © 2024 <a href="contact.html">Supply Chain Building Material</a> Company. All rights reserved.
                                <br></br> Design By :
                                {/* <img src="assets/images/ccc.png" alt="" class="footerimg" /> */}
                               <span> <a href="">CompCare Technology kolhapur</a></span>
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default HomeIndex;
