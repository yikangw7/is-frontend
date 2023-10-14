"use client";

import * as React from 'react';
import { Button, TextField, Checkbox, Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useState, useEffect, ChangeEvent } from 'react';

const columns: GridColDef[] = [
    {
        field: 'season',
        headerName: 'Season',
        width: 150,
    },
    {
        field: 'team',
        headerName: 'Team',
        width: 150,
    },
    {
        field: 'league',
        headerName: 'League',
        width: 150,
    },
    {
        field: 'goals',
        headerName: 'G',
        width: 50,
    },
    {
        field: 'assists',
        headerName: 'A',
        width: 50,
    },
    {
        field: 'points',
        headerName: 'P',
        width: 50,
    },
]

const Profile = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPlayer, setCurrentPlayer] = useState<any>(null);
    const [currentStats, setCurrentStats] = useState<any>(null);
    const [extraData, setExtraData] = useState<boolean>(false);
    const [rowData, setRowData] = useState<any>(null);

    useEffect(() => {
        if (currentPlayer) {
            setRowData(null);
            fetch('https://statsapi.web.nhl.com/api/v1/people/' + currentPlayer.id + '/stats?stats=yearByYear', {
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
                console.log(data.stats[0].splits);
                setRowData(prepareDataForDataGrid(data.stats[0].splits));
            });
        }
    }, [currentPlayer, extraData])

    let playerList: any;
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/players.json');
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
                playerList = JSON.parse(result);
            } catch (error) {
                console.error('Error reading the JSON file:', error);
            }
          };
    

    const handleSearchChange = (event : ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    }

    const handleCheckboxChange = (event : ChangeEvent<HTMLInputElement>) => {
        setExtraData(event.target.checked);
    }

    const searchList = (search: string) => {
        fetchData();
        console.log(playerList);
        let found: boolean = false;
        let index = -1;
        for (let key in playerList.data) {
            if (playerList.data.hasOwnProperty(key)){
            if (playerList.data[key].fullName.toLowerCase() === search.toLowerCase()) {
                console.log("e1");
                found = true;
                setCurrentPlayer(playerList.data[key]);
                break;
            }
            }
        }
    }

    const prepareDataForDataGrid = (rows: any) => {
        const newRows: any[] = [];
        rows.map((rowData: any) => {
            if (extraData || rowData.league.name === "National Hockey League") {
                let singleRow = {
                    id: rowData.season,
                    season: rowData.season.substring(0, 4) + " - " + rowData.season.substring(4, 8),
                    team: rowData.team.name,
                    league: rowData.league.name === "National Hockey League" ? "NHL" : rowData.league.name,
                    goals: rowData.stat.goals,
                    assists: rowData.stat.assists,
                    points: rowData.stat.points,
                }
                newRows.push(singleRow);
            }
        })
        return newRows;
    }

    return (
        <>
            <h1>test</h1>
            <TextField label="Username" onChange={handleSearchChange} value={searchTerm}/>
            <Button onClick={() => {searchList(searchTerm)}}>
                Search
            </Button>

            {currentPlayer && 
                <>
                    <Box
                        component="img"
                        sx={{
                            height: 80,
                            width: 80,
                        }}
                        alt={currentPlayer.fullName}
                        src={"http://nhl.bamcontent.com/images/headshots/current/168x168/" + currentPlayer.id + ".jpg"}
                    />
                    {currentPlayer.fullName + "\n"}
                    <Checkbox checked={extraData} onChange={handleCheckboxChange}/>
                    {"Show Extra Data"}
                    <br/>
                </>
            }
                {rowData &&
                    <DataGrid
                        rows={rowData}
                        columns={columns}
                    />
                }
        </>
    )
}

export default Profile;
