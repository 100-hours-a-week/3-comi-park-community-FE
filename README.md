# Gossip Girl (FrontEnd)

> 가십거리 등 다양한 이야기를 가볍게 나누는 커뮤니티입니다.

<img width="1528" height="1080" alt="image" src="https://github.com/user-attachments/assets/0e12c62a-ce01-41d6-a87e-9ee23d516f07" />

<br>
<br>
<br>

## 목차

1. [소개](#소개)

    a. [시연 영상](#시연-영상)

2. [개발 정보](#개발-정보)

3. [실행 방법](#실행-방법)

4. [설계](#설계)

    a. [구조](#구조)

    b. [디렉터리 구조](#디렉터리-구조)

<br>
<br>
<br>

## 소개

- 미국 드라마 'Gossip Girl'에 영감받았어요
- 가십거리뿐만 아니라 다양한 주제로 이야기를 나눌 수 있는 커뮤니티에요

<br>

### 시연 영상

> https://youtu.be/DljeHMnJPa8 유튜브 링크입니다

[![Video Label](http://img.youtube.com/vi/DljeHMnJPa8/sddefault.jpg)](https://youtu.be/DljeHMnJPa8)

- 회원가입을 해야만 이용할 수 있습니다
- 회원은 게시글당 1장 이하의 이미지를 첨부할 수 있습니다
- 회원은 본인이 작성한 게시글과 댓글의 자유롭게 수정/삭제할 수 있습니다

<br>
<br>
<br>

## 개발 정보

- 개발 기간: 2025.10 - 2025.12 (2개월)
- 개발 인원: 1인 (개인 프로젝트)
- 개발 스택: HTML/CSS, Vanilla JS, Express (정적 서빙용)
- 백엔드 GitHub 레포지터리: https://github.com/100-hours-a-week/3-comi-park-community-BE

<br>
<br>
<br>

## 실행 방법

```bash
git clone https://github.com/100-hours-a-week/3-comi-park-community-FE.git

cd kbt3-comi-community-FE
npm run start
```

<br>
<br>
<br>

## 설계

### 구조

<img width="9672" height="7144" alt="image" src="https://github.com/user-attachments/assets/5ffa6aa3-49c8-4cde-9ca4-065ced7bdcd2" />

### 디렉터리 구조

- `apis/`
    - 백엔드 서버로 API 요청 보내는 자바스크립트 파일 존재

- `component/`
    - 다른 곳에서 활용되는 컴포넌트의 자바스크립트 및 CSS 파일 존재
    - 자바스크립트는 HTML 동적 생성 및 이벤트 등록, 공통 함수 정의

- `utils/`
    - 유틸리티 자바스크립트 파일 존재
