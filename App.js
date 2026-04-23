import { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as SQLite from 'expo-sqlite';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const db = useRef(null);

  useEffect(() => {
    (async () => {
      db.current = await SQLite.openDatabaseAsync('todos.db');
      await db.current.execAsync(
        `CREATE TABLE IF NOT EXISTS todos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          text TEXT NOT NULL,
          completed INTEGER NOT NULL DEFAULT 0
        );`
      );
      await load();
    })();
  }, []);

  async function load() {
    const rows = await db.current.getAllAsync('SELECT * FROM todos ORDER BY id DESC;');
    setTodos(rows);
  }

  async function addTodo() {
    const trimmed = text.trim();
    if (!trimmed) return;
    await db.current.runAsync('INSERT INTO todos (text) VALUES (?);', trimmed);
    setText('');
    await load();
  }

  async function toggle(id, completed) {
    await db.current.runAsync('UPDATE todos SET completed = ? WHERE id = ?;', completed ? 0 : 1, id);
    await load();
  }

  async function remove(id) {
    await db.current.runAsync('DELETE FROM todos WHERE id = ?;', id);
    await load();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          onSubmitEditing={addTodo}
          placeholder="Add a new task..."
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addBtn} onPress={addTodo}>
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todos}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <TouchableOpacity onPress={() => toggle(item.id, item.completed)} style={styles.checkbox}>
              <Text style={styles.checkboxText}>{item.completed ? '☑' : '☐'}</Text>
            </TouchableOpacity>
            <Text style={[styles.todoText, item.completed && styles.done]}>{item.text}</Text>
            <TouchableOpacity onPress={() => remove(item.id)}>
              <Text style={styles.del}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No tasks yet. Add one above!</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 60, paddingHorizontal: 20 },
  title: { fontSize: 32, fontWeight: '700', marginBottom: 24, color: '#111' },
  inputRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  input: {
    flex: 1, backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 12, fontSize: 16, borderWidth: 1, borderColor: '#ddd',
  },
  addBtn: { backgroundColor: '#4f46e5', borderRadius: 10, paddingHorizontal: 18, justifyContent: 'center' },
  addBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  row: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 10, padding: 14, marginBottom: 8, gap: 10,
  },
  checkbox: { width: 28 },
  checkboxText: { fontSize: 22, color: '#4f46e5' },
  todoText: { flex: 1, fontSize: 16, color: '#333' },
  done: { textDecorationLine: 'line-through', color: '#aaa' },
  del: { fontSize: 18, color: '#ccc', paddingHorizontal: 4 },
  empty: { textAlign: 'center', color: '#aaa', marginTop: 40, fontSize: 15 },
});
