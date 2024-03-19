import { clickAnimation } from "@/components/ui/click-animation";
import Image from "next/image";
import Link from "next/link";
import ListClientUsers from "./listClientUsers";
import { Badge } from "@/components/ui/badge";
import { IoSettingsOutline } from "react-icons/io5";

export type ListSingleClientProps = {
  clients:
    | [
        {
          id: string;
          createdAt: Date;
          companyEmail: string;
          phone: string;
          address: string;
          country: string;
          companyName: string;
          logo: string;
          categorie: string;
          size: string;
          website: string;
          internalNote: string;
          users: any;
        }
      ]
    | null;
};

export default function ListSingleClient(props: ListSingleClientProps) {
  const clients = props.clients;

  if (!clients?.length) {
    return (
      <div className="h-32 w-full text-sm flex flex-col items-center justify-center text-center p-8">
        <p>No result...</p>
      </div>
    );
  }

  return (
    <ul>
      {clients?.map((client) => (
        <li
          key={client.id}
          className="relative mb-4 hover:bg-secondary p-2 rounded transition-all"
          onClick={clickAnimation}
        >
          <Link
            href={`/admin/clients/${client.id}/settings`}
            className="absolute top-3 right-2 transition hover:scale-105"
          >
            <IoSettingsOutline size="20" className="fill-primary" />
          </Link>
          <Link href={`/admin/clients/${client.id}`}>
            <div className="flex">
              <div className="w-1/3">
                {client.logo ? (
                  <Image
                    src={client.logo}
                    alt=""
                    width={300}
                    height={300}
                    className="aspect-square rounded bg-secondary w-full"
                  />
                ) : (
                  <div className="aspect-square rounded bg-secondary w-full"></div>
                )}
              </div>
              <div className="w-2/3 flex flex-col pl-2 gap-[2px] text-sm md:text-xs lg:text-sm pb-1 justify-between">
                <div className="flex flex-col xl:gap-[2px]">
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-lg md:text-base lg:text-lg xl:text-xl">
                      {client.companyName}
                    </div>
                    <div className="w-10 bg-red-400"></div>
                  </div>
                  <div>
                    <ListClientUsers users={client.users} />
                  </div>
                  <div className="truncate">{client.companyEmail}</div>
                  <div className="truncate">{client.phone}</div>
                </div>
                <div className="flex justify-between gap-2 items-center">
                  <div className="flex gap-2">
                    <Badge className="bg-green-600 text-secondary">
                      {client.country}
                    </Badge>
                    <Badge className="bg-blue-600 text-secondary">
                      {client.categorie}
                    </Badge>
                  </div>
                  <div>status</div>
                </div>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
