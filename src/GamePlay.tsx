import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PlayerModel } from './playerModel';
import { BossModel } from './bossModel'; // Import BossModel
import { Button, Input, Flex, Heading, View } from '@aws-amplify/ui-react';
import { IoIosHeart } from "react-icons/io";
import { MdHeartBroken } from "react-icons/md";
import { HiOutlineArrowSmallUp, HiOutlineArrowSmallDown, HiOutlineArrowSmallLeft, HiOutlineArrowSmallRight } from "react-icons/hi2";
import wordDict from './assets/words_dictionary.json'; 
import axios from 'axios';

const GamePlay = () => {
  const { avatarName } = useParams();
  const [player, setPlayer] = useState<PlayerModel | null>(null);
  const [boss, setBoss] = useState<BossModel | null>(null); // Boss state
  const [userInput, setUserInput] = useState(''); // User's input
  const [dodgeSequence, setDodgeSequence] = useState<string[]>([]);
  const [isDodging, setIsDodging] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3); // 3 seconds to dodge
  const [counterattackInProgress, setCounterattackInProgress] = useState(false); // Track if counterattack is happening
  const [currentWord, setCurrentWord] = useState('');
  const [defeatedBossCount, setDefeatedBossCount] = useState(0); // Track number of defeated bosses
  const navigate = useNavigate();

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
    if (avatarName && !player) {
      handleCreatePlayer();
    }
  }, [avatarName, player]);
  
  const handleCreatePlayer = () => {
    const newPlayer = new PlayerModel('1', avatarName!);
    const newBoss = new BossModel('Dark Overlord', 150, 20, 50); // Create the boss
    setPlayer(newPlayer);
    setBoss(newBoss);
  };

  const handleReturnToMenu = () => {
    navigate('/');
  };

  // Function to handle boss defeat
  const handleBossDefeat = () => {
    if(boss){
      player?.gainMoney(boss.bounty);
      player?.gainScore(boss.score);
    }
    if (defeatedBossCount === 2) {  
      // After the second boss is defeated, end the game
      alert('You have defeated both bosses! You win!');
      updateLeaderboard(player?.username ?? "temp", player?.score ?? 0);
      navigate('/'); // Navigate back to the main menu
    } else {
      // Generate a new boss after defeating the current one
      alert("The Dark Overlord rises AGAIN!!!")
      const newBoss = new BossModel('Dark Overlord II', 300, 40, 100); // New boss
      setBoss(newBoss);
      setDefeatedBossCount((prevCount) => prevCount + 1); // Increment defeated boss count
    }
  };

  const updateLeaderboard = async (name: string, score: number) => {  
    console.log("This is the name and score", name,score)
    try {
      const scoreAsString = String(score);  
      const response = await axios.post('http://localhost:3000/leaderboard', {
        username: name,
        score: scoreAsString
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

        if (updatedHealth <= 0) {
          handleBossDefeat(); //Handle the boss defeat logic
          return null;
        }
      
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
      alert('Incorrect word! Try again.');
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

  return (
    <View padding="2rem">
      <Button variation="primary" size="small" onClick={handleReturnToMenu}>
        Back to Main Menu
      </Button>
      <Flex direction="column" gap="1rem" alignItems="center">
        {!player ? (
          <>
            handleCreatePlayer();
          </>
        ) : (
          <>
            <Heading level={1}>Battle!</Heading>
            <Heading level={2}>Player: {player.username}</Heading>
            <Flex direction="row" gap="0.5rem" justifyContent="center" alignItems="center">
              {renderHearts(player.health, player.maxHealth)}
            </Flex>
            <p>Level: {player.level}</p>

            {boss && (
              <>
                <Heading level={2}>Boss: {boss.name}</Heading>
                <p>Health: {boss.health}/{boss.maxHealth}</p>
                <Flex direction="row" gap="0.5rem" justifyContent="center" alignItems="center">
                  {renderHearts(boss.health, boss.maxHealth)}
                </Flex>
              </>
            )}
            <Flex direction="row" gap="0.5rem" justifyContent="center" alignItems="center">
            <p>Input the following word to attack:</p>
            <strong>{currentWord}</strong>
            </Flex>
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
