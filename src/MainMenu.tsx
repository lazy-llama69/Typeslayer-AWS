import { Card, Heading, Grid, View } from '@aws-amplify/ui-react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';
import { MdLeaderboard, MdSettings, MdExitToApp } from "react-icons/md";
import { TbTargetArrow, TbCubePlus  } from "react-icons/tb";


const MainMenu = () => {
    
    const { user, signOut } = useAuthenticator();
    const navigate = useNavigate(); 

    // Main menu buttons
    const handleNewGame = () => {
        navigate('/nameCreation'); 
    };

    const handleLeaderboards = () => {
        navigate('/leaderboards');
    };

    const handleSettings = () => {
        navigate('/settings');
    };

    const handlePractice = () => {
        navigate('/practice');
    };

    return (
        <View className="main-menu" padding="2rem">
            <Heading 
                level={1} 
                style={{
                    fontSize: "4rem",
                    fontWeight: "bold",
                    background: "linear-gradient(90deg, #ff4500, #ff6347, #ff0000, #dc143c)",
                    backgroundSize: "800% 800%",
                    animation: "flameAnimation 4s ease-in-out infinite",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textTransform: "uppercase",
                    letterSpacing: "0.2rem",
                    backgroundClip: "text", 
                    textAlign:"center",
                    marginBottom:"50px",
                }}
            >
                TYPESLAYER
            </Heading>
            <Heading level={1} textAlign="center" marginBottom="2rem">
                Welcome, {user?.signInDetails?.loginId?.toLowerCase().match(/^[^@]+/)?.[0]}
            </Heading>
            <Grid
                columnGap="1rem"
                rowGap="1rem"
                templateColumns="1fr 1fr 1fr" 
                templateRows="3fr 1fr"
            >
                {/* New Game */}
                <Card
                    columnStart="1"
                    columnEnd="2"
                    rowStart="1"
                    rowEnd="3"
                    padding="1rem"
                    textAlign="center"
                    onClick={handleNewGame}
                    style={{
                        cursor: 'pointer',
                        backgroundColor: '#d1e7dd', 
                        color: '#0f5132', 
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '28px',
                    }}
                >
                    <TbCubePlus  /> New Game
                </Card>

                {/* Practice Mode */}
                <Card
                    columnStart="2"
                    columnEnd="-1"
                    padding="1rem"
                    textAlign="center"
                    onClick={handlePractice}
                    style={{
                        cursor: 'pointer',
                        backgroundColor: '#cff4fc', 
                        color: '#055160',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '28px',
                    }}
                >
                    <TbTargetArrow />Practice Mode
                </Card>

                {/* Leaderboards */}
                <Card
                    columnStart="2"
                    columnEnd="2"
                    padding="1rem"
                    textAlign="center"
                    onClick={handleLeaderboards}
                    style={{
                        cursor: 'pointer',
                        backgroundColor: '#fef3c7', 
                        color: '#854d0e',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '18px',   
                    }}
                >
                    <MdLeaderboard />Leaderboards
                </Card>

                {/* Settings */}
                <Card
                    columnStart="3"
                    columnEnd="-1"
                    padding="1rem"
                    textAlign="center"
                    onClick={handleSettings}
                    style={{
                        cursor: 'pointer',
                        backgroundColor: '#f0f4f8 ', 
                        color: '#2c3e50 ', 
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '18px', 
                    }}
                >
                    <MdSettings />Settings
                </Card>

                {/* Sign Out */}
                <Card
                    columnStart="1"
                    columnEnd="-1"
                    padding="1rem"
                    textAlign="center"
                    onClick={signOut}
                    style={{
                        cursor: 'pointer',
                        backgroundColor: '#f8d7da', 
                        color: '#842029',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '19px',
                    }}
                >
                    <MdExitToApp/>Sign Out
                </Card>
            </Grid>

        </View>
    );
};

export default MainMenu;
