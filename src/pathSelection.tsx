// pathSelection.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Collection, Card, Image, View, Flex, Badge, Divider, Heading, Breadcrumbs, ThemeProvider, createTheme, ScrollView  } from '@aws-amplify/ui-react';
import forestCabin from '/assets/paths/forest_cabin.jpg';
import ybr from '/assets/paths/yellowbrickroad.jpg';
import shop from '/assets/paths/shop.jpg';
import haunted_castle from '/assets/paths/haunted_castle.png'
import { FaArrowRight } from "react-icons/fa";
import axios from 'axios';
import { PlayerModel } from './models/playerModel';


// Interface for Path Item
interface PathItem {
  title: string;
  badges: string[];
  imageUrl: string;
  pathId: number;   
}


const PathSelection = () => {
    const navigate = useNavigate();
    const { defeatedBossCount: totalDefeatedBossCount } = useParams();
    const [selectedPath, setSelectedPath] = useState<number | null>(null);
    const [breadcrumbs, setBreadcrumbs] = useState<string[]>(['Start']);
    const shopAppears = Math.random() < 1; 
    const [randomLocation, setRandomLocation] = useState<PathItem[]>([]); // Use state for locations
    const [player, setPlayer] = useState<PlayerModel | null>(null);
    const [defeatedBossCount, setDefeatedBossCount] = useState<number>(0); 
    

    const handleReturnToMenu = () => {
        handleEnd();
    };
    // Define the paths
    const locations: PathItem[] = [
        {
            title: 'The Dark Forest',
            badges: ['Hard', 'Poison'],
            imageUrl: forestCabin,
            pathId: 1,
        },
        {
            title: 'Yellow Brick Road',
            badges: ['Easy', 'Heal'],
            imageUrl: ybr,
            pathId: 2,
        },
        {
            title: 'The Haunted Castle',
            badges: ['Medium', 'Fire'],
            imageUrl: haunted_castle,
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
        setDefeatedBossCount(parseInt(totalDefeatedBossCount || '0', 10));
        loadPlayerData();
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

    const loadPlayerData = () => {
        const storedPlayerData = localStorage.getItem('playerData');
        if(storedPlayerData){
            const parsedPlayer = JSON.parse(storedPlayerData);
            const reconstructedPlayer = Object.assign(new PlayerModel(parsedPlayer.id,parsedPlayer.username), parsedPlayer);
            setPlayer(reconstructedPlayer);  
        }
    }
    const handleEnd = () => {
        console.log(player);
        if (player?.score){
            updateLeaderboard(player?.username, player?.score);
        } 
        localStorage.clear();
        navigate('/');
    };
    
    const updateLeaderboard = async (name: string, score: number) => {  
    console.log("This is the name and score", name,score);
    try {
        const bossCount = defeatedBossCount;
        const response = await axios.post("https://5sovduu1i1.execute-api.ap-southeast-2.amazonaws.com/dev/leaderboard", {
            username: name,
            score: score,
            bossCount: bossCount,
        });
        console.log('Leaderboard updated', response.data);
    } catch (error) { 
        console.error('Error updating leaderboard:', error);
    }
    };    



    return (
    <View padding="2rem">
        {/* Breadcrumbs Component */}
        <ScrollView
                width="1500px" 
                height='60px'
                autoScroll="instant"
        >
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
                            {idx !== breadcrumbs.length - 1 && <FaArrowRight color= "pink" size="25px"/>} {/* Add separator except for the last item */}
                        </Breadcrumbs.Item>
                    ))}
                </Breadcrumbs.Container>
            </ThemeProvider>
        </ScrollView>
        <Flex direction="column" gap="0.5rem" justifyContent="center" alignItems="center">
            <Heading level={2} marginTop="1rem">
                Choose Your Path
            </Heading>
            <p>
            Bosses Defeated: {defeatedBossCount}

            </p>

            {/*3 Chosen Path Cards*/}
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
                   
                    <Image src={item.imageUrl} alt={item.title} width="300px" height="300px" />
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
