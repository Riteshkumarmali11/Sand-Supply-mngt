import React from 'react'
import Navbar from '../../component/Navbar'
import addNotification from 'react-push-notification';
import Layout from '../../component/Layout';
import logo from '../../static/logo512.png';

const Sample = () => {

    const clickToNotify = () => {
        addNotification({
            title: 'Notification Test',
            message: 'My Test',
            icon:logo,
            duration: 4000,
            native: true
        });
    }

    return (
        <div>
            <Navbar />
            <Layout>
                <button className='btn btn-primary mt-10' onClick={clickToNotify}>ClickToNotify</button>
            </Layout>
        </div>
    )
}

export default Sample
