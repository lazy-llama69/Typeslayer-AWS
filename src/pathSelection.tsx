// pathSelection.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Collection, Card, Image, View, Flex, Badge, Divider, Heading, Breadcrumbs, ThemeProvider, createTheme  } from '@aws-amplify/ui-react';
import forestCabin from './assets/forest_cabin.jpg';
import ybr from './assets/yellowbrickroad.jpg';
import shop from './assets/shop.jpg';



// Interface for Path Item
interface PathItem {
  title: string;
  badges: string[];
  imageUrl: string;
  pathId: number;   
}


const PathSelection = () => {
    const navigate = useNavigate();
    const { avatarName, defeatedBossCount } = useParams();
    const [selectedPath, setSelectedPath] = useState<number | null>(null);
    const [breadcrumbs, setBreadcrumbs] = useState<string[]>(['Start']);

    // Handle return to menu
    const handleReturnToMenu = () => {
        localStorage.clear();
        navigate('/');
    };
    // Define the paths
    const items: PathItem[] = [
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
    ];

    useEffect(() => {
        const savedBreadcrumbs = localStorage.getItem('breadcrumbs');
        if (savedBreadcrumbs) {
            setBreadcrumbs(JSON.parse(savedBreadcrumbs));
        }
    }, []);

    // Handle name submission and path selection
    const handleStartGame = () => {
        if (selectedPath === null) {
            alert('Please select a path.');
            return;
        }

        const selectedPathTitle = items.find((item) => item.pathId === selectedPath)?.title || '';
        setBreadcrumbs((prev) => {
            const updatedBreadcrumbs = [...prev, selectedPathTitle];
            // Store updated breadcrumbs in localStorage
            localStorage.setItem('breadcrumbs', JSON.stringify(updatedBreadcrumbs));
            return updatedBreadcrumbs;
        });


        // Pass the avatar name and selected path to the GamePlay component
        navigate(`/gameplay/${avatarName}/${selectedPath}/${defeatedBossCount}`);
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
                                textDecoration: 'underline',
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
