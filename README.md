# 🎯 Dixit 점수판 만들기

## 0. 게임 소개

### 🎮 Dixit 보드게임이란?

출처 : https://www.youtube.com/watch?v=SWvzmI2jts8

- Dixit는 창의적인 연상과 추측을 즐기는 파티형 보드게임입니다.

- 플레이어는 번갈아 이야기꾼이 되어 카드와 관련된 힌트를 제시하고, 플레이어들은 해당 힌트에 맞는 카드를 제출하고 이야기꾼의 카드를 맞춥니다.

- 점수를 얻어 30점에 먼저 도달한 플레이어가 승리합니다.

### 규칙 설명

1. 라운드 진행

   I ) 각 플레이어 마다 6장 지급 (4명 기준)

   II ) 이야기꾼이 선택한 그림 카드를 뒤집어서 제출하고 힌트를 제시

   III ) 힌트는 단어나 문장을 말해도 되고, 노래나 행동으로도 가능

   IV ) 다른 플레이어들도 힌트에 어울리는 카드 1장 뒤집어 제출

   V ) 제출된 카드들을 섞어 공개

   VI ) 이야기꾼을 제외한 플레이어들이 비밀 투표

   VII )투표 결과를 동시에 공개한 후, 이야기꾼이 선택한 사진 발표

   VIII )해당 라운드에 대한 점수 지급 및 말 이동

2. 점수 계산

- 전원 정답 혹은 오답 시 (만장일치)

  - 이야기꾼 : 점수 X
  - 플레이어 : +2점

- 일부 정답 시 (만장일치 X)
  - 이야기꾼 : +3점
  - 정답자 : +3점
  - 그 외 플레이어 : 자신의 카드에 들어온 표 1개당 +1점

3. 승리 조건

- 30점을 먼저 채운 플레이어가 우승 (말판 기준)

<br/>

## 1. 요구사항 분석

### 필수 요구사항

- **게임 룰 반영** : Dixit 룰을 반영한 점수판 구현 (자동 계산 시스템)
- **플레이어 수** : 4인 기준
- **입력** : 플레이어 이름, 각 라운드별 점수 입력
- **출력** : 유저별 누적 총점, 승리 조건 도달 시 종료 알림
- **모바일 환경** : 모바일 웹 환경을 고려한 설계

### 추가 요구사항

- 사용성 및 확정성을 고려하여 기능 개선
- 각 조건별 득점 점수와 승리 조건 점수를 조정할 수 있는 기능 추가

<br/>

## 2. 요구사항 정의서

※ 이야기꾼 => 스토리텔러 (ST)

| ID  | 구분 | 기능명                 | 기능 설명                                           | 입력          | 출력           | CRUD | 우선순위 | 비고                   |
| --- | ---- | ---------------------- | --------------------------------------------------- | ------------- | -------------- | ---- | -------- | ---------------------- |
| 01  | 필수 | 게임 룰 반영           | Dixit 기본 규칙 적용으로 인한 점수 지급             | 라운드별 점수 | 누적 점수 변화 | U    | 높음     | `scoring.ts` 로직 구현 |
| 02  | 필수 | 플레이어 수            | 4인 플레이 -> 3~6인 선택 가능                       | 플레이어 이름 | 플레이어 목록  | C    | 높음     | `SetupScreen` 검증     |
| 03  | 필수 | 플레이어 이름 입력     | 수동 입력 (+ 이름 자동 입력 옵션)                   | 이름 문자열   | 이름 목록      | C    | 높음     | 임의명 토글 기능       |
| 04  | 필수 | 라운드 점수 입력       | 라운드별 수동 점수 입력 (+ 증감 버튼으로 점수 입력) | 점수 값       | 라운드 기록    | U    | 높음     | -                      |
| 05  | 필수 | 누적 점수 표시         | 각 플레이어의 현재 총점 표시                        | 라운드별 점수 | 총점 표시      | R    | 높음     | `ScoreBoard` UI        |
| 06  | 필수 | 승리 조건 체크         | 30점 이상 달성 시 게임 종료                         | 총점          | 우승자 알림    | R    | 높음     | `detectWinner` 로직    |
| 07  | 필수 | 모바일 환경 대응       | 360px 기준 반응형, 터치 최적화, 고대비 색상         | -             | 반응형 UI      | R    | 높음     | Tailwind CSS 적용      |
| 08  | 선택 | 스토리텔러 역할 순환   | 첫 라운드 랜덤 스토리텔러(ST) 배정, 이후 순차 순환  | 라운드 수     | ST 표시        | U    | 중간     | `App.tsx` 로직         |
| 09  | 선택 | 초기화 기능            | 라운드 기록 및 누적 점수 전체 초기화                | -             | 초기화 완료    | D    | 중간     | ScoreBoard 버튼        |
| 10  | 선택 | 도움말 팝오버          | 물음표(?) 버튼으로 간단 설명 제공                   | 버튼 클릭     | 팝오버 표시    | R    | 낮음     | `HelpHint` 컴포넌트    |
| 11  | 선택 | 승리 점수 커스터마이즈 | 10/20/30점 설정 가능                                | 점수 값       | 승리 조건      | U    | 낮음     | -                      |

## 3. 아키텍처 & 설계

### 디렉터리 구조

```
src/
│
├── components/ # UI 컴포넌트
│ ├── SetupScreen.tsx # 게임 설정 화면 (플레이어 수 및 점수 설정)
│ ├── RoundManual.tsx # 라운드 점수 입력 화면
│ ├── ScoreBoard.tsx # 스코어보드 및 라운드별 상세 표
│ ├── FinishedScreen.tsx # 게임 종료 후 최종 점수 화면
│ └── HelpHint.tsx # 도움말 팝오버 컴포넌트
│
├── lib/ # 게임 로직 관련 모듈
│ ├── scoring.ts # 점수 계산 로직
│ └── winner.ts # 승리자 판별 로직
│
├── types.ts # 타입 정의
├── App.tsx # 앱 루트 및 라우팅
└── index.css # 전역 스타일 및 Tailwind 설정
```

### 기술 스택

• 프레임워크 : React + TypeScript

• 스타일링 : Tailwind CSS

• 번들러 : Vite

• 배포 환경 : Vercel / Netlify 중 선택 가능

### 화면 흐름 (Flow)

`SetupScreen → RoundManual / ScoreBoard → FinishedScreen`

1. **SetupScreen**

- 플레이어 수(3~6명)와 이름, 승리 점수 설정

- 색상으로 임의명 자동 입력 옵션 제공

- “게임 시작” 시 초기 상태로 이동

2.  **RoundManual**

- 스토리텔러(ST) 표시

- 라운드별 점수 수동 입력 (± 버튼 & 직접 입력)

- 확정 시 ScoreBoard 갱신

3.  **ScoreBoard**

- 현재 점수 및 진행률(승리 점수 대비 %) 표시

- 라운드별 점수 상세 내역(드롭다운)

- 전체 초기화 기능 제공

4.  **FinishedScreen**

- 최종 우승자와 점수 표시

- 새 게임 시작 버튼 제공

### 주요 로직

1. scoring.ts - 점수 계산

- 분기 단순화 : `allOrNone`(전원 정답/오답) 여부만 판단하여 ST 가산 여부를 결정

```ts
const correctGuessers = voters.filter(v => votes[v.id] === storytellerId);
const allOrNone =
  correctGuessers.length === 0 || correctGuessers.length === voters.length;

if (!allOrNone) {
  score[storytellerId] += rule.storytellerCorrect;
  correctGuessers.forEach(g => (score[g.id] += rule.guesserCorrect));
}
```

2. winner.ts - 승리자 판별

- 공동 우승 처리 : 승점 기준을 통과한 플레이어만 모아 최댓값 비교 -> 동점자도 자동 반영
- O(n) 성능 보장 : 정렬 없이 `Math.max`와 `filter`로 한 번에 처리 -> 불필요한 계산 방지

```ts
export function detectWinner(
  totals: Record<PlayerId, number>,
  victory: number,
): { ids: PlayerId[]; score: number } | null {
  const reached = Object.entries(totals).filter(([, s]) => s >= victory);
  if (reached.length === 0) return null;

  const topScore = Math.max(...reached.map(([, s]) => s));
  const ids = reached.filter(([, s]) => s === topScore).map(([id]) => id);
  return { ids, score: topScore };
}
```

3. 스토리텔러 역할 순환

- O(1) 계산 : (stStart + rounds.length) % players.length로 현재 ST를 즉시 산출 -> 별도 상태 저장 불필요
- 상태 최소화 : ST를 파생값으로 계산 -> 동기화 버그 가능성 제거

```ts
const storyteller = players[(stStart + rounds.length) % players.length];
```

4. RoundManual - 점수 입력 관리

- 초기화 : 확정 시 setScores(zeroScores)로 즉시 리셋 -> 이전 라운드 값이 다음 라운드로 넘어가는 실수 방지
- 메모이즈 기본값 : players 변경 시에만 초기 점수 객체를 재생성

```ts
const zeroScores = useMemo(
  () =>
    Object.fromEntries(players.map(p => [p.id, 0])) as Record<PlayerId, number>,
  [players],
);

const handleConfirm = () => {
  if (submitting) return;
  setSubmitting(true);
  onConfirm(scores);
  setScores(zeroScores); // 다음 라운드 준비
  setSubmitting(false);
};
```

5. 상태 관리 전략

- 단일 진입점(App) 집중 : players / rounds / stStart / victory 상태를 루트에서만 관리하고 하위로 props 전달 → 데이터 흐름이 명확해 디버깅 쉬움.
- 전역 스토어 미사용 : 화면 수/데이터량이 적어 전역 상태 관리 라이브러리 도입 시 오히려 복잡도 증가

## 4. 화면 구성 (UI/UX)

<p align="center">
  <img width="381" height="827" alt="Image" src="https://github.com/user-attachments/assets/60d89f6a-d355-4845-8c1f-93e3c9aaa86a" />
  <img width="381" height="827" alt="Image" src="https://github.com/user-attachments/assets/7557f575-6720-491d-a8ea-545970382211" />
  <img width="381" height="827" alt="Image" src="https://github.com/user-attachments/assets/e0c54f79-8e88-4026-ab57-8f6f02c2abd3" />
</p>

### 5. 테스트 전략

## 🧪 테스트 전략

| 구분                 | 테스트 항목      | 입력/조건                   | 예상 결과                             |
| -------------------- | ---------------- | --------------------------- | ------------------------------------- |
| **단위 테스트**      | 승리자 없음      | 모든 플레이어 점수 < 승점   | `null` 반환                           |
|                      | 단독 승리        | 특정 플레이어 점수 ≥ 승점   | 해당 플레이어만 반환                  |
|                      | 동점 승리        | 2명 이상 동일 최고점 ≥ 승점 | 동점자 모두 반환                      |
|                      | 일부 정답        | 정답자 일부 존재            | ST +3, 정답자 +3, 표 받은 수만큼 가산 |
|                      | 전원 정답/오답   | 모든 투표 동일              | ST 0점, 표 받은 수만큼 가산           |
|                      | 점수 범위 제한   | -99~99 입력                 | 정상 처리                             |
| **통합 테스트**      | 플레이어 수 선택 | 3~6명 설정                  | 반영됨                                |
|                      | 이름 입력        | 자동/수동 입력              | 정상 표시                             |
|                      | 게임 시작 버튼   | 필수값 입력 후 클릭         | RoundManual 화면 이동                 |
|                      | ST 배지 표시     | 라운드 시작 시              | 올바른 플레이어에 ST 표시             |
|                      | 점수 입력        | ± 버튼 / 직접 입력          | 정상 반영                             |
|                      | 라운드 확정      | 버튼 클릭                   | ScoreBoard 갱신 & 입력값 리셋         |
|                      | 진행률 표시      | 점수 변화                   | 퍼센트 정확히 표시                    |
|                      | 드롭다운 상세표  | 카드 클릭                   | 열림/닫힘 및 표 데이터 정상           |
|                      | 초기화 버튼      | 클릭                        | 모든 기록 삭제                        |
|                      | 우승자 표시      | 승점 도달 시                | 정확한 우승자 표시                    |
|                      | 새 게임 시작     | 클릭                        | 초기 상태로 복원                      |
| **수동 QA (Mobile)** | 화면 반응형      | 360px 해상도                | UI 깨짐 없음                          |
|                      | 키패드 UX        | iOS/Android 숫자 입력       | 정상 입력                             |
|                      | 중복 제출 방지   | 빠른 연타                   | 단일 제출 처리                        |
|                      | 새로고침 안전성  | 새로고침                    | 초기 페이지 이동                      |

### 6. 배포 & 운영 계획

- 배포 환경

  - Vercel 기준

  - GitHub 저장소 연동 → 자동 빌드 & 배포

  - Framework: Vite 자동 감지

  - Build: npm run build

  - Output: /dist

  - 대안: Netlify 또는 GitHub Pages (Vite base 설정 필요)

- 배포 절차

  - GitHub에 코드 푸시

  - Vercel 프로젝트에 저장소 연결

  - 환경변수/빌드 설정 확인 후 자동 배포

  - Preview URL로 QA → 문제 없을 시 Production 배포

### 7. 유지보수 & 개선사항

- **UI 개선** :

  - 모바일 환경에서 입력창, 버튼 간격, 폰트 크기 등을 미세 조정하여 가독성과 조작 편의성 향상

  - Dixit Game에 어울리는 색을 조합하여 UI 개선

- **경고/확인 UI 추가** : 초기화, 점수 확정 시 경고 모달 표시로 실수 방지

- **성능 최적화** : 불필요한 리렌더링 방지를 위한 `React.memo`·`useCallback` 적용 검토

- **데이터 저장 기능** : LocalStorage를 활용해 게임 상태를 자동 저장 및 복원하여 새로고침·페이지 이탈
  시에도 이어서 진행 가능

- **점수 규칙 확장** : 라운드별 점수 규칙과 승리 점수를 자유롭게 설정할 수 있도록 옵션 추가

- **접근성 강화** : 키보드 네비게이션 지원, 스크린 리더 호환성 개선
