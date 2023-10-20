"use client";

import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button, Box, Grid } from '@mui/material';

const Teams = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [teamsList, setTeamsList] = useState<any>(null);
    
    // Initialize Teams Data
    useEffect(() => { 
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('https://statsapi.web.nhl.com/api/v1/teams');
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.status} - ${response.statusText}`);
                }     
                // Create a ReadableStream from the response body
                const reader = response.body?.getReader();
                let chunk;
                let result = '';
              
                while (true) {
                    chunk = await reader?.read();
                    if (chunk?.done) {
                        break;
                    }
                    result += new TextDecoder('utf-8').decode(chunk?.value);
                }
                setTeamsList(JSON.parse(result));
                console.log(JSON.parse(result));
            } catch (error) {
                console.error('Error reading the JSON file:', error);
            }
            setIsLoading(false);
            console.log(teamsList);
        };
        fetchData();
    }, []);

    const teamsDisplay = () => {
        const metroDisplay: JSX.Element[] = [];
        const atlanticDisplay: JSX.Element[] = [];
        const centralDisplay: JSX.Element[] = [];
        const pacificDisplay: JSX.Element[] = [];

        if (teamsList) {
            console.log(teamsList);
            for (let i = 0; i < 32; i++) {
                const teamDisplayRow = (
                    <Grid container>
                        <Grid item xs={2}>
                            <Box
                                component="img"
                                sx={{
                                    height: 40,
                                    width: 40,
                                }}
                                src={"https://assets.nhle.com/logos/nhl/svg/" + teamsList.teams[i].abbreviation + "_light.svg"}
                            />
                        </Grid>
                        <Grid item xs={10}>
                            <Button>{teamsList.teams[i].name}</Button>
                        </Grid>
                    </Grid>
                );
                console.log(teamsList.teams[i].division.name);
                if (teamsList.teams[i].division.name === "Metropolitan") metroDisplay.push(teamDisplayRow);
                else if (teamsList.teams[i].division.name === "Atlantic") atlanticDisplay.push(teamDisplayRow);
                else if (teamsList.teams[i].division.name === "Central") centralDisplay.push(teamDisplayRow);
                else if (teamsList.teams[i].division.name === "Pacific") pacificDisplay.push(teamDisplayRow);
            }
            console.log(atlanticDisplay);
        }

        return (
            <Grid container justifyContent="center">
                    <Grid item xs={6}>
                        <h1 style={{ marginBottom: "20px", fontWeight: "bold" }}>{"Eastern Conference"}</h1>
                        <Grid container>
                            <Grid item xs={6}>
                                {"Metropolitan Division"}
                                {metroDisplay}
                            </Grid>
                            <Grid item xs={6}>
                                {"Atlantic Division"}
                                {atlanticDisplay}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                    <h1 style={{ marginBottom: "20px", fontWeight: "bold" }}>{"Western Conference"}</h1>
                        <Grid container>
                            <Grid item xs={6}>
                                {"Central Division"}
                                {centralDisplay}
                            </Grid>
                            <Grid item xs={6}>
                                {"Western Division"}
                                {pacificDisplay}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
        );
    }

    return (
        <Box style={{ padding: "60px" }}>
            {teamsList &&
                <>
                    {teamsDisplay()}
                </>
            }
        </Box>
    )
}

export default Teams;
