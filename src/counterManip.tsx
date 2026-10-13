/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Text, View } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { decrement, increment } from "./redux/slice/counterSlice";

const CounterManip = () => {
    // @ts-ignore
    const count = useSelector((state) => state.counter.count);
    const dispatch = useDispatch();

    return(
        <View>
            <Text>
                {count}
            </Text>
            <Button title="inc" onPress = {() => dispatch(increment())} />
            <Button title="dec" onPress = {() => dispatch(decrement())} />
            
        </View>
    )
}

export default CounterManip