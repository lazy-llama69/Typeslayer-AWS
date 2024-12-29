import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PlayerModel } from './models/playerModel';
import { BossModel } from './models/bossModel'; 
import { Button, Input, Flex, Heading, View, Breadcrumbs, ThemeProvider, createTheme } from '@aws-amplify/ui-react';
import { IoIosHeart } from "react-icons/io";
import { MdHeartBroken } from "react-icons/md";
import { HiOutlineArrowSmallUp, HiOutlineArrowSmallDown, HiOutlineArrowSmallLeft, HiOutlineArrowSmallRight } from "react-icons/hi2";
import wordDict from './assets/words_dictionary.json'; 
import axios from 'axios';
import { TraderModel } from './models/traderModel';
import { Menu, MenuItem } from '@aws-amplify/ui-react';


const GamePlay = () => {
  const { avatarName, pathId, defeatedBossCount: totalDefeatedBossCount } = useParams();
  const [player, setPlayer] = useState<PlayerModel | null>(null);
  const [boss, setBoss] = useState<BossModel | null>(null); // Boss state
  const [userInput, setUserInput] = useState(''); // User's input
  const [dodgeSequence, setDodgeSequence] = useState<string[]>([]);
  const [isDodging, setIsDodging] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3); // 3 seconds to dodge
  const [counterattackInProgress, setCounterattackInProgress] = useState(false); // Track if counterattack is happening
  const [currentWord, setCurrentWord] = useState('');
  const [defeatedBossCount, setDefeatedBossCount] = useState<number>(parseInt(totalDefeatedBossCount || '0', 10)); // Track number of defeated bosses
  const [playerCreated, setPlayerCreated] = useState(false);
  const navigate = useNavigate();
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>(['Start']);
  const [trader, setTrader] = useState<TraderModel | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (counterattackInProgress) {
      // If counterattack is in progress, start the dodge sequence
      startCounterattack();
    }
  }, [counterattackInProgress]);

  // Listen to keyboard events (arrow keys)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isDodging) {
        if (event.key === 'ArrowUp') handleDodgeInput('Up');
        if (event.key === 'ArrowDown') handleDodgeInput('Down');
        if (event.key === 'ArrowLeft') handleDodgeInput('Left');
        if (event.key === 'ArrowRight') handleDodgeInput('Right');
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup the event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDodging, dodgeSequence]);

  useEffect(() => {
    if (isDodging && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
  
      // Cleanup the timer to avoid memory leaks
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && isDodging) {
      // Time is up, dodge failed
      setIsDodging(false);
      alert('Time is up! Dodge failed! Boss counterattack hits you!');
      handleCounterattack();
    }
  }, [isDodging, timeLeft]);

  // Call this when starting the game or after each attack
  useEffect(() => {
    if (player) {
      pickRandomWord();
    }
  }, [player]);

  // Create player and boss when the game starts
  useEffect(() => {
    if (avatarName && !playerCreated) {
      handleCreatePlayer();
    }
  }, [avatarName, playerCreated]);
  

  useEffect(() => {
    // Check if the boss is defeated after state change
    if (boss && boss.health <= 0) {
      handleBossDefeat();
    }
  }, [boss]); // This effect runs when `boss` state changes

  useEffect(() => {
    loadPlayerData();
  }, []);

  const handleMenuOpenChange = (open: boolean) => {
    setIsMenuOpen(open);
  };

  const closeMenu = () => setIsMenuOpen(false);

  const savePlayerData = () => {
    if (player) {
      localStorage.setItem('playerScore', JSON.stringify(player.score));
      localStorage.setItem('playerMoney', JSON.stringify(player.money));
    }
  };

  const loadPlayerData = () => {
    const storedScore = localStorage.getItem('playerScore');
    const storedMoney = localStorage.getItem('playerMoney');
  
    if (storedScore && storedMoney) {
      setPlayer((prevPlayer) => {
        // Check if prevPlayer is null and create a new player if it is
        return {
          ...prevPlayer,  // If prevPlayer exists, spread its properties
          score: JSON.parse(storedScore),  // Update score
          money: JSON.parse(storedMoney),  // Update money
          // Add any other necessary properties to ensure PlayerModel is complete
        } as PlayerModel;
      });
    } else {
      // If no data is found, you could reset to default values (e.g., score 0, money 0)
      setPlayer(new PlayerModel('1', avatarName!));  // Default player creation
    }

    const savedBreadcrumbs = localStorage.getItem('breadcrumbs');
    if (savedBreadcrumbs) {
        setBreadcrumbs(JSON.parse(savedBreadcrumbs));
    }
  };
  
  const handleCreatePlayer = () => {
    if (playerCreated || player) return;

    const newPlayer = new PlayerModel('1', avatarName!);
    const newTrader = new TraderModel();
    setTrader(newTrader);
    setPlayer(newPlayer);
    setPlayerCreated(true);
    handCreateBoss();
    setDefeatedBossCount(defeatedBossCount);
  };

  const bosses = {
    "1": ['Slendy Manny', 150, 25, 50],
    "2": ['The Wicked Witch', 150, 25, 50],
    "3": ['Shopkeeper', 150, 25, 50],
  };

  const handCreateBoss = () => {
      const [name, health, attack, reward] = bosses[pathId] || ['ERROR 404', 450, 55, 250];
      const newBoss = new BossModel(name, health, attack, reward);
      setBoss(newBoss);
  };

  const handleReturnToMenu = () => {
    localStorage.clear();
    navigate('/');
  };

  // Function to handle boss defeat
  const handleBossDefeat = () => {
    if (boss && player){
      // console.log("Handle boss defeat called");
      player.money += boss.bounty;
      player.score += boss.score;
      savePlayerData(); // Save updated player data after defeating the boss
      alert('You have defeated the boss');
      console.log("This is the players money",player?.money);
      console.log('This is the defeated boss count', defeatedBossCount+1);
    }
    if (defeatedBossCount+1 === 2) {  
      // After the second boss is defeated, end the game
      alert('You have defeated all bosses! You win!');
      handleEnd();
    } else {
      // Continues the journey and lets the player choose a new path
      setDefeatedBossCount((prevCount) => prevCount + 1);
      navigate(`/pathselection/${avatarName}/${defeatedBossCount+1}`); 
      
    }
  };

  const handleEnd = () => {
    localStorage.clear();
    updateLeaderboard(player?.username ?? "error", player?.score ?? 0);
    navigate('/')
  };

  const updateLeaderboard = async (name: string, score: number) => {  
    console.log("This is the name and score", name,score)
    try {
      const scoreAsString = String(score);  
      const bossCount = defeatedBossCount+1;
      const response = await axios.post('http://localhost:3000/leaderboard', {
        username: name,
        score: scoreAsString,
        bossCount,
      });
      console.log('Leaderboard updated', response.data);
    } catch (error) { 
      console.error('Error updating leaderboard:', error);
    }
  };

  const renderHearts = (currentHealth: number, maxHealth: number) => {
    const hearts = [];
    const numHearts = maxHealth / 10; // Total hearts based on max health
    const filledHearts = Math.ceil(currentHealth / 10); // Filled hearts based on current health

    for (let i = 0; i < numHearts; i++) {
      if (i < filledHearts) {
        hearts.push(<IoIosHeart key={i} color="red" size="24px" />);
      } else {
        hearts.push(<MdHeartBroken key={i} color="gray" size="24px" />);
      }
    }
    return hearts;
  };

  // Handle the attack logic
  const handleAttack = () => {
    if (userInput.trim().toLowerCase() === currentWord.toLowerCase()) {
      setUserInput(''); // Clear the input after attack
      setBoss((prevBoss) => {
        if (!prevBoss) return null;
        const updatedHealth = Math.max(0, prevBoss.health - 100);

        //Picks a new random word
        pickRandomWord();
      
        return {
          ...prevBoss,
          health: updatedHealth,
        };
      });

      // After each attack, there's a 100% chance to trigger the counterattack
      const randomChance = Math.random();
      if (randomChance < 0.5) {
        alert('The boss is counterattacking!');
        setCounterattackInProgress(true); // Trigger counterattack
      }
    } else {
      alert('YOu messed up your attack, the boss heals!!');
      pickRandomWord(); // Pick a new random word
      setBoss((prevBoss) => {
        if (!prevBoss) return null;
        
        const healedHealth = Math.min(prevBoss.maxHealth, prevBoss.health + 50); // Heal the boss by 50
        return {
          ...prevBoss,
          health: healedHealth, // Apply healing
        };
      });
    }
  };

  // Generate a random dodge sequence
  const generateDodgeSequence = () => {
    const directions = ['Up', 'Down', 'Left', 'Right'];
    let sequence: string[] = [];
    for (let i = 0; i < 5; i++) {
      const randomDirection = directions[Math.floor(Math.random() * directions.length)];
      sequence.push(randomDirection);
    }
    setDodgeSequence(sequence);
    setIsDodging(true);
    setTimeLeft(3); // Reset the timer to 3 seconds
  };
  
  // Handle the dodge logic
  const handleDodgeInput = (direction: string) => {
    if (isDodging && dodgeSequence.length > 0) {
  
      if (dodgeSequence[0] === direction) {
        // Correct input, remove the first element from the queue
        setDodgeSequence((prev) => prev.slice(1));
  
        if (dodgeSequence.length === 1) {
          // If this was the last input, dodge is successful
          setIsDodging(false);
          alert('Dodge successful!');
        }
      } else {
        // Incorrect input
        setIsDodging(false);
        alert('Dodge failed! Boss counterattack hits you!');
        handleCounterattack();
      }
    }
  };

  // Start the counterattack and set a timer for the player to dodge
  const startCounterattack = () => {
    setCounterattackInProgress(false); // End counterattack phase
    generateDodgeSequence(); // Generate dodge sequence
  };

  // Handle the counter logic
  const handleCounterattack = () => {
    // Boss counterattacks and reduces player's health
    setPlayer((prevPlayer) => {
      if (!prevPlayer) return null;
      const updatedHealth = Math.max(0, prevPlayer.health - (boss?.damage || 20));

      if (updatedHealth <= 0) {
        alert('You have been defeated by the boss!');
        return null;
      }

      return {
        ...prevPlayer,
        health: updatedHealth,
      };
    });
  };

  const renderDodgeSequence = () => {
    return dodgeSequence.map((direction, index) => {
      switch (direction) {
        case 'Up':
          return <HiOutlineArrowSmallUp key={index} size={24} color= "black"/>;
        case 'Down':
          return <HiOutlineArrowSmallDown key={index} size={24} color= "black" />;
        case 'Left':
          return <HiOutlineArrowSmallLeft key={index} size={24} color= "black" />;
        case 'Right':
          return <HiOutlineArrowSmallRight key={index} size={24} color= "black" />;
        default:
          return null;
      }
    });
  };
  
  const pickRandomWord = () => {
    const wordKeys = Object.keys(wordDict);  
    const randomIndex = Math.floor(Math.random() * wordKeys.length);
    setCurrentWord(wordKeys[randomIndex]);  // Set the random word from the keys
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
      {/* Add the Menu Component */}
      <Menu
        isOpen={isMenuOpen}
        onOpenChange={handleMenuOpenChange}
        width="3rem"
        maxWidth="4rem"
      >
        <MenuItem
          onClick={() => {
            closeMenu();
            alert('Resume Game');
          }}
        >
          Resume Game
        </MenuItem>
        <MenuItem
          onClick={() => {
            closeMenu();
            alert('Settings');
          }}
        >
          Settings
        </MenuItem>
        <MenuItem
          onClick={() => {
            closeMenu();
            handleReturnToMenu();
          }}
        >
          Exit to Main Menu
        </MenuItem>
      </Menu>
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
      <Flex direction="column" alignItems="center">
  {!player ? (
    <p>Loading player...</p>
  ) : (
    <>
      <Heading level={1}>Battle!</Heading>
      <Flex direction="row" justifyContent="space-between" alignItems="flex-start" width="100%" gap="10rem">
        {/* Player Section */}
        <Flex direction="column" alignItems="center" gap="0.5rem">
          <Heading level={2}>Player:</Heading>
          <Heading level={2}> {player.username}</Heading>
          <Flex direction="row" gap="0.5rem" wrap="wrap" maxWidth="315px" justifyContent="center">
            {renderHearts(player.health, player.maxHealth)}
          </Flex>
          <p>Level: {player.level}</p>
        </Flex>

        {/* Boss Section */}
        {boss && (
          <Flex direction="column" alignItems="center" gap="0.5rem">
            <Heading level={2}>Boss: </Heading>
            <Heading level={2}> {boss.name}</Heading>
            <Flex direction="row" gap="0.5rem" wrap="wrap" maxWidth="315px" justifyContent="center">
              {renderHearts(boss.health, boss.maxHealth)}
            </Flex>
          </Flex>
        )}
      </Flex>

      {/* Word Input and Attack Section */}
      <Flex direction="column" gap="0.5rem" alignItems="center">
        <p>Input the following word to attack:</p>
        <strong>{currentWord}</strong>
        <Flex direction="row" gap="0.5rem" justifyContent="center" alignItems="center">
          <Input
            placeholder={`Type the word`}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAttack(); // Trigger attack on Enter key press
              }
            }}
          />
        </Flex>
      </Flex>

      {/* Display the dodge sequence */}
      {isDodging && (
        <div>
          <p>Follow the sequence to dodge:</p>
          <Flex direction="row" gap="1rem" justifyContent="center">
            {renderDodgeSequence()}
          </Flex>
          <p>Time left to dodge: {timeLeft} seconds</p>
        </div>
      )}
    </>
      )}
      <Button variation="primary" size="small" onClick={handleReturnToMenu}>
        Back to Main Menu
      </Button>
    </Flex>
    </View>
  );
};

export default GamePlay;