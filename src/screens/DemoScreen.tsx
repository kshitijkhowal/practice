/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRef, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

interface ProgressBarProps {
    value: number,
    max: number,
    min: number,
}

const ProgressBar = ({ value, max, min }: ProgressBarProps) => {

    const adjustedValue = value-min;
    const adjustedMax = max-min;

    const progressPercentage = adjustedValue*100/adjustedMax;

    return (
        <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, {width: `${progressPercentage}%`}]}/>

        </View>
    )
}

const DemoScreen = () => {
    const [progressValue, setProgressValue] = useState<number>(50);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const maxLimit = 100;
    const minLimit = 0;

    const handleChangeProgress = (value: number) => {
        setProgressValue((prev) => {
            return prev+value;
        })
    }

// Increments smoothly over time instead of a blocking 'while' loop
    const handleIncrementalChangeProgress = (targetDelta: number) => {
        // Clear any ongoing animation increments first
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        let stepsRemaining = Math.abs(targetDelta);
        const stepSize = targetDelta > 0 ? 1 : -1;

        intervalRef.current = setInterval(() => {
            if (stepsRemaining <= 0) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                return;
            }

            setProgressValue((prev) => {
                const nextValue = prev + stepSize;
                // Stop running if we hit the boundaries early
                if (nextValue >= maxLimit || nextValue <= minLimit) {
                    if (intervalRef.current) clearInterval(intervalRef.current);
                }
                return Math.min(Math.max(nextValue, minLimit), maxLimit);
            });

            stepsRemaining--;
        }, 16); // ~60fps smooth stepping
    };

    return (

        <View style={styles.container}>
            <Text>Demo Screen</Text>

            <ProgressBar
                value={progressValue}
                max={maxLimit}
                min={minLimit}
            />
            <View style={styles.buttonRow}>
                <Button title="inc 10" onPress={() => handleChangeProgress(10)} />
                <Button title="dec 10" onPress={() => handleChangeProgress(-10)} />
            </View>

            <View style={styles.buttonRow}>
                <Button title="Smooth Inc 40" color="purple" onPress={() => handleIncrementalChangeProgress(40)} />
                <Button title="Smooth Dec 40" color="purple" onPress={() => handleIncrementalChangeProgress(-40)} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center'
    },
    progressBarContainer: {
        height: 30,
        borderWidth: 1,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#e0e0e0',
        marginBottom: 20,
    },
    progressBar: {
        flex: 1,
        backgroundColor: 'red',
        borderRadius: 10,

    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10
    }
});

export default DemoScreen;