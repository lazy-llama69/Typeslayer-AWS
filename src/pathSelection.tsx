// pathSelection.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Collection, Card, Image, View, Flex, Badge, Divider, Heading, Breadcrumbs, ThemeProvider, createTheme  } from '@aws-amplify/ui-react';
import forestCabin from '/assets/paths/forest_cabin.jpg';
import ybr from '/assets/paths/yellowbrickroad.jpg';
import shop from '/assets/paths/shop.jpg';



// Interface for Path Item
interface PathItem {
  title: string;
  badges: string[];
  imageUrl: string;
  pathId: number;   
}


const PathSelection = () => {
    const navigate = useNavigate();
    const { defeatedBossCount } = useParams();
    const [selectedPath, setSelectedPath] = useState<number | null>(null);
    const [breadcrumbs, setBreadcrumbs] = useState<string[]>(['Start']);
    const shopAppears = Math.random() < 1; // 100% chance for the Shop to appear
    const [randomLocation, setRandomLocation] = useState<PathItem[]>([]); // Use state for locations
    // Handle return to menu
    const handleReturnToMenu = () => {
        localStorage.clear();
        navigate('/');
    };
    // Define the paths
    const locations: PathItem[] = [
        {
            title: 'The Dark Forest',
            badges: ['Easy', 'Poison'],
            imageUrl: forestCabin,
            pathId: 1,
        },
        {
            title: 'Yellow Brick Road',
            badges: ['Hard', 'Heal'],
            imageUrl: ybr,
            pathId: 2,
        },
        {
            title: 'The Haunted Castle',
            badges: ['Medium', 'Fire'],
            imageUrl: shop,
            pathId: 3,
        },
        {
            title: 'Shop',
            badges: ['Shop'],
            imageUrl: shop,
            pathId: 4,
        },
    ];

    useEffect(() => {
        const savedBreadcrumbs = localStorage.getItem('breadcrumbs');
        if (savedBreadcrumbs) {
            setBreadcrumbs(JSON.parse(savedBreadcrumbs));
        }
        // Generate random locations
        setRandomLocation(getRandomLocations());
    }, []);

    // Handle name submission and path selection
    const handleStartGame = () => {
        if (selectedPath === null) {
            alert('Please select a path.');
            return;
        }
        const selectedPathTitle = locations.find((item) => item.pathId === selectedPath)?.title || '';
        setBreadcrumbs((prev) => {
            const updatedBreadcrumbs = [...prev, selectedPathTitle];
            // Store updated breadcrumbs in localStorage
            localStorage.setItem('breadcrumbs', JSON.stringify(updatedBreadcrumbs));
            return updatedBreadcrumbs;
        });
        
        if (selectedPathTitle === "Shop"){
            navigate(`/trading/${selectedPath}/${defeatedBossCount}`);
            return;
        }
        // Pass the avatar name and selected path to the GamePlay component
        navigate(`/gameplay/${selectedPath}/${defeatedBossCount}`);
    };

    const theme = createTheme({
        name: 'breadcrumbs-theme',
        tokens: {
          components: {
            breadcrumbs: {
              separator: {
                color: '{colors.secondary.20}',
                fontSize: '{fontSizes.xl}',
                paddingInline: '{space.medium}',
              },
              link: {
                color: '#520e90'
              },
            },
          },
        },
      });

    // Function to get 3 random locations, with a 25% chance for the Shop to appear
    const getRandomLocations = (): PathItem[] => {
        const availableLocations = shopAppears ? locations : locations.filter(loc => loc.pathId !== 4);

        // Shuffle the available locations and select the first 3
        const shuffled = availableLocations.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 3);
    };

    return (
    <View padding="2rem">
        {/* Breadcrumbs Component */}
        <ThemeProvider theme={theme}>
            <Breadcrumbs.Container borderRadius="medium" padding="medium">
                {breadcrumbs.map((text, idx) => (
                    
                    <Breadcrumbs.Item key={`${idx}`} color={"#3F00FF"}>
                        <Breadcrumbs.Link 
                            isCurrent={idx === breadcrumbs.length - 1}
                            style={{
                                fontWeight: 'bold',
                                
                            }}
                        >
                            {text}
                        </Breadcrumbs.Link>
                        {idx !== breadcrumbs.length - 1 && <Breadcrumbs.Separator />} {/* Add separator except for the last item */}
                    </Breadcrumbs.Item>
                ))}
            </Breadcrumbs.Container>
        </ThemeProvider>
        <Flex direction="column" gap="0.5rem" justifyContent="center" alignItems="center">
            <Heading level={2} marginTop="1rem">
                Choose Your Path
            </Heading>
            <p>
            Bosses Defeated: {defeatedBossCount}

            </p>

            <Collection items={randomLocation} type="list" direction="row" gap="20px" wrap="nowrap">
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
                                : badge === 'Shop' 
                                ? 'yellow.40'
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
            isDisabled={selectedPath === null}
            style={{ marginTop: '1rem' }}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleStartGame(); 
                }
            }}
        >
            Choose path
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
