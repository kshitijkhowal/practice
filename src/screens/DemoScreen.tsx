import { useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import type { TextInputInstance, TextInputKeyPressEvent } from "react-native";

interface OTPComponentProps {
    digits: number,
    onComplete: (value: string) => void
}

const OTPComponent = (
    {
        digits,
        onComplete
    }: OTPComponentProps
) => {
    const [otp, setOtp] = useState<string[]>(Array(digits).fill(""));
    const inputRefs = useRef<Array<TextInputInstance | null>>([]);

    const handleChangeText = (text: string, index: number) => {
        const cleanedText = text.replace(/[^0-9]/g, "");
        const newOtp = [...otp];

        newOtp[index] = cleanedText.slice(-1);
        setOtp(newOtp);

        const combinedCode = newOtp.join("");
        if (combinedCode.length === digits) {
            onComplete(combinedCode);
        }

        // Move to next input field if text is entered
        if (cleanedText && index < digits - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    }

    const handleKeyPress = (
        e: TextInputKeyPressEvent,
        index: number
    ) => {
        // Move to previous field on backspace if current field is empty
        if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();

            const newOtp = [...otp];
            newOtp[index - 1] = ""; // Optional: Clear previous field value
            setOtp(newOtp);
        }
    };

    return (
        <View style={styles.container}>
            {Array.from({ length: digits }).map((_, index) => (
                <TextInput
                    key={index}
                    style={styles.ti}
                    ref={(ref) => {
                        inputRefs.current[index] = ref;
                    }}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={otp[index]}
                    onChangeText={(text) => handleChangeText(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                />
            ))}
        </View>
    )

}

const DemoScreen = () => {



    return (
        <View>
            <OTPComponent
                digits={6}
                onComplete={(value) => { console.log(value) }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    ti: {
        borderWidth: 1,
        borderColor: "#CCCCCC",
        borderRadius: 8,
        width: 40,
        height: 50,
        textAlign: "center",
        fontSize: 20,
        backgroundColor: "#FFFFFF",
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    }
})

export default DemoScreen;