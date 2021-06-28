import regeneratorRuntime from "regenerator-runtime";
import "../scss/styles.scss";

const MB = 1024 * 1024;

const inputFile = document.querySelector(".upload__video__file");

const handleChangeFile = (event) => {
  if (inputFile.files[0] && inputFile.files[0].size > 10 * MB - 1) {
    alert("10MB 이하의 비디오만 업로드 가능합니다.");
    inputFile = inputFile;
  }
  return;
  //파일 상태를 null로 만들 수 없다면 upload 버튼을 막아야 하는가?
  //https://developer.mozilla.org/ko/docs/Web/HTML/Element/Input/file#attr-accept
};

inputFile.addEventListener("change", handleChangeFile);
