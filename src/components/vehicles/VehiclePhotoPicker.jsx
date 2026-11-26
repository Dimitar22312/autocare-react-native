import {
    View,
    Text,
    Image,
    Pressable,
    StyleSheet,
    Alert,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function VehiclePhotoPicker({
    imageUri,
    onImageSelected,
    disabled = false,
}) {

    async function pickImageHandler() {
        if (disabled) {
            return;
        }

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: false,
                quality: 0.8,
            });

            if (
                !result.canceled &&
                result.assets?.length > 0
            ) {
                onImageSelected(result.assets[0]);
            }

        } catch (error) {
            console.error('ImagePicker Error:', error);

            Alert.alert(
                'Error',
                'Unable to select an image.'
            );
        }
    }

    async function takePhotoHandler() {
        if (disabled) {
            return;
        }

        try {
            const permission =
                await ImagePicker.requestCameraPermissionsAsync();

            if (!permission.granted) {
                Alert.alert(
                    'Camera Permission Required',
                    'Please allow AutoCare to access your camera.'
                );

                return;
            }

            const result =
                await ImagePicker.launchCameraAsync({
                    mediaTypes: ['images'],
                    allowsEditing: true,
                    aspect: [16, 9],
                    quality: 0.8,
                });

            if (
                !result.canceled &&
                result.assets?.length > 0
            ) {
                onImageSelected(result.assets[0]);
            }

        } catch (error) {
            console.error('Camera Error:', error);

            Alert.alert(
                'Camera Error',
                'Unable to open the camera.'
            );
        }
    }

    return (
        <View>
            <Text style={styles.sectionTitle}>
                Vehicle Photo
            </Text>

            <View style={styles.imageContainer}>
                {imageUri ? (
                    <Image
                        source={{ uri: imageUri }}
                        style={styles.vehicleImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Ionicons
                            name="car-sport-outline"
                            size={70}
                            color="#FF7A00"
                        />

                        <Text
                            style={styles.imagePlaceholderText}
                        >
                            Add your vehicle photo
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.imageActions}>
                <Pressable
                    style={[
                        styles.imageButton,
                        disabled && styles.disabledButton,
                    ]}
                    onPress={pickImageHandler}
                    disabled={disabled}
                >
                    <Ionicons
                        name="images-outline"
                        size={22}
                        color="#FF7A00"
                    />

                    <Text style={styles.imageButtonText}>
                        Choose From Gallery
                    </Text>
                </Pressable>

                <Pressable
                    style={[
                        styles.cameraButton,
                        disabled && styles.disabledButton,
                    ]}
                    onPress={takePhotoHandler}
                    disabled={disabled}
                >
                    <Ionicons
                        name="camera-outline"
                        size={22}
                        color="#FFFFFF"
                    />

                    <Text style={styles.cameraButtonText}>
                        Take Photo
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 19,
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: 10,
    },

    imageContainer: {
        width: '100%',
        height: 210,
        backgroundColor: '#1C212B',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#303641',
        overflow: 'hidden',
        marginBottom: 15,
    },

    vehicleImage: {
        width: '100%',
        height: '100%',
    },

    imagePlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },

    imagePlaceholderText: {
        color: '#9CA3AF',
        fontSize: 14,
    },

    imageActions: {
        gap: 12,
        marginBottom: 30,
    },

    imageButton: {
        backgroundColor: '#332519',
        borderWidth: 1,
        borderColor: '#FF7A00',
        borderRadius: 12,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },

    imageButtonText: {
        color: '#FF7A00',
        fontSize: 15,
        fontWeight: 'bold',
    },

    cameraButton: {
        backgroundColor: '#FF7A00',
        borderRadius: 12,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },

    cameraButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold',
    },

    disabledButton: {
        opacity: 0.6,
    },
});