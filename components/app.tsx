"use client";

import Account from "./account";
import Providers from "./providers";
import Schedule from "./schedule";
import Profile from "./profile";
import Navbar from "./navbar";

import Link from 'next/link';

// Icons
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PeopleIcon from '@mui/icons-material/People';
import GroupsIcon from '@mui/icons-material/Groups';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';

// Top 5s
import { topCenters, topWingers, topDefenders, topGoalies } from "../constants/top5";

import { Box, Button, Grid } from "@mui/material";

export default function App() {
    return (
        <Providers>
            <Navbar/>
            <Box 
                style={{ padding: "25px" }}
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <Box
                    component="img"
                    sx={{
                        height: 200,
                        width: 1200,
                    }}
                    src={"https://cdn.discordapp.com/attachments/566250791707344896/1166167746938163280/image.png?ex=65498159&is=65370c59&hm=065007e2f2503cb1cc9ba0bea40db42c9cd1a673315b6688538e3125af0f4866&"}
                    alt={"is  banner"}
                />
            </Box>
            <Box 
                style={{ paddingLeft: "125px", paddingRight: "125px" }}
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <Grid 
                    container
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid item xs={3} p={3}>
                        <Link href="/players">
                            <Box
                                border="1px solid #000"
                                borderRadius="10px"
                                p={2}
                                >
                                <Grid container>
                                    <Grid item xs={2.5}>
                                        <h1>Players</h1>
                                    </Grid>
                                    <Grid item xs={9.5}>
                                        <PeopleIcon />
                                    </Grid>
                                </Grid>
                                <p>Browse a massive database of all players that have ever played in the NHL and more! Pick you favourite players to stay updated.</p>
                            </Box>
                        </Link>
                    </Grid>
                    <Grid item xs={3} p={3}>
                        <Link href="/teams">
                            <Box
                                border="1px solid #000"
                                borderRadius="10px"
                                p={2} 
                                >
                                <Grid container>
                                    <Grid item xs={2.5}>
                                        <h1>Teams</h1>
                                    </Grid>
                                    <Grid item xs={9.5}>
                                        <GroupsIcon />
                                    </Grid>
                                </Grid>
                                <p>Explore the complete rosters, stats, and more of all NHL teams this season, as well as up-to-date standings.</p>
                            </Box>
                        </Link>
                    </Grid>
                    <Grid item xs={3} p={3}>
                        <Link href="/games">
                            <Box
                                border="1px solid #000" 
                                borderRadius="10px"
                                p={2}
                                >
                                <Grid container>
                                    <Grid item xs={2.5}>
                                        <h1>Games</h1>
                                    </Grid>
                                    <Grid item xs={9.5}>
                                        <VideogameAssetIcon />
                                    </Grid>
                                </Grid>
                                <p>In development - Pick players for awards, predict goal scorers and compete with others!</p>
                            </Box>
                        </Link>
                    </Grid>
                    <Grid item xs={3} p={3}>
                        <Link href="/account">
                            <Box
                                border="1px solid #000" 
                                borderRadius="10px"
                                p={2}
                                >
                                <Grid container>
                                    <Grid item xs={2.5}>
                                        <h1>Account</h1>
                                    </Grid>
                                    <Grid item xs={9.5}>
                                        <AccountCircleIcon />
                                    </Grid>
                                </Grid>
                                <p>View your games data and favourite players & teams on your account page! You can also manage your account here.</p>
                            </Box>
                        </Link>
                    </Grid>
                </Grid>
            </Box>
            <Box 
                style={{ paddingLeft: "125px", paddingRight: "125px" }}
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <Grid 
                    container
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid item xs={3} p={3}>
                        <Box
                            border="1px solid #000"
                            borderRadius="10px"
                            p={2}
                        >
                            <h1>Top 5 Centers - 2023</h1>
                            <Grid container>
                                <Grid item xs={2}>
                                    {topCenters.map((center: any) => {
                                        return (
                                            <Box
                                                component="img"
                                                sx={{
                                                    height: 35,
                                                    width: 35,
                                                }}
                                                src={"http://nhl.bamcontent.com/images/headshots/current/168x168/" + center[0] + ".jpg"}
                                            />
                                        )
                                    })}
                                </Grid>
                                <Grid item xs={10}>
                                    {topCenters.map((center: any) => {
                                        const playerName = center[1];
                                        return (
                                            <Box>
                                                <Link href={{ pathname: '/players', query: { playerName }}}>
                                                    <Button color="inherit">{playerName}</Button>
                                                </Link>
                                            </Box>
                                        )
                                    })}
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item xs={3} p={3}>
                        <Box
                            border="1px solid #000"
                            borderRadius="10px"
                            p={2} 
                        >
                            <h1>Top 5 Wingers - 2023</h1>
                            <Grid container>
                                <Grid item xs={2}>
                                    {topWingers.map((winger: any) => {
                                        return (
                                            <Box
                                                component="img"
                                                sx={{
                                                    height: 35,
                                                    width: 35,
                                                }}
                                                src={"http://nhl.bamcontent.com/images/headshots/current/168x168/" + winger[0] + ".jpg"}
                                            />
                                        )
                                    })}
                                </Grid>
                                <Grid item xs={10}>
                                    {topWingers.map((winger: any) => {
                                        const playerName: string = winger[1];
                                        return (
                                            <Box>
                                                <Link href={{ pathname: '/players', query: { playerName }}}>
                                                    <Button color="inherit">{winger[1]}</Button>
                                                </Link>
                                            </Box>
                                        )
                                    })}
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item xs={3} p={3}>
                        <Box
                            border="1px solid #000" 
                            borderRadius="10px"
                            p={2}
                        >
                            <h1>Top 5 Defenseman - 2023</h1>
                            <Grid container>
                                <Grid item xs={2}>
                                    {topDefenders.map((defender: any) => {
                                        return (
                                            <Box
                                                component="img"
                                                sx={{
                                                    height: 35,
                                                    width: 35,
                                                }}
                                                src={"http://nhl.bamcontent.com/images/headshots/current/168x168/" + defender[0] + ".jpg"}
                                            />
                                        )
                                    })}
                                </Grid>
                                <Grid item xs={10}>
                                    {topDefenders.map((defender: any) => {
                                        const playerName = defender[1];
                                        return (
                                            <Box>
                                                <Link href={{ pathname: '/players', query: { playerName }}}>
                                                    <Button color="inherit">{playerName}</Button>
                                                </Link>
                                            </Box>
                                        )
                                    })}
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item xs={3} p={3}>
                        <Box
                            border="1px solid #000" 
                            borderRadius="10px"
                            p={2}
                        >
                            <h1>Top 5 Goalies - 2023</h1>
                            <Grid container>
                                <Grid item xs={2}>
                                    {topGoalies.map((goalies: any) => {
                                        return (
                                            <Box
                                                component="img"
                                                sx={{
                                                    height: 35,
                                                    width: 35,
                                                }}
                                                src={"http://nhl.bamcontent.com/images/headshots/current/168x168/" + goalies[0] + ".jpg"}
                                            />
                                        )
                                    })}
                                </Grid>
                                <Grid item xs={10}>
                                    {topGoalies.map((goalies: any) => {
                                        const playerName = goalies[1];
                                        return (
                                            <Box>
                                                <Link href={{ pathname: '/players', query: { playerName }}}>
                                                    <Button color="inherit">{playerName}</Button>
                                                </Link>
                                            </Box>
                                        )
                                    })}
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <p>{"Todo: Add goalie stat page support, add games"}</p>
            </Box>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <p>{"All logos are the trademark & property of their owners and are presented here for educational purposes. Data is taken directly from the National Hockey League."}</p>
            </Box>
        </Providers>
    );
}
