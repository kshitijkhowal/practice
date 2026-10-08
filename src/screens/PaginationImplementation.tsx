/* eslint-disable @typescript-eslint/no-unused-vars */
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native"
import PRODUCT_JSON from "../../mockData/PRODUCTS.json"
import { useEffect, useMemo, useState } from "react"

const test = PRODUCT_JSON.products[0];
const PAGE_SIZE = 10;

const PaginationComponent = ({ arr, value, onChangeValue }: { arr: number[], value: number, onChangeValue: (text: number) => void }) => {
    type config = "left" | "right";

    const renderPaginationItem = ({ item }: { item: number }) => {

        const isActive = item === value;

        return (
            <Pressable
                onPress={() => onChangeValue(item)}
                style={[
                    styles.paginationItem,
                    isActive && styles.activePaginationItem
                ]}
            >
                <Text>{item}</Text>
            </Pressable>
        )
    }

    const arrowsComponent = ({config = "left"} : {config: config}) => {

        const arrow = config === 'left' ? '<' : '>'

        const handleOnPressArrow = () => {
            if(config === 'left' && value>1){
                onChangeValue(value-1);
            } else if(config === 'right' && value<arr.length) {
                onChangeValue(value+1);
            }
        }

        return (
            <Pressable onPress={() => handleOnPressArrow()} style={styles.paginationItem}>
                <Text>
                    {arrow}
                </Text>
            </Pressable>
        )
    }

    return (
        <View style={styles.paginationContainer}>
            {arrowsComponent({config:'left'})}
            <FlatList
                data={arr}
                renderItem={renderPaginationItem}
                horizontal
                />
            {arrowsComponent({config:'right'})}
        </View>
    )
}

const PaginationImplementation = () => {
    const [allProducts, setAllProducts] = useState(PRODUCT_JSON.products)
    const [activePage, setActivePage] = useState<number>(1);
    const [productsToDisplay, setProductsToDisplay] = useState([]);


    const numberOfPages = Math.ceil(allProducts.length / PAGE_SIZE);

    const paginationArray = useMemo(() => {
        const arr = [];
        for (let i = 1; i <= numberOfPages; i++) {
            arr.push(i);
        }
        return arr;
    }, [numberOfPages]);

    useEffect(() => {

        const initialIndex = (activePage - 1) * PAGE_SIZE;
        const pl = allProducts.slice(initialIndex, initialIndex + PAGE_SIZE);
        //@ts-ignore
        setProductsToDisplay(pl)
    }, [allProducts, activePage])

    const productItem = ({ item }: any) => {
        return (
            <View style={styles.pi}>
                <Text>Title : {item.title}</Text>
                <Text>Price : {item.price}</Text>
                <Text>Brand : {item.brand}</Text>
            </View>
        )
    }

    return (
        <FlatList
            ListHeaderComponent={
                <PaginationComponent
                    arr={paginationArray}
                    value={activePage}
                    onChangeValue={(text) => setActivePage(text)}
                />
            }
            data={productsToDisplay}
            renderItem={productItem}
        />
    )
}

const styles = StyleSheet.create({
    pi: {
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 10,
        padding: 10,
        margin: 10,
        gap: 5
    },
    paginationItem: {
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 10,
        padding: 10,
        margin: 2,
    },
    paginationContainer: {
        flexDirection: 'row'
    },
    activePaginationItem: {
        backgroundColor: 'lightblue',
    },
})

export default PaginationImplementation