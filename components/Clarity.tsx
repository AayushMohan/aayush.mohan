"use client";

import { useEffect } from "react";
import clarity from "@microsoft/clarity";

type ClarityProps = {
  projectId?: string;
};

export default function Clarity({ projectId }: ClarityProps) {
  useEffect(() => {
    const id = projectId?.trim();
    if (!id) return;

    clarity.init(id);
  }, [projectId]);

  return null;
}
