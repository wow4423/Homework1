// =========================
// 0. 필요한 요소들 잡아두기
// =========================
const firstPage = document.querySelector("#firstPage");
const loadingPage = document.querySelector("#loadingPage");
const resultPage = document.querySelector("#resultPage");

const form = document.querySelector("#fortuneForm");
const nameInput = document.querySelector("#name");
const mbtiSelect = document.querySelector("#mbti");

const card = document.querySelector("#fortuneCard");
const goHomeBtn = document.querySelector("#goHomeBtn");

const resultTitle = document.querySelector("#resultTitle");
const resultText = document.querySelector("#resultText");
const resultImg = document.querySelector("#resultImg");

// 결과 텍스트 박스(카드 뒤집을 때 블러 풀리면서 나오는 영역)
const resultArea = document.querySelector("#result-area");

// 로딩 끝나고 결과로 넘어가는 타이머(중복 submit 방지용)
let timerId = null;


// =========================
// 1. 페이지 전환(보이기/숨기기)
// =========================
function showPage(page) {
  // 일단 다 숨기고
  firstPage.style.display = "none";
  loadingPage.style.display = "none";
  resultPage.style.display = "none";

  // 원하는 페이지만 보여주기
  // (우리 페이지들은 grid로 만들었으니까 grid로 고정)
  page.style.display = "grid";
}


// =========================
// 2. 라디오 선택값 가져오기
// =========================
function getLang() {
  const checked = document.querySelector('input[name="lang"]:checked');
  return checked ? checked.value : "";
}


// =========================
// 3. 운세 데이터(문구 + 이미지)
// =========================
const fortuneData = {
  java: {
    img: "../resources/1번.png",
    title: "올해는 ‘팀의 화합을 이끌며 성공하는 해’!!",
    text: (name, mbti) =>
`<b>${name}</b>님에게 2026년은 <b>‘함께할 때 더 빛나는 해’</b>입니다.
작은 불협화음이 생겨도 외면하지 말고 먼저 다가가 대화를 시작해 보세요.

<b>${mbti}</b> 특유의 긍정 에너지와 배려가 팀 분위기를 바꾸고,
그 변화가 더 큰 성과로 이어질 확률이 높습니다.

자바를 선택한 <b>${name}</b>님이라면 이미 기본기는 충분합니다.
올해는 “혼자 잘하는 사람”에서 <b>“함께 성장시키는 사람”</b>으로 레벨업할 차례예요!`
  },

  javascript: {
    img: "../resources/2번.png",
    title: "올해는 ‘행운과 기회가 계속 이어지는 해’!!",
    text: (name, mbti) =>
`<b>${name}</b>님은 2026년에 <b>좋은 기회가 연달아 찾아오는 흐름</b>에 들어갑니다.
<b>${mbti}</b>답게 수많은 선택지 속에서도 ‘나에게 맞는 것’을 꽤 빨리 알아볼 거예요.

자바스크립트를 고른 것부터가 감각과 도전정신이 있다는 뜻!
여유롭고 긍정적인 태도가 작은 행운을 크게 키우는 촉매가 됩니다.

<b>${name}</b>님의 행운은 벌써 시작되었네요! 부러워요~`
  },

  sql: {
    img: "../resources/3번.png",
    title: "올해는 ‘노력이 빛을 발하고 보상을 받는 한 해’!!",
    text: (name, mbti) =>
`<b>${name}</b>님이 묵묵히 쌓아온 노력은 2026년에 <b>확실한 결과</b>로 돌아옵니다.
<b>${mbti}</b>의 강점인 인내와 꾸준함이 ‘실력’으로 인정받는 타이밍이에요.

동료들의 신뢰가 쌓이고,
그 인정이 취업·평가·연봉 같은 ‘실질적인 보상’으로 이어질 가능성이 큽니다.

SQL을 선택한 <b>${name}</b>님은 팀에서 핵심 인재가 될 확률이 높습니다.
올해는 진짜로 <b>“성실함이 스펙이 되는 해”</b>입니다!`
  }
};


// =========================
// 4. 결과 화면 내용 채우기
// =========================
function setResult(name, mbti, lang) {
  const data = fortuneData[lang];

  resultTitle.textContent = data.title;
  resultText.innerHTML = data.text(name, mbti);

  resultImg.src = data.img;
  resultImg.alt = "운세 이미지";

  // 이미지 없을 때 대비
  resultImg.onerror = () => {
    resultImg.src = "";
    resultImg.alt = "이미지를 준비해주세요!";
  };

  // 카드/텍스트 상태 초기화 (다시 보기할 때 꼬이는거 방지)
  card.classList.remove("flipped");
  if (resultArea) resultArea.classList.remove("show");
}


// =========================
// 5. 제출 이벤트(첫페이지 -> 로딩 -> 5초후 결과)
// =========================
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const mbti = mbtiSelect.value;
  const lang = getLang();

  // 입력 체크
  if (!name) { alert("이름을 입력해주세요!"); nameInput.focus(); return; }
  if (!mbti) { alert("MBTI를 선택해주세요!"); mbtiSelect.focus(); return; }
  if (!lang) { alert("좋아하는 언어를 선택해주세요!"); return; }

  if (!confirm("제출하시겠습니까?")) return;

  // 결과 내용은 미리 만들어두고 로딩 보여주기
  setResult(name, mbti, lang);
  showPage(loadingPage);

  // submit 연타하면 타이머 여러개 생길 수 있어서 한번 지움
  if (timerId) clearTimeout(timerId);

  // 5초 뒤 결과 화면
  timerId = setTimeout(() => {
    showPage(resultPage);
    timerId = null;
  }, 5000);
});


// =========================
// 6. 카드 클릭(뒤집기 + 텍스트 등장)
// =========================
card.addEventListener("click", () => {
  const flippedNow = card.classList.toggle("flipped");

  // 뒤집힌 상태일 때만 텍스트 박스 보여주기
  if (resultArea) {
    if (flippedNow) resultArea.classList.add("show");
    else resultArea.classList.remove("show");
  }
});


// =========================
// 7. 홈으로(처음으로 돌아가기)
// =========================
goHomeBtn.addEventListener("click", () => {
  // 로딩 중이면 타이머 끊기
  if (timerId) clearTimeout(timerId);
  timerId = null;

  // 입력 초기화
  form.reset();

  // 텍스트 박스 숨김도 같이 초기화
  if (resultArea) resultArea.classList.remove("show");

  showPage(firstPage);
});


// =========================
// 시작 화면
// =========================
showPage(firstPage);
