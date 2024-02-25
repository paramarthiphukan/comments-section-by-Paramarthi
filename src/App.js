import { useState, useEffect } from "react";

import "./Components/Styles/App.scss";

import Comment from "./Components/Comment";
import AddComment from "./Components/AddComment";

const App = () => {
  const [comments, updateComments] = useState([]);
  const [deleteModalState, setDeleteModalState] = useState(false);
  const [sortOrder, setSortOrder] = useState({
    criteria: "newest",
    order: "ascending",
  });

  const toggleSortOrder = () => {
    setSortOrder((prevSortOrder) => ({
      criteria: prevSortOrder.criteria,
      order: prevSortOrder.order === "ascending" ? "descending" : "ascending",
    }));
  };
  const getData = async () => {
    const res = await fetch("./data/data.json");
    const data = await res.json();
    updateComments(data.comments);
  };

  useEffect(() => {
    localStorage.getItem("comments") !== null
      ? updateComments(JSON.parse(localStorage.getItem("comments")))
      : getData();
  }, []);

  useEffect(() => {
    localStorage.setItem("comments", JSON.stringify(comments));
    deleteModalState
      ? document.body.classList.add("overflow--hidden")
      : document.body.classList.remove("overflow--hidden");
  }, [comments, deleteModalState]);

  // add comments
  const addComments = (newComment) => {
    const updatedComments = [...comments, newComment];
    updateComments(updatedComments);
  };

  // add replies
  const updateReplies = (replies, id) => {
    let updatedComments = [...comments];
    updatedComments.forEach((data) => {
      if (data.id === id) {
        data.replies = [...replies];
      }
    });
    updateComments(updatedComments);
  };

  // edit comment
  const editComment = (content, id, type) => {
    let updatedComments = [...comments];

    if (type === "comment") {
      updatedComments.forEach((data) => {
        if (data.id === id) {
          data.content = content;
        }
      });
    } else if (type === "reply") {
      updatedComments.forEach((comment) => {
        comment.replies.forEach((data) => {
          if (data.id === id) {
            data.content = content;
          }
        });
      });
    }

    updateComments(updatedComments);
  };

  // delete comment
  let commentDelete = (id, type, parentComment) => {
    let updatedComments = [...comments];
    let updatedReplies = [];

    if (type === "comment") {
      updatedComments = updatedComments.filter((data) => data.id !== id);
    } else if (type === "reply") {
      comments.forEach((comment) => {
        if (comment.id === parentComment) {
          updatedReplies = comment.replies.filter((data) => data.id !== id);
          comment.replies = updatedReplies;
        }
      });
    }

    updateComments(updatedComments);
  };

  const sortedComments = [...comments];

  sortedComments.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    let comparison = 0;
    if (sortOrder.criteria === "newest") {
      comparison = dateB - dateA;
    } else if (sortOrder.criteria === "oldest") {
      comparison = dateA - dateB;
    }

    if (sortOrder.order === "descending") {
      comparison *= -1;
    }

    return comparison;
  });
  return (
    <main className="App">
      <AddComment buttonValue={"send"} addComments={addComments} />
      <div className="btn-div">
      <button onClick={toggleSortOrder}>
        {sortOrder.order === "ascending" ? "Sort Descending" : "Sort Ascending"}
      </button>
      </div>
      {sortedComments.map((comment) => (
        <Comment
          key={comment.id}
          commentData={comment}
          updateReplies={updateReplies}
          editComment={editComment}
          commentDelete={commentDelete}
          setDeleteModalState={setDeleteModalState}
        />
      ))}
    </main>
  );
};

export default App;
