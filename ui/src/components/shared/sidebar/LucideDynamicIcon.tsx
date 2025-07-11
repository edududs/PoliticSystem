import { DynamicIcon } from "lucide-react/dynamic";
import * as React from "react";

interface LucideDynamicIconProps {
  name: string;
  className?: string;
}

export function LucideDynamicIcon({ name, className }: LucideDynamicIconProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return React.createElement(DynamicIcon as any, { name, className });
}
