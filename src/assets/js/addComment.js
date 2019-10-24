import axios from "axios";

const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");

const increaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};

const addComment = (comment, commentID) => {
  const li = document.createElement("li");
  const span = document.createElement("span");
	const button = document.createElement("button");
	button.className = "jsDeleteComment";
	button.value = commentID;
	button.innerText = "X";
	span.style.paddingRight = "10px";
	button.addEventListener("click", deleteComment);
  span.innerHTML = comment;
	span.appendChild(button);
	li.id = commentID;
  li.appendChild(span);
  commentList.prepend(li);
  increaseNumber();
};

const deleteComment = async event => {
	const commentID = event.target.value;

	const response = await axios({
		url: `/api/${commentID}/deleteComment`,
		method: "POST"
	});
	if (response.status === 200) {
		document.getElementById(`${commentID}`).remove();
	}
};

const sendComment = async comment => {
  const videoId = window.location.href.split("/videos/")[1];
  const response = await axios({
    url: `/api/${videoId}/comment`,
    method: "POST",
    data: {
      comment
    }
  });
  if (response.status === 200) {
		const { commentId } = response.data;
		addComment(comment, commentId);
  }
};

const handleSubmit = event => {
  event.preventDefault();
  const commentInput = addCommentForm.querySelector("input");
  const comment = commentInput.value;
  sendComment(comment);
  commentInput.value = "";
};
function init() {
  addCommentForm.addEventListener("submit", handleSubmit);

	const deleteButtonList = document.querySelectorAll(".jsDeleteComment");

	for (let index = 0; index < deleteButtonList.length; index++) {
		deleteButtonList[index].addEventListener("click", deleteComment);
	}
}

if (addCommentForm) {
  init();
}
