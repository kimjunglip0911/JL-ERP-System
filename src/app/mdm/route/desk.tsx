"use client";

/** 작업장과 공정 등록 화면. */

import { useRef, useState } from "react";
import { kindOptions, useOptions } from "./labels";
import { filterRoutes, filterWcs } from "./query";
import { RouteGrid } from "./route-grid";
import {
  addStep,
  copyRoute,
  dropStep,
  patchRoute,
  patchStep,
  patchWc,
  removeRoute,
  removeWc,
  sameRoute,
  sameWc,
  saveRoute,
  saveWc,
} from "./rules";
import { blankRoute, blankWc, emptyRouteQuery, emptyWcQuery, seedRoutes, seedWcs } from "./seed";
import { StepGrid } from "./steps";
import { routeKey, wcKey, type Route, type RouteQuery, type Wc, type WcQuery } from "./types";
import { WcForm } from "./wc-form";
import { WcGrid } from "./wc-grid";

type Mode = "new" | "edit";
type Tab = "wc" | "route";

type Desk = {
  wcs: Wc[];
  routes: Route[];
  tab: Tab;
  wcQuery: WcQuery;
  wcApplied: WcQuery;
  wcSelected: string | null;
  wcDraft: Wc;
  wcMode: Mode;
  routeQuery: RouteQuery;
  routeApplied: RouteQuery;
  routeSelected: string | null;
  routeDraft: Route;
  routeMode: Mode;
  step: number | null;
  message: string;
};

function openDesk(): Desk {
  const wcs = seedWcs();
  const routes = seedRoutes();
  const wc = wcs[0];
  const route = routes[0];
  return {
    wcs,
    routes,
    tab: "wc",
    wcQuery: emptyWcQuery(),
    wcApplied: emptyWcQuery(),
    wcSelected: wc ? wcKey(wc) : null,
    wcDraft: wc ? { ...wc } : blankWc(),
    wcMode: "edit",
    routeQuery: emptyRouteQuery(),
    routeApplied: emptyRouteQuery(),
    routeSelected: route ? routeKey(route) : null,
    routeDraft: route ? copyRoute(route) : blankRoute(),
    routeMode: "edit",
    step: route && route.steps.length > 0 ? 0 : null,
    message: "",
  };
}

function stepOf(route: Route): number | null {
  return route.steps.length > 0 ? 0 : null;
}

function isDirty(desk: Desk): boolean {
  if (desk.tab === "wc") {
    if (desk.wcMode === "new") {
      return !sameWc(desk.wcDraft, blankWc());
    }
    const saved = desk.wcs.find((wc) => wcKey(wc) === desk.wcSelected);
    return !sameWc(desk.wcDraft, saved ?? blankWc());
  }
  if (desk.routeMode === "new") {
    return !sameRoute(desk.routeDraft, blankRoute());
  }
  const saved = desk.routes.find((route) => routeKey(route) === desk.routeSelected);
  return !sameRoute(desk.routeDraft, saved ?? blankRoute());
}

/** 세션 안에서 작업장과 공정을 조회하고 고친다. */
export function RouteDesk() {
  const [desk, setDesk] = useState(openDesk);
  const deskRef = useRef(desk);
  deskRef.current = desk;
  const wcRows = filterWcs(desk.wcs, desk.wcApplied);
  const routeRows = filterRoutes(desk.routes, desk.routeApplied);

  function leaveOk(): boolean {
    if (!isDirty(deskRef.current)) {
      return true;
    }
    return window.confirm("저장하지 않은 내용이 있습니다. 이동할까요?");
  }

  function onTab(tab: Tab) {
    if (tab === deskRef.current.tab) {
      return;
    }
    if (!leaveOk()) {
      return;
    }
    setDesk((prev) => ({ ...prev, tab, message: "" }));
  }

  function onSearch() {
    setDesk((prev) => {
      if (prev.tab === "wc") {
        const found = filterWcs(prev.wcs, prev.wcQuery);
        const stay = prev.wcSelected !== null && found.some((row) => wcKey(row) === prev.wcSelected);
        if (stay) {
          return { ...prev, wcApplied: prev.wcQuery, message: "" };
        }
        const first = found[0];
        if (first) {
          return { ...prev, wcApplied: prev.wcQuery, wcSelected: wcKey(first), wcDraft: { ...first }, wcMode: "edit", message: "" };
        }
        return { ...prev, wcApplied: prev.wcQuery, wcMode: "edit", wcSelected: null, wcDraft: blankWc(), message: "조회된 작업장이 없습니다." };
      }
      const found = filterRoutes(prev.routes, prev.routeQuery);
      const stay = prev.routeSelected !== null && found.some((row) => routeKey(row) === prev.routeSelected);
      if (stay) {
        return { ...prev, routeApplied: prev.routeQuery, message: "" };
      }
      const first = found[0];
      if (first) {
        return {
          ...prev,
          routeApplied: prev.routeQuery,
          routeSelected: routeKey(first),
          routeDraft: copyRoute(first),
          routeMode: "edit",
          step: stepOf(first),
          message: "",
        };
      }
      return {
        ...prev,
        routeApplied: prev.routeQuery,
        routeMode: "edit",
        routeSelected: null,
        routeDraft: blankRoute(),
        step: null,
        message: "조회된 공정이 없습니다.",
      };
    });
  }

  function onNew() {
    if (!leaveOk()) {
      return;
    }
    setDesk((prev) => {
      if (prev.tab === "wc") {
        return { ...prev, wcMode: "new", wcSelected: null, wcDraft: blankWc(), message: "신규 작업장을 입력한 뒤 저장하세요." };
      }
      return { ...prev, routeMode: "new", routeSelected: null, routeDraft: blankRoute(), step: null, message: "신규 공정을 입력한 뒤 저장하세요." };
    });
  }

  function onPickWc(code: string) {
    if (!leaveOk()) {
      return;
    }
    setDesk((prev) => {
      const wc = prev.wcs.find((row) => wcKey(row) === code);
      if (!wc) {
        return prev;
      }
      return { ...prev, wcSelected: code, wcDraft: { ...wc }, wcMode: "edit", message: "" };
    });
  }

  function onPickRoute(parent: string) {
    if (!leaveOk()) {
      return;
    }
    setDesk((prev) => {
      const route = prev.routes.find((row) => routeKey(row) === parent);
      if (!route) {
        return prev;
      }
      return { ...prev, routeSelected: parent, routeDraft: copyRoute(route), routeMode: "edit", step: stepOf(route), message: "" };
    });
  }

  function onSave() {
    setDesk((prev) => {
      if (prev.tab === "wc") {
        const result = saveWc(prev.wcs, prev.wcDraft, prev.wcMode);
        if (result.error) {
          return { ...prev, message: result.error };
        }
        const saved = result.wcs.find((wc) => wcKey(wc) === wcKey(prev.wcDraft));
        return {
          ...prev,
          wcs: result.wcs,
          wcMode: "edit",
          wcSelected: saved ? wcKey(saved) : null,
          wcDraft: saved ? { ...saved } : prev.wcDraft,
          message: "저장했습니다.",
        };
      }
      const result = saveRoute(prev.routes, prev.routeDraft, prev.wcs, prev.routeMode);
      if (result.error) {
        return { ...prev, message: result.error };
      }
      const saved = result.routes.find((route) => routeKey(route) === routeKey(prev.routeDraft));
      return {
        ...prev,
        routes: result.routes,
        routeMode: "edit",
        routeSelected: saved ? routeKey(saved) : null,
        routeDraft: saved ? copyRoute(saved) : prev.routeDraft,
        step: saved ? stepOf(saved) : null,
        message: "저장했습니다.",
      };
    });
  }

  function onDelete() {
    const current = deskRef.current;
    if (current.tab === "wc") {
      if (current.wcMode === "new" || current.wcSelected === null) {
        setDesk((prev) => ({ ...prev, message: "삭제할 작업장을 선택하세요." }));
        return;
      }
      if (!window.confirm("선택한 작업장을 삭제할까요?")) {
        return;
      }
      setDesk((prev) => {
        if (prev.wcSelected === null) {
          return prev;
        }
        const wcs = removeWc(prev.wcs, prev.wcSelected);
        const found = filterWcs(wcs, prev.wcApplied);
        const first = found[0];
        return {
          ...prev,
          wcs,
          wcMode: "edit",
          wcSelected: first ? wcKey(first) : null,
          wcDraft: first ? { ...first } : blankWc(),
          message: "삭제했습니다.",
        };
      });
      return;
    }
    if (current.routeMode === "new" || current.routeSelected === null) {
      setDesk((prev) => ({ ...prev, message: "삭제할 공정을 선택하세요." }));
      return;
    }
    if (!window.confirm("선택한 공정을 삭제할까요?")) {
      return;
    }
    setDesk((prev) => {
      if (prev.routeSelected === null) {
        return prev;
      }
      const routes = removeRoute(prev.routes, prev.routeSelected);
      const found = filterRoutes(routes, prev.routeApplied);
      const first = found[0];
      return {
        ...prev,
        routes,
        routeMode: "edit",
        routeSelected: first ? routeKey(first) : null,
        routeDraft: first ? copyRoute(first) : blankRoute(),
        step: first ? stepOf(first) : null,
        message: "삭제했습니다.",
      };
    });
  }

  function onAddStep() {
    setDesk((prev) => {
      const routeDraft = addStep(prev.routeDraft);
      return { ...prev, routeDraft, step: routeDraft.steps.length - 1, message: "" };
    });
  }

  function onDropStep() {
    if (deskRef.current.step === null) {
      setDesk((prev) => ({ ...prev, message: "삭제할 공정을 선택하세요." }));
      return;
    }
    setDesk((prev) => {
      if (prev.step === null) {
        return prev;
      }
      const routeDraft = dropStep(prev.routeDraft, prev.step);
      const step = routeDraft.steps.length === 0 ? null : Math.min(prev.step, routeDraft.steps.length - 1);
      return { ...prev, routeDraft, step, message: "" };
    });
  }

  return (
    <section className="route-desk">
      <div className="route-toolbar">
        <div className="route-actions">
          <button type="button" className="is-primary" onClick={onSearch}>
            조회
          </button>
          <button type="button" onClick={onNew}>
            신규
          </button>
          <button type="button" className="is-primary" onClick={onSave}>
            저장
          </button>
          <button type="button" onClick={onDelete}>
            삭제
          </button>
          {desk.tab === "route" ? (
            <>
              <button type="button" onClick={onAddStep}>
                행추가
              </button>
              <button type="button" onClick={onDropStep}>
                행삭제
              </button>
            </>
          ) : null}
        </div>
        <p className="route-message" aria-live="polite">
          {desk.message}
        </p>
      </div>
      <div className="route-tabs" role="tablist" aria-label="공정 정보">
        <button type="button" role="tab" aria-selected={desk.tab === "wc"} onClick={() => onTab("wc")}>
          작업장
        </button>
        <button type="button" role="tab" aria-selected={desk.tab === "route"} onClick={() => onTab("route")}>
          공정
        </button>
      </div>
      {desk.tab === "wc" ? (
        <form
          className="route-query"
          onSubmit={(event) => {
            event.preventDefault();
            onSearch();
          }}
        >
          <label htmlFor="q-code">
            작업장코드
            <input id="q-code" value={desk.wcQuery.code} onChange={(event) => setDesk((prev) => ({ ...prev, wcQuery: { ...prev.wcQuery, code: event.target.value } }))} />
          </label>
          <label htmlFor="q-name">
            작업장명
            <input id="q-name" value={desk.wcQuery.name} onChange={(event) => setDesk((prev) => ({ ...prev, wcQuery: { ...prev.wcQuery, name: event.target.value } }))} />
          </label>
          <label htmlFor="q-kind">
            작업장구분
            <select
              id="q-kind"
              value={desk.wcQuery.kind}
              onChange={(event) => setDesk((prev) => ({ ...prev, wcQuery: { ...prev.wcQuery, kind: event.target.value as WcQuery["kind"] } }))}
            >
              <option value="">전체</option>
              {kindOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="q-use">
            사용여부
            <select
              id="q-use"
              value={desk.wcQuery.use}
              onChange={(event) => setDesk((prev) => ({ ...prev, wcQuery: { ...prev.wcQuery, use: event.target.value as WcQuery["use"] } }))}
            >
              <option value="">전체</option>
              {useOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </form>
      ) : (
        <form
          className="route-query"
          onSubmit={(event) => {
            event.preventDefault();
            onSearch();
          }}
        >
          <label htmlFor="q-parent">
            모품번
            <input
              id="q-parent"
              value={desk.routeQuery.parent}
              onChange={(event) => setDesk((prev) => ({ ...prev, routeQuery: { ...prev.routeQuery, parent: event.target.value } }))}
            />
          </label>
          <label htmlFor="q-parent-name">
            모품명
            <input
              id="q-parent-name"
              value={desk.routeQuery.parentName}
              onChange={(event) => setDesk((prev) => ({ ...prev, routeQuery: { ...prev.routeQuery, parentName: event.target.value } }))}
            />
          </label>
          <label htmlFor="q-route-use">
            사용여부
            <select
              id="q-route-use"
              value={desk.routeQuery.use}
              onChange={(event) => setDesk((prev) => ({ ...prev, routeQuery: { ...prev.routeQuery, use: event.target.value as RouteQuery["use"] } }))}
            >
              <option value="">전체</option>
              {useOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </form>
      )}
      {desk.tab === "wc" ? (
        <WcGrid rows={wcRows} selected={desk.wcMode === "edit" ? desk.wcSelected : null} onPick={onPickWc} />
      ) : (
        <RouteGrid rows={routeRows} selected={desk.routeMode === "edit" ? desk.routeSelected : null} onPick={onPickRoute} />
      )}
      {desk.tab === "wc" ? (
        <WcForm
          draft={desk.wcDraft}
          mode={desk.wcMode}
          onChange={(key, value) => setDesk((prev) => ({ ...prev, wcDraft: patchWc(prev.wcDraft, key, value), message: "" }))}
        />
      ) : (
        <div className="route-sheet">
          <div className="route-form">
            <label htmlFor="r-parent">
              모품번
              <input
                id="r-parent"
                value={desk.routeDraft.parent}
                disabled={desk.routeMode === "edit"}
                onChange={(event) => setDesk((prev) => ({ ...prev, routeDraft: patchRoute(prev.routeDraft, "parent", event.target.value), message: "" }))}
              />
            </label>
            <label htmlFor="r-name">
              모품명
              <input
                id="r-name"
                value={desk.routeDraft.parentName}
                onChange={(event) => setDesk((prev) => ({ ...prev, routeDraft: patchRoute(prev.routeDraft, "parentName", event.target.value), message: "" }))}
              />
            </label>
            <label htmlFor="r-use">
              사용여부
              <select
                id="r-use"
                value={desk.routeDraft.use}
                onChange={(event) =>
                  setDesk((prev) => ({ ...prev, routeDraft: patchRoute(prev.routeDraft, "use", event.target.value as Route["use"]), message: "" }))
                }
              >
                {useOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label htmlFor="r-note">
              비고
              <input
                id="r-note"
                value={desk.routeDraft.note}
                onChange={(event) => setDesk((prev) => ({ ...prev, routeDraft: patchRoute(prev.routeDraft, "note", event.target.value), message: "" }))}
              />
            </label>
          </div>
          <StepGrid
            steps={desk.routeDraft.steps}
            wcs={desk.wcs}
            picked={desk.step}
            onPick={(step) => setDesk((prev) => ({ ...prev, step }))}
            onChange={(index, key, value) =>
              setDesk((prev) => ({ ...prev, routeDraft: patchStep(prev.routeDraft, index, key, value), step: index, message: "" }))
            }
          />
        </div>
      )}
    </section>
  );
}
