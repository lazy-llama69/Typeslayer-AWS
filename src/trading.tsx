import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Image, View, Flex, Badge, Divider, Heading, StepperField, IconsProvider, ThemeProvider, Breadcrumbs, createTheme  } from '@aws-amplify/ui-react';
import { TraderModel } from './models/traderModel';
import { PlayerModel } from './models/playerModel';
import { Item } from './items/item';
import { FiMinusSquare, FiPlusSquare } from 'react-icons/fi';

// Initialize the Trader
const trader = new TraderModel();

const Trading = () => {
  const navigate = useNavigate();
  const {defeatedBossCount}  = useParams();
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [message, setMessage] = useState<string>('');
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>(['Start']);
  const [player, setPlayer] = useState<PlayerModel | null>(null);
  const [quantities, setQuantities] = useState<{ [itemId: string]: number }>({});
  const [itemsForSale, setItemsForSale] = useState<Item[]>();
  
  useEffect(() => {
    loadPlayerData(); 
    chooseItemsForSale();
  }, []);

  const chooseItemsForSale = () => {
    const items = trader.itemsForSale;
    // Shuffle the available items and select the first 3
    const shuffled = items.sort(() => Math.random() - 0.5);
    setItemsForSale(shuffled.slice(0,3));
  }
 
  const loadPlayerData = () => {
    const storedPlayerData = localStorage.getItem('playerData');

    if (storedPlayerData) {
      const parsedPlayer = JSON.parse(storedPlayerData);
      const reconstructedPlayer = Object.assign(new PlayerModel(parsedPlayer.id,parsedPlayer.username), parsedPlayer);
      setPlayer(reconstructedPlayer);  // Set the player with the data from localStorage
    } else {
      navigate('/');  // Redirect to the name creation screen if player data is not found
    }

    const savedBreadcrumbs = localStorage.getItem('breadcrumbs');
    if (savedBreadcrumbs) {
        setBreadcrumbs(JSON.parse(savedBreadcrumbs));
    }
  };

  const savePlayerData = () => {
    if (player) {
      localStorage.setItem('playerData', JSON.stringify(player));
    }
  };

  // Update the quantity
  const handleOnStepChange = (itemId: string, newValue: number) => {
    setQuantities((prev) => ({ ...prev, [itemId]: newValue }));
  };

  // Calculates the total cost for all items
  const totalCost = itemsForSale?.reduce(
    (sum, item) => sum + (quantities[item.id] || 0) * item.price,
    0
  );

  // Handle item purchase
  const handlePurchase = () => {
    if (player && totalCost) {
        // Check if the player has enough money
        if (player.money >= (totalCost)) {
          for (const [itemId, quantity] of Object.entries(quantities)) {
            const item = itemsForSale?.find((i) => i.id === itemId);
            if (item && quantity > 0) {
              for (let i = 0; i < quantity; i++) {
                trader.trade(player, item.id); // Trade each item
              }
            }
          }
          setMessage('Items successfully purchased!');
          setQuantities({}); // Reset quantities after purchase
        } else {
          setMessage('Not enough money to complete the purchase.');
        }
      }
    savePlayerData();
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

  // const refresh = () => {
  //   const items = trader.itemsForSale;
  //   // Shuffle the available items and select the first 3
  //   const shuffled = items.sort(() => Math.random() - 0.5);
  //   setItemsForSale(shuffled.slice(0,3));
  // }

  return (
    <View padding="2rem">
        <Flex direction="column" alignItems="flex-start">
            <Flex direction="row" justifyContent="flex-start" width="100%"> 
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
            </Flex>
        </Flex>
        <Heading level={2}>Welcome to the Shop, {player?.username}</Heading>
        <p>Current Money: {player?.money}</p>
        <p>{message}</p>

        <Flex direction="row" gap="20px" wrap="wrap" justifyContent="center">
            {itemsForSale?.map((item) => (
            <Card
                key={item.id}
                borderRadius="medium"
                maxWidth="20rem"
                variation="outlined"
                onClick={() => setSelectedItem(item)}
                style={{
                cursor: 'pointer',
                border: selectedItem === item ? '2px solid blue' : '1px solid #ddd',
                }}
            >
                <Image src={item.url} alt={item.name} width='300px' height='300px'/>
                <View padding="xs">
                <Flex direction="row" gap="1.5rem" justifyContent="center" alignItems="center">
                    <Badge backgroundColor="yellow.60">{item.price} gold</Badge>
                </Flex>
                </View>
                <Divider padding="xs" />
                <Flex direction="row" gap="0.5rem" justifyContent="center" alignItems="center">
                <Heading padding="medium">{item.name}</Heading>
                </Flex>
                <IconsProvider
                    icons={{
                    stepperField: {
                        add: <FiPlusSquare />,
                        remove: <FiMinusSquare />,
                    },
                    }}
                >
                    <StepperField
                    label="Themed stepper"
                    defaultValue={0}
                    min={0}
                    max={10}
                    step={1}
                    labelHidden
                    value={quantities[item.id] || 0}
                    onStepChange={(newValue) => handleOnStepChange(item.id, newValue)}
                    />
                </IconsProvider>
            </Card>
            ))}
        </Flex>

        <Flex direction="column" alignItems="center">
            <p>Total Cost: {totalCost}</p>
            <Flex direction="row" justifyContent="center" alignItems="center" width="100%" >
                <Button
                    borderRadius='10px'
                    variation="primary"
                    size="large"
                    isDisabled={totalCost === 0}
                    onClick={handlePurchase}
                >
                    Buy
                </Button>

                <Button
                    borderRadius='10px'
                    variation="primary"
                    size="large"
                    onClick={() => navigate(`/pathselection/${defeatedBossCount}`)} // Navigate back to the path selection page
                >
                    Back to Paths
                </Button>
            </Flex>
            
        </Flex>
        
    </View>
  );
};

export default Trading;
