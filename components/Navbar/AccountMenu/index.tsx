import React from "react";

import { signOut } from "next-auth/react";
import Image from "next/image";
import useCurrentUser from "../../../hooks/useCurrentUser";

interface AccountMenuProps {
    visible?: boolean;
}



const AccountMenu:React.FC<AccountMenuProps> = ({visible}) => {

    const {data} = useCurrentUser();

    if(!visible) return null;

    return ( 
        
        <div className="bg-black w-56 absolute top-14 right-0 py-5 flex-col border-2 border-gray-800 flex">
            <div className="flex flex-col gap-3">
                <div className="px-3 group/item flex flex-row gap-3 items-center w-full">
                    <Image className="w-8 rounded-md" src="/images/default_blue.jpg" width="100" height="100" alt="user_image" />
                    <p className="text-white text-sm group-hover/item:underline">{data?.name}</p>
                </div>
                <hr className="bg-gray-600 border-0 h-px" />
                <div onClick={() => signOut()}className="text-center px-3 text-white text-sm hover:underline">Sing out of Netflix</div>
            </div>
        </div>
)
}

export default AccountMenu;