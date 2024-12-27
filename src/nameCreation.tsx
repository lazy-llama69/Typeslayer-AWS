//nameCreation.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, View, Flex,  Heading } from '@aws-amplify/ui-react';

const nameCreation = () => {
    const navigate = useNavigate();
    const [avatarName, setAvatarName] = useState('');
    const [defeatedBossCount] = useState(0);

    // Handle return to menu
    const handleReturnToMenu = () => {
        navigate('/');
    };

    // Handle name submission and path selection
    const handleStartGame = () => {
        if (!avatarName.trim()) {
            alert('Please enter your avatar name.');
            return;
        }
        // Pass the avatar name and selected path to the GamePlay component
        navigate(`/pathselection/${avatarName}/${defeatedBossCount}`);
    };

    return (
    <View padding="2rem">
        <Flex direction="column" gap="0.5rem" justifyContent="center" alignItems="center">
            <Heading level={1}>Enter Avatar Name</Heading>
            <Input
                value={avatarName}
                onChange={(e) => setAvatarName(e.target.value)}
                placeholder="Enter your avatar name"
                onKeyDown={(e) => {
                if (e.key === 'Enter') handleStartGame();
                }}
            />
        </Flex>

        
        <Flex direction="column" gap="0.5rem" justifyContent="center" alignItems="center">
        <Button
            variation="primary"
            size="large"
            onClick={handleStartGame}
            isDisabled={!avatarName}
            style={{ marginTop: '1rem' }}
        >
            Continue
        </Button>
        <Button
            variation='primary'
            size = 'large'
            onClick={handleReturnToMenu}
            style={ {margin: '1rem'}}
        >
            Return to menu
        </Button>
        </Flex>

        
    </View>
  );
};

export default nameCreation;
