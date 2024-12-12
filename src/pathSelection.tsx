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

  // Define the paths
  const items: PathItem[] = [
    {
      title: 'Path #1: The Dark Forest',
      badges: ['Easy', 'Poison'],
      imageUrl: '/darkforest.jpg',
      pathId: 1,
    },
    {
      title: 'Path #2: Yellow Brick Road',
      badges: ['Hard', 'Heal'],
      imageUrl: '/yellowbrickroad.jpg',
      pathId: 2,
    },
    {
      title: 'Path #3: The Haunted Castle',
      badges: ['Medium', 'Fire'],
      imageUrl: '/hauntedcastle.jpg',
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
      <Heading level={1}>Enter Avatar Name</Heading>
      <Input
        value={avatarName}
        onChange={(e) => setAvatarName(e.target.value)}
        placeholder="Enter your avatar name"
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleStartGame();
        }}
      />

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
              <Flex>
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
              <Divider padding="xs" />
              <Heading padding="medium">{item.title}</Heading>
            </View>
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
    </View>
  );
};

export default PathSelection;
