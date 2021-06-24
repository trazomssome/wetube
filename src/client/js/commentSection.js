const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtns = document.querySelectorAll(".video__comment-delete");

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  const span = document.createElement("span");
  const span2 = document.createElement("span");
  icon.className = "fas fa-comment";
  span.innerText = `${text}`;
  span2.innerText = "❌";
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/comment/${videoId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status == 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

const deleteComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  const span = document.createElement("span");
  const span2 = document.createElement("span");
  icon.className = "fas fa-comment";
  span.innerText = `${text}`;
  span2.innerText = "❌";
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments.prepend(newComment);
};

const handleDelete = (deleteBtn) => {
  const { id } = deleteBtn.dataset;
  fetch(`/api/comment/delete/${id}`, { method: "DELETE" });
  deleteComment();
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

for (const deleteBtn of deleteBtns) {
  deleteBtn.addEventListener("click", () => handleDelete(deleteBtn));
}
