/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useCallback, useMemo } from "react"
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native"

const API_URL = "https://dummyjson.com/products";
const MAX_ACTIVE_PRODUCTS = 3;

// Strongly typed Product object matching your schema
interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    thumbnail: string;
}

// 1. Fixed ListHeaderComponent to be an isolated presentation pass
interface HeaderProps {
    searchQ: string;
    setSearchQ: (text: string) => void;
}

const FilterHeader = ({ searchQ, setSearchQ }: HeaderProps) => {
    return (
        <View style={styles.headerContainer}>
            <TextInput
                style={styles.ti}
                value={searchQ}
                onChangeText={setSearchQ}
                placeholder="Search products..."
                placeholderTextColor="#888"
            />
        </View>
    );
};

// 2. Safe Text Highlighting Component with Regex character escaping
const HighlightedText = ({ text, SQ }: { text: string, SQ: string }) => {
    if (!SQ?.trim()) {
        return <Text style={styles.baseText}>{text}</Text>;
    }

    // Escape special characters to prevent RegExp runtime crashes
    const escapedSQ = SQ.replace(/[-\/\\^\$*+?.()|[\]{}]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escapedSQ})`, 'gi'));
    
    return (
        <Text style={styles.baseText}>
            {parts.map((part, index) =>
                part.toLowerCase() === SQ.toLowerCase() ? (
                    <Text key={index} style={styles.highlight}>
                        {part}
                    </Text>
                ) : (
                    <Text key={index}>{part}</Text>
                )
            )}
        </Text>
    );
};

// 3. Extracted and Memoized Product Item Component for extreme rendering efficiency
interface ProductItemProps {
    item: Product;
    isActive: boolean;
    searchQ: string;
    onToggleActive: (id: number) => void;
}

const ProductItem = React.memo(({ item, isActive, searchQ, onToggleActive }: ProductItemProps) => {
    return (
        <Pressable style={styles.pItem} onPress={() => onToggleActive(item.id)}>
            <HighlightedText text={item.title} SQ={searchQ} />
            <Text style={styles.priceText}>Price : \${item.price}</Text>
            {isActive &&
                <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionText}>Description : {item.description}</Text>
                </View>
            }
        </Pressable>
    );
});

const ProductListPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchQ, setSearchQ] = useState<string>("");
    const [activeProducts, setActiveProducts] = useState<number[]>([]);

    const fetchDataFromAPI = () => {
        fetch(API_URL)
            .then((res) => res.json())
            .then((res) => setProducts(res.products || []))
            .catch((err) => console.error("Error fetching products:", err));
    };

    useEffect(() => {
        fetchDataFromAPI();
    }, []);

    // Optimized computed text filter utilizing hook dependency mappings instead of syncing double state
    const filteredProducts = useMemo(() => {
        const query = searchQ.toLocaleLowerCase().trim();
        if (!query) return products;
        
        return products.filter((p) => 
            p.title.toLocaleLowerCase().includes(query)
        );
    }, [products, searchQ]);

    // Stable interaction callback passed safely into child elements
    const handleToggleActive = useCallback((id: number) => {
        setActiveProducts((prev) => {
            const isActive = prev.includes(id);
            if (isActive) {
                return prev.filter((p) => p !== id);
            } else {
                return [id, ...prev].slice(0, MAX_ACTIVE_PRODUCTS);
            }
        });
    }, []);

    // Main layout cell render routine
    const renderPItem = useCallback(({ item }: { item: Product }) => {
        return (
            <ProductItem 
                item={item}
                isActive={activeProducts.includes(item.id)}
                searchQ={searchQ}
                onToggleActive={handleToggleActive}
            />
        );
    }, [activeProducts, searchQ, handleToggleActive]);

    return (
        <FlatList
            data={filteredProducts}
            renderItem={renderPItem}
            ListHeaderComponent={<FilterHeader searchQ={searchQ} setSearchQ={setSearchQ} />}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
        />
    );
};

const styles = StyleSheet.create({
    listContent: {
        paddingBottom: 20,
    },
    headerContainer: {
        padding: 5,
    },
    pItem: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        margin: 5,
        gap: 5,
        borderRadius: 4,
        backgroundColor: '#fff',
    },
    ti: {
        backgroundColor: 'lightgray',
        borderWidth: 1,
        borderColor: '#999',
        padding: 10,
        margin: 5,
        borderRadius: 4,
        color: '#000',
    },
    baseText: {
        fontSize: 16,
        color: '#333',
    },
    priceText: {
        fontSize: 14,
        color: '#666',
    },
    descriptionContainer: {
        marginTop: 5,
        paddingTop: 5,
        borderTopWidth: 0.5,
        borderTopColor: '#eee',
    },
    descriptionText: {
        fontSize: 14,
        color: '#555',
        fontStyle: 'italic',
    },
    highlight: {
        backgroundColor: 'yellow',
        fontWeight: 'bold',
        color: 'black',
    },
});

export default ProductListPage;
