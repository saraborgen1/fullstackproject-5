export default function TodosView({
    newTitle,
    setNewTitle,
    sortBy,
    setSortBy,
    searchBy,
    setSearchBy,
    searchValue,
    setSearchValue,
    displayedTodos,
    editingId,
    editingTitle,
    setEditingTitle,
    onAdd,
    onDelete,
    onToggle,
    onStartEdit,
    onSaveEdit,
    onCancelEdit,
    onBackHome
}) {
    return (
        <div>
            <button onClick={onBackHome}>Back to Home</button>

            <h1>Todos</h1>

            <h3>Add new todo</h3>
            <input
                placeholder="New todo title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
            />
            <button onClick={onAdd}>Add</button>

            <h3>Sort todos</h3>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="id">Sort by ID</option>
                <option value="title">Sort by Title</option>
                <option value="completed">Sort by Completed</option>
            </select>

            <h3>Search todos</h3>
            <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
                <option value="id">Search by ID</option>
                <option value="title">Search by Title</option>
                <option value="completed">Search by Completed</option>
            </select>

            <input
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />

            <h3>Todos list</h3>

            {displayedTodos.length === 0 ? (
                <p>No todos found.</p>
            ) : (
                <ul>
                    {displayedTodos.map((todo) => (
                        <li key={todo.id}>
                            <span>ID: {todo.id} | </span>

                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => onToggle(todo)}
                            />

                            {editingId === todo.id ? (
                                <>
                                    <input
                                        value={editingTitle}
                                        onChange={(e) => setEditingTitle(e.target.value)}
                                    />
                                    <button onClick={() => onSaveEdit(todo)}>Save</button>
                                    <button onClick={onCancelEdit}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    <span
                                        style={{
                                            textDecoration: todo.completed ? "line-through" : "none",
                                            marginRight: "10px"
                                        }}
                                    >
                                        {todo.title}
                                    </span>

                                    <button onClick={() => onStartEdit(todo)}>Edit</button>
                                    <button onClick={() => onDelete(todo.id)}>Delete</button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}