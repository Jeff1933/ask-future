"use client"

import { useState } from "react"

interface switcherProps {
  isCollapsed: boolean;
  account: string;
  setAccount: (account: string) => void;
}
export function AccountSwitcher({ isCollapsed, account, setAccount } : switcherProps) {
  const [isNow, setIsNow] = useState(account === 'now');
  
  const changeRole = () => {
    setIsNow(!isNow);
    setAccount(isNow ? 'now' : 'future')
  }

  const showMenu = () => {

  }
  return (
    <div className="">
      <div className="cursor-pointer">
          {
            isCollapsed ? (
              <div 
                onClick={showMenu}
                className="h-9 w-9 rounded-full border border-border cursor-pointer flex shrink-0 justify-center items-center "
              >
                {isNow ? 'N' : 'F'}
              </div>
            ) :             
              <div className="w-[8rem] gap-1 h-[2rem] rounded-lg flex p-1 justify-between items-center">
                <div 
                    onClick={changeRole} 
                    className={`flex items-center flex-1 transform justify-center transition-colors duration-200 ${isNow ? 'switcher-button-active' : 'switcher-button-default'}`}
                >
                    <span className="text-[.75rem] font-normal">Now</span>
                </div>
                <div 
                    onClick={changeRole} 
                    className={`flex items-center flex-1 transform justify-center transition-colors duration-200 ${!isNow ? 'switcher-button-active' : 'switcher-button-default'}`}
                >
                    <span className="text-[.75rem] font-normal">Future</span>
                </div>
              </div>           
          }
      </div>
    </div>
  )
}