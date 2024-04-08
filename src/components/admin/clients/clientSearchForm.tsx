"use client";

import { Badge } from "@/components/ui/badge";
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

export type ClientSearchFormProps = {
  clients: any;
  handlerSearch: any;
  search: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  filter: string;
  setFilter: (open: string) => void;
};

function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export default function ClientSearchForm({
  clients,
  handlerSearch,
  search,
  open,
  setOpen,
  filter,
  setFilter,
}: ClientSearchFormProps) {
  return (
    <div className="mb-4 px-2 relative">
      <Input
        type="name"
        onChange={(event) => {
          handlerSearch(event);
        }}
        placeholder="Search..."
        value={search}
      />
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger className="absolute top-2 right-4 focus:hidden">
          {filter ? (
            <Badge>{capitalize(filter) + " x"}</Badge>
          ) : (
            <Badge variant="outline" className="bg-secondary">
              Filter
            </Badge>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Filter by</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Country</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  onValueChange={(event) => {
                    handlerSearch(event, "country");
                  }}
                >
                  {clients.map((client: any) => (
                    <DropdownMenuRadioItem
                      key={client.country}
                      value={client.country}
                    >
                      {capitalize(client.country)}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Category</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  onValueChange={(event) => {
                    handlerSearch(event, "categorie");
                  }}
                >
                  {clients.map((client: any) => (
                    <DropdownMenuRadioItem
                      key={client.categorie}
                      value={client.categorie}
                    >
                      {capitalize(client.categorie)}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => {
              setFilter("");
            }}
          >
            Reset
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
