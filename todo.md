# To Do List

## 버그

1. Github 기본아바타 http://localhost:4000/https://avatars.githubusercontent.com/u/49433915?v=4 404 (Not Found)
2. 녹화 영상 자동으로 업로드하기(아니면 녹화 분리하기)
3. 업로드시 file too large 에러 컨트롤하기
4. 적재적소에 flash message 삽입하기

## 수정

1. Watch 화면 유튜브스럽게 CSS 작업
1. 녹화 기능 분리하기
1. 검색창 가운데로 옮기고 항상 보여주기(유튜브스럽게)
1. 기본아바타 추가(github 가입시 기본아바타 사용하기)
1. 존재하지 않는 링크에 접근할 시 띄울 페이지(404페이지)
1. mixin을 통해 댓글 개선하기

## 기능

1. 댓글삭제
   - fetch request(method:"Delete")
   - api router 추가
   - controller
   - 소유자에게만 삭제버튼 노출
   - html을 삭제시켜서 실시간으로 댓글 삭제시키기
1. 댓글삭제 더 자세히
   - fetch를 통해 백엔드에 삭제 요청 보내기
   - 그러려면 삭제에 대한 api route가 있어야 함
   - DB상의 삭제를 controller에 구현하기
   - controller 상에서 세션을 확인해 소유자 검증후 삭제하도록
   - pug상에 소유자에게만 삭제버튼을 노출하도록 조건문 구현
   - id를 통해 html상에서 삭제시키기(client js)
1. 업로드 영상 크기 줄여 업데이트하게하기
1. 업로드 프로필 크기 줄여 업데이트하게하기
1. Thumbnail 자동으로 추출하게 하기 or 기본썸네일 만들기
1. 카카오, 네이버, 구글 로그인 추가
   - 카카오 : https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api
   - 네이버 : https://developers.naver.com/products/login/api/api.md
   - 구글 : https://console.cloud.google.com/projectselector2/apis/dashboard?pli=1&supportedpurview=project
1. video play 단축키 추가(볼륨조절 등등)
1. Recording 카운트다운 표시
1. 유튜브 링크만으로 영상을 올릴 수 있도록

## 불편함

1. 다짜고짜 내 카메라를 켜는게 불쾌함(카메라On버튼을 만들까?)
2. 서버에 지운 파일이 계속 남아있는데 나중에 처리하나?
3. 트롤링 방지기능..(유저가 영상을 너무 많이 올린다던지.. 돈나오면 안되니까)
4. 카메라가 없는 pc에서는 어떻게 동작하나?
