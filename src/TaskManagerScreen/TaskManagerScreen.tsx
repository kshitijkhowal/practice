/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { Button, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type Priority = "low" | "med" | "high" | "all";
type Status = "pending" | "completed" | "all";

interface Form {
    title: string,
    desc: string,
    priority: Priority,
    status: Status,
    dueData: string,
}

interface Task extends Form {
    id: string,
}

interface Filters {
    searchQ: string,
    priority: Priority | null,
    status: Status | null,
}

const FILTERS_DEFAULT_STATE: Filters = {
    searchQ: "",
    priority: 'all',
    status: 'all',
}

const FORM_DEFAULT_STATE: Form = {
    title: "",
    desc: "",
    priority: "low",
    status: "pending",
    dueData: new Date(Date.now()).toISOString().slice(0, 10),
}

const TASKS_DEFAULT_STATE: Task[] = [
    // 🏢 Work & Professional
    {
        id: "1",
        title: "Review Q3 Project Proposals",
        desc: "Analyze budgets, milestone timelines, and resource allocation drafts from the engineering department.",
        status: "pending",
        dueData: "2026-10-15",
        priority: "high"
    },
    {
        id: "2",
        title: "Update Client Pitch Deck",
        desc: "Revise growth statistics charts and incorporate product feedback from the latest beta testing pool.",
        status: "completed",
        dueData: "2026-10-08",
        priority: "high"
    },
    {
        id: "3",
        title: "Weekly Sync Meeting",
        desc: "Catch up with the design and marketing squads on feature rollouts.",
        status: "pending",
        dueData: "2026-10-12",
        priority: "med"
    },

    // 🏠 Personal & Household
    {
        id: "4",
        title: "Grocery Shopping",
        desc: "Pick up fresh spinach, oat milk, meal prep containers, and chicken breasts.",
        status: "pending",
        dueData: "2026-10-07",
        priority: "low"
    },
    {
        id: "5",
        title: "Fix Kitchen Faucet Leak",
        desc: "Call the landlord or go to the hardware shop to buy a replacement washer ring.",
        status: "pending",
        dueData: "2026-10-20",
        priority: "med"
    },

    // 🏋️ Health & Wellness
    {
        id: "6",
        title: "Dentist Appointment",
        desc: "Routine cleaning and checkup appointment at 10:30 AM.",
        status: "pending",
        dueData: "2026-11-02",
        priority: "high"
    },
    {
        id: "7",
        title: "Cardio Session",
        desc: "Complete a 5km run at the park or do 45 minutes on the gym treadmill.",
        status: "completed",
        dueData: "2026-10-05",
        priority: "low"
    },

    // 📚 Learning & Development
    {
        id: "8",
        title: "Read Chapter 4 of TypeScript Deep Dive",
        desc: "Take notes on advanced mapped types, conditional types, and generics execution profiles.",
        status: "pending",
        dueData: "2026-10-14",
        priority: "med"
    },
    {
        id: "9",
        title: "Watch React Native Performance Webinar",
        desc: "Learn about list optimization tricks, optimizing image caches, and reducing bridge overhead.",
        status: "completed",
        dueData: "2026-10-01",
        priority: "low"
    },

    // 💰 Finance & Admin
    {
        id: "10",
        title: "Pay Monthly Electricity Bill",
        desc: "Log into the banking application portal and settle utility accounts before the late charge fee kicks in.",
        status: "pending",
        dueData: "2026-10-10",
        priority: "high"
    }
];

interface FormComponentProps {
    form: Form;
    setForm: React.Dispatch<React.SetStateAction<Form>>;
    editTaskId: string | null; // FIXED: Typings updated to support null
    onSubmit: () => void;
    onCancelEdit: () => void; // Added cancel functionality
}

// 1. EXTRACTED FORM COMPONENT
const FormComponent = ({ form, setForm, onSubmit, editTaskId, onCancelEdit }: FormComponentProps) => {
    const priorityArr: Priority[] = ["low", "med", "high"];

    const handleFormChange = (key: keyof Form, value: string) => {
        setForm((prev: Form) => ({
            ...prev,
            [key]: value
        }))
    }

    return (
        <View style={styles.formContainer}>
            <Text style={styles.sectionHeader}>{editTaskId ? "Edit Task" : "Form"}</Text>

            <View>
                <Text>Title : </Text>
                <TextInput
                    style={styles.ti}
                    value={form.title}
                    onChangeText={(text) => handleFormChange("title", text)}
                />
            </View>
            <View>
                <Text>description : </Text>
                <TextInput
                    style={styles.ti}
                    value={form.desc}
                    onChangeText={(text) => handleFormChange("desc", text)}
                />
            </View>
            <View>
                <Text>Due Date : </Text>
                <TextInput
                    style={styles.ti}
                    value={form.dueData}
                    onChangeText={(text) => handleFormChange("dueData", text)}
                />
            </View>

            <View>
                <Text>Priority : </Text>
                <View style={styles.pFlatlistContainer}>
                    {priorityArr.map((item) => {
                        const isActive = form.priority === item;
                        return (
                            <Pressable
                                key={item}
                                onPress={() => setForm((prev) => ({ ...prev, priority: item }))}
                                style={[
                                    styles.pItemContainer,
                                    isActive && styles.pItemActiveContainer,
                                ]}>
                                <Text>{item}</Text>
                            </Pressable>
                        )
                    })}
                </View>
            </View>

            {/* Render appropriate actions based on edit mode state */}
            {!editTaskId ? (
                <Button title="Add Task" onPress={onSubmit} />
            ) : (
                <View style={styles.editActionsContainer}>
                    <View style={{ flex: 1 }}>
                        <Button title="Save Changes" onPress={onSubmit} color="green" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Button title="Cancel" onPress={onCancelEdit} color="red" />
                    </View>
                </View>
            )}
        </View>
    );
}

interface TaskItemProps {
    item: Task;
    onDelete: (id: string) => void;
    onEdit: (task: Task) => void; // Added edit callback
}

// 2. EXTRACTED TASK ITEM COMPONENT
const TaskItem = ({ item, onDelete, onEdit }: TaskItemProps) => {
    return (
        <View style={styles.taskContainer}>
            <Text>Title : {item.title}</Text>
            <Text>Description : {item.desc}</Text>
            <Text>Priority : {item.priority}</Text>
            <Text>Due Date : {item.dueData}</Text>
            <Text>Status : {item.status}</Text>

            <View style={styles.itemActionsContainer}>
                <Button title="edit" onPress={() => onEdit(item)} />
                <Button title="delete" onPress={() => onDelete(item.id)} color="red" />
            </View>
        </View>
    )
}

// 3. EXTRACTED EMPTY LIST COMPONENT
const ListEmpty = () => (
    <View style={styles.emptyContainer}>
        <Text>No tasks to Display</Text>
    </View>
);

interface FiltersComponentProps {
    filters: Filters,
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const FiltersComponent = ({ filters, setFilters }: FiltersComponentProps) => {

    const priorityArr: Priority[] = ["low", 'med', 'high', 'all']
    const statusArr: Status[] = ["completed", "pending", "all"]

    const handleSearchQChange = (text: string) => {
        setFilters((prev) => {
            return {
                ...prev,
                searchQ: text,
            }
        })
    }

    return (
        <View>

            <Text style={styles.sectionHeader}>Filters</Text>

            <TextInput
                style={styles.ti}
                // @ts-ignore
                value={filters.searchQ ?? ""}
                onChangeText={(text) => handleSearchQChange(text)}
            />

            <Text>Priority : </Text>
            <View style={styles.pFlatlistContainer}>
                {priorityArr.map((item) => {
                    const isActive = filters.priority === item;
                    return (
                        <Pressable
                            key={item}
                            onPress={() => setFilters((prev) => {
                                return{
                                    ...prev,
                                    priority: item,
                                }
                            })}
                            style={[
                                styles.pItemContainer,
                                isActive && styles.pItemActiveContainer,
                            ]}>
                            <Text>{item}</Text>
                        </Pressable>
                    )
                })}
            </View>
            <Text>Status : </Text>
            <View style={styles.pFlatlistContainer}>
                {statusArr.map((item) => {
                    const isActive = filters.status === item;
                    return (
                        <Pressable
                            key={item}
                            onPress={() => setFilters((prev) => {
                                return{
                                    ...prev,
                                    status: item,
                                }
                            })}
                            style={[
                                styles.pItemContainer,
                                isActive && styles.pItemActiveContainer,
                            ]}>
                            <Text>{item}</Text>
                        </Pressable>
                    )
                })}
            </View>


        </View>
    )
}

// MAIN SCREEN COMPONENT
const TaskManagerScreen = () => {

    const flatlistRef = useRef(null)

    const [form, setForm] = useState<Form>(FORM_DEFAULT_STATE);
    const [tasks, setTasks] = useState<Task[]>(TASKS_DEFAULT_STATE);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [editTaskId, setEditTaskId] = useState<string | null>(null);
    const [filters, setFilters] = useState<Filters>(FILTERS_DEFAULT_STATE)


    useEffect(() => {
        let ft = tasks;

        if(filters.searchQ && filters.searchQ.trim() !== ""){
            ft = ft.filter((t) => t.title.toString().toLowerCase().includes(filters.searchQ.toString().toLowerCase()))
        }

        if(filters.status !== 'all'){
            ft = ft.filter((t) => t.status === filters.status);
        }

        if(filters.priority !== 'all'){
            ft = ft.filter((t) => t.priority === filters.priority);
        }

        setFilteredTasks(ft)

    },[tasks, filters])


    // Form Submission & Editing Handler
    const handleSaveTask = () => {
        if (!form.title.trim()) return;

        if (editTaskId) {
            // LOGIC: Edit mode active -> Map existing array and swap targets
            setTasks((prev) =>
                prev.map((t) => (t.id === editTaskId ? { ...form, id: editTaskId } : t))
            );
            setEditTaskId(null);
        } else {
            // LOGIC: Creation mode -> Append brand new item entry
            const newTask: Task = {
                ...form,
                id: Date.now().toString(),
            };
            setTasks((prev) => [newTask, ...prev]);
        }

        setForm(FORM_DEFAULT_STATE); // Clear inputs
    };

    // LOGIC: Select entry, copy values to input state fields, flag view mode change
    const handleStartEdit = (task: Task) => {
        setEditTaskId(task.id);
        setForm({
            title: task.title,
            desc: task.desc,
            priority: task.priority,
            status: task.status,
            dueData: task.dueData,
        });
    };

    const handleCancelEdit = () => {
        setEditTaskId(null);
        setForm(FORM_DEFAULT_STATE);
    };

    const handleDeleteTask = (id: string) => {
        // If the task being edited is deleted, cancel the editing state
        if (id === editTaskId) {
            handleCancelEdit();
        }
        setTasks((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <FlatList
            style={styles.mainContainer}
            data={filteredTasks}
            ref={flatlistRef}
            renderItem={({ item }) => (
                <TaskItem item={item} onDelete={handleDeleteTask} onEdit={handleStartEdit} />
            )}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={
                <>
                    <FormComponent
                        form={form}
                        setForm={setForm}
                        editTaskId={editTaskId}
                        onSubmit={handleSaveTask}
                        onCancelEdit={handleCancelEdit}
                    />
                    <FiltersComponent
                        filters={filters}
                        setFilters={setFilters}
                    />
                    <Text style={[styles.sectionHeader, { marginTop: 15 }]}>Tasks List</Text>


                </>
            }
            contentContainerStyle={styles.tasksFlatlistContainer}
            ListEmptyComponent={ListEmpty}
        />
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        padding: 10,
        backgroundColor: "#fff",
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    taskContainer: {
        padding: 10,
        gap: 5,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 4,
    },
    formContainer: {
        gap: 10,
        marginBottom: 10,
    },
    ti: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 6,
        borderRadius: 4,
    },
    pItemContainer: {
        borderWidth: 1,
        borderColor: "#ccc",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
    },
    pItemActiveContainer: {
        backgroundColor: "lightgray"
    },
    pFlatlistContainer: {
        flexDirection: "row",
        gap: 10,
        marginVertical: 5,
    },
    tasksFlatlistContainer: {
        gap: 10,
        paddingBottom: 30,
    },
    emptyContainer: {
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    itemActionsContainer: {
        flexDirection: "row",
        gap: 10,
        marginTop: 5,
    },
    editActionsContainer: {
        flexDirection: "row",
        gap: 10,
    }
})

export default TaskManagerScreen;
