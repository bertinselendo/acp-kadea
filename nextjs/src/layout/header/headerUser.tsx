"use client";

import UserAvatar from "@/components/auth/UserAvatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import MainMenu from "../navigation/mainMenu";
import HeaderMainMenu from "./headerMainMenu";
import HeaderSettingMenu from "./headerSettingMenu";
import FooterMenu from "../footer/footerMenu";

export default function HeaderUserPoper(props: {
  user: any;
  clientID: string;
}) {
  // const session;
  // console.log(props.user);
  const user = props.user;

  return (
    <Popover>
      <PopoverTrigger>
        <UserAvatar src={props.user?.avatar} />
      </PopoverTrigger>
      <PopoverContent className="mr-3">
        <div className="border-b pb-3 mb-3">
          <h4 className="font-medium">{`${user?.firstName} ${user?.lastName}`}</h4>
          <p className="text-sm">{user?.email}</p>
        </div>
        <div className="border-b pb-3 mb-3">
          <HeaderMainMenu clientID={props.clientID} />
        </div>
        <div className="border-b pb-3 mb-3">
          <HeaderSettingMenu />
        </div>
        <div>
          <FooterMenu />
        </div>
      </PopoverContent>
    </Popover>
  );
}
