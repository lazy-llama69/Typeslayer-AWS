import { Button, Heading, Flex, View } from '@aws-amplify/ui-react';
import { useAuthenticator } from '@aws-amplify/ui-react';

const GameApp = () => {

    const { user, signOut } = useAuthenticator();

    // Main menu buttons
    const handleNewGame = () => {
        console.log('New game started!');
        // Implement your logic to start a new game here
    };

    const handleContinueGame = () => {
        console.log('Continuing game...');
        // Implement logic to continue the game if applicable
    };

    const handleLeaderboards = () => {
        console.log('Opening leaderboards...');
        // Implement logic for leaderboards here
    };

    const handleSettings = () => {
        console.log('Opening settings...');
        // Implement settings logic here
    };

    return (
        <View padding="2rem">
        <Flex direction="column" gap="1rem" alignItems="center">
            <Heading level={1}>Welcome, {user?.signInDetails?.loginId?.toUpperCase()}</Heading>

            <Button variation="primary" size="large" onClick={handleNewGame}>
            New Game
            </Button>

            <Button variation="primary" size="large" onClick={handleContinueGame}>
            Continue Game
            </Button>

            <Button variation="primary" size="large" onClick={handleLeaderboards}>
            Leaderboards
            </Button>

            <Button variation="primary" size="large" onClick={handleSettings}>
            Settings
            </Button>

            <Button variation="destructive" size="small" onClick={signOut}>
            Sign Out
            </Button>
        </Flex>
        </View>
  );
};

export default GameApp;
