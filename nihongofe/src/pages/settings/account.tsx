import { jwtDecode } from "jwt-decode";
import type { GetServerSidePropsContext, NextPage } from "next";
import { useState } from "react";
import { BottomBar } from "~/components/BottomBar";
import { LeftBar } from "~/components/LeftBar";
import { SettingsRightNav } from "~/components/SettingsRightNav";
import { TopBar } from "~/components/TopBar";
import { getProfile, updateProfile } from "~/db/queries";
import { getIdUserByToken, manualParsedCoolies } from "~/utils/JWTService";
import { UserData } from "../profile";
import { useToast } from "~/context/toast";
import Fetching from "~/components/Fetching";
import { useRouter } from "next/router";
import React from "react";
import { useWalletStore } from "~/stores/useWalletStore";
import { getShopContract } from "~/utils/contracts";

const Account: NextPage<{
  profile: UserData;
}> = ({ profile }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<{
    name: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
  }>({
    name: profile.name,
    phoneNumber: profile.phone,
    password: "",
    confirmPassword: "",
  });

  const { addToast } = useToast();

  const handleSave = async () => {
    if (form.password !== form.confirmPassword) {
      addToast("Confirm password and new password are not same", "error");
      return;
    }

    try {
      setLoading(true);

      const userId = getIdUserByToken();
      await updateProfile({
        userId: Number(userId),
        ...form,
      });
      addToast("success", "success");
      await router.push("/profile");
    } catch (error) {
      addToast(String(error), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <Fetching />}
      <TopBar />
      <LeftBar selectedTab={null} />
      <BottomBar selectedTab={null} />
      <div className="mx-auto flex flex-col gap-5 px-4 py-20 sm:py-10 md:pl-28 lg:pl-72">
        <div className="mx-auto flex w-full max-w-xl items-center justify-between lg:max-w-4xl">
          <h1 className="text-lg font-bold text-gray-800 sm:text-2xl">
            Tài khoản
          </h1>
          <button
            className="rounded-2xl border-b-4 border-green-600 bg-green-500 px-5 py-3 font-bold uppercase text-white transition hover:brightness-110 disabled:border-b-0 disabled:bg-gray-200 disabled:text-gray-400 disabled:hover:brightness-100"
            onClick={() => {
              handleSave();
            }}
            disabled={form.name === "" || form.phoneNumber === ""}
          >
            Lưu
          </button>
        </div>
        <div className="flex justify-center gap-12">
          <div className="flex w-full max-w-xl flex-col gap-8">
            <div className="flex flex-col items-stretch justify-between gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-10 sm:pl-10">
              <div className="font-bold sm:w-2/6">Name</div>
              <input
                className="grow rounded-2xl border-2 border-gray-200 p-4 py-2"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex flex-col items-stretch justify-between gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-10 sm:pl-10">
              <div className="font-bold sm:w-2/6">Phone</div>
              <input
                className="grow rounded-2xl border-2 border-gray-200 p-4 py-2"
                value={form.phoneNumber}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phoneNumber: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex flex-col items-stretch justify-between gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-10 sm:pl-10">
              <div className="font-bold sm:w-2/6">New Password</div>
              <input
                className="grow rounded-2xl border-2 border-gray-200 p-4 py-2"
                value={form.password}
                placeholder="Mật khẩu "
                type="password"
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex flex-col items-stretch justify-between gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-10 sm:pl-10">
              <div className="font-bold sm:w-2/6">Confirm Password</div>
              <input
                className="grow rounded-2xl border-2 border-gray-200 p-4 py-2"
                value={form.confirmPassword}
                placeholder="Mật khẩu "
                type="password"
                onChange={(e) =>
                  setForm({
                    ...form,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </div>
            {/* Avatar Frames Selection */}
            <div className="border-t-2 border-gray-100 pt-10 mt-5">
              <h2 className="mb-5 text-xl font-bold">Avatar Frames</h2>
              <AvatarFramesSelector />
            </div>

          </div>
          <SettingsRightNav selectedTab="Tài khoản" />
        </div>
      </div>
    </div>
  );
};

const AvatarFramesSelector = () => {
  const { walletAddress, provider } = useWalletStore();
  const [ownedItems, setOwnedItems] = React.useState<Set<number>>(new Set());
  const [selectedFrame, setSelectedFrame] = React.useState<number>(0);

  const ITEMS = [
    { id: 1, name: "Frame 1", img: "/avatar-frames/frame-1.svg" },
    { id: 2, name: "Frame 2", img: "/avatar-frames/frame-2.svg" },
    { id: 3, name: "Frame 3", img: "/avatar-frames/frame-3.svg" },
    { id: 4, name: "Frame 4", img: "/avatar-frames/frame-4.svg" },
  ];

  React.useEffect(() => {
    const saved = localStorage.getItem("selectedFrame");
    if (saved) setSelectedFrame(Number(saved));
  }, []);

  React.useEffect(() => {
    const checkOwnership = async () => {
      if (!walletAddress || !provider) return;
      try {
        const shop = await getShopContract(provider);
        if (!shop || typeof shop.hasPurchased !== "function") {
          return;
        }
        const owned = new Set<number>();
        for (const item of ITEMS) {
          const hasPurchased = await shop.hasPurchased(walletAddress, item.id);
          if (hasPurchased) owned.add(item.id);
        }
        setOwnedItems(owned);
      } catch (err) {
        console.error(err);
      }
    };
    checkOwnership();
  }, [walletAddress, provider]);

  const handleSelect = (id: number) => {
    setSelectedFrame(id);
    localStorage.setItem("selectedFrame", String(id));
  };

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {/* None Option */}
      <div
        onClick={() => handleSelect(0)}
        className={`cursor-pointer rounded-xl border-2 p-2 flex flex-col items-center gap-2 transition hover:bg-gray-50
                    ${selectedFrame === 0 ? "border-green-500 bg-green-50" : "border-gray-200"}`}
      >
        <div className="h-16 w-16 rounded-full bg-gray-200"></div>
        <span className="text-sm font-bold">None</span>
      </div>

      {ITEMS.map(item => (
        <div
          key={item.id}
          onClick={() => ownedItems.has(item.id) && handleSelect(item.id)}
          className={`relative rounded-xl border-2 p-2 flex flex-col items-center gap-2 transition 
                        ${selectedFrame === item.id ? "border-green-500 bg-green-50" : "border-gray-200"}
                        ${!ownedItems.has(item.id) ? "opacity-50 cursor-not-allowed grayscale" : "cursor-pointer hover:bg-gray-50"}
                    `}
        >
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 rounded-full bg-gray-200"></div>
            <img src={item.img} className="absolute -left-2 -top-2 h-20 w-20 max-w-none" />
          </div>
          <span className="text-sm font-bold">{item.name}</span>
          {!ownedItems.has(item.id) && <span className="text-xs text-red-500 font-bold">LOCKED</span>}
        </div>
      ))}
    </div>
  );
};

export default Account;

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
  const cookies = String(req?.headers?.cookie ?? "");

  const parsedCookies = manualParsedCoolies(cookies);

  const myCookie = parsedCookies["token"] || null;

  if (!myCookie) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  const jwtPayload = jwtDecode<{
    id: number;
  }>(myCookie);

  const profile = await getProfile(jwtPayload.id);

  return {
    props: { profile },
  };
}
