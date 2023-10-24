// components/NavBar.js
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Link from 'next/link';

import "../app/globals.css";

import { useSession } from 'next-auth/react';

const NavBar = () => {
const { data: session, status } = useSession();
  if (status === 'loading') return <h1> loading... please wait</h1>;

  return (
    <AppBar position="static">
      <Toolbar style={{ backgroundColor: "#303030"}}>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
            <Link href="/">
                <Box
                    component="img"
                    sx={{
                        height: 35,
                        width: 208,
                    }}
                    src={"https://cdn.discordapp.com/attachments/566250791707344896/1164080061461303348/logo.png?ex=6541e90a&is=652f740a&hm=bc6fef09733255bf2d0f87f5a554364bde75068f61719831ba6becbc8243a55b&"}
                    alt={"is"}
                />
            </Link>
        </Typography>
        <Link href="/">
            <Button color="inherit">Home</Button>
        </Link>
        <Link href="/players">
            <Button color="inherit">Players</Button>
        </Link>
        <Link href="/teams">
            <Button color="inherit">Teams</Button>
        </Link>
        <Link href="/games">
            <Button color="inherit">Games</Button>
        </Link>
        {status != 'authenticated' &&
            <Link href="/account">
                <Button color="inherit">Log In</Button>
            </Link>
        }
        {status === 'authenticated' &&
            <>
                <Box style={{ marginLeft: "10px", marginRight: "10px" }}>
                    <h2> Logged in as <br/> {session?.user?.name}</h2>
                </Box>
                <Link href="/account">
                    <Box>
                        <img height={40} width={40} src={session?.user?.image || ""} alt={session?.user?.name + ' photo'} />
                    </Box>
                </Link>
            </>
        }
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
