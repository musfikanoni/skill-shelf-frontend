"use client";

import { useEffect } from "react";

interface PageTitleProps {
  title: string;
}

export default function PageTitle({ title }: PageTitleProps) {
  useEffect(() => {
    if (title) {
      document.title = title.includes("SkillShelf") ? title : `${title} | SkillShelf`;
    }
  }, [title]);

  return null;
}

export const Helmet = PageTitle;

