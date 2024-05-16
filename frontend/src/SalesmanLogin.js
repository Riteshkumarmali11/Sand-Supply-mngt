import './static/Login.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

const SalesmanLogin = () => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(true); // State for managing loading skeleton
    const [mobile, setMobile] = useState('');
    const [error, setError] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false); // Switch from loading skeleton to login form after 5 seconds
        }, 1000); // 5000 milliseconds = 5 seconds

        return () => clearTimeout(timer);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true when login starts
        try {
            const response = await axios.post('http://localhost:5000/salesmanLogin', { mobile, password });
            const { token, username } = response.data;
            toast.success("Login Successfully");
            console.log("response", response);
            localStorage.setItem('token', token);
            localStorage.setItem('username',username);
           localStorage.setItem('mobile',mobile);
            navigate('/salesmanNavbar')
        } catch (error) {
            console.log("error");
            console.error('Login error:', error.response.data.message);
            toast.error("Login Failed");
            setError('Invalid username or password');
        } finally {
            setLoading(false); // Set loading to false after login attempt (whether success or failure)
        }
    };
    return (
        <div>
            <div className="bg-cover bg-center bg-fixed bg-gray-200">
                <ToastContainer />
                {loading ? (
                    <div className="h-screen flex justify-center items-center">
                        <div className="spinner-container">
                            <div className="spinner"></div>
                        </div>
                    </div>
                ) : (
                    <div className="h-screen flex justify-center items-center">
                        <div className="bg-white mx-4 p-8 rounded-4 shadow-md w-full md:w-1/2 lg:w-1/3">
                            <h1 className="text-3xl font-bold mb-8 text-center">Salesman Login</h1>
                            <div>
                                
                                <div className="mb-4">
                                    <div className='input-icon'>
                                        <input type="text" name='mobile' value={mobile} onChange={(e) => setMobile(e.target.value)}
                                            className="back shadow-md rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            placeholder="Enter Mobile No."
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mb-4 relative">
                                    <div className="input-icon">
                                        <input
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="back shadow-md rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pl-10 pr-10"
                                            placeholder="Enter your password"
                                            required />
                                        <FontAwesomeIcon
                                            icon={showPassword ? faEye : faEyeSlash}
                                            className="eye-icon mb-3"
                                            onClick={() => setShowPassword(!showPassword)} />
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <button type="submit" onClick={handleLogin}
                                        className="bg-blue-500 d-grid gap-2 col-6 mx-auto hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                        Login
                                    </button>
                                </div>
                                <div className='row'>
                                    <div className='column '>
                                        Forgot  &nbsp;
                                        <a href="/construction" className="text-blue-600 hover:text-red-800 right-2 pass ">
                                            Password..?
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalesmanLogin;
