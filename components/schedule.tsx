"use client";

import * as React from 'react';
import { Button, TextField } from '@mui/material';
import { useState, useEffect, ChangeEvent } from 'react';

const Schedule = () => {

    useEffect(() => {
        fetch('https://statsapi.web.nhl.com/api/v1/scheduleTypes', {
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
    }, [])

    return (
        <>
            <h1>test</h1>
        </>
    )
}

export default Schedule;
