import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayerModel } from './playerModel'; // Import your player model
import { Button, Input, Flex, Heading, View } from '@aws-amplify/ui-react';

const GamePlay = () => {
  const [username, setUsername] = useState('');
  const [player, setPlayer] = useState<PlayerModel | null>(null);
  const navigate = useNavigate(); // Initialize navigation

  // Function to handle the creation of a new player
  const handleCreatePlayer = () => {
    if (username.trim()) {
      const newPlayer = new PlayerModel('1', username); // Create a new player
      setPlayer(newPlayer); // Set the player state
      console.log('Player created:', newPlayer.getStats()); // Log the player stats (optional)
    } else {
      alert('Please enter a valid username!');
    }
  };

  // Function to handle returning to the main menu
  const handleReturnToMenu = () => {
    navigate('/'); // Navigate back to the main menu
  };

  return (
    <View padding="2rem">
      <Flex direction="column" gap="1rem" alignItems="center">
        <Heading level={1}>Create Your Character</Heading>

        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
        />

        <Button variation="primary" size="large" onClick={handleCreatePlayer}>
          Start Game
        </Button>

        {player && (
          <div>
            <Heading level={2}>Welcome, {player.username}!</Heading>
            <p>Health: {player.health}</p>
            <p>Level: {player.level}</p>
            <p>Experience: {player.experience}</p>
          </div>
        )}

        <Button variation="primary" size="small" onClick={handleReturnToMenu}>
          Back to Main Menu
        </Button>
      </Flex>
    </View>
  );
};

export default GamePlay;
