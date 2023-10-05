"use client";

import Login from "../components/login";
import { SessionProvider } from "next-auth/react";

export default function App() {
    return (
    <SessionProvider>
        <Login/>
    </SessionProvider>
    );
}
