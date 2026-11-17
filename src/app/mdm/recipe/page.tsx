import type { Metadata } from "next";
import { RecipeDesk } from "./desk";
import "./recipe.css";

export const metadata: Metadata = {
  title: "제조 처방전 · JL ERP System",
};

/** 제조 처방전 화면. */
export default function RecipePage() {
  return <RecipeDesk />;
}
