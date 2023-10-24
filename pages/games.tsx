import React from 'react';
import Games from '../components/games';
import Navbar from '../components/navbar';
import Providers from "../components/providers";

import '../app/globals.css';

const GamesPage = () => {
  return (
    <Providers>
        <Navbar />
        <Games />
    </Providers>
  );
};

export default GamesPage;
