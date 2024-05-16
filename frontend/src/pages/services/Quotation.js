import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import '../registrations/registration.css'
import axios from 'axios';
import Navbar from '../../component/Navbar';
import { Link, useParams } from 'react-router-dom';
import Layout from '../../component/Layout';

const Quotation = () => {

    //const [supply, setSupply] = useState([]);
    const [error, setError] = useState(null); // Initialize error state as null
    const { id } = useParams();
    const [registrations, setRegistrations] = useState([]);
    const [admindata, setAdminData] = useState([]);
    const username = localStorage.getItem('username');
    const mobile = localStorage.getItem('mobile');

    const handlePrintPDF = () => {
        const invoiceBox = document.getElementById('invoice-box');

        html2canvas(invoiceBox).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save('invoice.pdf');
        });
    };

    useEffect(() => {
        fetchData();
        fetchAdmin();
    }, [id]);

    const fetchData = async () => {
        try {
            if (!id) return;
            const response = await axios.get(`http://localhost:5000/getBuilderAvailable/${id}`);
            const { success, data } = response.data;
            if (success) {
                setRegistrations(data);
                console.log("Quotation", data);
            } else {
                throw new Error('Backend response indicates failure');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchAdmin = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/admin`);
            const { success, data } = response.data;
            if (success) {
                if (Array.isArray(data) && data.length > 0) {
                    setAdminData(data[0]); // Accessing the first item in the array
                    console.log("Admin Data", data[0]);
                } else {
                    throw new Error('Admin data is not in the expected format');
                }
            } else {
                throw new Error('Backend response indicates failure');
            }
        } catch (error) {
            console.error('Error fetching admin data:', error);
            setError(error.message);
        }
    };

    return (
        <>
            <Navbar />
            <Layout>
                <div className='text-center'>
                    <Link className='btn btn-secondary' onClick={handlePrintPDF}>
                        Print as PDF
                    </Link>
                </div>
                <div className='invoice-container'>
                    <div className="invoice-box" id="invoice-box">
                        <table cellpadding="0" cellspacing="0">
                            <tbody>
                                <tr class="top">
                                    <td colspan="4">
                                        <div className="top">
                                            <div className="title">
                                                <img src="/mahalaxmi.jpeg" alt="Logo" />
                                            </div>
                                            <div className="company-info">
                                                <h1> {admindata.companyname} </h1>
                                                <h5>
                                                    {admindata.companyaddress}<br />
                                                    Mobile: {admindata.mobile} <br />
                                                    GSTIN: {admindata.gstno}<br />
                                                    Email: {admindata.email}
                                                </h5>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td><h2> Quotation Form</h2></td><td></td><td></td>
                                </tr>
                                <tr class="information">
                                    <td>QuotationNo #: {registrations.quotation}</td>
                                    <td>Date: {new Date().toDateString()}</td>
                                    <td>Time: {new Date().toLocaleTimeString()}</td>
                                </tr>
                                <tr><td></td></tr>
                                <tr><td></td></tr>
                                <tr class="heading">
                                    <td>Cutomer Details</td>
                                    <td></td>
                                    <td>Site Contact Person</td>
                                </tr>
                                <tr class="information">
                                    <td>
                                        Site Name:{registrations.sitename} <br />
                                        Builder Name: {registrations.buildername} <br />
                                        Address: {registrations.siteaddress} <br />
                                        Contact No: +91 {registrations.mobile} <br />
                                    </td>
                                    <td> </td>
                                    <td>
                                        Name:Mr. {username}<br />
                                        Contact No: +91 {mobile}<br />
                                    </td>
                                </tr>
                                <tr><td></td></tr>
                                <tr><td></td></tr>
                                <tr class="heading">
                                    <td>Our Site Visitor(Salesman)</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>
                                        Name:Mr.{registrations.supervisorname}<br />
                                        Mobile No:{registrations.supervisormobile}<br />
                                    </td>
                                </tr>
                                <tr class="heading">
                                    <td>Product</td>
                                    <td>Quantity</td>
                                    <td>Price</td>
                                </tr>
                                {/* Map over the products and render each product's details */}
                                {registrations.products && registrations.products.map((product, index) => (
                                    <tr key={index} className="item">
                                        <td>{product.product_name}</td>
                                        <td>{product.quantity}</td>
                                        <td>{product.price}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Terms &amp; Condition:</td>
                                </tr>
                                <tr>
                                    <td>
                                        1.Above Price is <br />
                                        2.GST  <br />
                                        3.Payment Terms<br />
                                    </td>
                                    <td>: Delliverd at your location.<br />
                                        : 5%.<br />
                                        : Immediate.<br />
                                    </td>
                                </tr>
                                <tr><td></td></tr>
                                <tr><td></td></tr>
                                <tr>
                                    <td>Thanking You.And looking forword for receiving your valuable Order.</td>
                                </tr>
                                <tr><td></td></tr>
                                <tr><td></td></tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        <img src="/Digital_Sign.png" width="200px" height="150px" />
                                    </td>
                                    <td>
                                        Yours Faithfully,<br />
                                        {admindata.companyname},<br />
                                        {admindata.ownername}<br />
                                        Mob. No.+91 {admindata.mobile}/<br />
                                        +91 8788935767.<br />
                                        {admindata.email}<br />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                {error && <div>Error: {error}</div>} {/* Display error if present */}
            </Layout>
        </>
    );
};

export default Quotation;



