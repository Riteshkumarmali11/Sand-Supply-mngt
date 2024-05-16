import React from 'react';

const Layout = ({ children }) => {
  const customStyles = {
    height: '90%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    // alignItems: 'center',
    overflowY: 'auto', // Vertical scroll
    overflowX: 'auto', // Horizontal scroll
  };

  return (
    <div className="container mt-28 h-screen p-4 md:p-8 w-full max-w-screen-100 bg-gray-50 shadow-md" style={customStyles}>
      {children}
    </div>
  );
};

export default Layout;
