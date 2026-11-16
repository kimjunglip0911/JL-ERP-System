/** 업무 메뉴 정의. 화면 본문은 각 경로에서 나중에 채운다. */

export type MenuItem = {
  slug: string;
  title: string;
  summary: string;
};

export type MenuGroup = {
  slug: string;
  title: string;
  summary: string;
  items: MenuItem[];
};

export type ScreenHit = {
  group: MenuGroup;
  item: MenuItem;
};

const slugPattern = /^[a-z0-9]+$/;

function assertCatalog(groups: MenuGroup[]): void {
  const groupSlugs = new Set<string>();
  for (const group of groups) {
    if (!slugPattern.test(group.slug)) {
      throw new Error(`그룹 slug가 규칙을 벗어납니다: ${group.slug}`);
    }
    if (groupSlugs.has(group.slug)) {
      throw new Error(`그룹 slug가 중복입니다: ${group.slug}`);
    }
    groupSlugs.add(group.slug);
    const itemSlugs = new Set<string>();
    for (const item of group.items) {
      if (!slugPattern.test(item.slug)) {
        throw new Error(`항목 slug가 규칙을 벗어납니다: ${group.slug}/${item.slug}`);
      }
      if (itemSlugs.has(item.slug)) {
        throw new Error(`항목 slug가 중복입니다: ${group.slug}/${item.slug}`);
      }
      itemSlugs.add(item.slug);
    }
  }
}

export const menuCatalog: MenuGroup[] = [
  {
    slug: "mdm",
    title: "기준정보 관리",
    summary: "시스템 전반의 트랜잭션 기준이 되는 기준 데이터를 정의하고 통제한다.",
    items: [
      {
        slug: "item",
        title: "품목 마스터",
        summary: "원자재, 반제품, 완제품의 품번 체계와 단위를 등록한다.",
      },
      {
        slug: "bom",
        title: "BOM 관리",
        summary: "단일 및 다단 BOM, 버전, 설계 변경과 개정 이력을 관리한다.",
      },
      {
        slug: "route",
        title: "공정 및 작업장",
        summary: "표준 공정 순서, 작업장 생산능력, 기계·노무 표준 공수를 설정한다.",
      },
      {
        slug: "recipe",
        title: "제조 처방전",
        summary: "프로세스형 제조의 배합비와 성분 비율을 정의한다.",
      },
    ],
  },
  {
    slug: "sales",
    title: "영업 및 수주 관리",
    summary: "고객 접점과 주문부터 출하 지시까지의 오더 흐름을 처리한다.",
    items: [
      {
        slug: "customer",
        title: "고객 마스터 및 CRM",
        summary: "고객 기본정보, 담당자, 여신 한도와 계약 조건을 관리한다.",
      },
      {
        slug: "quote",
        title: "견적 관리",
        summary: "단가와 조건으로 견적서를 작성하고 이력을 남긴다.",
      },
      {
        slug: "order",
        title: "수주 등록",
        summary: "확정 주문을 접수하고 납기와 가용 수량을 확인한다.",
      },
      {
        slug: "ship",
        title: "출하 지시 및 매출 처리",
        summary: "출하 오더, 패킹 리스트, 송장을 발행한다.",
      },
    ],
  },
  {
    slug: "plan",
    title: "생산 및 계획 관리",
    summary: "수요에 맞춰 자재와 생산 일정을 수립한다.",
    items: [
      {
        slug: "mps",
        title: "주생산계획",
        summary: "판매 계획과 수주량으로 기준 생산 일정을 수립한다.",
      },
      {
        slug: "mrp",
        title: "자재소요량계획",
        summary: "BOM, 현재 재고, 입고 예정으로 원자재 소요와 발주 제안을 만든다.",
      },
      {
        slug: "crp",
        title: "생산능력계획",
        summary: "공정·라인 부하와 병목 작업장을 확인한다.",
      },
      {
        slug: "work",
        title: "작업지시서 관리",
        summary: "생산 작업지시서를 발행하고 분할하며 일정을 확정한다.",
      },
    ],
  },
  {
    slug: "floor",
    title: "생산 실행 및 공정 관리",
    summary: "작업지시서에 따른 현장 작업과 실적을 기록한다.",
    items: [
      {
        slug: "output",
        title: "생산 실적 등록",
        summary: "공정별 완료 수량, 불량 수량, 투입 공수를 입력한다.",
      },
      {
        slug: "issue",
        title: "자재 투입 및 불출",
        summary: "실적 기준 자재 소모와 현장 반납을 처리한다.",
      },
      {
        slug: "line",
        title: "작업장 현황 모니터링",
        summary: "라인별 진척도와 가동·비가동 시간을 집계한다.",
      },
      {
        slug: "tool",
        title: "금형 및 공구 관리",
        summary: "금형·공구의 타수, 수명, 사용 이력을 추적한다.",
      },
    ],
  },
  {
    slug: "buy",
    title: "구매 및 조달 관리",
    summary: "원자재와 소모품의 조달부터 매입 대금 확정까지를 담당한다.",
    items: [
      {
        slug: "pr",
        title: "구매요청",
        summary: "사내 요청과 MRP 결과의 구매요청을 접수하고 승인한다.",
      },
      {
        slug: "vendor",
        title: "공급업체 관리",
        summary: "협력사, 공급 단가, 거래 이력을 관리한다.",
      },
      {
        slug: "po",
        title: "구매발주",
        summary: "구매발주서를 발행하고 납기 변경을 추적한다.",
      },
      {
        slug: "match",
        title: "매입 검수 및 정산",
        summary: "입고증과 세금계산서를 맞추고 매입채무를 확정한다.",
      },
    ],
  },
  {
    slug: "stock",
    title: "재고 및 창고 관리",
    summary: "원자재, 반제품, 완제품의 위치와 수불 변동을 통제한다.",
    items: [
      {
        slug: "io",
        title: "입출고 관리",
        summary: "구매 입고, 생산 불출, 완제품 입고, 출하 출고, 창고 이동 전표를 처리한다.",
      },
      {
        slug: "bin",
        title: "로케이션 및 창고",
        summary: "창고 구역, 랙, 보관 위치를 지정한다.",
      },
      {
        slug: "lot",
        title: "Lot Batch Serial 추적",
        summary: "로트 번호를 부여하고 전방·후방 추적성을 관리한다.",
      },
      {
        slug: "count",
        title: "재고 실사 및 조정",
        summary: "장부 재고와 실물 재고를 맞추고 조정 전표를 발행한다.",
      },
    ],
  },
  {
    slug: "quality",
    title: "품질 관리",
    summary: "입고부터 출하까지의 품질 검사와 규격 적합성을 검증한다.",
    items: [
      {
        slug: "spec",
        title: "품질 검사 기준서",
        summary: "품목별 검사 항목, 시료 채취 기준, 허용 오차를 등록한다.",
      },
      {
        slug: "check",
        title: "검사 실행",
        summary: "수입·공정·출하 검사 결과와 합격 여부를 입력한다.",
      },
      {
        slug: "ncr",
        title: "부적합품 및 시정조치",
        summary: "부적합 보고, 격리, 원인 분석과 개선 조치를 관리한다.",
      },
      {
        slug: "coa",
        title: "시험성적서 관리",
        summary: "고객 제출용 검사 성적서를 발행하고 이력을 보관한다.",
      },
    ],
  },
  {
    slug: "plant",
    title: "설비 관리",
    summary: "생산 장비와 치공구의 보전 일정을 관리한다.",
    items: [
      {
        slug: "asset",
        title: "설비 마스터 및 이력",
        summary: "설비, 스펙, 도입 일자, 설치 장소를 등록한다.",
      },
      {
        slug: "pm",
        title: "예방보전 일정",
        summary: "주기별 점검 계획과 체크리스트를 관리한다.",
      },
      {
        slug: "repair",
        title: "고장 신고 및 수리",
        summary: "고장 접수, 수리 작업지시, 수리 부품 소모를 기록한다.",
      },
      {
        slug: "spare",
        title: "예비품 재고",
        summary: "유지보수용 소모품과 예비 부품 수불을 관리한다.",
      },
    ],
  },
  {
    slug: "finance",
    title: "원가 및 재무회계",
    summary: "실물 흐름을 금액으로 환산하고 결산과 세무를 처리한다.",
    items: [
      {
        slug: "gl",
        title: "총계정원장",
        summary: "전표, 분개장, 계정과목표를 관리한다.",
      },
      {
        slug: "arap",
        title: "매출채권 및 매입채무",
        summary: "수금, 지급, 미수금과 미지급금을 관리한다.",
      },
      {
        slug: "cash",
        title: "자금 및 은행",
        summary: "현금 흐름, 계좌 이체, 입출금 대사를 처리한다.",
      },
      {
        slug: "cost",
        title: "제조원가 계산",
        summary: "재료비·노무비·경비, 작업지시 원가, 표준·실제 차이를 집계한다.",
      },
      {
        slug: "close",
        title: "회계 결산 및 재무제표",
        summary: "월말·연말 결산, 재무상태표, 손익계산서를 작성한다.",
      },
    ],
  },
  {
    slug: "hr",
    title: "인사 및 급여",
    summary: "조직 구성원의 정보와 근태, 보수를 관리한다.",
    items: [
      {
        slug: "person",
        title: "인사 마스터",
        summary: "조직, 사원, 직급·직책, 입퇴사 이력을 관리한다.",
      },
      {
        slug: "attend",
        title: "근태 관리",
        summary: "출퇴근, 휴가 승인, 교대 스케줄을 관리한다.",
      },
      {
        slug: "pay",
        title: "급여 및 상여",
        summary: "기본급, 수당, 공제를 계산하고 급여명세서를 발행한다.",
      },
      {
        slug: "retire",
        title: "퇴직금 및 4대보험",
        summary: "원천징수 영수증과 법정 정산을 관리한다.",
      },
    ],
  },
  {
    slug: "admin",
    title: "시스템 및 공통",
    summary: "시스템의 보안과 운영 기반을 통제한다.",
    items: [
      {
        slug: "access",
        title: "사용자 및 권한",
        summary: "계정과 메뉴 접근·수정 권한을 통제한다.",
      },
      {
        slug: "flow",
        title: "결재선 및 워크플로우",
        summary: "문서별 전자결재선을 설정한다.",
      },
      {
        slug: "audit",
        title: "감사 로그",
        summary: "데이터 변경과 접속 이력을 추적한다.",
      },
    ],
  },
];

assertCatalog(menuCatalog);

/** 그룹과 항목 slug로 화면을 찾는다. */
export function findScreen(moduleSlug: string, screenSlug: string): ScreenHit | null {
  const group = menuCatalog.find((entry) => entry.slug === moduleSlug);
  if (!group) {
    return null;
  }
  const item = group.items.find((entry) => entry.slug === screenSlug);
  if (!item) {
    return null;
  }
  return { group, item };
}

/** 정적 경로에 넣을 화면 목록. */
export function listScreens(): { module: string; screen: string }[] {
  return menuCatalog.flatMap((group) =>
    group.items.map((item) => ({ module: group.slug, screen: item.slug })),
  );
}

/** 화면 URL. */
export function screenPath(moduleSlug: string, screenSlug: string): string {
  return `/${moduleSlug}/${screenSlug}`;
}

const screenCount = listScreens().length;
if (screenCount !== 44) {
  throw new Error(`화면 수가 44개가 아닙니다: ${screenCount}`);
}
