const BASE_URL = "http://localhost:3001";

export async function getUsers() {
  const response = await fetch(`${BASE_URL}/users`);

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}

export async function getTodosByUser(userId) {
  const response = await fetch(
    `http://localhost:3001/todos?userId=${userId}`
  );
  return response.json();
}

export async function addTodo(todo) {
  const response = await fetch("http://localhost:3001/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(todo)
  });

  return response.json();
}

export async function deleteTodo(id) {
  await fetch(`http://localhost:3001/todos/${id}`, {
    method: "DELETE"
  });
}

export async function updateTodo(id, updatedTodo) {
  const response = await fetch(`http://localhost:3001/todos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedTodo)
  });

  return response.json();
}

export async function getPostsByUser(userId) {
  const response = await fetch(
    `http://localhost:3001/posts?userId=${userId}`
  );
  return response.json();
}

export async function getCommentsByPost(postId) {
  const response = await fetch(
    `http://localhost:3001/comments?postId=${postId}`
  );
  return response.json();
}

export async function addComment(comment) {
  const response = await fetch("http://localhost:3001/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(comment)
  });

  return response.json();
}

export async function getAlbumsByUser(userId) {
  const response = await fetch(
    `http://localhost:3001/albums?userId=${userId}`
  );
  return response.json();
}

export async function getPhotosByAlbum(albumId) {
  const response = await fetch(
    `http://localhost:3001/photos?albumId=${albumId}`
  );
  return response.json();
}

export async function addAlbum(album) {
  const response = await fetch("http://localhost:3001/albums", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(album)
  });

  return response.json();
}

export async function addPost(post) {
  const response = await fetch(`${BASE_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(post)
  });

  return response.json();
}

export async function deletePost(id) {
  await fetch(`${BASE_URL}/posts/${id}`, {
    method: "DELETE"
  });
}

export async function updatePost(id, updatedPost) {
  const response = await fetch(`${BASE_URL}/posts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedPost)
  });

  return response.json();
}

export async function deleteComment(id) {
  await fetch(`${BASE_URL}/comments/${id}`, {
    method: "DELETE"
  });
}

export async function updateComment(id, updatedComment) {
  const response = await fetch(`${BASE_URL}/comments/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedComment)
  });

  return response.json();
}

export async function updateAlbum(id, updatedAlbum) {
  const response = await fetch(`${BASE_URL}/albums/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedAlbum)
  });

  return response.json();
}

export async function deleteAlbum(id) {
  await fetch(`${BASE_URL}/albums/${id}`, {
    method: "DELETE"
  });
}

export async function getPhotosByAlbumPaged(albumId, page, limit) {
  const response = await fetch(
    `${BASE_URL}/photos?albumId=${albumId}&_page=${page}&_per_page=${limit}`
  );

  const result = await response.json();

  return Array.isArray(result) ? result : result.data;
}

export async function addPhoto(photo) {
  const response = await fetch(`${BASE_URL}/photos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(photo)
  });

  return response.json();
}

export async function deletePhoto(id) {
  await fetch(`${BASE_URL}/photos/${id}`, {
    method: "DELETE"
  });
}

export async function updatePhoto(id, updatedPhoto) {
  const response = await fetch(`${BASE_URL}/photos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedPhoto)
  });

  return response.json();
}

export async function addUser(user) {
  const response = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  });

  return response.json();
}