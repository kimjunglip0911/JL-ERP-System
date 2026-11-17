import type { Metadata } from "next";
import { RouteDesk } from "./desk";
import "./route.css";

export const metadata: Metadata = {
  title: "공정 및 작업장 · JL ERP System",
};

/** 공정 및 작업장 화면. */
export default function RoutePage() {
  return <RouteDesk />;
}
