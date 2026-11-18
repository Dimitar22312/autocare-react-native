import * as SecureStore from 'expo-secure-store';

const CHUNK_SIZE = 400;

function getChunkKey(key, index) {
    return `${key}.part${index}`;
}

function getCountKey(key) {
    return `${key}.count`;
}

async function getChunkCount(key) {
    const value = await SecureStore.getItemAsync(getCountKey(key));
    
    return value === null ? 0 : Number(value);
}

export const supabaseStorage = {
    async getItem(key) {
        const count = await getChunkCount(key);

        if (!Number.isInteger(count) || count <= 0) {
            return null;
        }

        const chunks = [];

        for (let index = 0; index < count; index++) {
            const chunk = await SecureStore.getItemAsync(getChunkKey(key, index));

            if (chunk === null) {
                return null;
            }
            chunks.push(chunk);
        }

        return chunks.join('');

    },
    
    async setItem(key, value) {
        const previousCount = await getChunkCount(key);

        const characters = Array.from(value);
        const chunks = [];

        for (let index = 0; index < characters.length; index += CHUNK_SIZE) {
            chunks.push(characters.slice(index, index + CHUNK_SIZE).join(''));
        }

        for (let index = 0; index < chunks.length; index++) {
            await SecureStore.setItemAsync(getChunkKey(key, index), chunks[index]);
        }

        await SecureStore.setItemAsync(getCountKey(key), String(chunks.length));

        for (let index = chunks.length; index < previousCount; index++) {
            await SecureStore.deleteItemAsync(getChunkKey(key, index));
        }
    },

    async removeItem(key) {
        const count = await getChunkCount(key);

        for (let index = 0; index < count; index++) {
            await SecureStore.deleteItemAsync(getChunkKey(key, index));
        }
        
        await SecureStore.deleteItemAsync(getCountKey(key));
    }
};