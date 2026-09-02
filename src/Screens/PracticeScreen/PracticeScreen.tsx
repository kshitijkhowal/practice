// create a screen in which there is a search bar and i have an api in which i am getting users

import { FC, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import User from './types';

const API_URL = 'https://dummyjson.com/users';

const PracticeScreen: FC = () => {
    // states
    const [users, setUsers] = useState<User[]>([]);
    const [searchQ, setSearchQ] = useState<string | null>(null);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

    useEffect(() => {
        getDataFromAPI();
    }, []);

    useEffect(() => {
        updateFilteredUsers(searchQ, users);
    }, [searchQ, users])

    const updateFilteredUsers = (searchQ: string | null, users: User[]) => {
        if(!searchQ) {
            setFilteredUsers(users);
            return;
        };

        const filtered = users.filter(user => `${user.firstName}${user.lastName}`.toLocaleLowerCase().includes(searchQ.toLocaleLowerCase()));
        setFilteredUsers(filtered);

    };

    const getDataFromAPI = () => {
        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                setUsers(data.users);
            });
    };

    const renderUserItem = ({ item }: { item: User }) => {
        return (
            <View style={styles.userItem}>
                <View style={styles.nameRow}>
                    <Text>{item.firstName}</Text>
                    <Text>{item.lastName}</Text>
                </View>
            </View>
        );
    };
    return (
        <View style={styles.container}>
            <TextInput
                value={searchQ ?? ''}
                onChangeText={(text: string) => setSearchQ(text)}
                style={styles.searchBox}
            />
            <FlatList data={filteredUsers} renderItem={renderUserItem} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    userItem: {
        backgroundColor: 'grey',
        margin: 10,
    },
    nameRow: {
        flexDirection: 'row',
        gap: 5,
    },
    searchBox: {
        backgroundColor: 'lightgrey',
        margin: 10,

    }
});

export default PracticeScreen;
