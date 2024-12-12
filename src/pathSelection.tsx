// pathSelection.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Collection, Card, Image, View, Flex, Badge, Divider, Heading } from '@aws-amplify/ui-react';


// Interface for Path Item
interface PathItem {
  title: string;
  badges: string[];
  imageUrl: string;
  pathId: number;
}


const PathSelection = () => {
    const navigate = useNavigate();
    const [avatarName, setAvatarName] = useState('');
    const [selectedPath, setSelectedPath] = useState<number | null>(null);

    // Handle return to menu
    const handleReturnToMenu = () => {
        navigate('/');
    };
    // Define the paths
    const items: PathItem[] = [
        {
        title: 'The Dark Forest',
        badges: ['Easy', 'Poison'],
        imageUrl: 'src/assets/forest_cabin.jpg',
        pathId: 1,
        },
        {
        title: 'Yellow Brick Road',
        badges: ['Hard', 'Heal'],
        imageUrl: 'src/assets/yellowbrickroad.jpg',
        pathId: 2,
        },
        {
        title: 'The Haunted Castle',
        badges: ['Medium', 'Fire'],
        imageUrl: 'src/assets/shop.jpg',
        pathId: 3,
        },
    ];

    // Handle name submission and path selection
    const handleStartGame = () => {
        if (!avatarName.trim()) {
            alert('Please enter your avatar name.');
            return;
        }

        if (selectedPath === null) {
            alert('Please select a path.');
            return;
        }

        // Pass the avatar name and selected path to the GamePlay component
        navigate(`/gameplay/${avatarName}/${selectedPath}`);
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
            <Heading level={2} marginTop="1rem">
                Choose Your Path
            </Heading>
            <Collection items={items} type="list" direction="row" gap="20px" wrap="nowrap">
                {(item, index) => (
                <Card
                    key={index}
                    borderRadius="medium"
                    maxWidth="20rem"
                    variation="outlined"
                    onClick={() => setSelectedPath(item.pathId)}
                    style={{
                    cursor: 'pointer',
                    border: selectedPath === item.pathId ? '2px solid blue' : '1px solid #ddd',
                    }}
                >
                   
                    <Image src={item.imageUrl} alt={item.title} />
                    <View padding="xs">
                    <Flex direction="row" gap="1.5rem" justifyContent="center" alignItems="center">

                        {item.badges.map((badge) => (
                        <Badge
                            key={badge}
                            backgroundColor={
                            badge === 'Easy'
                                ? 'green.40'
                                : badge === 'Hard'
                                ? 'red.40'
                                : badge === 'Heal'
                                ? 'blue.40'
                                : badge === 'Poison'
                                ? 'purple.40'
                                : 'orange.40'
                            }
                        >
                            {badge}
                        </Badge>
                        ))}
                    </Flex>
                    </View>
                    <Divider padding="xs" />
                    <Flex direction="row" gap="0.5rem" justifyContent="center" alignItems="center">
                        <Heading padding="medium">{item.title}</Heading>
                    </Flex>
                </Card>
                )}
            </Collection>

        <Button
            variation="primary"
            size="large"
            onClick={handleStartGame}
            isDisabled={!avatarName || selectedPath === null}
            style={{ marginTop: '1rem' }}
        >
            Start Game
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

export default PathSelection;
