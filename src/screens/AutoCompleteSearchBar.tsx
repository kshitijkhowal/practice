/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { Button, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const API_URL = "https://dummyjson.com/recipes/search";
const MAX_RECCOMENDATIONS = 10;
const DEBOUNCE_DELAY = 500;

const AutoCompleteSearchBar = () => {
    const [searchQ, setSearchQ] = useState<string>("");
    const [recipies, setRecipies] = useState<any[]>([]);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [cache, setCache] = useState<any>({});

    useEffect(()=>{
        console.log(cache)
    },[cache])

    const textInputRef = useRef<TextInput>(null);

    useEffect(() => {
        const fetchData = () => {
            console.log("API CALL", searchQ);
            const params = {
                q: searchQ,
                limit: MAX_RECCOMENDATIONS.toString(),
            }

            if (params.q === "") {
                setRecipies([]);
                return;
            }

            const queryString = new URLSearchParams(params).toString();
            const API_WITH_PARAMS = `${API_URL}?${queryString}`

            if(cache[API_WITH_PARAMS]) {
                console.log('from cache', searchQ)
                setRecipies(cache[API_WITH_PARAMS]);
                return;
            }

            fetch(API_WITH_PARAMS)
                .then((res) => res.json())
                .then((res) => {
                    console.log('from api', searchQ)
                    setRecipies(res.recipes);
                    setCache((prev: any) => {
                        return {
                            ...prev,
                            [API_WITH_PARAMS]: res.recipes,
                        }
                    })
                });
        }

        const timeoutId = setTimeout(() => {
            fetchData();
        }, DEBOUNCE_DELAY);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [searchQ])

    const handleTIFocus = () => {
        setIsFocused(true)
    }
    
    const handleTIUnfocus = () => {
        setIsFocused(false)
    }

    const renderSuggestionItem = ({ item }: { item: any }) => {

        const handleItemPress = () => {
            setSearchQ(item.name);
            //@ts-ignore
            textInputRef?.current?.blur()
        }

        return (
            <Pressable onPress={() => handleItemPress()} style={styles.suggestionItem}>
                <Text>
                    {item.name}
                </Text>
            </Pressable>
        );
    }

    return (
        <View style={styles.mainContainer}>
            <TextInput
                placeholder="Search for something"
                ref={textInputRef}
                onFocus={() => handleTIFocus()}
                onBlur={() => handleTIUnfocus()}
                style={styles.ti}
                value={searchQ}
                onChangeText={(text) => setSearchQ(text)}
            />
            {recipies.length !== 0 && isFocused && <FlatList
                data={recipies}
                renderItem={renderSuggestionItem}
                ItemSeparatorComponent={<View style={styles.horizontalSeperator} />}
                contentContainerStyle={styles.flatlistContainer}
            />}
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        padding: 5,
    },
    ti: {
        borderWidth: 1,
        backgroundColor: "gray",
        borderRadius: 10,
        padding: 5
    },
    suggestionItem: {
        padding: 5,
    },
    horizontalSeperator: {
        height: 1,
        backgroundColor: 'black'
    },
    flatlistContainer: {
        borderWidth: 1,
        borderRadius: 10,
    },
})

export default AutoCompleteSearchBar;