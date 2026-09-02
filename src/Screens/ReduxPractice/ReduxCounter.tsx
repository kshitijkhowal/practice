import { Button, StyleSheet, Text, View } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { decrement, increment } from "../../Redux/Slices/counterSlice";


const ReduxCounter = () => {
//@ts-ignore
    const count = useSelector(state => state.counter.count);
    const dispatch = useDispatch();
    return (
        <View style={styles.container}>

            <Button title="inc" onPress={() => {dispatch(increment())}}/>
            <Button title="dec" onPress={() => {dispatch(decrement())}}/>
                <Text>
                    {count}
                </Text>


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})

export default ReduxCounter