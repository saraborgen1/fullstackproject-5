const BASE_URL = "http://localhost:3001";

function getFromCache(key) {
  const cachedData = localStorage.getItem(key);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  return null;
}

function saveToCache(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function clearCache(key) {
  localStorage.removeItem(key);
}

export async function getUsers() {
  const cachedUsers = getFromCache("users");

  if (cachedUsers) {
    return cachedUsers;
  }

  const response = await fetch(`${BASE_URL}/users`);

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  const users = await response.json();
  saveToCache("users", users);

  return users;
}

export async function getTodosByUser(userId) {
  const cacheKey = `todos_user_${userId}`;
  const cachedTodos = getFromCache(cacheKey);

  if (cachedTodos) {
    return cachedTodos;
  }

  const response = await fetch(`${BASE_URL}/todos?userId=${userId}`);
  const todos = await response.json();

  saveToCache(cacheKey, todos);

  return todos;
}

export async function addTodo(todo) {
  const response = await fetch(`${BASE_URL}/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(todo)
  });

  const created = await response.json();
  clearCache(`todos_user_${todo.userId}`);

  return created;
}

function clearTodosCache() {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("todos_user_")) {
      localStorage.removeItem(key);
    }
  });
}

export async function deleteTodo(id) {
  await fetch(`${BASE_URL}/todos/${id}`, {
    method: "DELETE"
  });

  clearTodosCache();
}

export async function updateTodo(id, updatedTodo) {
  const response = await fetch(`${BASE_URL}/todos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedTodo)
  });

  const updated = await response.json();
  clearTodosCache();

  return updated;
}

export async function getPostsByUser(userId) {
  const cacheKey = `posts_user_${userId}`;
  const cachedPosts = getFromCache(cacheKey);

  if (cachedPosts) {
    return cachedPosts;
  }

  const response = await fetch(`${BASE_URL}/posts?userId=${userId}`);
  const posts = await response.json();

  saveToCache(cacheKey, posts);

  return posts;
}

export async function getCommentsByPost(postId) {
  const cacheKey = `comments_post_${postId}`;
  const cachedComments = getFromCache(cacheKey);

  if (cachedComments) {
    return cachedComments;
  }

  const response = await fetch(`${BASE_URL}/comments?postId=${postId}`);
  const comments = await response.json();

  saveToCache(cacheKey, comments);

  return comments;
}

function clearPostsCache() {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("posts_user_")) {
      localStorage.removeItem(key);
    }
  });
}

function clearCommentsCache() {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("comments_post_")) {
      localStorage.removeItem(key);
    }
  });
}

function clearAlbumsCache() {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("albums_user_")) {
      localStorage.removeItem(key);
    }
  });
}

function clearPhotosCache() {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("photos_album_")) {
      localStorage.removeItem(key);
    }
  });
}

export async function addComment(comment) {
  const response = await fetch(`${BASE_URL}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(comment)
  });

  const created = await response.json();
  clearCache(`comments_post_${comment.postId}`);

  return created;
}

export async function getAlbumsByUser(userId) {
  const cacheKey = `albums_user_${userId}`;
  const cachedAlbums = getFromCache(cacheKey);

  if (cachedAlbums) {
    return cachedAlbums;
  }

  const response = await fetch(`${BASE_URL}/albums?userId=${userId}`);
  const albums = await response.json();

  saveToCache(cacheKey, albums);

  return albums;
}

export async function getPhotosByAlbum(albumId) {
  const response = await fetch(
    `http://localhost:3001/photos?albumId=${albumId}`
  );
  return response.json();
}

export async function addAlbum(album) {
  const response = await fetch(`${BASE_URL}/albums`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(album)
  });

  const created = await response.json();
  clearCache(`albums_user_${album.userId}`);

  return created;
}

export async function addPost(post) {
  const response = await fetch(`${BASE_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(post)
  });

  const created = await response.json();
  clearPostsCache();

  return created;
}

export async function deletePost(id) {
  await fetch(`${BASE_URL}/posts/${id}`, {
    method: "DELETE"
  });

  clearPostsCache();
  clearCommentsCache();
}

export async function updatePost(id, updatedPost) {
  const response = await fetch(`${BASE_URL}/posts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedPost)
  });

  const updated = await response.json();
  clearPostsCache();

  return updated;
}

export async function deleteComment(id) {
  await fetch(`${BASE_URL}/comments/${id}`, {
    method: "DELETE"
  });

  clearCommentsCache();
}

export async function updateComment(id, updatedComment) {
  const response = await fetch(`${BASE_URL}/comments/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedComment)
  });

  const updated = await response.json();
  clearCache(`comments_post_${updatedComment.postId}`);

  return updated;
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
  const cacheKey = `photos_album_${albumId}_page_${page}_limit_${limit}`;
  const cachedPhotos = getFromCache(cacheKey);

  if (cachedPhotos) {
    return cachedPhotos;
  }

  const response = await fetch(
    `${BASE_URL}/photos?albumId=${albumId}&_page=${page}&_per_page=${limit}`
  );

  const result = await response.json();
  const photos = Array.isArray(result) ? result : result.data;

  saveToCache(cacheKey, photos);

  return photos;
}

export async function addPhoto(photo) {
  const response = await fetch(`${BASE_URL}/photos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(photo)
  });

  const created = await response.json();
  clearPhotosCache();

  return created;
}

export async function deletePhoto(id) {
  await fetch(`${BASE_URL}/photos/${id}`, {
    method: "DELETE"
  });

  clearPhotosCache();
}

export async function updatePhoto(id, updatedPhoto) {
  const response = await fetch(`${BASE_URL}/photos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedPhoto)
  });

  const updated = await response.json();
  clearPhotosCache();

  return updated;
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