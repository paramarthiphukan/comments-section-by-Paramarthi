import { ReactComponent as IconReply } from "../../Assets/images/icon-reply.svg";
import { ReactComponent as IconDelete } from "../../Assets/images/icon-delete.svg";
import { ReactComponent as IconEdit } from "../../Assets/images/icon-edit.svg";

const CommentBtn = ({
  commentData,
  replying,
  setReplying,
  setDeleting,
  setDeleteModalState,
  setEditing,
}) => {
  const showAddComment = () => {
    setReplying(!replying);
  };

  // delete comment
  const showDeleteModal = () => {
    setDeleting(true);
    setDeleteModalState(true);
  };

  // edit comment
  const showEditComment = () => {
    setEditing(true);
  };

  return (
    <div className="comment--btn">
      <button
        className={`reply-btn "
        }`}
        onClick={showAddComment}
      >
        <IconReply /> Reply
      </button>
      <button
        className={`delete-btn ${
          commentData.currentUser ? "" : "display--none"
        }`}
        onClick={showDeleteModal}
      >
        <IconDelete /> Delete
      </button>
      <button
        className={`edit-btn ${commentData.currentUser ? "" : "display--none"}`}
        onClick={showEditComment}
      >
        <IconEdit /> Edit
      </button>
    </div>
  );
};

export default CommentBtn;
