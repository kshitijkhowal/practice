/* eslint-disable @typescript-eslint/no-unused-vars */
import { View } from "react-native"
import StarRatingComponent from "../components/StarRatingComponent"
import { useEffect, useState } from "react"


const DemoScreen = () => {

    const [starRating, setStarRating] = useState<number>(0)

    useEffect(() => {
        console.log(starRating)
    },[starRating])

    return (
        <View>
            <StarRatingComponent
                stars={5}
                value={starRating}
                setValue={setStarRating}
            />
        </View>
    )
}

export default DemoScreen