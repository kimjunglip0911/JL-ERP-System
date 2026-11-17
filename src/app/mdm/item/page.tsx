import type { Metadata } from "next";
import { ItemDesk } from "./desk";
import "./item.css";

export const metadata: Metadata = {
  title: "품목 마스터 · JL ERP System",
};

/** 품목 마스터 화면. */
export default function ItemPage() {
  return <ItemDesk />;
}
