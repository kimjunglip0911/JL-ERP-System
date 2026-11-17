# JL-ERP-System

물류창고 레포트 포트폴리오. 현재 설치된 런타임은 Next.js와 TypeScript이다. 화면은 헤더, 본문, 풋으로 된 셸이다. 헤더 왼쪽 메뉴에서 업무 화면으로 이동한다.

## 목적

DB 없이 화면을 올리기 위한 프론트 셸을 둔다.

## 실행 방법

```powershell
npm ci
npm run typecheck
npm run dev
```

`npm run typecheck`는 `tsc --noEmit`이다. 통과하면 출력이 없고 종료 코드는 0이다.

`npm test`는 품목, BOM, 공정 조회의 `node:test`다. 통과하면 실패가 없다.

`npm run dev`는 셸을 연다. 주소는 터미널에 출력된 로컬 주소다. `/`가 그 셸이다. 메뉴 항목은 `/<module>/<screen>`이다. 예: `/mdm/item`.

`npm run build` 후 `npm run start`로 빌드 결과를 볼 수 있다.

## 환경 변수

없다.

## 주의사항

- 이 저장소의 에이전트 규칙은 `.cursor/rules/stack.mdc`이다.
- 직접 의존성은 `next` 16.4.5, `react` 19.3.1, `react-dom` 19.3.1이다. 개발 의존성은 `typescript` 7.0.2, `@types/react` 19.3.0, `@types/react-dom` 19.3.0, `@types/node` 26.6.6이다. React 패키지에는 선언 파일이 없어 타입 패키지가 필요하다.
- 데이터는 연결하지 않는다. Python 백엔드를 두지 않는다.
- 화면은 `src/app`이다. 그 바로 아래는 레이아웃, 셸, 전역 스타일, `/` 진입, 메뉴 버튼이다. 메뉴 정의는 `src/menu/catalog.ts`이다. `/mdm/item`은 `src/app/mdm/item/page.tsx`가 그린다. 품목 조회, 신규, 저장, 삭제를 이 브라우저 탭에서 수행한다. 새로고침하면 샘플 8건으로 돌아간다. `/mdm/bom`은 `src/app/mdm/bom/page.tsx`가 그린다. 모품목 BOM의 조회, 신규, 저장, 삭제와 자품목 행 추가·삭제를 이 브라우저 탭에서 수행한다. 새로고침하면 샘플 5건으로 돌아간다. `/mdm/route`는 `src/app/mdm/route/page.tsx`가 그린다. 작업장과 공정순서를 이 브라우저 탭에서 조회하고 저장한다. 새로고침하면 작업장 4건과 공정 3건으로 돌아간다. 다른 메뉴는 `src/app/[module]/[screen]/page.tsx`가 제목과 설명만 보여 준다. 헤더 왼쪽은 메뉴 버튼이고, 하위 메뉴를 열면 그 이름이 헤더 가운데에 나온다. 헤더 오른쪽과 풋 왼쪽에는 JL ERP System이 있다. `/` 본문은 비어 있다. 데이터는 연결하지 않는다.
- 헤더와 풋이 나뉜다. 풋에는 개발 시작일 2026년 11월 9일, 사용 도구 Cursor, 100% AI만으로 개발했다는 문구가 있다.
- `src/ping.ts`의 `ping`은 화면이 아니라 타입 검사 샘플이다.
- Geist 글꼴은 빌드할 때 한 번 받아 실행 화면에서 로컬로 쓴다.
- TypeScript 7은 JavaScript 컴파일러 API(`typescript/lib/typescript.js`)를 제공하지 않는다. 타입 검사는 `tsc` CLI로 한다.
- Next.js를 붙일 때 `experimental.useTypeScriptCli: false`로 두지 않는다. 그 설정은 TypeScript 7에서 `next build`가 실패하는 경로이다.
