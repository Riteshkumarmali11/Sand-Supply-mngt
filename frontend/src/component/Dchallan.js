import './DC.css';
import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Layout from './Layout';
import DriverNavbar from './DriverNavbar';

const Dchallan = () => {
    const [error, setError] = useState(null);
    const { id } = useParams();
    const [registrations, setRegistrations] = useState([]);
    const [admindata, setAdminData] = useState([]);
    const [loading, setLoading] = useState();

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

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/getSales/${id}`);
            const { success, data } = response.data;
            if (success) {
                setRegistrations(data);
                console.log("Data", data);
            } else {
                throw new Error('Backend response indicates failure');
            }
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

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

    const calculateTotals = () => {
        let totalQuantity = 0;
        let totalTAmount = 0;
        let totalGSTAmount = 0;
        let totalPrice = 0;
        let cgst = 0;
        let sgst = 0;
        let taxableamt = 0;

        if (registrations.products) {
            registrations.products.forEach((product) => {
                totalQuantity += parseFloat(product.quantity);
                totalTAmount += parseFloat(product.totalAmountWithGST);
                totalGSTAmount += parseFloat(product.gstAmount);
                totalPrice += parseFloat(product.price);
            });
        }
        taxableamt = totalTAmount - totalGSTAmount;
        cgst = (taxableamt * 2.5) / 100;
        sgst = (taxableamt * 2.5) / 100;

        // Calculate total amount including CGST and SGST
        const totalAmount = taxableamt + cgst + sgst;

        return { totalQuantity, totalTAmount, totalGSTAmount, totalPrice, totalAmount, cgst, sgst, taxableamt };
    };

    const { totalQuantity, totalTAmount, totalGSTAmount, totalPrice, cgst, sgst, totalAmount, taxableamt } = calculateTotals();


    return (
        <>
            <Layout>
                <div className='text-center'>
                    <Link className='btn btn-primary' onClick={handlePrintPDF}>
                        Print as PDF
                    </Link>
                </div>
                <div className="invoice-box ml-60 mt-20" id="invoice-box">
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
                    <h2 className='invoice'>Delivery Challan</h2>
                    <div className="invoice-details mt-4">
                        <div className='column'>
                            <p>Invoice No #: {registrations.invoiceno}</p>
                        </div>
                        <div className='column'>

                        </div>
                    </div>
                    <div className="addresses">
                        <div className="bill-to">
                            <h3 className="address-heading">BILL TO</h3>
                            <p>
                                {registrations.sitename}<br />
                                Mobile No: +91 {registrations.mobile}<br />
                                GSTIN: {registrations.gstno}<br />
                                State: Maharashtra
                            </p>
                        </div>
                        <div className="ship-to">
                            <h3 className="address-heading" style={{ paddingLeft: '15rem' }}>Details</h3>
                            <p className='ml-60'>
                                Date: {new Date().toDateString()}<br />
                                Driver Name: {registrations.drivername}
                            </p>
                        </div>
                    </div>

                    <div className="product-table">
                        <div className="product-heading">
                            <div className="item">ITEM</div>
                            <div className="item">HSN</div>
                            <div className="item">QTY.</div>
                            <div className="item">RATE</div>
                            <div className="item">TAX</div>
                            <div className="item">AMOUNT</div>
                        </div>
                        {registrations.products && registrations.products.map((product, index) => (
                            <div key={index} className="product">
                                <div className="item">{product.product_name}</div>
                                <div className="item">{product.hsncode}</div>
                                <div className="item">{product.quantity}</div>
                                <div className="item">{product.price}</div>
                                <div className="item">{product.gstAmount}(5%)</div>
                                <div className="item">{product.totalAmountWithGST}</div>
                            </div>
                        ))}
                    </div>
                    <div className='subtotal'>
                        <div className='tamt'>  <p>SUBTOTAL</p></div>
                        <div className='tamt'>
                            <p style={{ textAlign: 'right' }}> ₹ {totalTAmount}</p>
                        </div>
                    </div>
                    <div className="totals">
                        <div className='details'>
                            <p>BANK DETAILS</p>
                            <p>
                                Name: {admindata.companyname}<br />
                                IFSC Code: {admindata.ifsccode}<br />
                                Account No: {admindata.accountno}<br />
                                Bank: {admindata.bankname}
                            </p>
                        </div>
                        <div className='details'>
                            <p style={{ textAlign: 'right' }}>
                                TAXABLE AMOUNT: ₹ {taxableamt}<br />
                                CGST @2.5%: ₹ {cgst}<br />
                                SGST @2.5%: ₹ {sgst}<br />
                                TOTAL AMOUNT: ₹ {totalAmount}<br />
                                Received Amount: ₹ 0
                            </p>
                        </div>
                    </div>
                    <div className="signature ml-80">
                        <img src="/Digital_Sign.png" alt="Digital Signature" />
                    </div>
                    {/* <button onClick={handlePrintPDF}>Print as PDF</button> */}
                </div>
            </Layout>
        </>
    );
}

export default Dchallan;
