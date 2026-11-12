import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function usePersistedState(key, initialValue) {
    const [state, setState] = useState(initialValue);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        let isActive = true;

        async function loadState() {
            try {
                const storedState = await AsyncStorage.getItem(key);

                if (storedState !== null && isActive) {
                    setState(JSON.parse(storedState));
                }
            } catch {
                console.error("Failed to load data:", error);
            } finally {
                if (isActive) {
                    setIsLoaded(true);
                }
            }
        }

        loadState();

        return () => {
            isActive = false;
        };
    }, [key]);

    useEffect(() => {
        if (!isLoaded) {
            return;
        }

        async function saveState() {
            try {
                await AsyncStorage.setItem(
                    key,
                    JSON.stringify(state)
                );
            } catch (error) {
                console.error("Failed to save data:", error);
            } 
        }

        saveState();
    }, [key, state, isLoaded]);

    return [state, setState, isLoaded];
}