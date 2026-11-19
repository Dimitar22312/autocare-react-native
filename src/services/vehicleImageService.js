import * as FileSystem from 'expo-file-system/legacy';

import { decode } from 'base64-arraybuffer';

import { supabase } from '../lib/supabase';

const BUCKET_NAME = 'vehicle-images';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const SIGNED_URL_DURATION = 60 * 60 * 24;

const imageTypes = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    heic: 'image/heic',
};

function getImageExtension(uri) {
    const path = uri.split('?')[0];

    const extension = path
        .split('.')
        .pop()
        .toLowerCase();

    return imageTypes[extension] ? extension : 'jpg';
}

export function isStorageImage(path) {
    return Boolean(
        path &&
        !path.startsWith('file://') &&
        !path.startsWith('content://') &&
        !path.startsWith('http://') &&
        !path.startsWith('https://')
    );
}

export async function uploadVehicleImage(imageUri, userId) {
    if (!imageUri || !userId) {
        throw new Error('Image and user are required.');
    }

    const fileInfo = await FileSystem.getInfoAsync(imageUri);

    if (!fileInfo.exists) {
        throw new Error('Selected image does not exist.');
    }

    if (fileInfo.size > MAX_IMAGE_SIZE) {
        throw new Error(
            'Image must be smaller than 5 MB.'
        );
    }

    const base64 = await FileSystem.readAsStringAsync(
        imageUri,
        {
            encoding: FileSystem.EncodingType.Base64,
        }
    );

    const arrayBuffer = decode(base64);

    const extension = getImageExtension(imageUri);

    const fileName =
        `vehicle-${Date.now()}-${Math.floor(Math.random() * 1000000)}.${extension}`;

    const filePath = `${userId}/${fileName}`;

    const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, arrayBuffer, {
            contentType: imageTypes[extension],
            upsert: false,
        });

    if (error) {
        console.error('Image Upload Error:', error);

        throw error;
    }

    return filePath;
}

export async function getVehicleImageUrl(imagePath) {
    if (!imagePath) {
        return null;
    }

    if (!isStorageImage(imagePath)) {
        return imagePath;
    }

    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrl(
            imagePath,
            SIGNED_URL_DURATION
        );

    if (error) {
        console.error('Signed URL Error:', error);

        throw error;
    }

    return data.signedUrl;
}

export async function deleteVehicleImage(imagePath) {
    if (!isStorageImage(imagePath)) {
        return;
    }

    const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([imagePath]);

    if (error) {
        console.error('Image Delete Error:', error);

        throw error;
    }
}