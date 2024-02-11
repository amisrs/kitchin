import {View, StyleSheet} from 'react-native';
import {
    Button,
    Card,
    FAB,
    Modal,
    Text,
    TextInput,
    useTheme,
} from 'react-native-paper';
import Space from '../data/Space/Space';
import {useState} from 'react';
import {useRealm} from '@realm/react';
import SpaceRepository from '../data/Space/SpaceRepository';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AppBar from '../components/AppBar';

const SpacesScreen = () => {
    const [spacesList, setSpacesList] = useState<Realm.Results<Space>>();
    const realm = useRealm();
    const spaceRepo = new SpaceRepository(realm);
    const spaces = spaceRepo.Find();
    const [isModalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState('');
    const theme = useTheme();

    const toggleModal = (toggle: boolean) => {
        setModalVisible(toggle);
    };

    const CreateSpace = () => {
        spaceRepo.Create({name: name});
    };

    const styles = StyleSheet.create({
        fab: {
            position: 'absolute',
            margin: 16,
            right: 0,
            bottom: 0,
        },
        container: {
            height: '100%',
            width: '100%',
            backgroundColor: theme.colors.surface,
        },
        inputContainer: {
            display: 'flex',
            margin: '10%',
            padding: 16,
            backgroundColor: 'white',
            flexDirection: 'column',
            gap: 8,
        },
        cardContainer: {
            padding: 24,
            height: '100%',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 16,
            justifyContent: 'center',
        },
        card: {
            flexShrink: 0,
            flexGrow: 1,
            flexBasis: '24%',
        },
    });

    return (
        <View style={styles.container}>
            <AppBar screen="Spaces" />
            <KeyboardAwareScrollView style={{height: '100%'}}>
                <View style={styles.cardContainer}>
                    {spaces?.map(space => (
                        <Card
                            style={styles.card}
                            key={space._id.toString()}
                            onPress={() => {
                                console.log(space);
                            }}>
                            <Card.Cover
                                source={{uri: 'https://picsum.photos/700'}}
                            />
                            <Card.Title
                                title={space.name}
                                titleVariant="titleLarge"
                            />
                            <Card.Content>
                                <Text>{space.items?.length} items</Text>
                            </Card.Content>
                        </Card>
                    ))}
                </View>
            </KeyboardAwareScrollView>
            <Modal
                visible={isModalVisible}
                onDismiss={() => toggleModal(false)}>
                <View style={styles.inputContainer}>
                    <Text variant="titleLarge">Add a space</Text>
                    <TextInput
                        mode="outlined"
                        label="Space"
                        style={{flexGrow: 1}}
                        onChangeText={setName}
                    />
                    <Button
                        mode="contained"
                        onPress={() => {
                            CreateSpace();
                            toggleModal(false);
                        }}>
                        Add
                    </Button>
                </View>
            </Modal>
            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => {
                    toggleModal(true);
                }}
            />
        </View>
    );
};
export default SpacesScreen;
