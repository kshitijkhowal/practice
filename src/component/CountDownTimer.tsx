/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

interface Time {
    hours: number,
    minutes: number,
    seconds: number
}

const CountDownTimer = () => {

    const [time, setTime] = useState<Time>({
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    const [isActive, setIsActive] = useState<boolean>(false);

    useEffect(() => {
        let interval: any = null;

        if(isActive) {
            interval = setInterval(() => {
                setTime((prev) => {
                    const {hours, minutes, seconds} = prev;

                    // If timer reaches zero, clear interval and stop
                    if (hours === 0 && minutes === 0 && seconds === 0) {
                        setIsActive(false);
                        if (interval) clearInterval(interval);
                        return prev;
                    }

                    // Ticking math
                    if (seconds > 0) {
                        return { ...prev, seconds: seconds - 1 };
                    } else if (minutes > 0) {
                        return { hours, minutes: minutes - 1, seconds: 59 };
                    } else if (hours > 0) {
                        return { hours: hours - 1, minutes: 59, seconds: 59 };
                    }

                    return prev;
                })
            },1000)

        } else {
            if(interval) clearInterval(interval);
        }
        
        
        return () => {
            if(interval) clearInterval(interval);
        }

    },[isActive])

    const handleTimeChange = ({key, value}: {key: string, value: string}) => {
        setTime((prev) => {
            return {
                ...prev,
                [key]: value
            }
        })
    }

    const normaliseTime = () => {
        //normalise time to comply with max values
        const timeInSeconds = time.hours*60*60 + time.minutes*60 + time.seconds;
        const newTime: Time = {
            hours: Math.floor(timeInSeconds/3600),
            minutes: Math.floor((timeInSeconds%3600)/60),
            seconds: timeInSeconds%60,
        }
        setTime(newTime);
    }

    const handleStartPause = () => {
        normaliseTime()
        setIsActive((prev) => !prev);
    }

    const handleReset = () => {
        setIsActive(false);
        setTime({
            hours: 0,
            minutes: 0,
            seconds: 0
        })
    }

    return (
        <View style={styles.container} >
            <View style={styles.tiContainer} >
                <TextInput
                    style={styles.ti}
                    value={time.hours.toLocaleString()}
                    onChangeText={(text) => handleTimeChange({key:"hours", value: text})}
                    maxLength={2}
                    keyboardType="number-pad"
                    editable={!isActive}
                />
                <Text style={styles.colons} >:</Text>
                <TextInput
                    style={styles.ti}
                    value={time.minutes.toLocaleString()}
                    onChangeText={(text) => handleTimeChange({key:"minutes", value: text})}
                    maxLength={2}
                    keyboardType="number-pad"
                    editable={!isActive}
                />
                <Text style={styles.colons} >:</Text>
                <TextInput
                    style={styles.ti}
                    value={time.seconds.toLocaleString()}
                    onChangeText={(text) => handleTimeChange({key:"seconds", value: text})}
                    maxLength={2}
                    keyboardType="number-pad"
                    editable={!isActive}
                />
            </View>

            <View style={styles.buttonContainer}>
                <Button
                    title={isActive ? "Stop" : "Start"}
                    onPress={() => handleStartPause()}
                />
                <Button
                    title={"reset"}
                    onPress={() => handleReset()}
                />
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        padding: 20,
        gap: 10
    },
    tiContainer: {
        flexDirection: 'row',
        gap: 10
    },
    ti: {
        borderWidth: 1,
        flex: 1,
        textAlign: 'center',
    },
    colons: {
        fontSize: 30,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 10
    },
    button: {
        flex: 1,
    },
    text: {
        flex: 1,
        backgroundColor: 'red',
        textAlign: "center"
    }
})

export default CountDownTimer;