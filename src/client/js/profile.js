const inputAvatar = document.querySelector(".profile__avatar__file");
const inputSubmit = document.querySelector(".profile__avatar__submit");

const MB = 1024 * 1024;
const avatarSize = 1 * MB;

let videoFileCheck = false;
let thumbnailFileCheck = false;

const handleChangeAvatar = (event) => {
  if (inputAvatar.files[0] && inputAvatar.files[0].size > avatarSize - 10) {
    alert("1MB 이하의 이미지 파일만 업로드 가능합니다.");
    inputSubmit.disabled = true;
  } else {
    inputSubmit.disabled = false;
  }
  return;
};

inputAvatar.addEventListener("change", handleChangeAvatar);
