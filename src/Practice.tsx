import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heading, Button, Input, Flex, View, Menu, MenuItem, MenuButton, Tabs, ThemeProvider, createTheme, SwitchField, SliderField, Text, StepperField}from '@aws-amplify/ui-react';
import wordDict from './assets/words_dictionary.json';
import { HiOutlineArrowSmallUp, HiOutlineArrowSmallDown, HiOutlineArrowSmallLeft, HiOutlineArrowSmallRight } from "react-icons/hi2";

// Constants
const COUNTERATTACKPROBABILITY =0.5;
const DODGE_TIME_LIMIT = 3;
const DIRECTIONS = ['Up', 'Down', 'Left', 'Right'] as const;
const DODGE_SEQUENCE_LENGTH = 5;
type Direction = typeof DIRECTIONS[number];

const Practice = () => {
    // Navigation
    const navigate = useNavigate();

    // Menu State
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Game State
    const [currentWord, setCurrentWord] = useState('');
    const [userInput, setUserInput] = useState('');
    

    // Combat State
    const [counterattackInProgress, setCounterattackInProgress] = useState(false);
    const [dodgeSequence, setDodgeSequence] = useState<Direction[]>([]);
    const [isDodging, setIsDodging] = useState(false);

    // State for the counterattack settings
    const [counterattackProbability, setCounterattackProbability] = useState(COUNTERATTACKPROBABILITY);
    const [isCounterattackEnabled, setIsCounterattackEnabled] = useState(true);

    // State for the length of word setting
    const [wordLength, setWordLength] = useState(31); // Default word length is 31 (all words)
    const [filteredWords, setFilteredWords] = useState<string[]>([]);
    const [includeLessThanOrEqual, setIncludeLessThanOrEqual] = useState(true); // Default: includes all words

    // State for the length of dodge sequence and time setting
    const [dodgeLength, setDodgeLength] = useState(DODGE_SEQUENCE_LENGTH); // Default dodge length is 5 
    const [timeLeft, setTimeLeft] = useState(DODGE_TIME_LIMIT); // Default dodge time is 3s 

    // State for dodge sequence repeated count
    const [completedDodgeCount, setCompletedDodgeCount] = useState(-1); // Track completed sequences
    const [dodgeRepeats, setDodgeRepeats] = useState(0); // Number of times the sequence should be repeated
    const [curretTab, setCurrentTab] = useState("1");    // The current tab to prevent dodge from running instantly 




    // Menu Handlers
    const handleMenuOpenChange = (open: boolean) => setIsMenuOpen(open);
    const closeMenu = () => setIsMenuOpen(false);
    const handleReturnToMenu = () => {
        localStorage.clear();
        navigate('/');
    };

    // Handler for Switch Change
    const handleCounterChange = (checked: boolean) => {
        setIsCounterattackEnabled(checked);
    };

    // Handler for Slider Change
    const handleSliderCounterChange = (value: number) => {
        setCounterattackProbability(value / 100);  // Convert slider value (0-100) to a probability (0-1)
    };

    // Handle switch change for including less than or equal length words
    const handleIncludeLessThanOrEqualChange = (checked: boolean) => {
        setIncludeLessThanOrEqual(checked);
    };

    // Handle word length stepper change
    const handleWordLengthStepperChange = (value: number) => {
        setWordLength(value);
    };

    // Handle dodge length stepper change
    const handleDodgeLengthStepperChange = (value: number) => {
        setDodgeLength(value);
        setTimeLeft(value);
    };

    // Word Management
    const pickRandomWord = () => {
        // const wordKeys = Object.keys(wordDict);
        const randomIndex = Math.floor(Math.random() * filteredWords.length);
        // console.log(filteredWords[randomIndex]);
        setCurrentWord(filteredWords[randomIndex]);
    };

    // Filter words from wordDict based on the selected filter type and length
    const filterWordsByLength = (wordDict: Record<string, number>, length: number, includeLessThanOrEqual: boolean) => {
        return Object.keys(wordDict).filter(word => {
            const wordLengthValue = wordDict[word];
            return includeLessThanOrEqual
                ? wordLengthValue <= length // Words with length <= selected
                : wordLengthValue === length; // Words with exact length
        });
    };

    // Combat Handlers

    // Start the counterattack and set a timer for the player to dodge
    const startCounterattack = () => {
        setCounterattackInProgress(false); // End counterattack phase
        setDodgeRepeats(1);
        generateDodgeSequence(); // Generate dodge sequence
    };

    const handleAttack = () => {
        if (userInput.trim().toLowerCase() === currentWord.toLowerCase()) { 
            setUserInput('');
            pickRandomWord();

            if (Math.random() < counterattackProbability && isCounterattackEnabled) {
                alert('The boss is counterattacking!');
                setCounterattackInProgress(true);
                setDodgeRepeats(1);
                startCounterattack();
            }
        } else{
            alert('Wrong')
            pickRandomWord();
        }
    };

    const renderDodgeSequence = () => {
        return dodgeSequence.map((direction, index) => {
            if(index===0){
                
            }
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

    const generateDodgeSequence = () => {
        const sequence = Array.from(
            { length: dodgeLength },
            () => DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)]
        );
        setDodgeSequence(sequence);
        setIsDodging(true);
        setTimeLeft(dodgeLength);
    };

    const handleDodgeInput = (direction: Direction) => {
        if (!isDodging || dodgeSequence.length === 0) return;

        if (dodgeSequence[0] === direction) {
            setDodgeSequence((prev) => prev.slice(1));
            
            if (dodgeSequence.length === 1) {
                setCompletedDodgeCount((prev) => prev + 1); // Increment completed repetitions
                if (completedDodgeCount + 1 < dodgeRepeats) {
                    alert('Dodge successful! Prepare for the next sequence.');
                    setTimeout(() => generateDodgeSequence(), 1000); // Delay for better flow
                } else {
                    alert('All dodge sequences completed successfully!');
                    setIsDodging(false);
                }
            }
        } else {
            setIsDodging(false);
            alert('Dodge failed!!');
        }
    };
    
    const handleHideRest = (value: string) => {
        setCurrentTab(value);
    };

    const handleGenerateRepeats = () => {
        if (dodgeRepeats === 0){
            return;
        }
        setCompletedDodgeCount(0); // Resets the completed dodge count
        generateDodgeSequence();
    };

    const handleQuit = () => {
        setIsDodging(false);
        setCompletedDodgeCount(dodgeRepeats);  // Reset the completed sequence count
    };
    
    // Effects
    useEffect(() => {
        if (counterattackInProgress) {
            setCounterattackInProgress(false);
            generateDodgeSequence();
        }
    }, [counterattackInProgress]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!isDodging) return;

            const keyMap: Record<string, Direction> = {
                ArrowUp: 'Up',
                ArrowDown: 'Down',
                ArrowLeft: 'Left',
                ArrowRight: 'Right'
            };

            if (keyMap[event.key]) {
                handleDodgeInput(keyMap[event.key]);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isDodging, dodgeSequence]);

    useEffect(() => {
        if (!isDodging && (completedDodgeCount  < dodgeRepeats) && curretTab === "2"){
            generateDodgeSequence();
        } 
    }, [isDodging]);

    useEffect(() => {
        if (isDodging && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        }
        
        if (timeLeft === 0 && isDodging) {
            setIsDodging(false);
            alert('Time is up! Dodge failed! Boss counterattack hits you!');
        }
    }, [isDodging, timeLeft]);

    useEffect(() =>{
        const initialFilteredWords = filterWordsByLength(wordDict as Record<string, number>, wordLength, includeLessThanOrEqual);
        setFilteredWords(initialFilteredWords);

        // Pick a random word after the filteredWords is set
        if (initialFilteredWords.length > 0) {
            setCurrentWord(initialFilteredWords[Math.floor(Math.random() * initialFilteredWords.length)]);
        }
    }, []);

    useEffect(() => {
        // Whenever wordLength or includeLessThanOrEqual changes, update filteredWords and pick a new word
        const updatedFilteredWords = filterWordsByLength(wordDict as Record<string, number>, wordLength, includeLessThanOrEqual);
        setFilteredWords(updatedFilteredWords);

        if (updatedFilteredWords.length > 0) {
            setCurrentWord(updatedFilteredWords[Math.floor(Math.random() * updatedFilteredWords.length)]);
        }
    }, [wordLength,includeLessThanOrEqual]);

    // Theme
    const theme = createTheme({
        name: 'tabs-theme',
        tokens: {
          components: {
            tabs: {
              borderColor: { value: '{colors.neutral.20}' },
              item: {
                color: { value: '{colors.blue.80}' },
                fontSize: { value: '{fontSizes.xl}' },
                fontWeight: { value: '{fontWeights.normal}',    
                },
      
                _hover: {
                  color: { value: '{colors.blue.60}' },
                },
                _focus: {
                  color: { value: '{colors.blue.60}' },
                },
                _active: {
                  color: { value: '{colors.blue.80}' },
                  borderColor: { value: '{colors.blue.80}' },
                  backgroundColor: { value: '{colors.blue.10}' },
                },
                _disabled: {
                  color: { value: 'gray' },
                  backgroundColor: { value: 'transparent' },
                },
              },
            },
          },
        },
      });

    // Render
    return (
        <View padding="2rem">
            {/* Menu */}
            <View position="absolute" top="0" left="0" padding="1rem">
                <Menu isOpen={isMenuOpen} onOpenChange={handleMenuOpenChange} width="15rem" size="large">
                    <MenuItem onClick={() => { closeMenu(); alert('Resume Game'); }}>
                        Resume Game
                    </MenuItem>
                    <MenuItem isDisabled onClick={() => { closeMenu(); alert('Settings'); }}>
                        Settings
                    </MenuItem>
                    <MenuButton variation="destructive" onClick={() => { closeMenu(); handleReturnToMenu(); }}>
                        Exit to Main Menu
                    </MenuButton>
                </Menu>
            </View>

            {/* Settings */}
            <View position="absolute" top="1rem" right="10rem" padding="1rem">
                
                <Flex direction="column" gap="1rem" alignItems="center" alignContent="center">
                    {/*  Counterattack Probability Setting*/}
                    <Flex direction="column" gap="1rem" alignItems="center" alignContent="center">
                        <Heading level={3}>Counterattack Probability</Heading>
                        <SliderField
                                label="counterAttackProbability"
                                value={counterattackProbability*100}  // Convert back to percentage (0-100)
                                onChange={(value) => handleSliderCounterChange(value)}
                                min={0}
                                max={100}
                                step={1}
                                isValueHidden={true}
                                labelHidden={true}
                                isDisabled={!isCounterattackEnabled}
                            />
                        <Flex direction="row" gap="1rem" justifyContent="center" alignContent="center">
                            <Text>{`Probability: ${(counterattackProbability*100).toFixed(0)}%`}</Text>
                        </Flex>
                    
                        <Flex direction="row" gap="1rem" alignItems="center">
                            <Text>Enable Counterattack</Text>
                            <SwitchField 
                                label ="isCounterAttackENabled"
                                isLabelHidden={true}
                                isChecked={isCounterattackEnabled} 
                                onChange={(e) => handleCounterChange(e.target.checked)} 
                            />
                        </Flex>
                    </Flex>
                    


                    {/* Word Length Setting */}
                    <Flex direction="column" gap="1rem" alignItems="center" alignContent="center">
                        <Heading level={3}>Word Length</Heading>

                        <StepperField
                            label="Word Length"
                            value={wordLength}
                            min={1}  
                            max={31} 
                            onStepChange={(value) => handleWordLengthStepperChange(value)}
                            labelHidden={true}
                            backgroundColor='blue.20'
                        />

                        {/* Toggle for Filter Type */}
                        <Flex direction="row" gap="1rem" alignItems="center">
                            <Text>Condition: </Text>
                            <SwitchField
                                label="Include Less Than or Equal Length"
                                isLabelHidden={true}
                                isChecked={includeLessThanOrEqual}
                                onChange={(e) => handleIncludeLessThanOrEqualChange(e.target.checked)}
                            />
                            <Text>{includeLessThanOrEqual ? "Less Than or Equal" : "Exact Length"}</Text>
                        </Flex>
                        <p>
                            {filteredWords.length === 0 ? (
                                <Text>No words found for this length.</Text>
                            ) : (
                                <Text>Number of words: <strong>{filteredWords.length}</strong></Text>
                            )}
                        </p>
                    </Flex>



                    {/* Dodge Sequence Length */}
                    <Flex direction="column" gap="1rem" alignItems="center" alignContent="center">
                        <Heading level={3}>Dodge Sequence Length</Heading>

                        <StepperField
                            label="Dodge Length"
                            value={dodgeLength}
                            min={1}  
                            max={40} 
                            onStepChange={(value) => handleDodgeLengthStepperChange(value)}
                            labelHidden={true}
                            backgroundColor='blue.20'
                        />

                    </Flex>
                    
                </Flex>
            </View>

            {/* Tabs */}
            <View position="absolute" top="1rem" left="40rem">
                {/* The dummy picture */}
                <Flex direction="row" width="100%" gap="10rem" marginLeft="80px" marginBottom="10px">
                    <Flex direction="column" alignItems="center" gap="0.5rem">
                        <Heading level={2}> TRAINING DUMMY</Heading>
                        <img
                        src={"/assets/entities/dummy.png"} 
                        alt={`dummy`}
                        style={{ width: '400px', height: '400px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                    </Flex>
                </Flex>

                <ThemeProvider theme={theme} colorMode="light">
                    <Tabs.Container ariaLabel="type" defaultValue="1" fontSize="xl" isLazy spacing='equal'>
                        
                        {/* List of tabs */}
                        <Tabs.List spacing='equal' >
                            <Tabs.Item value="1" minWidth="180px">Words</Tabs.Item>
                            <Tabs.Item value="2" minWidth="180px" onClick={() => handleHideRest("2")} >Dodge</Tabs.Item>
                            <Tabs.Item value="3" minWidth="180px">Numbers</Tabs.Item>
                        </Tabs.List>

                        {/* Words Tab */}
                        <Tabs.Panel value="1" >
                            <Flex direction="column" alignItems="center">
                                <p 
                                style={{
                                    userSelect: 'none', // Disable text selection
                                }}
                                >
                                Input the following word to attack: <strong>{currentWord}</strong>
                                </p>
                                <Flex direction="row" justifyContent="center" alignItems="center">
                                    <Input
                                        marginTop="-20px"
                                        placeholder="Type the word"
                                        value={userInput}
                                        onChange={(e) => setUserInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAttack()}
                                        borderColor="black"
                                        backgroundColor='blue.20'
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
                            </Flex>
                        </Tabs.Panel>

                        {/* Dodge Tab */}
                        <Tabs.Panel value="2">
                            {/* Display the dodge sequence */}
                            <Flex direction="column" alignItems="center">
                                {isDodging && (
                                    <div>
                                        <Flex direction="row" justifyContent="center">
                                            <Heading level={3}>
                                                Round: {completedDodgeCount + 1} of {dodgeRepeats}
                                            </Heading>   
                                        </Flex>
                                        <Flex direction="row" margin='20px' justifyContent="center">
                                            <Heading level={5}>
                                                Follow the sequence to dodge:
                                            </Heading>
                                        </Flex>

                                        
                                        <Flex direction="row" gap="1rem" justifyContent="center">
                                            {renderDodgeSequence()}
                                        </Flex>
                                        <Flex direction="row"  marginTop='20px' justifyContent="center">
                                            <Heading level={5}>
                                                Time left to dodge: {timeLeft} seconds
                                            </Heading>
                                        </Flex>
                                        <Flex direction="row" margin='20px' justifyContent="center">
                                            <Button variation='destructive' onClick={handleQuit}> 
                                                Stop
                                            </Button>
                                        </Flex>
                                    </div>
                                )}
                                {!isDodging && (
                                    <Flex direction="column" alignItems="center">
                                        <Flex direction="row" marginBottom={'-20px'} justifyContent="center">
                                            <p>
                                                Enter the desired number of dodges:
                                            </p>
                                        </Flex>
                                        <Flex direction="row" alignContent={"center"} alignItems={'center'}>
                                            <Input
                                                    value={dodgeRepeats}
                                                    onChange={(e) => setDodgeRepeats(parseInt(e.target.value || "0", 10))}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleGenerateRepeats()}
                                                    borderColor="black"
                                                    backgroundColor='blue.20'
                                                />
                                        </Flex>
                                    </Flex>
                                )}
                            </Flex>
                            
                        </Tabs.Panel>

                        {/* Numbers Tab */}
                        <Tabs.Panel value="3">
                            {/* Add content for the Numbers tab here */}
                            <p>Placeholder for numbers-based game or info</p>
                        </Tabs.Panel>
                    </Tabs.Container>
                </ThemeProvider>
            </View>
            
        </View>
    );
};

export default Practice;
