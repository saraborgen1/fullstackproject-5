export default function PostsView({
  posts,
  selectedPost,
  comments,
  searchBy,
  setSearchBy,
  searchValue,
  setSearchValue,

  newPostTitle,
  setNewPostTitle,
  newPostBody,
  setNewPostBody,

  editingPostId,
  editingPostTitle,
  setEditingPostTitle,
  editingPostBody,
  setEditingPostBody,

  newCommentBody,
  setNewCommentBody,
  editingCommentId,
  editingCommentBody,
  setEditingCommentBody,

  onBackHome,
  onAddPost,
  onDeletePost,
  onSelectPost,
  onStartEditPost,
  onSaveEditPost,
  onCancelEditPost,

  onShowComments,
  onAddComment,
  onDeleteComment,
  onStartEditComment,
  onSaveEditComment,
  onCancelEditComment,
  onClosePost,

  isLoggedIn,
  onGoLogin,
  currentUser
}) {
  if (!isLoggedIn) {
    return (
      <div>
        <h1>Please login first</h1>
        <button onClick={onGoLogin}>Go to Login</button>
      </div>
    );
  }
  return (
    <div>
      <button onClick={onBackHome}>Back to Home</button>

      <h1>Posts</h1>

      <h3>Add new post</h3>
      <input
        placeholder="Post title"
        value={newPostTitle}
        onChange={(e) => setNewPostTitle(e.target.value)}
      />
      <br />
      <textarea
        placeholder="Post body"
        value={newPostBody}
        onChange={(e) => setNewPostBody(e.target.value)}
      />
      <br />
      <button onClick={onAddPost}>Add Post</button>

      <h3>Search posts</h3>
      <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
        <option value="id">Search by ID</option>
        <option value="title">Search by Title</option>
      </select>

      <input
        placeholder="Search..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />

      <h3>Posts list</h3>

      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li
              key={post.id}
              style={{
                border:
                  selectedPost?.id === post.id ? "2px solid black" : "1px solid gray",
                padding: "8px",
                margin: "8px"
              }}
            >
              {editingPostId === post.id ? (
                <>
                  <input
                    value={editingPostTitle}
                    onChange={(e) => setEditingPostTitle(e.target.value)}
                  />
                  <br />
                  <textarea
                    value={editingPostBody}
                    onChange={(e) => setEditingPostBody(e.target.value)}
                  />
                  <br />
                  <button onClick={() => onSaveEditPost(post)}>Save</button>
                  <button onClick={onCancelEditPost}>Cancel</button>
                </>
              ) : (
                <>
                  <strong>ID: {post.id}</strong> | {post.title}

                  <br />

                  <button onClick={() => onSelectPost(post)}>Select</button>
                  <button onClick={() => onStartEditPost(post)}>Edit</button>
                  <button onClick={() => onDeletePost(post.id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {selectedPost && (
        <div>
          <h2>Selected Post</h2>
          <h3>{selectedPost.title}</h3>
          <p>{selectedPost.body}</p>

          <button onClick={onShowComments}>
            {comments.length > 0 ? "Hide Comments" : "Show Comments"}
          </button>
          <button onClick={onClosePost}>Close Post</button>

          <h3>Comments</h3>

          <textarea
            placeholder="Add comment..."
            value={newCommentBody}
            onChange={(e) => setNewCommentBody(e.target.value)}
          />
          <br />
          <button onClick={onAddComment}>Add Comment</button>

          {comments.length === 0 ? (
            <p>Click "Show Comments" to load comments.</p>
          ) : (
            <ul>
              {comments.map((comment) => (
                <li key={comment.id}>
                  {editingCommentId === comment.id ? (
                    <>
                      <textarea
                        value={editingCommentBody}
                        onChange={(e) => setEditingCommentBody(e.target.value)}
                      />
                      <br />
                      <button onClick={() => onSaveEditComment(comment)}>
                        Save
                      </button>
                      <button onClick={onCancelEditComment}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <p>{comment.body}</p>
                      <small>
                        By: {comment.name} | {comment.email}
                      </small>

                      {comment.userId === currentUser.id && (
                        <>
                          <br />
                          <button onClick={() => onStartEditComment(comment)}>
                            Edit Comment
                          </button>
                          <button onClick={() => onDeleteComment(comment.id)}>
                            Delete Comment
                          </button>
                        </>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}