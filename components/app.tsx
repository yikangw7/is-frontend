"use client";

import Login from "../components/login";
import Providers from "../components/providers";
import Schedule from "../components/schedule";
import Profile from "../components/profile";

export default function App() {
    return (
        <Providers>
            <Login/>
            <Schedule/>
            <Profile/>
        </Providers>
    );
}
