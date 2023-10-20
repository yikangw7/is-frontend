"use client";

import Account from "./account";
import Providers from "./providers";
import Schedule from "./schedule";
import Profile from "./profile";
import Navbar from "./navbar";

import { Box } from "@mui/material";

export default function App() {
    return (
        <Providers>
            <Navbar/>
            <Box>
                Welcome to is
            </Box>
        </Providers>
    );
}
