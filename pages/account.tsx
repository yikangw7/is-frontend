import React from 'react';
import Account from '../components/account';
import Navbar from '../components/navbar';
import Providers from "../components/providers";

import '../app/globals.css';

const AccountPage = () => {
  return (
    <Providers>
        <Navbar />
        <Account />
    </Providers>
  );
};

export default AccountPage;
