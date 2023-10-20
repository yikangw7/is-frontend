import React from 'react';
import Profile from '../components/profile';
import Navbar from '../components/navbar';
import Providers from "../components/providers";

import '../app/globals.css';

const PlayersPage = () => {
  return (
    <Providers>
        <Navbar />
        <Profile />
    </Providers>
  );
};

export default PlayersPage;
