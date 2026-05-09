import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAllPosts,
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

  const [showOnlyMyPosts, setShowOnlyMyPosts] = useState(
    localStorage.getItem("postsShowOnlyMyPosts") === "true"
  );

  const [newPostTitle, setNewPostTitle] = useState(
    localStorage.getItem("postsNewPostTitle") || ""
  );

  const [newPostBody, setNewPostBody] = useState(
    localStorage.getItem("postsNewPostBody") || ""
  );

  const [editingPostId, setEditingPostId] = useState(
    localStorage.getItem("postsEditingPostId") || null
  );

  const [editingPostTitle, setEditingPostTitle] = useState(
    localStorage.getItem("postsEditingPostTitle") || ""
  );

  const [editingPostBody, setEditingPostBody] = useState(
    localStorage.getItem("postsEditingPostBody") || ""
  );

  const [newCommentBody, setNewCommentBody] = useState(
    localStorage.getItem("postsNewCommentBody") || ""
  );

  const [editingCommentId, setEditingCommentId] = useState(
    localStorage.getItem("postsEditingCommentId") || null
  );

  const [editingCommentBody, setEditingCommentBody] = useState(
    localStorage.getItem("postsEditingCommentBody") || ""
  );

  const [postsLoaded, setPostsLoaded] = useState(false);

  const navigate = useNavigate();
  const { userId, postId } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (userId && userId.toString() !== currentUser?.id?.toString()) {
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

  useEffect(() => {
    localStorage.setItem("postsShowOnlyMyPosts", showOnlyMyPosts);
  }, [showOnlyMyPosts]);

  useEffect(() => {
    localStorage.setItem("postsNewPostTitle", newPostTitle);
  }, [newPostTitle]);

  useEffect(() => {
    localStorage.setItem("postsNewPostBody", newPostBody);
  }, [newPostBody]);

  useEffect(() => {
    if (editingPostId) {
      localStorage.setItem("postsEditingPostId", editingPostId);
    } else {
      localStorage.removeItem("postsEditingPostId");
    }
  }, [editingPostId]);

  useEffect(() => {
    localStorage.setItem("postsEditingPostTitle", editingPostTitle);
  }, [editingPostTitle]);

  useEffect(() => {
    localStorage.setItem("postsEditingPostBody", editingPostBody);
  }, [editingPostBody]);

  useEffect(() => {
    localStorage.setItem("postsNewCommentBody", newCommentBody);
  }, [newCommentBody]);

  useEffect(() => {
    if (editingCommentId) {
      localStorage.setItem("postsEditingCommentId", editingCommentId);
    } else {
      localStorage.removeItem("postsEditingCommentId");
    }
  }, [editingCommentId]);

  useEffect(() => {
    localStorage.setItem("postsEditingCommentBody", editingCommentBody);
  }, [editingCommentBody]);

  async function loadPosts() {
    const data = await getAllPosts();
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

    if (showOnlyMyPosts) {
      result = result.filter(
        (post) => post.userId?.toString() === currentUser.id?.toString()
      );
    }

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

    result.sort((a, b) => {
      if (a.userId === currentUser.id && b.userId !== currentUser.id) return -1;
      if (a.userId !== currentUser.id && b.userId === currentUser.id) return 1;
      return a.id - b.id;
    });

    return result;
  }

  async function handleAddPost() {
    if (!newPostTitle.trim() || !newPostBody.trim()) return;

    const newPost = {
      id: Date.now(),
      userId: currentUser.id,
      title: newPostTitle,
      body: newPostBody
    };

    const created = await addPost(newPost);
    setPosts([...posts, created]);

    setNewPostTitle("");
    setNewPostBody("");
    localStorage.removeItem("postsNewPostTitle");
    localStorage.removeItem("postsNewPostBody");
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
    setTimeout(() => {
      document
        .getElementById("selected-post-section")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 0);
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
    localStorage.removeItem("postsEditingPostId");
    localStorage.removeItem("postsEditingPostTitle");
    localStorage.removeItem("postsEditingPostBody");
  }

  function handleCancelEditPost() {
    setEditingPostId(null);
    setEditingPostTitle("");
    setEditingPostBody("");
    localStorage.removeItem("postsEditingPostId");
    localStorage.removeItem("postsEditingPostTitle");
    localStorage.removeItem("postsEditingPostBody");
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

    const newComment = {
      id: Date.now(),
      postId: selectedPost.id,
      userId: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      body: newCommentBody
    };

    const created = await addComment(newComment);

    setComments([...comments, created]);
    setNewCommentBody("");
    localStorage.removeItem("postsNewCommentBody");
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
    localStorage.removeItem("postsEditingCommentId");
    localStorage.removeItem("postsEditingCommentBody");
  }

  function handleCancelEditComment() {
    setEditingCommentId(null);
    setEditingCommentBody("");
    localStorage.removeItem("postsEditingCommentId");
    localStorage.removeItem("postsEditingCommentBody");
  }

  function handleClosePost() {
    setSelectedPost(null);
    setComments([]);
    navigate("/posts");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
      showOnlyMyPosts={showOnlyMyPosts}
      setShowOnlyMyPosts={setShowOnlyMyPosts}
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
        localStorage.removeItem("postsShowOnlyMyPosts");
        localStorage.removeItem("postsNewPostTitle");
        localStorage.removeItem("postsNewPostBody");
        localStorage.removeItem("postsEditingPostId");
        localStorage.removeItem("postsEditingPostTitle");
        localStorage.removeItem("postsEditingPostBody");
        localStorage.removeItem("postsNewCommentBody");
        localStorage.removeItem("postsEditingCommentId");
        localStorage.removeItem("postsEditingCommentBody");
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