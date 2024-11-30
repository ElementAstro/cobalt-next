import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbProps {
  path: string;
  onNavigate: (path: string) => void;
}

export function BreadcrumbComponent({ path, onNavigate }: BreadcrumbProps) {
  const parts = path.split("/").filter(Boolean);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <Button variant="ghost" size="sm" onClick={() => onNavigate("/")}>
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </BreadcrumbItem>
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            <BreadcrumbSeparator>
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink
                asChild
                onClick={() =>
                  onNavigate(`/${parts.slice(0, index + 1).join("/")}/`)
                }
              >
                <Button variant="ghost" size="sm">
                  {part}
                </Button>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
