"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

export type MembersSearchFormProps = {
  handlerSearch: any;
  search: string;
};

export default function TeamSearchForm({
  handlerSearch,
  search,
}: MembersSearchFormProps) {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="w-full">
          <Input
            type="name"
            onChange={(event) => {
              handlerSearch(event);
            }}
            placeholder="Search..."
            value={search}
            className="transition-all duration-75"
          />
        </div>
      </CardContent>
    </Card>
  );
}
