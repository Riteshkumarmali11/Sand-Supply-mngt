import React, { useEffect, useState } from 'react';
import Navbar from '../../component/Navbar';
import Layout from '../../component/Layout';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../static/page.css';
import { FaFilePdf, FaShoppingCart } from 'react-icons/fa';
import { AiFillRightCircle } from "react-icons/ai";
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';
import ModalLayout from '../../component/ModalLayout';

const SalesComponent = () => {
    const [inventoryData, setInventoryData] = useState([]);
    const [filteredInventoryData, setFilteredInventoryData] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedOwnerTransactions, setSelectedOwnerTransactions] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [admindata, setAdminData] = useState([]);
    const [error, setError] = useState();
    const [ownerNameFilter, setOwnerNameFilter] = useState('');
    const [selectedProductId, setSelectedProductId] = useState(null);

    useEffect(() => {
        fetchInventoryData();
        fetchAdmin();
    }, []);

    const fetchInventoryData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/getSalesInventory`);
            const { success, data } = response.data;
            if (success) {
                setInventoryData(data);
                const defaultFilteredData = data.filter(transaction => {
                    const transactionDate = new Date(transaction.fromdate);
                    return transactionDate >= new Date(admindata.fdate) && transactionDate <= new Date(admindata.tdate);
                });
                const processedData = processData(defaultFilteredData);
                setFilteredInventoryData(processedData);
                console.log("Inventory", data);
            } else {
                throw new Error('Backend response indicates failure');
            }
        } catch (error) {
            console.error('Error fetching inventory data:', error);
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

    useEffect(() => {
        if (admindata.fdate && admindata.tdate) {
            setFromDate(admindata.fdate);
            setToDate(admindata.tdate);
            handleFilter(admindata.fdate, admindata.tdate);
        }
    }, [admindata]);

    const handlePdfView = (ownerName, month) => {
        const ownerMonthTransactions = inventoryData.filter(transaction => {
            const transactionDate = new Date(transaction.fromdate);
            const transactionMonth = transactionDate.getMonth() + 1; // Get month (1-indexed)
            return transaction.selectedOwnerName === ownerName && transactionMonth === month;
        });
        setSelectedOwnerTransactions(ownerMonthTransactions);
        setModalIsOpen(true);
    };

    const handleFilter = (fromDate, toDate) => {
        // Filter by date range
        let filteredTransactions = inventoryData.filter(transaction => {
            const transactionDate = new Date(transaction.fromdate);
            return transactionDate >= new Date(fromDate) && transactionDate <= new Date(toDate);
        });

        // Filter by owner name
        if (ownerNameFilter) {
            filteredTransactions = filteredTransactions.filter(transaction => transaction.selectedOwnerName === ownerNameFilter);
        }

        const processedData = processData(filteredTransactions);
        setFilteredInventoryData(processedData);
    };

    const processData = (data) => {
        const processedData = {};
        data.forEach(transaction => {
            const month = transaction.fromdate.split('-')[1];
            const key = `${transaction.selectedOwnerName}-${month}`;
            if (!processedData[key]) {
                processedData[key] = {
                    ...transaction,
                    month,
                    totalCredit: parseFloat(transaction.recievedAmount.replace(/,/g, ''))
                };
            } else {
                processedData[key].totalCredit += parseFloat(transaction.recievedAmount.replace(/,/g, ''));
            }
        });
        return Object.values(processedData);
    };

    const formatCreditValue = (value) => {
        return new Intl.NumberFormat().format(value);
    };

    const handleCloseModal = () => {
        setModalIsOpen(false);
    };
    const calculateClosingBalance = (transactions) => {
        if (!transactions || transactions.length === 0) {
            return 0; // Return 0 if there are no transactions
        }

        // Calculate total credits
        const totalCredits = transactions.reduce((total, transaction) => {
            return total + parseFloat(transaction.recievedAmount.replace(/,/g, '') || 0);
        }, 0);

        // Get opening balance from the first transaction
        const openingBalance = transactions[0]?.openingbal;

        // Ensure opening balance is a string before trying to replace commas
        const openingBalanceWithoutCommas = typeof openingBalance === 'string' ? openingBalance.replace(/,/g, '') : openingBalance;

        // Parse opening balance as float
        const openingBalanceFloat = parseFloat(openingBalanceWithoutCommas || 0);

        // Calculate closing balance by subtracting total credits from opening balance
        return openingBalanceFloat - totalCredits;
    };


    return (
        <>
            <Navbar />
            <Layout>
                <div className="registration-form-container">
                    <ToastContainer />
                    <h1 style={{ textAlign: 'center', fontSize: '30px', padding: '20px' }}><strong>Sales Report</strong></h1>
                    <h3 style={{ textAlign: 'center', marginBottom: '20px', textAlign: 'right', fontWeight: 'bolder' }}> {admindata.fdate} To {admindata.tdate}</h3>
                    <div style={{ marginBottom: '20px' }}>
                        <div className='form-row'>
                            <div className='form-group'>
                                <label>From Date:</label>
                                <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
                            </div>
                            <div className='form-group'>
                                <label>To Date:</label>
                                <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
                            </div>
                            <div>
                                <button onClick={() => handleFilter(fromDate, toDate)}>Filter</button>
                            </div>
                            <div className='form-group'></div>
                            <div className='form-group'></div>
                        </div>
                    </div>
                    <div>
                        <table className="s-table">
                            <thead>
                                <tr>
                                    <th className='bot'>Date</th>
                                    <th className='bot'>Particulars</th>
                                    <th className='bot'>Credit</th>
                                    <th className='bot'>debit</th>
                                    <th className='bot'>View</th>
                                    <th className='bot'>Sales Product</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInventoryData.map((transaction, index) => (
                                    <tr key={index}>
                                        <td>{transaction.fromdate}</td>
                                        <td>{transaction.selectedOwnerName}</td>
                                        <td>{formatCreditValue(transaction.totalCredit)}</td>
                                        <td>0</td>
                                        <td>
                                            <FaFilePdf style={{ color: 'orange' }}
                                                className="pdf-icon"
                                                onClick={() => handlePdfView(transaction.selectedOwnerName, new Date(transaction.fromdate).getMonth() + 1)}
                                            />
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <Link to={`/salesproduct/${transaction.id}?date=${transaction.fromdate}`}>
                                                <AiFillRightCircle style={{ color: 'blue', fontSize: '25px' }} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Modal */}
                    <Modal
                        isOpen={modalIsOpen && !selectedProductId} // Check if the product modal should be opened
                        onRequestClose={() => setModalIsOpen(false)}
                        contentLabel="Transaction Modal"
                        style={{
                            content: {
                                width: '60%',
                                height: '60%',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)'
                            }
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <h2>Transactions</h2>
                            <button style={{ backgroundColor: 'none', border: 'none', cursor: 'pointer', color: 'black' }} onClick={() => setModalIsOpen(false)}>
                                <FaTimes />
                            </button>
                        </div>
                        <ModalLayout>
                            <div style={{ fontWeight: 'bolder', textAlign: 'right' }} className='mb-10'>
                                {selectedOwnerTransactions.map((transaction, index) => (
                                    <h1>Opening Balance :{transaction.openingbal}</h1>
                                ))}
                            </div>
                            <table className='s-table'>
                                <thead className='bg-orange-100'>
                                    <tr>
                                        <th className='bg-dark-200'>Date</th>
                                        <th className='bg-dark-200'>Owner Name</th>
                                        <th className='bg-dark-200'>Invoice No.</th>
                                        <th className='bg-dark-200'>Credit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOwnerTransactions.map((transaction, index) => (
                                        <tr key={index}>
                                            <td>{transaction.fromdate}</td>
                                            <td>{transaction.selectedOwnerName}</td>
                                            <td>{transaction.invoiceno}</td>
                                            <td>{transaction.recievedAmount}</td>
                                        </tr>
                                    ))}

                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="3" style={{ textAlign: 'right', fontWeight: 'bold' }}>Closing Balance:</td>
                                        <td style={{ fontWeight: 'bold' }}>
                                            {calculateClosingBalance(selectedOwnerTransactions)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </ModalLayout>
                    </Modal>
                </div>
            </Layout>
        </>
    )
}

export default SalesComponent;
