import React from 'react';
import Teams from '../components/teams';
import Navbar from '../components/navbar';
import Providers from "../components/providers";

import '../app/globals.css';

const TeamsPage = () => {
  return (
    <Providers>
        <Navbar />
        <Teams />
    </Providers>
  );
};

export default TeamsPage;
