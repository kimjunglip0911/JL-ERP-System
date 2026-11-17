import type { Metadata } from "next";
import { BomDesk } from "./desk";
import "./bom.css";

export const metadata: Metadata = {
  title: "BOM 관리 · JL ERP System",
};

/** BOM 관리 화면. */
export default function BomPage() {
  return <BomDesk />;
}
