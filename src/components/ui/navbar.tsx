"use client";
import { useEffect, useState , useRef} from "react";
import { Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PaidIcon from "@mui/icons-material/Paid";
import Divider from "@mui/material/Divider";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import HowToRegRoundedIcon from '@mui/icons-material/HowToRegRounded';
import { LogIn } from 'lucide-react';
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const { data: session, status } = useSession();
  const [ userName, setUserName ] = useState(session?.user?.name || "Guest");
  const [ userImage, setUserImage ] = useState(session?.user?.profilePicture || "https://github.com/shadcn.png");
  const router = useRouter();
  const [ chips, setChips ] = useState(session?.user?.chips);
  const menuRef = useRef<HTMLDivElement>(null);
  const [ contentWidth, setContentWidth ] = useState("");

  useEffect(() => {
    if ( session ){
      setUserName(session.user.name || "Guest");
      setChips(session.user.chips);
      setUserImage(session.user.profilePicture || "" )
    }
  }, [session]);
  useEffect(() => {
    if (menuRef.current) {
      setContentWidth(menuRef.current.offsetWidth.toString());
      console.log("Menu width:", menuRef.current.offsetWidth);
    }

  }, [chips]);
  return (
    <header className="flex h-[64px] relative z-10">
      <div className="flex flex-1 items-center"></div>
      {!session ? (
        <div className="flex items-center gap-5 bg-surface-panel pl-5 shadow-lg rounded-l-4xl">
          <button
            className="flex text-white  cursor-pointer  gap-3"
            onClick={() => {
              router.push("/auth/signin");
            }}
          >
            <LogIn />
            Sign in
          </button>
          
          <Divider
            orientation="vertical"
            sx={{ borderColor: "white", opacity: 0.6 }}
            variant="middle"
            flexItem
          />
          <button
            className="flex text-white  cursor-pointer justify-center items-center gap-3 pr-2"
            onClick={() => {
              router.push("/auth/signup");
            }}
          >
            Sign up
            <HowToRegRoundedIcon className="text-white " />
          </button>
          
        </div>
      ) : (
        <div
          className={
            `flex items-center gap-5 bg-surface-panel pl-5 shadow-lg transition-all duration-300 ease-in-out ` +
            (showMenu ? "rounded-tl-4xl" : "rounded-l-4xl")
          }
          ref={menuRef}
          
        >
          <PaidIcon fontSize="large" />
          <span className="text-white text-lg font-medium">{chips}</span>
          <Divider
            orientation="vertical"
            sx={{ borderColor: "white", opacity: 0.6 }}
            variant="middle"
            flexItem
          />
          <Avatar className="w-12 h-12">
            <AvatarImage src={userImage} />
            <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div
            className="pr-5 cursor-pointer"
            onMouseEnter={() => setShowMenu(true)}
          >
            <Menu className="w-10 h-10 mt-1 " />
          </div>
        </div>
      )}
      {showMenu && (
        <div
          className="absolute right-0 top-full z-20 transition-all duration-300 ease-out transform animate-slide-in"
          onMouseEnter={() => setShowMenu(true)}
          onMouseLeave={() => setShowMenu(false)}
        >
          <Content
            onSignOut={() => signOut({ callbackUrl: "/" })}
            authenticated={status === "authenticated"}
            width={contentWidth}
          />
        </div>
      )}
    </header>
  );
}

const Content = ({
  onSignOut,
  authenticated,
  width ,
}: {
  onSignOut: () => void;
  authenticated: boolean;
  width: string;
}) => {
  return (
    <div
      style={{ width: `${width}px` }}
      className={`w-[${width}px] bg-surface-panel rounded-bl-4xl overflow-hidden shadow-lg flex flex-col divide-y divide-white/10`}
    >
      {/* Menu items */}
      {authenticated && (
        <button className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition">
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <path d="M12 20h9" />
            <path d="M19 20V4a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16" />
            <path d="M9 8h6" />
            <path d="M9 12h6" />
            <path d="M9 16h6" />
          </svg>
          edit profile
        </button>
      )}
      <button className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition">
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        more chips
      </button>
      <button className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition">
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
        settings
      </button>
      {authenticated && (
        <button
          onClick={onSignOut}
          className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition text-left"
        >
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <path d="M17 16l4-4-4-4" />
            <path d="M21 12H9" />
            <path d="M3 21V3" />
          </svg>
          Sign Out
        </button>
      )}
      {!authenticated && (
        <Link
          href="/auth/signIn"
          className="px-4 py-3 text-white hover:bg-white/10 transition text-left"
        >
          Sign In
        </Link>
      )}
    </div>
  );
};
