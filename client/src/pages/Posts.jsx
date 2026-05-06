import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getPostsByUser,
  addPost,
  deletePost,
  updatePost,
  getCommentsByPost,
  addComment,
  deleteComment,
  updateComment
} from "../services/api";
import PostsView from "./PostsView";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);

  const [searchBy, setSearchBy] = useState(
    localStorage.getItem("postsSearchBy") || "title"
  );

  const [searchValue, setSearchValue] = useState(
    localStorage.getItem("postsSearchValue") || ""
  );

  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostBody, setNewPostBody] = useState("");

  const [editingPostId, setEditingPostId] = useState(null);
  const [editingPostTitle, setEditingPostTitle] = useState("");
  const [editingPostBody, setEditingPostBody] = useState("");

  const [newCommentBody, setNewCommentBody] = useState("");

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentBody, setEditingCommentBody] = useState("");

  const [postsLoaded, setPostsLoaded] = useState(false);

  const navigate = useNavigate();
  const { userId, postId } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (userId && Number(userId) !== currentUser?.id) {
    navigate("/home");
    return null;
  }

  useEffect(() => {
    if (currentUser) {
      loadPosts();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("postsSearchBy", searchBy);
  }, [searchBy]);

  useEffect(() => {
    localStorage.setItem("postsSearchValue", searchValue);
  }, [searchValue]);

  useEffect(() => {
    if (!postsLoaded) return;

    if (selectedPost) {
      localStorage.setItem("selectedPostId", selectedPost.id);
    } else {
      localStorage.removeItem("selectedPostId");
    }
  }, [selectedPost, postsLoaded]);

  async function loadPosts() {
    const data = await getPostsByUser(currentUser.id);
    setPosts(data);

    const savedPostId = postId || localStorage.getItem("selectedPostId");

    if (savedPostId) {
      const savedPost = data.find(
        (post) => post.id.toString() === savedPostId.toString()
      );

      if (savedPost) {
        setSelectedPost(savedPost);
      }
    }
    setPostsLoaded(true);
  }

  function getDisplayedPosts() {
    let result = [...posts];

    if (searchValue.trim()) {
      result = result.filter((post) => {
        if (searchBy === "id") {
          return post.id.toString().includes(searchValue);
        }

        if (searchBy === "title") {
          return post.title.toLowerCase().includes(searchValue.toLowerCase());
        }

        return true;
      });
    }

    return result;
  }

  async function handleAddPost() {
    if (!newPostTitle.trim() || !newPostBody.trim()) return;

    const numericIds = posts
      .map((post) => Number(post.id))
      .filter((id) => !isNaN(id));

    const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 0;

    const newPost = {
      id: maxId + 1,
      userId: currentUser.id,
      title: newPostTitle,
      body: newPostBody
    };

    const created = await addPost(newPost);
    setPosts([...posts, created]);

    setNewPostTitle("");
    setNewPostBody("");
  }

  async function handleDeletePost(id) {
    await deletePost(id);

    setPosts(posts.filter((post) => post.id !== id));

    if (selectedPost?.id === id) {
      setSelectedPost(null);
      setComments([]);
    }
  }

  function handleSelectPost(post) {
    setSelectedPost(post);
    setComments([]);
    navigate(`/users/${currentUser.id}/posts/${post.id}/comments`);
  }

  function handleStartEditPost(post) {
    setEditingPostId(post.id);
    setEditingPostTitle(post.title);
    setEditingPostBody(post.body);
  }

  async function handleSaveEditPost(post) {
    if (!editingPostTitle.trim() || !editingPostBody.trim()) return;

    const updatedPost = {
      ...post,
      title: editingPostTitle,
      body: editingPostBody
    };

    const updated = await updatePost(post.id, updatedPost);

    setPosts(posts.map((p) => (p.id === post.id ? updated : p)));

    if (selectedPost?.id === post.id) {
      setSelectedPost(updated);
    }

    setEditingPostId(null);
    setEditingPostTitle("");
    setEditingPostBody("");
  }

  function handleCancelEditPost() {
    setEditingPostId(null);
    setEditingPostTitle("");
    setEditingPostBody("");
  }

  async function handleToggleComments() {
    if (!selectedPost) return;

    if (comments.length > 0) {
      setComments([]);
      return;
    }

    const data = await getCommentsByPost(selectedPost.id);
    setComments(data);
  }

  async function handleAddComment() {
    if (!selectedPost || !newCommentBody.trim()) return;

    const numericIds = comments
      .map((comment) => Number(comment.id))
      .filter((id) => !isNaN(id));

    const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 0;

    const newComment = {
      id: maxId + 1,
      postId: selectedPost.id,
      userId: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      body: newCommentBody
    };

    const created = await addComment(newComment);

    setComments([...comments, created]);
    setNewCommentBody("");
  }

  async function handleDeleteComment(id) {
    await deleteComment(id);
    setComments(comments.filter((comment) => comment.id !== id));
  }

  function handleStartEditComment(comment) {
    setEditingCommentId(comment.id);
    setEditingCommentBody(comment.body);
  }

  async function handleSaveEditComment(comment) {
    if (!editingCommentBody.trim()) return;

    const updatedComment = {
      ...comment,
      body: editingCommentBody
    };

    const updated = await updateComment(comment.id, updatedComment);

    setComments(comments.map((c) => (c.id === comment.id ? updated : c)));

    setEditingCommentId(null);
    setEditingCommentBody("");
  }

  function handleCancelEditComment() {
    setEditingCommentId(null);
    setEditingCommentBody("");
  }

  function handleClosePost() {
    setSelectedPost(null);
    setComments([]);
    navigate("/posts");
  }

  return (
    <PostsView
      posts={getDisplayedPosts()}
      selectedPost={selectedPost}
      comments={comments}
      searchBy={searchBy}
      setSearchBy={setSearchBy}
      searchValue={searchValue}
      setSearchValue={setSearchValue}
      newPostTitle={newPostTitle}
      setNewPostTitle={setNewPostTitle}
      newPostBody={newPostBody}
      setNewPostBody={setNewPostBody}
      editingPostId={editingPostId}
      editingPostTitle={editingPostTitle}
      setEditingPostTitle={setEditingPostTitle}
      editingPostBody={editingPostBody}
      setEditingPostBody={setEditingPostBody}
      newCommentBody={newCommentBody}
      setNewCommentBody={setNewCommentBody}
      editingCommentId={editingCommentId}
      editingCommentBody={editingCommentBody}
      setEditingCommentBody={setEditingCommentBody}
      onBackHome={() => {
        localStorage.removeItem("postsSearchBy");
        localStorage.removeItem("postsSearchValue");
        localStorage.removeItem("selectedPostId");
        navigate("/home");
      }}
      onAddPost={handleAddPost}
      onDeletePost={handleDeletePost}
      onSelectPost={handleSelectPost}
      onStartEditPost={handleStartEditPost}
      onSaveEditPost={handleSaveEditPost}
      onCancelEditPost={handleCancelEditPost}
      onShowComments={handleToggleComments}
      onAddComment={handleAddComment}
      onDeleteComment={handleDeleteComment}
      onStartEditComment={handleStartEditComment}
      onSaveEditComment={handleSaveEditComment}
      onCancelEditComment={handleCancelEditComment}
      currentUser={currentUser}
      onClosePost={handleClosePost}
      isLoggedIn={!!currentUser}
      onGoLogin={() => navigate("/login")}
    />
  );
}