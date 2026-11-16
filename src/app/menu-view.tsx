"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { menuCatalog, screenPath, type MenuGroup } from "../menu/catalog";

function firstGroup(): MenuGroup {
  const group = menuCatalog[0];
  if (!group) {
    throw new Error("메뉴 그룹이 없습니다");
  }
  return group;
}

/** 헤더 왼쪽 메뉴 버튼과 메뉴 화면. */
export function MenuView() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [activeSlug, setActiveSlug] = useState(firstGroup().slug);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);
  const titleId = useId();
  const panelId = useId();
  const activeGroup = menuCatalog.find((group) => group.slug === activeSlug) ?? firstGroup();

  useEffect(() => {
    if (!open) {
      if (wasOpen.current) {
        buttonRef.current?.focus();
      }
      return;
    }
    wasOpen.current = true;
    panelRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function toggleMenu() {
    if (open) {
      setOpen(false);
      return;
    }
    setActiveSlug(firstGroup().slug);
    setOpen(true);
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="menu-btn"
        aria-label="메뉴"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggleMenu}
      >
        <span className="menu-bars" aria-hidden="true" />
      </button>
      {open ? (
        <div className="menu-layer">
          <button type="button" className="menu-backdrop" aria-label="메뉴 닫기" onClick={() => setOpen(false)} />
          <div
            ref={panelRef}
            id={panelId}
            className="menu-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
          >
            <h2 id={titleId} className="menu-heading">
              메뉴
            </h2>
            <div className="menu-columns">
              <ul className="menu-groups">
                {menuCatalog.map((group) => {
                  const selected = group.slug === activeGroup.slug;
                  return (
                    <li key={group.slug}>
                      <button
                        type="button"
                        className={selected ? "menu-group is-active" : "menu-group"}
                        aria-expanded={selected}
                        onClick={() => setActiveSlug(group.slug)}
                      >
                        {group.title}
                      </button>
                      <ul className="menu-items" hidden={!selected}>
                        {group.items.map((item) => (
                          <li key={item.slug}>
                            <MenuLink
                              href={screenPath(group.slug, item.slug)}
                              title={item.title}
                              current={pathname === screenPath(group.slug, item.slug)}
                              onNavigate={() => setOpen(false)}
                            />
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                })}
              </ul>
              <ul className="menu-desk">
                {activeGroup.items.map((item) => (
                  <li key={item.slug}>
                    <MenuLink
                      href={screenPath(activeGroup.slug, item.slug)}
                      title={item.title}
                      current={pathname === screenPath(activeGroup.slug, item.slug)}
                      onNavigate={() => setOpen(false)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function MenuLink({
  href,
  title,
  current,
  onNavigate,
}: {
  href: string;
  title: string;
  current: boolean;
  onNavigate: () => void;
}) {
  return (
    <Link href={href} className="menu-link" aria-current={current ? "page" : undefined} onClick={onNavigate}>
      {title}
    </Link>
  );
}
