"use client";

import * as React from 'react';
import { Button, TextField, Checkbox, Box, Grid, Typography, Popover } from '@mui/material';

// TextField Icon
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useState, useEffect, ChangeEvent } from 'react';
import Loading from "./loading";

import "../app/globals.css";

import { useSession } from 'next-auth/react';

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
        width: 100,
    },
    {
        field: 'games',
        headerName: 'GP',
        width: 60,
    },
    {
        field: 'goals',
        headerName: 'G',
        width: 60,
    },
    {
        field: 'assists',
        headerName: 'A',
        width: 60,
    },
    {
        field: 'points',
        headerName: 'P',
        width: 60,
    },
    {
        field: 'plusMinus',
        headerName: '+/-',
        width: 60,
    },
    {
        field: 'penaltyMins',
        headerName: 'PIM',
        width: 60,
    },
    {
        field: 'ppg',
        headerName: 'PPG',
        width: 60,
    },
    {
        field: 'ppp',
        headerName: 'PPP',
        width: 60,
    },
    {
        field: 'shg',
        headerName: 'SHG',
        width: 60,
    },
    {
        field: 'shp',
        headerName: 'SHP',
        width: 60,
    },
    {
        field: 'toipg',
        headerName: 'TOI/G',
        width: 100,
    },
    {
        field: 'gwg',
        headerName: 'GWG',
        width: 60,
    },
    {
        field: 'otg',
        headerName: 'OTG',
        width: 60,
    },
    {
        field: 'shots',
        headerName: 'S',
        width: 60,
    },
    {
        field: 'shotPercent',
        headerName: 'S%',
        width: 60,
    },
    {
        field: 'faceoffs',
        headerName: 'FO%',
        width: 60,
    },
]

const Profile = () => {
    // Search States
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [matchedSuggestions, setMatchedSuggestions] = useState<any[]>([]);

    // Player Info State Variables
    const [currentPlayer, setCurrentPlayer] = useState<any>(null);
    const [masterList, setMasterList] = useState<any>(null);
    const [currentTeam, setCurrentTeam] = useState<any>(null);
    const [favourites, setFavourites] = useState<any>(null);

    // Checkbox State Variables
    const [extraData, setExtraData] = useState<boolean>(false);
    const [isFavourite, setIsFavourite] = useState<boolean>(false);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [rowData, setRowData] = useState<any>(null);
    const [row2Data, setRow2Data] = useState<any>(null);

    const { data: session, status } = useSession();

    useEffect(() => {
        if (currentPlayer) {
            setIsLoading(true);
            setRowData(null);
            setCurrentTeam(null);

            // Check if is user's favourite
            fetch('http://localhost:3000/api/isFavourite?id=' + currentPlayer.id + "&email=" + session?.user?.email, {
                method: 'GET',
            }).then(response => {
                // Check if the response status is OK (status code 200)
                if (!response.ok) {
                throw new Error('Network response was not ok');
                }
                // Parse the response body as JSON
                return response.json();
            }).then((data) => {
                if (data.exists) {
                    setIsFavourite(true);
                }
                else {
                    setIsFavourite(false);
                }
            });

            // Get Year By Year Stats
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
                // Get Career Stats
                fetch('https://statsapi.web.nhl.com/api/v1/people/' + currentPlayer.id + '/stats?stats=careerRegularSeason', {
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
                    .then((data2) => {
                        setRow2Data(data2.stats[0].splits[0]);
                        console.log("Row2Data: " + data2.stats[0].splits[0]);
                        setRowData(prepareDataForDataGrid(data.stats[0].splits, data2.stats[0].splits[0]));
                    });
            });

            // Get Team Information
            if (currentPlayer.currentTeamId) {
                fetch('https://statsapi.web.nhl.com/api/v1/teams/' + currentPlayer.currentTeamId, {
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
                    console.log(data.teams[0]);
                    setCurrentTeam(data.teams[0]);
                });
            }

            setIsLoading(false);
        }
    }, [currentPlayer, extraData])

    let playerList: any;

    // Initialize Player Data
    useEffect(() => { 
        const fetchData = async () => {
            setIsLoading(true);
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
                setMasterList(JSON.parse(result));
                console.log(masterList);
            } catch (error) {
                console.error('Error reading the JSON file:', error);
            }
            setIsLoading(false);
        };
        fetchData();
        console.log(playerList);
    }, []);

    // Initialize User's Favourites
    useEffect(() => { 
        const fetchData = async () => {
            setIsLoading(true);
            fetch('http://localhost:3000/api/getAllFavourites?email=' + session?.user?.email, {
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
                    console.log("Favourites:");
                    console.log(data);
                    setFavourites(data);
                });
            setIsLoading(false);
        };
        fetchData();
        console.log(playerList);
    }, [session, isFavourite]);
    

    const handleSearchChange = (event : ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        if (searchTerm === "") {
            setMatchedSuggestions([]);
        }
        else {
            let matched = masterList.data.filter((item: any) =>
                item.fullName.toLowerCase().includes(searchTerm.toLowerCase())
            );
            matched.reverse();
            matched = matched.slice(0, 3);
            
            setMatchedSuggestions(matched);
        }
    }
    const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.keyCode === 13) {
            setIsLoading(true);
            if (matchedSuggestions) {
                setCurrentPlayer(matchedSuggestions[0]);
                setSearchTerm("");
                setMatchedSuggestions([]);
            }
            else {
                setCurrentPlayer(null);
                setRowData([]);
            }
            setIsLoading(false);
        }
      };

    const handleCheckboxChange = (event : ChangeEvent<HTMLInputElement>) => {
        setExtraData(event.target.checked);
    }

    const handleFavouriteChange = (event : ChangeEvent<HTMLInputElement>) => {
        setIsFavourite(event.target.checked);
        if (event.target.checked) {
            console.log("Favourite set!");
            console.log(session?.user?.email);
            console.log(currentPlayer.id);
            fetch('http://localhost:3000/api/addFavourite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: currentPlayer.id,
                    email: session?.user?.email,
                }),
                });
        }
        else {
            console.log("Favourite deleted!");
            console.log(session?.user?.email);
            console.log(currentPlayer.id);
            fetch('http://localhost:3000/api/deleteFavourite', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: currentPlayer.id,
                    email: session?.user?.email,
                }),
                });
        }
    }

    const searchList = (search: string) => {
        let found: boolean = false;
        for (let key in masterList.data) {
            if (masterList.data.hasOwnProperty(key)){
            if (masterList.data[key].fullName.toLowerCase() === search.toLowerCase()) {
                console.log("e1");
                found = true;
                setCurrentPlayer(masterList.data[key]);
                break;
            }
            }
        }
    }

    const prepareDataForDataGrid = (rows: any, row2Data: any) => {
        const newRows: any[] = [];
        rows.map((rowData: any) => {
            if (extraData || !rowData.league || rowData.league.name === "National Hockey League") {
                let singleRow = {
                    id: rowData.season,
                    season: rowData.season.substring(0, 4) + " - " + rowData.season.substring(4, 8),
                    team: rowData.team.name,
                    league: rowData.league.name === "National Hockey League" ? "NHL" : rowData.league.name,
                    games: rowData.stat.games || 0,
                    goals: rowData.stat.goals || 0,
                    assists: rowData.stat.assists || 0,
                    points: rowData.stat.points || 0,
                    plusMinus: rowData.stat.plusMinus || 0,
                    penaltyMins: rowData.stat.pim || 0,
                    ppg: rowData.stat.powerPlayGoal || 0,
                    ppp: rowData.stat.powerPlayPoints || 0,
                    shg: rowData.stat.shortHandedGoals || 0,
                    shp: rowData.stat.shortHandedPoints || 0,
                    toig: "" || 0,
                    gwg: rowData.stat.gameWinningGoals || 0,
                    otg: rowData.stat.overTimeGoals || 0,
                    shots: rowData.stat.shots,
                    shotPercent: "" || 0,
                    faceoffs: "" || 0,
                }
                newRows.push(singleRow);
            }
        })
        let careerTotals = {
            id: "Career Totals",
            season: "Career Totals",
            team: "TOT",
            league: "NHL",
            games: row2Data?.stat?.games || 0,
            goals: row2Data?.stat?.goals || 0,
            assists: row2Data?.stat?.assists || 0,
            points: row2Data?.stat?.points || 0,
            plusMinus: row2Data?.stat?.plusMinus || 0,
            penaltyMins: row2Data?.stat?.pim || 0,
            ppg: row2Data?.stat?.powerPlayGoals || 0,
            ppp: row2Data?.stat?.powerPlayPoints || 0,
            shg: row2Data?.stat?.shortHandedGoals || 0,
            shp: row2Data?.stat?.shortHandedPoints || 0,
            toig: "" || 0,
            gwg: row2Data?.stat?.gameWinningGoals || 0,
            otg: row2Data?.stat?.overTimeGoals || 0,
            shots: row2Data?.stat?.shots || 0,
            shotPercent: "" || 0,
            faceoffs: "" || 0,
        }
        newRows.push(careerTotals);
        return newRows;
    }

    const favouritesColumn = () => {
        const favouritesDisplay: JSX.Element[] = [];
        favourites.map((favourite: any) => {
            let player: any;
            for (let key in masterList.data) {
                if (masterList.data.hasOwnProperty(key)){
                    if (masterList.data[key].id === favourite.id) {
                        player = masterList.data[key];
                        break;
                    }
                }
            }
            const singleDisplay = (
                <Grid container>
                    <Grid item xs={2}>
                    <Box
                        component="img"
                        sx={{
                            height: 40,
                            width: 40,
                        }}
                        src={"http://nhl.bamcontent.com/images/headshots/current/168x168/" + player.id + ".jpg"}
                    />
                    </Grid>
                    <Grid item xs={10}>
                        <Button onClick={() => {setCurrentPlayer(player)}}>{player.fullName + "\n"}</Button>
                        {player.sweaterNumber}
                    </Grid>
                </Grid>
            );
            favouritesDisplay.push(singleDisplay);
        });
        return (
            <Box>
                {favouritesDisplay}
            </Box>
        );
    }

    return (
        <Box>
            {isLoading ? <Loading/> :
            <Box style={{ padding: "60px" }}>
                <Grid container justifyContent="center">
                    <TextField 
                        label="Player Name" 
                        onChange={handleSearchChange} 
                        onKeyDown={handleEnter}
                        value={searchTerm}
                        InputProps={{ 
                            spellCheck: "false",
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton>
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        style={searchTerm ? {
                            width: "900px",
                        } : {
                            width: "900px",
                            marginBottom: "40px",
                        }}
                    />
                </Grid>
                {searchTerm &&
                    <Grid container justifyContent="center">
                        {matchedSuggestions?.map((suggestion, index) => (
                            <Button key={index} onClick={() => {setCurrentPlayer(suggestion)}}>{suggestion.fullName}</Button>
                        ))}
                    </Grid>
                }

                {!currentPlayer && masterList &&
                    <Grid container justifyContent="center">
                        {favourites.length > 0 ?
                            <Box>
                                <h1 style={{ marginBottom: "10px" }}>Your Favourites</h1>
                                {favouritesColumn()}
                            </Box>
                            :
                            <Box>
                                <h1 style={{ marginBottom: "10px" }}>Your Favourites</h1>
                                {status === "unauthenticated" ? "Login to add favourites!" : "No favourites yet. Add some!"}
                            </Box>
                        }
                    </Grid>
                }

                {currentPlayer && 
                    <Grid container spacing={2}>
                        <Grid item xs={10}>
                            <Box>
                                <Grid container spacing={2}>
                                    <Grid item xs={1}>
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
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography>
                                            {(!currentTeam ? "No Team" : currentTeam.name) + " #" + currentPlayer.sweaterNumber}
                                        </Typography>
                                        <Typography>
                                            {"Height: " + Math.floor(currentPlayer.height / 12) + "'" + currentPlayer.height % 12}
                                        </Typography>
                                        <Typography>
                                            {"Weight: " + currentPlayer.weight + "lbs"}
                                        </Typography>
                                        <Typography>
                                            {currentPlayer.birthCity + ", " + currentPlayer.birthStateProvince + " - " + currentPlayer.birthCountry}
                                        </Typography>
                                        <Typography>
                                            {"Born " + currentPlayer.birthDate}
                                        </Typography>
                                        <Typography>
                                            {"Shoots " + currentPlayer.shootsCatches}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4} justifyContent="flex-end">
                                        <Box>
                                            <Checkbox checked={extraData} onChange={handleCheckboxChange}/>
                                            {"Show Extra Data"}
                                        </Box>
                                        {status === "authenticated" &&
                                            <Box>
                                                <Checkbox checked={isFavourite} onChange={handleFavouriteChange}/>
                                                {"Set As Favourite"}
                                            </Box>
                                        }
                                    </Grid>
                                    <br/>
                                </Grid>
                                {rowData &&
                                    <DataGrid
                                        rows={rowData}
                                        columns={columns}
                                    />
                                }
                            </Box>
                        </Grid>
                        <Grid item xs={2}>
                            {favourites.length > 0 ?
                                <Box style={{ marginLeft: "20px" }}>
                                    <h1 style={{ marginBottom: "10px" }}>Your Favourites</h1>
                                    {favouritesColumn()}
                                </Box>
                                :
                                <Box style={{ marginLeft: "20px" }}>
                                    <h1 style={{ marginBottom: "10px" }}>Your Favourites</h1>
                                    {status === "unauthenticated" ? "Login to add favourites!" : "No favourites yet. Add some!"}
                                </Box>
                            }
                        </Grid>
                    </Grid>
                }
                    </Box>
                }
        </Box>
    )
}

export default Profile;
