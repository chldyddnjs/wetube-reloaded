const videoContainer = document.getElementById("videoContainer");
const videoId = videoContainer.dataset.id;
const videoComments = document.querySelector(".video__comments ul");
const form = document.getElementById("commentForm");

const handleSubmit = async (event) => {
  event.preventDefault();

  const textarea = form.querySelector("textarea");
  const text = textarea.value;

  if (text === "") {
    return;
  }

  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

const addComment = (text, newCommentId) => {
  const newComment = document.createElement("li");
  newComment.className = "video__comment";
  newComment.dataset.id = newCommentId;

  const icon = document.createElement("i");
  icon.className = "fas fa-comment";

  const span = document.createElement("span");
  span.innerText = ` ${text}`;

  const span2 = document.createElement("span");
  span2.className = "commentDeleteBtn";
  span2.innerText = "❌";

  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);

  videoComments.prepend(newComment);
};

const handleDeleteComment = async (event) => {
  if (event.target.className !== "commentDeleteBtn") {
    return;
  }

  const li = event.target.closest("li");
  const commentId = li.dataset.id;

  const { status } = await fetch(
    `/api/videos/${videoId}/comment/${commentId}`,
    {
      method: "DELETE",
    }
  );

  if (status === 200) {
    videoComments.removeChild(li);
    alert("Delet Success!");
  } else {
    alert("Could not remove the comment.");
  }
};

videoComments.addEventListener("click", handleDeleteComment);