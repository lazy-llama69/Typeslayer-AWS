import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PlayerModel } from './models/playerModel';
import { BossModel } from './models/bossModel'; 
import { Button, Input, Flex, Heading, View, Breadcrumbs, ThemeProvider, createTheme, Menu, MenuItem, MenuButton, Radio, RadioGroupField, Divider, ScrollView, } from '@aws-amplify/ui-react';
import { IoIosHeart } from "react-icons/io";
import { MdHeartBroken } from "react-icons/md";
import { HiOutlineArrowSmallUp, HiOutlineArrowSmallDown, HiOutlineArrowSmallLeft, HiOutlineArrowSmallRight } from "react-icons/hi2";
import axios from 'axios';
import { GiPotionBall, GiCrossedSwords, GiShoulderArmor } from "react-icons/gi";
import { FaArrowRight } from "react-icons/fa";

  
const GamePlay = () => {
  // Constants and Router Hooks
  const wordDictUrl = 'https://typerslayer-music.s3.ap-southeast-2.amazonaws.com/words_dictionary.json';
  const navigate = useNavigate();
  const { pathId, defeatedBossCount: totalDefeatedBossCount } = useParams();

  // Core Game State
  const [loading, setLoading] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [wordDict, setWordDict] = useState<Record<string, number>>({});

  // Entity States
  const [player, setPlayer] = useState<PlayerModel | null>(null);
  const [boss, setBoss] = useState<BossModel | null>(null);
  const [avatarImage, setAvatarImage] = useState<string>();
  const [defeatedBossCount, setDefeatedBossCount] = useState<number>(
    parseInt(totalDefeatedBossCount || '0', 10)
  );

  // Combat and Typing Mechanics
  const [currentWord, setCurrentWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [highlightIndexWord, setHighlightIndexWord] = useState<number>(0);
  const [incorrectInputIndex, setIncorrectInputIndex] = useState<number | null>(null);

  // Dodge Mechanism
  const [dodgeSequence, setDodgeSequence] = useState<string[]>([]);
  const [isDodging, setIsDodging] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3);
  const [counterattackInProgress, setCounterattackInProgress] = useState(false);

  // UI States
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>(['Start']);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);

  // Equipment States
  const [selectedWeapon, setSelectedWeapon] = useState<string | null>(null);
  const [selectedClothing, setSelectedClothing] = useState<string | null>(null);
  const [selectedPotion, setSelectedPotion] = useState<string | null>(null);

  //--------------------------------------------Game Start and Initialization--------------------------------------------
  useEffect(() => {
    loadPlayerData(); 
    fetchWordDict();
  }, []); //This effect loads the player and word data

  useEffect(() => {
    // Only create the boss if not already initialized
    if (player && !isInitialized) {
      handCreateBoss();
      setIsInitialized(true);
    }
  }, [player, isInitialized]); //This effect starts the game


  //-----------------------------------------Boss Death Logic---------------------------------------------
  useEffect(() => {
    // Check if the boss is defeated after state change
    if (boss && boss.health <= 0) {
      handleBossDefeat();
    }
  }, [boss]); // This effect runs when `boss` state changes

  //-----------------------------------------Dodge Sequence Logic---------------------------------------------
  // Start the dodge sequence/counterattack
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

    // Cleanup the event 
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDodging, dodgeSequence]);

  //Dodge timer logic
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

  //-----------------------------------------Game Progress and Word Handling---------------------------------------------
  // Loads the word when player loads in
  useEffect(() => {
    if (loading) return;
    if (player) {
      pickRandomWord();
    }
  }, [player, loading]);

  //------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------
  //----------------------------------- Handlers for Menu and Inventory Logic---------------------------------------------
  const handleMenuOpenChange = (open: boolean) => {
    setIsMenuOpen(open);
  };

  const handleInventoryOpenChange = (open: boolean) => {
    setIsInventoryOpen(open);
  };


  //----------------------------------- Initialization Logic---------------------------------------------
  const fetchWordDict = async () => {
    try {
        const response = await fetch(wordDictUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch word dictionary');
        }

        const dict = await response.json();
        setWordDict(dict);
    } catch (error) {
        console.error('Error fetching word dictionary:', error);
    } finally {
        setLoading(false); // Mark as loaded when done
    }
  };
  const handCreateBoss = () => {
    if (!player) return;  // Ensure player is loaded before creating the boss
    
    // Check if pathId is a valid key in bosses
    if (pathId === "1" || pathId === "2" || pathId === "3") {
      const [bossName, health, attack, reward, url] = bosses[pathId] as [string, number, number, number, string];;

      const newBoss = new BossModel(bossName, health, attack, reward, url);
      setBoss(newBoss);
    } else {
      console.error("Invalid pathId:", pathId);
    }
  };

  
  //-----------------------------------------Quit Logic---------------------------------------------
  const closeMenu = () => setIsMenuOpen(false);

  const handleReturnToMenu = () => {
    handleEnd(defeatedBossCount);
  };



  //-----------------------------------------End Logic---------------------------------------------
  const handleBossDefeat = () => {
    if (boss && player){
      if (!(player instanceof PlayerModel)){
        loadPlayerData();
      }
      // console.log("Handle boss defeat called");
      player.money += boss.bounty;
      player.score += boss.score;
      try{
        player.gainExperience(Math.floor(Math.random() * 100));
      } catch {
        console.log('player has no gain experience function');
        player.experience += Math.floor(Math.random() * 100);
        if(player.experience >= 100){
          player.level++;
          player.experience -= 100;
        }
      }
      
      savePlayerData(); // Save updated player data after defeating the boss
      alert('You have defeated the boss');
      // console.log("This is the players money",player?.money);
      // console.log('This is the defeated boss count', defeatedBossCount+1);
    }
    // Continues the endless journey and lets the player choose a new path
    setDefeatedBossCount((prevCount) => prevCount + 1);
    navigate(`/pathselection/${defeatedBossCount+1}`); 

  };

  const handleEnd = (defBossCount: number) => {
    localStorage.clear();
    updateLeaderboard(player?.username ?? "error", player?.score ?? 0, defBossCount);
    navigate('/');
  };

  

  //-----------------------------------------Player Data Management---------------------------------------------
  const savePlayerData = () => {
    if (player) {
      localStorage.setItem('playerData', JSON.stringify(player));
    }
  };

  const loadPlayerData = () => {
    const storedPlayerData = localStorage.getItem('playerData');
    const storedImageUrl = localStorage.getItem('avatarImageUrl');

    if (storedPlayerData && storedImageUrl) {
      const parsedPlayer = JSON.parse(storedPlayerData);
      const reconstructedPlayer = Object.assign(new PlayerModel(parsedPlayer.id,parsedPlayer.username), parsedPlayer);
      
      setPlayer(reconstructedPlayer);  // Set the player with the data from localStorage
      setAvatarImage(storedImageUrl);  // Set the image url with the data from localStorage
    } else {
      navigate('/');  // Redirect to the name creation screen if player data is not found
    }

    const savedBreadcrumbs = localStorage.getItem('breadcrumbs');
    if (savedBreadcrumbs) {
        setBreadcrumbs(JSON.parse(savedBreadcrumbs));
    }
  };


  //-----------------------------------------Bosses---------------------------------------------
  const bosses = {
    "3": ['Slendy Manny', 200, 40, 50,'/assets/entities/slenddy.jpg'],
    "1": ['The Wicked Witch', 150, 30, 25,'/assets/entities/wicked_witch.jpg'],
    "2": ['Goblin', 125, 25, 80,'/assets/entities/goblin.jpg'],
  };

  
  //-----------------------------------------Update Leaderboard---------------------------------------------
  const updateLeaderboard = async (name: string, score: number, defBossCount: number) => {  
    console.log("This is the name and score", name,score);
    try {
      const bossCount = defBossCount;
      const response = await axios.post("https://5sovduu1i1.execute-api.ap-southeast-2.amazonaws.com/dev/leaderboard", {
        username: name,
        score: score,
        bossCount,
      });
      console.log('Leaderboard updated', response.data);
    } catch (error) { 
      console.error('Error updating leaderboard:', error);
    }
  };




  //-----------------------------------------Render Hearts Logic---------------------------------------------
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



  //-----------------------------------------Dodge Logic---------------------------------------------
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
        handleEnd(defeatedBossCount);
        return null;
      }

      return {
        ...prevPlayer,
        health: updatedHealth,
      } as PlayerModel;
    });
  };


  //-----------------------------------------Attack Logic---------------------------------------------
  const handleAttack = (bool: boolean) => {
    if (bool) {
      setUserInput(''); // Clear the input after attack
      setHighlightIndexWord(0);
      setBoss((prevBoss) => {
        if (!prevBoss) return null;
        const damageToBoss = player?.damage || 0;
        const updatedHealth = Math.max(0, prevBoss.health - damageToBoss);

        //Picks a new random word
        pickRandomWord();
      
        return {
          ...prevBoss,
          health: updatedHealth,
        } as BossModel;
      });

      // After each attack, there's a 50% chance to trigger the counterattack
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
        } as BossModel;
      });
    }
  };

  const handleWordInput = (chars: string) => {
      // Check if the last character typed matches the current character to highlight 
      // 1: Checks if there are incorrect inputs if correct character inputted
      // 2: Ensures when blank, the highlight moves if correct character inputted
      // 3: Ensures after backspacing, the highlight moves if correct character inputted
      if (chars[chars.length-1] === currentWord[highlightIndexWord] && (incorrectInputIndex === null || userInput.length === 0 || userInput.length=== highlightIndexWord)){
          setHighlightIndexWord((prevIndex) => prevIndex + 1);
          setIncorrectInputIndex(null); // Reset the incorrect input tracking
      } else {
          // If the typed character is incorrect, mark it with the index
          if (incorrectInputIndex === null) {
              setIncorrectInputIndex(highlightIndexWord); 
          }
      }
      setUserInput(chars);
      // Check if the entire word has been typed (ensures user wont be softlocked in case of highlight bug)
      if (chars === currentWord){
          handleAttack(true);
      }
  };

  const handleBackspace = () => {
      // Move the highlight back if needed 
      if (highlightIndexWord > 0 && (userInput.length-1 === highlightIndexWord || userInput.length === highlightIndexWord)){
          setHighlightIndexWord((prevIndex) => prevIndex - 1);
          setIncorrectInputIndex(null); 
      }
  };

  const pickRandomWord = () => {
    const wordKeys = Object.keys(wordDict);  
    const randomIndex = Math.floor(Math.random() * wordKeys.length);
    setCurrentWord(wordKeys[randomIndex]);  // Set the random word from the keys
  };


  //-----------------------------------------Theme---------------------------------------------
  const theme = createTheme({
    name: 'breadcrumbs-theme',
    tokens: {
      components: {
        breadcrumbs: {
          link: {
            color: '#520e90'
          },
        },
      },
    },
  });


  //-----------------------------------------Potion Logic---------------------------------------------
  const handlePotionChosen = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPotion(e.target.value); // Update selected potion ID
  };

  const handlePotionEffect = () => {
    
    // Find the potion in the player's inventory
    const potion = player?.inventory.find((i) => i.id === selectedPotion);
    if (!potion || !player) {
      alert("Selected potion not found in inventory.");
      return;
    }
  
    // Apply potion effects based on the item's effect type
    switch (potion.effect) {
      case "heal":
        player?.heal(50);
        alert(`You used a Healing Potion! Restored 50 health.`);
        break;
  
      case "attack":
        player.damage += 20;
        alert(`You used an Attack Boost Potion! Attack increased by 20.`);
        break;
  
      case "armor":
        player.armor += 20;
        alert(`You used an Armor Boost Potion! Armor increased by 20.`);
        break;
  
      default:
        alert("Unknown potion effect.");
        return;
    }
  
    // Remove the potion from the inventory after use
    player.removeItem(potion);

    // Initiate a chance for boss to counterattack 
    const randomChance = Math.random();
    if (randomChance < 0.25) {
      alert('The boss is counterattacking!');
      setCounterattackInProgress(true); // Trigger counterattack
    }
  };


  //-----------------------------------------Equipment Logic---------------------------------------------
  const handleEquipmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const item = player?.inventory.find(i => i.id === e.target.value);
    var itemToUnequip;
    if (e.target.value.charAt(0) === '1'){
      itemToUnequip = player?.equippedItems.find(i => i.type === 'weapon');
      setSelectedWeapon(e.target.value);
    } else {
      itemToUnequip = player?.equippedItems.find(i => i.type === 'armor');
      setSelectedClothing(e.target.value);
    }
    if (itemToUnequip) {
      // Unequip the currently equipped item
      player?.unequipItem(itemToUnequip);
    } 
    if (item){
      // Equip the new item
      player?.equipItem(item);
      console.log("successfully changed equipment");
    } else {
      // Handle case where the weapon was not found
      console.error('Item not found for equip operation');
    }

  };

  return (
    
    <View padding="2rem">
      {/* The Menu Component */}
      <View position="absolute" top="0" left="0" padding="1rem"> 
        <Menu isOpen={isMenuOpen} onOpenChange={handleMenuOpenChange} width="15rem" size="large">
          <MenuItem
            onClick={() => {
              closeMenu();
            }}
          >
            Resume Game
          </MenuItem>
  
          <MenuButton 
            variation = "destructive"
            onClick={() => {
              closeMenu();
              handleReturnToMenu();
            }}
          >
            Exit to Main Menu
          </MenuButton>
        </Menu>
      </View>

      {/* Inventory menu button*/}
      <View position="absolute" top="10rem" left="10rem" > 
        <Menu isOpen={isInventoryOpen} onOpenChange={handleInventoryOpenChange} width="18rem" size="large" backgroundColor="#bea9df"
          trigger={
          <MenuButton variation="primary"width="100%" height="5rem" borderRadius ="2rem"backgroundColor="#808080">
            Inventory
          </MenuButton>
          }
        >
          <Divider orientation="horizontal" size='large' border="5px solid pink" borderRadius="10px" />
          <Flex direction="row" justifyContent="center">
            <Heading level={3}><strong>Weapon</strong> <GiCrossedSwords></GiCrossedSwords></Heading>
          </Flex>
          <RadioGroupField
              legend="small"
              legendHidden
              name="weapon"
              value={selectedWeapon || 'invalid'}
              onChange={handleEquipmentChange} 
            > 
              {/* Render only weapons available in the player's inventory */}
              {player?.inventory
                .filter((item) => item.type === 'weapon') 
                .map((weapon) => (
                  <Radio key={weapon.id} value={weapon.id}>
                    {weapon.name} 
                  </Radio>
                ))}
            </RadioGroupField>
          
          <Divider orientation="horizontal" size='large' border="5px solid pink" borderRadius="1px" />
          <Flex direction="row" justifyContent="center">
            <Heading level={3}><strong>Clothing</strong> <GiShoulderArmor></GiShoulderArmor> </Heading>
          </Flex>
          <RadioGroupField
            legend="small"
            legendHidden
            name="clothing"
            value={selectedClothing || "invalid"}
            onChange={handleEquipmentChange} 
          >
            {/* Render only armor available in the player's inventory */}
            {player?.inventory
                .filter((item) => item.type === 'armor')  
                .map((armor) => (
                  <Radio key={armor.id} value={armor.id}>
                    {armor.name} 
                  </Radio>
                ))}
          </RadioGroupField>

          <Divider orientation="horizontal" size='large' border="5px solid pink" borderRadius="1px" />
          <Flex direction="row" justifyContent="center">
            <Heading level={3}><strong>Potions</strong> <GiPotionBall></GiPotionBall> </Heading>
          </Flex>
          <RadioGroupField
            legend="small"
            legendHidden
            name="potions"
            value={selectedPotion || "invalid"}
            onChange={handlePotionChosen} 
          >
            {/* Render only potions available in the player's inventory */}
            {player?.inventory
                .filter((item) => item.type === 'potion')  
                .map((potion) => (
                  <Radio key={potion.id} value={potion.id}>
                    {potion.name} 
                  </Radio>
                ))}
          </RadioGroupField>
          <Flex direction="row" justifyContent="center" marginBottom="-1rem" marginTop="-1rem" >
          <p>
            Remaining:{" "}
            {selectedPotion
            ? player?.inventory.find((i) => i.id === selectedPotion)?.count || 0
            : 0}
          </p>
          </Flex>  
          <Button 
          onClick={handlePotionEffect} 
          isDisabled={!player?.inventory.some((item) => item.id === selectedPotion)}
          >
            Use {player?.inventory.find((item) => item.id === selectedPotion)?.name}
          </Button>

          <Divider orientation="horizontal" size='large' border="5px solid pink" borderRadius="10px"/>
        </Menu>
      </View>

      {/* Breacrumbs/Top section */}
      <View position='absolute' top='10px' left='18rem'>
        <ScrollView
        width="1500px"  
        height='60px'
        autoScroll="instant"
        >
          <ThemeProvider theme={theme}>
            <Breadcrumbs.Container 
              borderRadius="medium" 
              padding="medium"
              style={{ display: 'inline-flex', flexWrap: 'nowrap' }} 
            >
              {breadcrumbs.map((text, idx) => (
                <Breadcrumbs.Item key={`${idx}`} color={"#3F00FF"}>
                  <Breadcrumbs.Link 
                    isCurrent={idx === breadcrumbs.length - 1}
                    style={{
                      fontWeight: 'bold',
                      textDecoration: 'underline',
                      marginRight: '10px', 
                    }}
                  >
                    {text}
                  </Breadcrumbs.Link>
                  {idx !== breadcrumbs.length - 1 && <FaArrowRight color="pink" size="25px" />}
                </Breadcrumbs.Item>
              ))}
            </Breadcrumbs.Container>
          </ThemeProvider>
        </ScrollView>
      </View>
      

      {/* Middle section */}
      <Flex direction="column" alignItems="center" marginTop={'20px'}>
        {!player ? (
          <p>Loading player...</p>
        ) : (
          <>
            <Heading level={1}>Battle!</Heading>
            <Flex direction="row" justifyContent="space-between" alignItems="flex-start" width="100%" gap="10rem" marginBottom="-20px">
              {/* Player Section */}
              <Flex direction="column" alignItems="center" gap="0.5rem">
                <Heading level={2}>Player:</Heading>
                <Heading level={2}> {player.username}</Heading>
                <img
                  src={avatarImage} 
                  alt={`${player.username}`}
                  style={{ width: '300px', height: '300px', objectFit: 'cover', borderRadius: '8px' }}
                />
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
                  <img
                    src={boss.url} 
                    alt={`${boss.name}`}
                    style={{ width: '300px', height: '300px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                  <Flex direction="row" gap="0.5rem" wrap="wrap" maxWidth="315px" justifyContent="center">
                    {renderHearts(boss.health, boss.maxHealth)}
                  </Flex>
                </Flex>
              )}
            </Flex>
            
      {/* Bottom section */}
            {/* Word Input and Attack Section */}
            <Flex direction="column" marginTop='-20px' gap="0.5rem" alignItems="center">
              <p 
                style={{
                    userSelect: 'none', // Disable text selection
                }}
                >
                {currentWord.split('').map((char, index) => (
                            <span
                                key={index}
                                style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: index === highlightIndexWord ? ( incorrectInputIndex === highlightIndexWord ?'red' : 'green'): 'black', // Highlight current digit
                                opacity: index < highlightIndexWord ? 0.5 : 1, // Fade out the typed digits
                                }}
                            >
                                {char}
                            </span>
                        ))}
                </p>
              
              <Flex direction="row" gap="0.5rem" justifyContent="center" alignItems="center">
                <Input
                    marginTop="-15px"
                    placeholder="Type the word"
                    value={userInput}
                    onChange={(e) => handleWordInput(e.target.value)}
                    onKeyDown={(e) => e.key==="Backspace" && handleBackspace()}
                    borderColor="black"
                    backgroundColor='blue.20'
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
      </Flex>
    </View>
  );
};
export default GamePlay;