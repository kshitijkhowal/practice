/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, Text, View } from 'react-native';

const API_URL = 'https://dummyjson.com/products?limit=100';

const PAGE_SIZE = 5;

const renderProductItem = ({ item }: { item: any }) => {
    console.log("help", item.images[0]);
    return (
        <View style={{ padding: 10, borderWidth: 2, maxWidth: 300, margin: 10 }}>
            <Image style={{ height: 50, width: 50 }} source={{ uri: item.images[0] }} />
            <Text>{item.title}</Text>
        </View>
    );
};



const PaginationScreen = () => {
    const [data, setData] = useState([]);
    const [activePage, setActivePage] = useState(0);
    const [activePageData, setActivePageData] = useState([]);



    const totalProducts = data.length;
    const numberOfPages = Math.ceil(totalProducts / PAGE_SIZE);


    const pages = Array.from({ length: numberOfPages }, (_, index) => index);

    useEffect(() => {
        fetch(API_URL)
            .then(res => res.json())
            .then(apiData => setData(apiData.products));
    }, []);

    useEffect(() => {
        const startIndex = PAGE_SIZE * activePage;
        const paginatedData = data.slice(startIndex, startIndex+PAGE_SIZE);
        setActivePageData(paginatedData);
    },[activePage, data])

    const renderPageButton = ({ item }: { item: number }) => {

        const isActive = item === activePage;
        return (<Pressable onPress={() => {setActivePage(item)}} style=
            {
                [
                    { borderWidth: 1, paddingHorizontal: 2, marginHorizontal: 2, },
                    isActive && { backgroundColor: 'blue' }
                ]
            }>
            <Text>
                {item}
            </Text>
        </Pressable>)
    };

    return (
        <View>
            <FlatList data={pages} renderItem={renderPageButton} horizontal />
            <FlatList data={activePageData} renderItem={renderProductItem} keyExtractor={(item) => item.id} />
        </View>
    );
};

export default PaginationScreen;
