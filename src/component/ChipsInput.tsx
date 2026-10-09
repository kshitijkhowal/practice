/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react"
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native"

export interface Chip {
    label: string;
}

export interface ChipsInputProps {
    value: Chip[];
    setValue: React.Dispatch<React.SetStateAction<Chip[]>>;
}

const ChipsInput = ({ value, setValue }: ChipsInputProps) => {

    const [textQ, setTextQ] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleSubmit = () => {
        setError("");
        const trimmedText = textQ.trim();


        setValue((prev) => {
            const exists = prev.some((chip) => chip.label.toLowerCase() === trimmedText.toLowerCase());

            if (exists) {
                setError("Already Exists")
                return prev;
            }
            return [...prev, { label: textQ }];
        })
        setTextQ("");
    }

    const renderChip = ({ item }: { item: Chip }) => {

        const handleDeleteChip = () => {
            setValue((prev) => {
                return prev.filter((c) => c !== item);
            })
        }

        return (
            <View style={styles.chip}>
                <Text>
                    {item.label}
                </Text>
                <Pressable onPress={() => handleDeleteChip()} >
                    <Text style={styles.chipCross}>X</Text>
                </Pressable>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Text>Chips Input Component</Text>

            <View style={styles.tiContainer}>
                <TextInput
                    style={styles.ti}
                    value={textQ}
                    onChangeText={setTextQ}
                    // FIXED: Pass the function directly so it actually executes on enter
                    onSubmitEditing={handleSubmit}
                // FIXED: Optional but standard for when user clicks outside the input
                />
                <Pressable style={styles.submitButton} onPress={handleSubmit}>
                    <Text>enter</Text>
                </Pressable>

            </View>

            {error !== "" && <Text style={styles.errorText}>{error}</Text>}

            <FlatList
                data={value}
                renderItem={renderChip}
                horizontal
                contentContainerStyle={styles.chipsContainer}
            />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 10
    },
    ti: {
        borderWidth: 1,
        backgroundColor: 'lightgray',
        flex: 1
    },
    tiContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    submitButton: {
        backgroundColor: 'lightgray',
        borderWidth: 1,
        padding: 10
    },
    chip: {
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 10,
        padding: 8,
        gap: 5
    },
    chipsContainer: {
        gap: 10
    },
    chipCross: {
        color: 'red'
    },
    errorText: {
        color: 'red',
        fontSize: 10
    }
})

export default ChipsInput
