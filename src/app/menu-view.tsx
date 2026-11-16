"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { menuCatalog, screenPath } from "../menu/catalog";

function groupForPath(pathname: string): string | null {
  const group = menuCatalog.find((entry) =>
    entry.items.some((item) => pathname === screenPath(entry.slug, item.slug)),
  );
  return group?.slug ?? null;
}

/** 헤더 왼쪽 메뉴 버튼과 접히는 메뉴 화면. */
export function MenuView() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);
  const titleId = useId();
  const panelId = useId();

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
    setActiveSlug(groupForPath(pathname));
    setOpen(true);
  }

  function toggleGroup(slug: string) {
    setActiveSlug((current) => (current === slug ? null : slug));
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
            <ul className="menu-groups">
              {menuCatalog.map((group) => {
                const selected = group.slug === activeSlug;
                return (
                  <li key={group.slug} className={selected ? "menu-block is-open" : "menu-block"}>
                    <button
                      type="button"
                      className={selected ? "menu-group is-active" : "menu-group"}
                      aria-expanded={selected}
                      onClick={() => toggleGroup(group.slug)}
                    >
                      <span>{group.title}</span>
                      <span className="menu-chevron" aria-hidden="true" />
                    </button>
                    <div className="menu-fold" inert={selected ? undefined : true}>
                      <ul className="menu-items">
                        {group.items.map((item) => (
                          <li key={item.slug}>
                            <MenuLink
                              href={screenPath(group.slug, item.slug)}
                              title={item.title}
                              current={pathname === screenPath(group.slug, item.slug)}
                              onNavigate={(href) => {
                                router.push(href);
                                setOpen(false);
                              }}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ul>
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
  onNavigate: (href: string) => void;
}) {
  return (
    <Link
      href={href}
      className="menu-link"
      aria-current={current ? "page" : undefined}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
          return;
        }
        event.preventDefault();
        onNavigate(href);
      }}
    >
      {title}
    </Link>
  );
}
