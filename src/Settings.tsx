import { useState, useEffect } from 'react';
import { SliderField, Text, Flex, Heading, View } from '@aws-amplify/ui-react';

const SettingsPage = () => {
  // State to manage volume levels for music and typing sounds
  const [musicVolume, setMusicVolume] = useState(0.5); // Default music volume (0 - 1)
  const [typingVolume, setTypingVolume] = useState(0.5); // Default typing sound volume (0 - 1)

  // Assuming you have audio elements for music and typing sounds
  const musicAudio = new Audio('/path/to/your/music.mp3');
  const typingSound = new Audio('/path/to/your/typing-sound.mp3');

  // Set audio volume based on slider value
  useEffect(() => {
    musicAudio.volume = musicVolume;
    typingSound.volume = typingVolume;
  }, [musicVolume, typingVolume]);

  // Function to handle music volume change
  const handleMusicVolumeChange = (value: number) => {
    setMusicVolume(value);
  };

  // Function to handle typing sound volume change
  const handleTypingVolumeChange = (value: number) => {
    setTypingVolume(value);
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

        {/* Typing Sound Volume Slider */}
        <Flex direction="column" gap="1rem" alignItems="center">
          <Text>Typing Sound Volume</Text>
          <SliderField
            label='Typing volume'
            value={typingVolume * 100} // Convert to percentage for slider range
            onChange={(e) => handleTypingVolumeChange(e / 100)} // Convert slider value back to range 0-1
            min={0}
            max={100}
            step={1}
            labelHidden={true}
            isValueHidden={true}
          />
          <Text>{`${(typingVolume * 100).toFixed(0)}%`}</Text>
        </Flex>
      </Flex>
    </View>
  );
};

export default SettingsPage;
