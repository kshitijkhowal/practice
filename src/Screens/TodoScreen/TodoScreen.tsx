/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Button, FlatList, Pressable, Switch, Text, TextInput, View } from "react-native"

interface todoItemType {
    id: number,
    title: string,
    isCompleted: boolean
};

const TodoScreen = () => {

    const [todos, setTodos] = useState<todoItemType[]>([
        {
            id: 1,
            title: "help1",
            isCompleted: false
        },
        {
            id: 2,
            title: "helsdfjkashdkfj aksjdh fkljasdh fkjh adksjhf kajsdhfkjahsdkfjh p2",
            isCompleted: false
        },
        {
            id: 3,
            title: "help3",
            isCompleted: false
        },
        {
            id: 4,
            title: "help4",
            isCompleted: true
        },
    ]);


    const handleAddTodo = () => {
        if(!inpText || inpText.trim() === "") return;
        const todoToAdd = {
            id: Date.now(),
            title: inpText,
            isCompleted: false
        }

        setTodos((prev) => {
            return [...prev, todoToAdd];
        })

        setInputText("");
    }

    const handleDeleteTodo = (id: number) => {
        setTodos((prev) => {
            return prev.filter((todo) => todo.id !== id);
        })
    }

    const handleTodoToggle = (id: number) => {
        setTodos((prev) => prev.map((todo) => {
            return todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo;
        })
        )
    }

    const [inpText, setInputText] = useState("asdfs");

    const renderTodoItem = ({ item }: { item: todoItemType }) => {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Switch value={item.isCompleted} onChange={() => handleTodoToggle(item.id)} />
                    <Text style={[
                        { maxWidth: "80%" },
                        item.isCompleted && { textDecorationLine: 'line-through' }
                    ]}>{item.title}</Text>
                </View>
                <Pressable onPress={() => handleDeleteTodo(item.id)}>
                    <Text style={{ color: "red", fontSize: 10 }}>Delete</Text>
                </Pressable>
            </View>
        )
    }

    return (
        <View style={{ flex: 1, padding: 10 }}>
            <Text>Todo Screen</Text>
            <TextInput style={{ borderWidth: 1 }} value={inpText} onChangeText={(text) => setInputText(text)} />
            <Button title="Add +" onPress={() => { handleAddTodo() }} />
            <FlatList
                data={todos}
                renderItem={renderTodoItem}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    )
}

export default TodoScreen