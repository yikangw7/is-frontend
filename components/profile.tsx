"use client";

import * as React from 'react';
import { Button, TextField, Checkbox, Box, Grid, Typography, Popover } from '@mui/material';

// TextField Icon
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useState, useEffect, ChangeEvent } from 'react';
import Loading from "./loading";

import "../app/globals.css";
import { columns, columns2 } from '../constants/profileConstants';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const Profile = () => {
    // Search States
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [matchedSuggestions, setMatchedSuggestions] = useState<any[]>([]);

    // Player Info State Variables
    const [currentPlayer, setCurrentPlayer] = useState<any>(null);
    const [masterList, setMasterList] = useState<any>(null);
    const [teamsList, setTeamsList] = useState<any>(null);
    const [currentTeam, setCurrentTeam] = useState<any>(null);
    const [favourites, setFavourites] = useState<any>(null);
    const [isGoalie, setIsGoalie] = useState<boolean>(false);
    const [isPlayoffs, setIsPlayoffs] = useState<boolean>(false);
    const [featuredStats, setFeaturedStats] = useState<any>(false);

    // Checkbox State Variables
    const [extraData, setExtraData] = useState<boolean>(false);
    const [isFavourite, setIsFavourite] = useState<boolean>(false);
    const [alignment, setAlignment] = useState('left');

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [rowData, setRowData] = useState<any>(null);
    const [row2Data, setRow2Data] = useState<any>(null);

    const { data: session, status } = useSession();

    const router = useRouter();
    const playerProp = router.query;

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
            fetch('https://api-web.nhle.com/v1/player/' + currentPlayer.id + '/landing', {
            method: 'GET',
            })
            .then(response => {
                console.log("E");
                console.log(response);
                // Check if the response status is OK (status code 200)
                if (!response.ok) {
                throw new Error('Network response was not ok');
                }
                // Parse the response body as JSON
                return response.json();
            })
            .then((data) => {
                console.log(data);
                if (data.position != "G") {
                    setRowData(prepareDataForDataGrid(data.seasonTotals, data.careerTotals.regularSeason));
                    setFeaturedStats(data.featuredStats);
                    setIsGoalie(false);
                }
                else {
                    setRowData(prepareGoalieForDataGrid(data.seasonTotals, data.careerTotals.regularSeason));
                    setFeaturedStats(data.featuredStats);
                    setIsGoalie(true);
                }
            });

            // Get Team Information
            if (currentPlayer.currentTeamId) {
                fetch('https://api.nhle.com/stats/rest/en/team', {
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
                    console.log("TL:");
                    console.log(data);
                    console.log(currentPlayer.currentTeamId);
                    data.data.filter((teamInfo: any) => {
                        if (teamInfo.id === currentPlayer.currentTeamId) {
                            setCurrentTeam(teamInfo);
                        }
                    })
                });
            }

            setIsLoading(false);
        }
    }, [currentPlayer, extraData, isPlayoffs])

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

   // Initialize Current Team
   useEffect(() => { 
    const fetchData = async () => {
        setIsLoading(true);
        fetch('https://api.nhle.com/stats/rest/en/team', {
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
                console.log("TL:");
                console.log(data);
                setTeamsList(data);
            });
        setIsLoading(false);
    };
    fetchData();
    console.log(playerList);
}, []);

    // Initialize page if player query is given
    useEffect(() => {
        if (playerProp.playerName) {
            if (masterList) searchList(playerProp.playerName as string);
        }
        else {
            setCurrentPlayer(null);
        }
    }, [playerProp, masterList])

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
                router.push({
                    pathname: '/players',
                    query: { playerName: matchedSuggestions[0].fullName },
                });
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
            if (extraData || rowData.leagueAbbrev === "NHL") {
                if ((extraData && !rowData.gameTypeId) || (isPlayoffs && rowData.gameTypeId === 3) || (!isPlayoffs && rowData.gameTypeId === 2)) {
                    let singleRow = {
                        id: rowData.season,
                        season: (rowData.season + "").substring(0, 4) + " - " + (rowData.season + "").substring(4, 8),
                        team: rowData.teamName.default,
                        league: rowData.leagueAbbrev,
                        games: rowData.gamesPlayed || 0,
                        goals: rowData.goals || 0,
                        assists: rowData.assists || 0,
                        points: rowData.points || 0,
                        plusMinus: rowData.plusMinus || 0,
                        penaltyMins: rowData.pim || 0,
                        ppg: rowData.powerPlayGoal || 0,
                        ppp: rowData.powerPlayPoints || 0,
                        shg: rowData.shorthandedGoals || 0,
                        shp: rowData.shorthandedPoints || 0,
                        toig: rowData.avgToi || "-",
                        gwg: rowData.gameWinningGoals || 0,
                        otg: rowData.otGoals || 0,
                        shots: rowData.shots,
                        shotPercent: !rowData.shots ? 0 : (rowData.goals / rowData.shots * 100).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) || 0,
                        faceoffs: (rowData.faceoffWinningPctg * 100).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) || 0,
                    }
                    newRows.push(singleRow);
                }
            }
        })
        let careerTotals = {
            id: "Career Totals",
            season: "Career Totals",
            team: "TOT",
            league: "NHL",
            games: row2Data?.gamesPlayed || "-",
            goals: row2Data?.goals || "-",
            assists: row2Data?.assists || "-",
            points: row2Data?.points || "-",
            plusMinus: row2Data?.plusMinus || "-",
            penaltyMins: row2Data?.pim || "-",
            ppg: row2Data?.powerPlayGoals || "-",
            ppp: row2Data?.powerPlayPoints || "-",
            shg: row2Data?.shorthandedGoals || 0,
            shp: row2Data?.shorthandedPoints || 0,
            toig: row2Data?.avgToi || "-",
            gwg: row2Data?.gameWinningGoals || "-",
            otg: row2Data?.otGoals || "-",
            shots: row2Data?.shots || "-",
            shotPercent: (row2Data?.goals / row2Data?.shots * 100).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) || "-",
            faceoffs: (row2Data?.faceoffWinningPctg * 100).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) || "-",
        }
        if (!isPlayoffs) newRows.push(careerTotals);
        return newRows;
    }

    const prepareGoalieForDataGrid = (rows: any, row2Data: any) => {
        const newRows: any[] = [];
        rows.map((rowData: any) => {
            if (extraData || rowData.leagueAbbrev === "NHL") {
                if ((extraData && !rowData.gameTypeId) || (isPlayoffs && rowData.gameTypeId === 3) || (!isPlayoffs && rowData.gameTypeId === 2)) {
                    let singleRow = {
                        id: rowData.season,
                        season: (rowData.season + "").substring(0, 4) + " - " + (rowData.season + "").substring(4, 8),
                        team: rowData.teamName.default,
                        league: rowData.leagueAbbrev,
                        games: rowData.gamesPlayed || 0,
                        gamesStarted: rowData.gamesStarted || 0,
                        wins: rowData.wins || 0,
                        losses: rowData.losses || 0,
                        ot: rowData.otLosses || 0,
                        shotsAgainst: rowData.shotsAgainst || 0,
                        ga: rowData.goalsAgainst || 0,
                        gaa: rowData.goalsAgainstAvg?.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }) || 0,
                        svp: rowData.savePctg?.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 }) || 0,
                        shutouts: rowData.shutouts || 0,
                        toi: rowData.timeOnIce || 0,
                    }
                    newRows.push(singleRow);
                }
            }
        })
        let careerTotals = {
            id: "Career Totals",
            season: "Career Totals",
            team: "TOT",
            league: "NHL",
            games: row2Data.gamesPlayed || 0,
            gamesStarted: row2Data.gamesStarted || 0,
            wins: row2Data.wins || 0,
            losses: row2Data.losses || 0,
            ot: row2Data.otLosses || 0,
            shotsAgainst: row2Data.shotsAgainst || 0,
            ga: row2Data.goalsAgainst || 0,
            gaa: row2Data.goalsAgainstAvg?.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }) || 0,
            svp: row2Data.savePctg?.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 }) || 0,
            shutouts: row2Data.shutouts || 0,
            toi: row2Data.timeOnIce || 0,
        }
        if (!isPlayoffs) newRows.push(careerTotals);
        return newRows;
    }

    const favouritesColumn = () => {
        const favouritesDisplay: JSX.Element[] = [];
        favourites?.map((favourite: any) => {
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
                        <Button onClick={() => {
                            router.push({
                                pathname: '/players',
                                query: { playerName: player.fullName },
                            });
                        }}>{player.fullName + "\n"}</Button>
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

    const handleToggleChange = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string,
      ) => {
        if(newAlignment === "left") setIsPlayoffs(false);
        else setIsPlayoffs(true);
        setAlignment(newAlignment);
        console.log(isPlayoffs);
      };

    const control = {
        value: alignment,
        onChange: handleToggleChange,
        exclusive: true,
    };
    
    return (
        <Box>
            {isLoading ? <Loading/> :
            <Box style={{ padding: "20px 60px 40px 60px" }}>
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
                        {favourites?.length > 0 ?
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
                            <Box className="data-grid-container">
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
                                        {isGoalie && "Goaltender"}
                                    </Grid>
                                    <Grid item xs={3}>
                                        {currentPlayer.sweaterNumber ? (!currentTeam ? "No Team" : 
                                            <Typography>
                                                <Button onClick={()=>{
                                                    router.push({
                                                        pathname: '/teams',
                                                        query: { team: currentTeam.fullName },
                                                    });
                                                }}>
                                                    {currentTeam.fullName}
                                                </Button> 
                                                {" #" + currentPlayer.sweaterNumber}
                                            </Typography>) :
                                                (!currentTeam ? "No Team" : 
                                            <Typography>
                                                <Button onClick={()=>{
                                                    router.push({
                                                        pathname: '/teams',
                                                        query: { team: currentTeam.name },
                                                    });
                                                }}>
                                                    {currentTeam.name}
                                                </Button> 
                                                {" #" + currentPlayer.sweaterNumber}
                                            </Typography>)
                                        }
                                        <Typography>
                                            {"Height: " + Math.floor(currentPlayer.height / 12) + "'" + currentPlayer.height % 12}
                                        </Typography>
                                        <Typography>
                                            {"Weight: " + currentPlayer.weight + "lbs"}
                                        </Typography>
                                        <Typography>
                                            {currentPlayer.birthStateProvince ? 
                                                currentPlayer.birthCity + ", " + currentPlayer.birthStateProvince + " - " + currentPlayer.birthCountry :
                                                currentPlayer.birthCity + " - " + currentPlayer.birthCountry
                                            }
                                        </Typography>
                                        <Typography>
                                            {"Born " + currentPlayer.birthDate}
                                        </Typography>
                                        <Typography>
                                            {"Shoots " + currentPlayer.shootsCatches}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3} justifyContent="flex-end">
                                        {featuredStats &&
                                            <Box border={0.5} style={{ padding: "5px", marginBottom: "10px", borderRadius: "5px" }}>
                                                <Typography><b>Current Season</b></Typography>
                                                <Typography>{featuredStats.regularSeason.subSeason.gamesPlayed}GP {featuredStats.regularSeason.subSeason.goals}G {featuredStats.regularSeason.subSeason.assists}A {featuredStats.regularSeason.subSeason.points}P</Typography>
                                            </Box>
                                        }
                                        {featuredStats &&
                                            <Box border={0.5} style={{ padding: "5px", borderRadius: "5px" }}>
                                                <Typography><b>Career Totals</b></Typography>
                                                <Typography>{featuredStats.regularSeason.career.gamesPlayed}GP {featuredStats.regularSeason.career.goals}G {featuredStats.regularSeason.career.assists}A {featuredStats.regularSeason.career.points}P</Typography>
                                            </Box>
                                        }
                                    </Grid>
                                    <Grid item xs={3} justifyContent="flex-end">
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
                                    <Grid item xs={2} justifyContent="flex-end">
                                        <Box 
                                            display="flex"
                                            flexDirection="column"
                                            justifyContent="space-between"
                                        >
                                            <br/>
                                            <br/>
                                            <br/>
                                            <br/>
                                            <ToggleButtonGroup size="small" {...control}>
                                                <ToggleButton value="left" key="left">Regular Season</ToggleButton>
                                                <ToggleButton value="right" key="right">Playoffs</ToggleButton>
                                            </ToggleButtonGroup>
                                        </Box>
                                    </Grid>
                                    <br/>
                                </Grid>
                                {rowData &&
                                    <DataGrid
                                        disableColumnMenu
                                        rows={rowData}
                                        columns={isGoalie ? columns2 : columns}
                                    />
                                }
                            </Box>
                        </Grid>
                        <Grid item xs={2}>
                            {favourites?.length > 0 ?
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
