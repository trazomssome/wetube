const MB = 1024 * 1024;
const videoSize = 10 * MB;
const tumbnailSize = 2 * MB;
let videoFileCheck = false;
let thumbnailFileCheck = false;

const inputVideo = document.querySelector(".upload__video__videoFile");
const inputThumbnail = document.querySelector(".upload__video__thumbnailFile");
const inputSubmit = document.querySelector(".upload__video__submit");

const handleChangeVideoFile = (event) => {
  if (inputVideo.files[0] && inputVideo.files[0].size > videoSize - 10) {
    alert("10MB 이하의 비디오 파일만 업로드 가능합니다.");
    videoFileCheck = false;
  } else {
    videoFileCheck = true;
  }
  checkFileAvailable();
  return;
};

const handleChangeThumbnailFile = (event) => {
  if (
    inputThumbnail.files[0] &&
    inputThumbnail.files[0].size > tumbnailSize - 10
  ) {
    alert("2MB 이하의 이미지 파일만 업로드 가능합니다.");
    thumbnailFileCheck = false;
  } else {
    thumbnailFileCheck = true;
  }
  checkFileAvailable();
  return;
};

const checkFileAvailable = () => {
  if (videoFileCheck && thumbnailFileCheck) {
    inputSubmit.disabled = false;
  } else {
    inputSubmit.disabled = true;
  }
};

inputVideo.addEventListener("change", handleChangeVideoFile);
inputThumbnail.addEventListener("change", handleChangeThumbnailFile);
