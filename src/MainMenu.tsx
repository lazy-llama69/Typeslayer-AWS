import { Button, Heading, Flex, View } from '@aws-amplify/ui-react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom'; // import the useNavigate hook

const MainMenu = () => {

    const { user, signOut } = useAuthenticator();
    const navigate = useNavigate(); // initialize navigate

    // Main menu buttons
    const handleNewGame = () => {
        console.log('New game started!');
        navigate('/nameCreation'); // navigate to the gameplay screen
    };

    const handleContinueGame = () => {
        console.log('Continuing game...');
        // Implement logic to continue the game if applicable
    };

    const handleLeaderboards = () => {
        console.log('Opening leaderboards...');
        navigate('/leaderboards');
    };

    const handleSettings = () => {
        console.log('Opening settings...');
        // Implement settings logic here
    };

    return (
        <View className="main-menu" padding = "2rem">
            <Flex direction="column" gap="1rem" alignItems="center">
                <Heading level={1}>Welcome, {user?.signInDetails?.loginId?.toUpperCase()}</Heading>

                <Button variation="primary" size="large" onClick={handleNewGame}>
                New Game
                </Button>

                <Button variation="primary" size="large" onClick={handleContinueGame} isDisabled={true}>
                Continue Game
                </Button>

                <Button variation="primary" size="large" onClick={handleLeaderboards}>
                Leaderboards
                </Button>

                <Button variation="primary" size="large" onClick={handleSettings} isDisabled={true}>
                Settings
                </Button>

                <Button variation="destructive" size="large" style={{margin:'1rem'}}onClick={signOut}>
                Sign Out
                </Button>
            </Flex>
        </View>
  );
};

export default MainMenu;
