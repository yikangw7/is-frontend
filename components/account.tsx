"use client";

import * as React from 'react';
import { Button, TextField, Box } from '@mui/material';
import { useState, ChangeEvent } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Account() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userDelete, setUserDelete] = useState<string>("");

  const [isInvalid, setIsInvalid] = useState<boolean>(false);
  const [type, setType] = useState<"password" | "text">("password");

  const { data: session, status } = useSession();
  if (status === 'loading') return <h1> loading... please wait</h1>;
 

  const createUser = () => {
    fetch('http://localhost:3000/api/createUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      }),
    });
  }

  const deleteUser = () => {
    fetch('http://localhost:3000/api/deleteUser', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: userDelete,
      }),
    });
  }

  const viewUsers = () => {
    fetch('http://localhost:3000/api/getUsers', {
      method: 'GET',
    })
      .then(response => {
        // Check if the response status is OK (status code 200)
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // Parse the response body as JSON
        return response.json();
      })
      .then((data) => {
        console.log(data);
      });
  }

  const handleUsernameChange = (event : ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  }

  const handleEmailChange = (event : ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  }

  const handlePasswordChange = (event : ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  }

  const handleUIDChange = (event : ChangeEvent<HTMLInputElement>) => {
    setUserDelete(event.target.value);
  }

  return (
    <Box style={{ padding: "25px" }}>
      <head>
        <script src="https://apis.google.com/js/platform.js" async defer></script>
      </head>
      {status != "authenticated" && 
        <>
          <Box 
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <div>Welcome! Please sign in with Google</div>
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Button onClick={() => signIn("google")}>Sign In With Google</Button>
          </Box>
        </>
      }

      {/*
        <Box>
          <TextField label="Username" onChange={handleUsernameChange} value={username}/>
          <TextField label="Email" onChange={handleEmailChange} value={email}/>
          <TextField label="Password" type={type} onChange={handlePasswordChange} value={password}/>
          <Button onClick={() => {type === "password" ? setType("text") : setType("password")}}>
            S
          </Button>
          <Button onClick={() => {createUser()}} disabled={isInvalid}>
            Create Account
          </Button>
          <div>Admin Tools</div>
          <TextField label="Username" onChange={handleUIDChange} value={userDelete}/>
          <Button onClick={() => {deleteUser()}} disabled={isInvalid}>
            Delete User
          </Button>
          <Button onClick={() => {viewUsers()}} disabled={isInvalid}>
            View All Users
          </Button>
        </Box>
      */}
      {status === "authenticated" && 
        <>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <h1>You are currently logged in as: {session?.user?.name}</h1>
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Button onClick={() => {signOut()}}>Sign Out</Button>
          </Box>
        </>
      } 
    </Box>
  )
}
