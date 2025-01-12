import { useState, useEffect, } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, useAuthenticator } from '@aws-amplify/ui-react'; // for handling login/logout
import { SliderField, Text, Flex, Heading, View } from '@aws-amplify/ui-react';

const Settings = () => {
  // State to manage volume levels for music and typing sounds
  const [musicVolume, setMusicVolume] = useState(0.5); // Default music volume (0 - 1)
  const { user } = useAuthenticator();
  const navigate = useNavigate(); 

  // Assuming you have audio elements for music and typing sounds
  const musicAudio = new Audio('https://typerslayer-music.s3.ap-southeast-2.amazonaws.com/Brylie+Christopher+Oxley+-+8-Bit+Sunrise.mp3');

  // Set audio volume based on slider value
  useEffect(() => {
    musicAudio.volume = musicVolume;
  }, [musicVolume]);

  // Function to handle music volume change
  const handleMusicVolumeChange = (value: number) => {
    setMusicVolume(value);
  };

  // Start music playback when the user logs in
  useEffect(() => {
    if (user) {
      musicAudio.loop = true; // Loop the music in the background
      musicAudio.play().catch((error) => {
        console.error("Music playback error: ", error);
      });
    }

    // Pause music on logout
    return () => {
      musicAudio.pause();
    };
  }, [user]); // Run when `user` changes

  // Handle return to menu
  const handleReturnToMenu = () => {
    navigate('/');
  }; 

  return (
    <View padding="2rem">
      <Heading level={2} textAlign="center" marginBottom="2rem">
        Settings
      </Heading>

      <Flex direction="column" gap="2rem" alignItems="center">
        {/* Music Volume Slider */}
        <Flex direction="column" gap="1rem" alignItems="center">
          <Text>Music Volume</Text>
          <SliderField
            label ="Music volume"
            value={musicVolume * 100} // Convert to percentage for slider range
            onChange={(e) => handleMusicVolumeChange(e / 100)} // Convert slider value back to range 0-1
            min={0}
            max={100}
            step={1}
            labelHidden={true}
            isValueHidden={true}
          />
          <Text>{`${(musicVolume * 100).toFixed(0)}%`}</Text>
        </Flex>
        <Flex direction='row' alignItems={'center'}>
            <Button
                variation='primary'
                size = 'large'
                onClick={handleReturnToMenu}
                style={ {margin: '1rem'}}
            >
                Return to menu
            </Button>
        </Flex>
      </Flex>
    </View>
  );
};

export default Settings;
