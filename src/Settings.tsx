import { useMusic } from './MusicProvider';
import { SliderField, Text, Flex, Heading, View, Button, Link, ToggleButton } from '@aws-amplify/ui-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaPause } from "react-icons/fa";

const Settings = () => {
    const { volume, setVolume, pauseMusic, playMusic } = useMusic(); // Use volume and setVolume from MusicContext
    const navigate = useNavigate();
    const [ musicStatus, setMusicStatus] = useState(true);

    const handleReturnToMenu = () => {
        navigate('/');
    };

    const handleMusicToggle = () => {
      if (musicStatus) {
          pauseMusic(); // Pause the music
      } else {
          playMusic(); // Resume the music
      }
      setMusicStatus(!musicStatus); // Toggle the music status
  };

    return (
        <View padding="2rem">
            <Heading level={2} textAlign="center" marginBottom="2rem">
                Settings
            </Heading>

            {/* Attribution Section */}
            <Flex direction="column" gap="0.5rem" alignItems="center" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
              <Text fontSize="small" fontWeight="bold">
                  Music Attribution:
              </Text>
              <Text fontSize="small" textAlign="center">
                  <Link 
                  href='https://freemusicarchive.org/music/Brylie_Christopher_Oxley/epicycles/8-bit-sunrise/' 
                  isExternal={true}
                  > 
                  <em>8-Bit Sunrise </em>
                  </Link> 
                   by 
                  <Link 
                  href='https://freemusicarchive.org/music/Brylie_Christopher_Oxley/' 
                  isExternal={true}
                  color={'black'}
                  > 
                  <strong>  Brylie Christopher Oxley</strong>
                  </Link> 

                  <br />
                  Source: <a href="https://freemusicarchive.org/" target="_blank" rel="noopener noreferrer">
                      Free Music Archive
                  </a>
                  <br />
                  License: <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">
                      CC BY 4.0
                  </a>
              </Text>
            </Flex>

            <Flex direction="column" gap="2rem" alignItems="center">
                <Flex direction="column" gap="0rem" alignItems="center">
                    <Text>Music Volume</Text>
                    <SliderField
                        label="Music volume"
                        value={volume * 100}
                        onChange={(e) => setVolume(e / 100)}
                        min={0}
                        max={100}
                        step={1}
                        labelHidden={true}
                        isValueHidden={true}
                    />
                    <Text>{`${(volume * 100).toFixed(0)}%`}</Text>
                </Flex>

                <Flex direction={'row'} alignItems={'center'} marginBottom={'10px'}>
                  <ToggleButton
                  variation='primary'
                  size='large'
                  onChange={handleMusicToggle}
                  isPressed={musicStatus}
                  >
                    {!musicStatus ? <> <FaPause /> Music Paused </>: <><FaPlay /> Music Playing</>} 
                  </ToggleButton>

                </Flex>

                <Flex direction="row" alignItems="center">
                    <Button
                        variation="primary"
                        size="large"
                        onClick={handleReturnToMenu}
                        style={{ margin: '1rem' }}
                    >
                        Return to menu
                    </Button>
                </Flex>
            </Flex>
        </View>
    );
};

export default Settings;
