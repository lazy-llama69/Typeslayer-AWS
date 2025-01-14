import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, View, Flex, Heading, DropZone, Text, VisuallyHidden, Image, SwitchField } from '@aws-amplify/ui-react'; 
import { PlayerModel } from './models/playerModel';
import { MdCheckCircle, MdFileUpload, MdRemoveCircle } from 'react-icons/md';

const nameCreation = () => {
    const navigate = useNavigate();
    const [avatarName, setAvatarName] = useState('');
    const [defeatedBossCount] = useState(0);
    const [avatarImage, setAvatarImage] = useState<File | null>();
    const hiddenInput = useRef<HTMLInputElement | null>(null);
    const acceptedFileTypes = ['image/png', 'image/jpeg'];
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [useDefault, setUseDefault] = useState(true); 

    // Handle return to menu
    const handleReturnToMenu = () => {
        navigate('/');
    };

    const handleCreatePlayer = () => {
        const avatarImageUrl = avatarImage ? URL.createObjectURL(avatarImage) : "/assets/entities/protagonist.jpg";
        const newPlayer = new PlayerModel('1', avatarName);
    
        // Save player to local storage
        localStorage.setItem('playerData', JSON.stringify(newPlayer));
        //Save image to local storage
        localStorage.setItem('avatarImageUrl', avatarImageUrl); 

        // Pass the defeated boss count to the GamePlay component 
        navigate(`/pathselection/${defeatedBossCount}`);
    };

    // Handle name submission and path selection
    const handleStartGame = () => {
        if (!avatarName.trim()) {
            alert('Please enter your avatar name.');
            return;
        }
        handleCreatePlayer();
    };

    const onFilePickerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (acceptedFileTypes.includes(file.type)) {
                handleFileSelection(file);
            }
        }
    };
    
    const handleFileSelection = (file: File) => {
        setAvatarImage(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
    };

    return (
        <View padding="2rem">
            <Flex direction="column" gap="0.5rem" justifyContent="center" alignItems="center">
                <Heading level={1}>Enter Avatar Name</Heading>
                <Input
                    value={avatarName}
                    onChange={(e) => setAvatarName(e.target.value)}
                    placeholder="Enter your avatar name"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleStartGame();
                    }}
                />
            </Flex>

            {/* Switch to toggle between default and custom avatar */}
            <Flex direction="row" justifyContent="center" alignItems="center" marginTop={'10px'} marginBottom={'10px'}>
                <Text>Use Custom Avatar?</Text>
                <SwitchField
                    checked={!useDefault}
                    onChange={() => setUseDefault(prev => !prev)}
                    label="Switch"
                    labelHidden={true}
                    isLabelHidden={true}
                    size='large'
                />
            </Flex>


            {/*Dropzone section*/}
            <Flex direction="column" gap="1rem" justifyContent="center" alignItems="center" margin="10px" borderRadius='50px'>
                {!useDefault ? (
                    <DropZone
                        acceptedFileTypes={acceptedFileTypes}
                        onDropComplete={({ acceptedFiles }) => {
                            if (acceptedFiles.length > 0) {
                                const file = acceptedFiles[0];
                                handleFileSelection(file);
                            } 
                        }}
                    >
                        <Flex direction="row" alignItems="center">
                            <DropZone.Default>
                                <MdFileUpload fontSize="2rem" /> 
                            </DropZone.Default>
                            <DropZone.Accepted>
                                <MdCheckCircle fontSize="2rem" />
                                <Text>File accepted!</Text>
                            </DropZone.Accepted>
                            <DropZone.Rejected>
                                <MdRemoveCircle fontSize="2rem" />
                                <Text>Invalid file type.</Text>
                            </DropZone.Rejected>
                            
                            <Flex direction="column" alignItems="center">
                                <Text>Drag avatar image here or</Text>
                                <Button size="small" onClick={() => hiddenInput.current?.click()}>
                                    Browse
                                </Button>
                            </Flex>
                        </Flex>
                        <VisuallyHidden>
                            <input
                                type="file"
                                ref={hiddenInput}
                                onChange={onFilePickerChange}
                                accept={acceptedFileTypes.join(',')}
                            />
                        </VisuallyHidden>
                        {previewUrl && (
                            <Flex direction="column" alignItems="center">
                                <Text>Preview:</Text>
                                <Image src={previewUrl} alt="Avatar Preview" maxHeight='300px' maxWidth='300px'/>
                            </Flex>
                        )}
                    </DropZone>
                ) : (
                    <Text>Using default avatar</Text>
                )}
            </Flex>

            <Flex direction="column" gap="0.5rem" justifyContent="center" alignItems="center">
                <Button
                    variation="primary"
                    size="large"
                    onClick={handleStartGame}
                    isDisabled={!avatarName}
                    style={{ marginTop: '1rem' }}
                >
                    Continue
                </Button>
                <Button
                    variation="primary"
                    size="large"
                    onClick={handleReturnToMenu}
                    style={{ margin: '1rem'}}
                >
                    Return to menu
                </Button>
            </Flex>
        </View>
    );
};

export default nameCreation;
