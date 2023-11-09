"use client";

import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button, Box, Grid } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Loading from "./loading";

import { atlantic, metro, central, pacific } from "../constants/teams";

import Link from 'next/link';
import { useRouter } from 'next/router';
import "./styles/teams.styles.css";

const Teams = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [displayType, setDisplayType] = useState<number>(0);
    const [standingsType, setStandingsType] = useState<number>(0);

    const [teamsList, setTeamsList] = useState<any>(null);

    const [currentTeam, setCurrentTeam] = useState<any>(null);
    const [currentRoster, setCurrentRoster] = useState<any>(null);
    const [rosterStats, setRosterStats] = useState<any>(null);
    const [standings, setStandings] = useState<any>(null);
    const [sortedStandings, setSortedStandings] = useState<any>(null);

    const [rows, setRows] = useState<any>(null);
    const [defenseRows, setDefenseRows] = useState<any>(null);
    const [goalieRows, setGoalieRows] = useState<any>(null);

    const router = useRouter();
    const teamProp = router.query;

    
    const columns: GridColDef[] = [
        {
            field: 'imageUrl',
            headerName: '',
            width: 50,
            renderCell: (params) => (
                <img src={params.row.imageUrl} style={{ width: '100%', height: 'auto' }} />
            ),
        },
        {
            field: 'jerseyNumber',
            headerName: '#',
            width: 50,
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 300,
            renderCell: (params) => (
                <Button onClick={() => {
                    router.push({
                        pathname: '/players',
                        query: { playerName: params.row.name },
                    });
                }}>{params.row.name}</Button>
            ),
        },
        {
            field: 'position',
            headerName: 'Position',
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
            field: 'toig',
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

    const columns2: GridColDef[] = [
        {
            field: 'imageUrl',
            headerName: '',
            width: 50,
            renderCell: (params) => (
                <img src={params.row.imageUrl} style={{ width: '100%', height: 'auto' }} />
            ),
        },
        {
            field: 'jerseyNumber',
            headerName: '#',
            width: 50,
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 300,
            renderCell: (params) => (
                <Button onClick={() => {
                    router.push({
                        pathname: '/players',
                        query: { playerName: params.row.name },
                    });
                }}>{params.row.name}</Button>
            ),
        },
        {
            field: 'position',
            headerName: 'Position',
            width: 100,
        },
        {
            field: 'games',
            headerName: 'GP',
            width: 60,
        },
        {
            field: 'gamesStarted',
            headerName: 'GS',
            width: 60,
        },
        {
            field: 'wins',
            headerName: 'W',
            width: 60,
        },
        {
            field: 'losses',
            headerName: 'L',
            width: 60,
        },
        {
            field: 'ot',
            headerName: 'OT',
            width: 60,
        },
        {
            field: 'shotsAgainst',
            headerName: 'SA',
            width: 60,
        },
        {
            field: 'ga',
            headerName: 'GA',
            width: 60,
        },
        {
            field: 'gaa',
            headerName: 'GAA',
            width: 80,
        },
        {
            field: 'svp',
            headerName: 'SV%',
            width: 100,
        },
        {
            field: 'shutouts',
            headerName: 'SO',
            width: 60,
        },
        {
            field: 'toi',
            headerName: 'TOI',
            width: 100,
        },
    ]

    const standingsCols: GridColDef[] = [
        {
            field: 'id',
            headerName: '',
            width: 50,
            renderCell: (params) => (
                <>
                    {teamsList.teams.map((team: any) => {
                        if (team.id === params.row.id) return (
                            <img src={"https://assets.nhle.com/logos/nhl/svg/" + team.abbreviation + "_light.svg"} style={{ width: '100%', height: 'auto' }} />
                        );
                    })} 
                </>
            ),
        },
        {
            field: 'rank',
            headerName: 'Rank',
            width: 100,
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 250,
            renderCell: (params) => (
                <Button onClick={() => {
                    router.push({
                        pathname: '/teams',
                        query: { team: params.row.name },
                    });
                }}>{params.row.name}</Button>
            ),
        },
        {
            field: 'games',
            headerName: 'GP',
            width: 60,
        },
        {
            field: 'wins',
            headerName: 'W',
            width: 60,
        },
        {
            field: 'losses',
            headerName: 'L',
            width: 60,
        },
        {
            field: 'ot',
            headerName: 'OT',
            width: 60,
        },
        {
            field: 'pts',
            headerName: 'PTS',
            width: 60,
        },
        {
            field: 'ptspct',
            headerName: 'P%',
            width: 60,
        },
        {
            field: 'rw',
            headerName: 'RW',
            width: 60,
        },
        {
            field: 'gf',
            headerName: 'GF',
            width: 60,
        },
        {
            field: 'ga',
            headerName: 'GA',
            width: 60,
        },
        {
            field: 'diff',
            headerName: 'Diff',
            width: 60,
        },
        {
            field: 'streak',
            headerName: 'Streak',
            width: 60,
        },
    ]
    
    // Initialize Teams Data
    useEffect(() => { 
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('https://api.nhle.com/stats/rest/en/team');
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
            } catch (error) {
                console.error('Error reading the JSON file:', error);
            }
            setIsLoading(false);
        };
        fetchData();
    }, []);

    // Initialize Standings Data
    useEffect(() => { 
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('https://api-web.nhle.com/v1/standings/now');
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
                const leagueStandings: any[] = [];
                const divisionalStandings = JSON.parse(result);
                divisionalStandings.records.map((division: any) => {
                    division.teamRecords.map((team: any) => {
                        leagueStandings.push(team);
                    })
                })
                setStandings(leagueStandings);
                setSortedStandings(divisionalStandings.records);
            } catch (error) {
                console.error('Error reading the JSON file:', error);
            }
            setIsLoading(false);
        };
        fetchData();
    }, []);

    useEffect(() => {
        console.log("standings");
        console.log(standings);
    }, [standings])
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('https://statsapi.web.nhl.com/api/v1/teams/' + currentTeam.id + "?expand=team.roster");
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
                setCurrentRoster(JSON.parse(result));
            } catch (error) {
                console.error('Error reading the JSON file:', error);
            }
            setIsLoading(false);
        };
        fetchData();
    }, [currentTeam])

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const seasonStats: any[] = [];
            currentRoster.teams[0].roster.roster.map(async (player: any) => {
                try {
                    const response = await fetch('https://statsapi.web.nhl.com/api/v1/people/' + player.person.id + '/stats?stats=statsSingleSeason&season=20232024');
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
                    seasonStats.push(JSON.parse(result));
                } catch (error) {
                    console.error('Error reading the JSON file:', error);
                }
            })

            setRosterStats(seasonStats);
            setIsLoading(false);
        };
        if (currentRoster) fetchData();
    }, [currentRoster])

    useEffect(() => {
        if(currentRoster) {
            prepareDataForDataGrid(currentRoster.teams[0].roster.roster, "F");
            prepareDataForDataGrid(currentRoster.teams[0].roster.roster, "D");
            prepareGoalieForDataGrid(currentRoster.teams[0].roster.roster);
        }
    }, [rosterStats]);

    // Initialize page if team query is given
    useEffect(() => {
        if (teamProp.team && teamsList) {
            searchList(teamProp.team as string);
            console.log(currentTeam);
            
        }
        else {
            setCurrentTeam(null);
        }
    }, [teamProp, teamsList])

    const searchList = (search: string) => {
        let found: boolean = false;
        for (let key in teamsList.teams) {
            if (teamsList.teams.hasOwnProperty(key)){
            if (teamsList.teams[key].name.toLowerCase() === search.toLowerCase()) {
                found = true;
                setCurrentTeam(teamsList.teams[key]);
                break;
            }
            }
        }
    }

    const toTimeOnIce = (timeString: string, games: number) => {
        const [minutes, seconds] = timeString.split(':').map(Number);
        const timeInSeconds = (minutes * 60 + seconds) / games;
        const minutesPerGame = Math.floor(timeInSeconds / 60);
        const secondsPerGame = timeInSeconds % 60;
        console.log(`${minutesPerGame}:${secondsPerGame.toString().padStart(2, '0')}`);
        return `${minutesPerGame}:${Math.round(secondsPerGame).toString().padStart(2, '0')}`;
    }

    const prepareDataForDataGrid = (rows: any, playerType: string) => {
        let newRows: any[] = [];
        rows.map(async (rowData: any) => {
            let seasonStats: any;
            try {
                const response = await fetch('https://statsapi.web.nhl.com/api/v1/people/' + rowData.person.id + '/stats?stats=statsSingleSeason&season=20232024');
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
                seasonStats = JSON.parse(result);
            } catch (error) {
                console.error('Error reading the JSON file:', error);
            }
            if (seasonStats.stats[0].splits[0] && ((playerType === "F" && rowData.position.abbreviation != "D" && rowData.position.abbreviation != "G") || playerType === rowData.position.abbreviation)) {
                let singleRow = {
                    id: rowData.person.id,
                    imageUrl: "http://nhl.bamcontent.com/images/headshots/current/168x168/" + rowData.person.id + ".jpg",
                    jerseyNumber: parseInt(rowData.jerseyNumber),
                    name: rowData.person.fullName,
                    position: rowData.position.abbreviation,
                    games: seasonStats.stats[0].splits[0].stat.games || "0",
                    goals: seasonStats.stats[0].splits[0].stat.goals || "0",
                    assists: seasonStats.stats[0].splits[0].stat.assists || "0",
                    points: parseInt(seasonStats.stats[0].splits[0].stat.points) || "0",
                    plusMinus: seasonStats.stats[0].splits[0].stat.plusMinus || "0",
                    penaltyMins: seasonStats.stats[0].splits[0].stat.pim || "0",
                    ppg: seasonStats.stats[0].splits[0].stat.powerPlayGoal || "0",
                    ppp: seasonStats.stats[0].splits[0].stat.powerPlayPoints || "0",
                    shg: seasonStats.stats[0].splits[0].stat.shortHandedGoals || "0",
                    shp: seasonStats.stats[0].splits[0].stat.shortHandedPoints || "0",
                    toig: toTimeOnIce(seasonStats.stats[0].splits[0].stat.timeOnIce, parseInt(seasonStats.stats[0].splits[0].stat.games)) || 0,
                    gwg: seasonStats.stats[0].splits[0].stat.gameWinningGoals || "0",
                    otg: seasonStats.stats[0].splits[0].stat.overTimeGoals || "0",
                    shots: seasonStats.stats[0].splits[0].stat.shots || "0",
                    shotPercent: seasonStats.stats[0].splits[0].stat.shots === 0 ? 0 : (seasonStats.stats[0].splits[0].stat.goals / seasonStats.stats[0].splits[0].stat.shots * 100).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) || 0,
                    faceoffs: seasonStats.stats[0].splits[0].stat.faceOffPct || 0,
                }
                newRows = JSON.parse(JSON.stringify(newRows));
                newRows.push(singleRow);
                if (playerType === "F") setRows(newRows);
                else setDefenseRows(newRows);
            }
            
        })
    }

    const prepareGoalieForDataGrid = (rows: any) => {
        let newRows: any[] = [];
        rows.map(async (rowData: any) => {
            let seasonStats: any;
            try {
                const response = await fetch('https://statsapi.web.nhl.com/api/v1/people/' + rowData.person.id + '/stats?stats=statsSingleSeason&season=20232024');
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
                seasonStats = JSON.parse(result);
            } catch (error) {
                console.error('Error reading the JSON file:', error);
            }
            if (seasonStats.stats[0].splits[0] && rowData.position.abbreviation === "G") {
                console.log(rowData);
                let singleRow = {
                    id: rowData.person.id,
                    imageUrl: "http://nhl.bamcontent.com/images/headshots/current/168x168/" + rowData.person.id + ".jpg",
                    jerseyNumber: parseInt(rowData.jerseyNumber),
                    name: rowData.person.fullName,
                    position: rowData.position.abbreviation,
                    games: seasonStats.stats[0].splits[0].stat.games || 0,
                    gamesStarted: seasonStats.stats[0].splits[0].gamesStarted || 0,
                    wins: seasonStats.stats[0].splits[0].stat.wins || 0,
                    losses: seasonStats.stats[0].splits[0].stat.losses || 0,
                    ot: seasonStats.stats[0].splits[0].stat.ot || 0,
                    shotsAgainst: seasonStats.stats[0].splits[0].stat.shotsAgainst || 0,
                    ga: seasonStats.stats[0].splits[0].stat.goalsAgainst || 0,
                    gaa: seasonStats.stats[0].splits[0].stat.goalAgainstAverage.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }) || 0,
                    svp: seasonStats.stats[0].splits[0].stat.savePercentage.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 }) || 0,
                    shutouts: seasonStats.stats[0].splits[0].stat.shutouts || 0,
                    toi: seasonStats.stats[0].splits[0].stat.timeOnIce || 0,
                }
                newRows = JSON.parse(JSON.stringify(newRows));
                newRows.push(singleRow);
                setGoalieRows(newRows);
            }
            
        })
    }

    const prepareStandingsForDataGrid = (rows: any, standingsType: number) => {
        const newRows: any[] = [];
        rows.map((rowData: any) => {
            let singleRow = {
                id: rowData.team.id,
                rank: parseInt(standingsType === 0 ? rowData.divisionRank : (standingsType === 1 ? rowData.conferenceRank : rowData.leagueRank)),
                name: rowData.team.name,
                games: parseInt(rowData.gamesPlayed),
                wins: rowData.leagueRecord.wins,
                losses: rowData.leagueRecord.losses,
                ot: rowData.leagueRecord.ot,
                pts: rowData.points,
                ptspct: parseFloat(rowData.pointsPercentage).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }),
                rw: rowData.regulationWins,
                gf: rowData.goalsScored,
                ga: rowData.goalsAgainst,
                diff: parseInt(rowData.goalsScored) - parseInt(rowData.goalsAgainst),
                streak: rowData.streak.streakCode,
            }
            newRows.push(singleRow);
        })
        return newRows;
    }

    const handleStandingsChange = (newValue: number) => {
        setStandingsType(newValue);
    }

    const standingsDisplay = () => {
        return (
            <>
                <Box style={{ paddingBottom: "25px" }}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Button
                        disabled={standingsType===0}
                        onClick={() => {handleStandingsChange(0)}}
                    >
                        Division
                    </Button>
                    <Button
                        disabled={standingsType===1}
                        onClick={() => {handleStandingsChange(1)}}
                    >
                        Conference
                    </Button>
                    <Button
                        disabled={standingsType===2}
                        onClick={() => {handleStandingsChange(2)}}
                    >
                        League
                    </Button>
                </Box>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    {standingsType === 0 &&
                        <Box className="data-grid-container">
                            {sortedStandings.map((division: any, index: number) => {
                                return (
                                    <Box>
                                        {index % 2 === 0 && 
                                            <Box style={{ padding: "25px" }}
                                                display="flex"
                                                justifyContent="center"
                                                alignItems="center"
                                            >
                                                <h1>
                                                    <b>{division.conference.name + " Conference"}</b>
                                                </h1>
                                            </Box>
                                        }
                                        <h1><b>{division.division.name + " Division"}</b></h1>
                                        <DataGrid
                                            disableColumnMenu
                                            rows={prepareStandingsForDataGrid(division.teamRecords, standingsType)}
                                            columns={standingsCols}
                                            sortModel={[{
                                                field: "rank",
                                                sort: "asc",
                                            }]}
                                            onRowClick={(params) => {
                                                router.push({
                                                    pathname: '/teams',
                                                    query: { team: params.row.name },
                                                });
                                            }}
                                        />
                                        <br/>
                                    </Box>
                                )
                            })}
                        </Box>
                    }
                    {standingsType === 1 &&
                        <Box className="data-grid-container">
                            {sortedStandings.map((division: any, index: number) => {
                                // Combine divisions to make conference
                                if (index % 2 === 0) {
                                    const conference: any[] = [];
                                    sortedStandings[index].teamRecords.map((team: any) => {
                                        conference.push(team);
                                    })
                                    sortedStandings[index + 1].teamRecords.map((team: any) => {
                                        conference.push(team);
                                    })
                                    return (
                                        <Box>
                                            <h1>
                                                <b>{division.conference.name + " Conference"}</b>
                                            </h1>
                                            <DataGrid
                                                disableColumnMenu
                                                rows={prepareStandingsForDataGrid(conference, standingsType)}
                                                columns={standingsCols}
                                                sortModel={[{
                                                    field: "rank",
                                                    sort: "asc",
                                                }]}
                                                onRowClick={(params) => {
                                                    router.push({
                                                        pathname: '/teams',
                                                        query: { team: params.row.name },
                                                    });
                                                }}
                                            />
                                            <br/>
                                        </Box>
                                    )
                                }
                            })}
                        </Box>
                    }
                    {standingsType === 2 &&
                        <Box className="data-grid-container">
                            <h1>
                                <b>{"League Standings"}</b>
                            </h1>
                            <DataGrid
                                disableColumnMenu
                                rows={prepareStandingsForDataGrid(standings, standingsType)}
                                columns={standingsCols}
                                sortModel={[{
                                    field: "rank",
                                    sort: "asc",
                                }]}
                                onRowClick={(params) => {
                                    router.push({
                                        pathname: '/teams',
                                        query: { team: params.row.name },
                                    });
                                }}
                            />
                        </Box>
                    }
                </Box>
            </>
        )
    }

    const teamsDisplay = () => {
        const metroDisplay: JSX.Element[] = [];
        const atlanticDisplay: JSX.Element[] = [];
        const centralDisplay: JSX.Element[] = [];
        const pacificDisplay: JSX.Element[] = [];

        if (teamsList) {
            console.log(teamsList);
            for (let i = 0; i < 59; i++) {
                const teamDisplayRow = (
                    <Grid container>
                        <Grid item xs={2}>
                            <Box
                                component="img"
                                sx={{
                                    height: 40,
                                    width: 40,
                                }}
                                src={"https://assets.nhle.com/logos/nhl/svg/" + teamsList.data[i].triCode + "_light.svg"}
                            />
                        </Grid>
                        <Grid item xs={10}>
                            <Button onClick={() => {
                                router.push({
                                    pathname: '/teams',
                                    query: { team: teamsList.data[i].fullName },
                                });
                            }}>{teamsList.data[i].fullName}</Button>
                        </Grid>
                    </Grid>
                );
                console.log(metro);
                console.log(teamsList.data[i].fullName);
                if (metro.includes(teamsList.data[i].fullName)) metroDisplay.push(teamDisplayRow);
                else if (atlantic.includes(teamsList.data[i].fullName)) atlanticDisplay.push(teamDisplayRow);
                else if (central.includes(teamsList.data[i].fullName)) centralDisplay.push(teamDisplayRow);
                else if (pacific.includes(teamsList.data[i].fullName)) pacificDisplay.push(teamDisplayRow);
            }
        }

        return (
            <Box>
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
            </Box>
        );
    }

    const handleDisplayChange = () => {
        if (displayType === 0) setDisplayType(1);
        else setDisplayType(0);
    }

    return (
        <Box style={{ padding: "10px 60px 40px 60px" }}>
            {isLoading ? <Loading/> :
                <>
                    {teamsList &&
                        <>
                            {!currentTeam ? 
                                <Box>
                                    <Box style={{ paddingBottom: "25px" }}
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                    >
                                        <Button
                                            disabled={displayType===0}
                                            onClick={handleDisplayChange}
                                        >
                                            Teams Display
                                        </Button>
                                        <Button
                                            disabled={displayType===1}
                                            onClick={handleDisplayChange}
                                        >
                                            Standings Display
                                        </Button>
                                    </Box>
                                    {displayType === 0 ? <>{teamsDisplay()}</> : <>{standingsDisplay()}</>}
                                </Box> 
                            :
                                <Box>
                                    <Box>
                                        {currentRoster && rosterStats && rows && defenseRows && goalieRows &&
                                            <Box className="data-grid-container">
                                                <Grid container>
                                                    <Grid item xs={1}>
                                                        <Box
                                                            component="img"
                                                            sx={{
                                                                height: 100,
                                                                width: 100,
                                                            }}
                                                            src={"https://assets.nhle.com/logos/nhl/svg/" + currentRoster.teams[0].abbreviation + "_light.svg"}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={2}>
                                                        <br/>
                                                        <h1><b>{currentRoster.teams[0].locationName + " " + currentRoster.teams[0].teamName}</b></h1>
                                                        <p>2023 - 2024 NHL Roster</p>
                                                    </Grid>
                                                    <Grid item xs={8}>
                                                        <br/>
                                                        <h1><b>Team Performance</b></h1>
                                                        {standings && standings.map((team: any) => {
                                                            if (team.team.name === currentRoster.teams[0].locationName + " " + currentRoster.teams[0].teamName) {
                                                                return (
                                                                    <p>{"#" + team.leagueRank + " League Rank - Record: " + team.leagueRecord.wins + "W " + team.leagueRecord.losses + "L " + team.leagueRecord.ot + "OTL"}</p>
                                                                )
                                                            }
                                                        })}
                                                    </Grid>
                                                    <Grid item xs={1}>
                                                        <br/>
                                                        <Button 
                                                            onClick={()=>{
                                                                router.push({
                                                                    pathname: '/teams',
                                                                });
                                                            }}
                                                            startIcon={<ArrowBackIcon />}
                                                        >
                                                            {"Back to Teams"}
                                                        </Button> 
                                                    </Grid>
                                                </Grid>

                                                <br/>
                                                <h1>Forwards</h1>
                                                <DataGrid
                                                    disableColumnMenu
                                                    rows={rows}
                                                    columns={columns}
                                                    onRowClick={(params) => {
                                                        router.push({
                                                            pathname: '/players',
                                                            query: { playerName: params.row.name },
                                                        });
                                                    }}
                                                    sortModel={[{
                                                        field: "points",
                                                        sort: "desc",
                                                    }]}
                                                />

                                                <br/>
                                                <h1>Defensemen</h1>
                                                <DataGrid
                                                    disableColumnMenu
                                                    rows={defenseRows}
                                                    columns={columns}
                                                    onRowClick={(params) => {
                                                        router.push({
                                                            pathname: '/players',
                                                            query: { playerName: params.row.name },
                                                        });
                                                    }}
                                                    sortModel={[{
                                                        field: "points",
                                                        sort: "desc",
                                                    }]}
                                                />
                                                
                                                <br/>
                                                <h1>Goaltenders</h1>
                                                <DataGrid
                                                    disableColumnMenu
                                                    rows={goalieRows}
                                                    columns={columns2}
                                                    onRowClick={(params) => {
                                                        router.push({
                                                            pathname: '/players',
                                                            query: { playerName: params.row.name },
                                                        });
                                                    }}
                                                    sortModel={[{
                                                        field: "games",
                                                        sort: "desc",
                                                    }]}
                                                />
                                            </Box>
                                        }
                                    </Box>
                                </Box>
                            }
                        </>
                    }
                </>
            }
        </Box>
    )
}

export default Teams;
