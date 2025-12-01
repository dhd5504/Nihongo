import { jwtDecode } from "jwt-decode";
import type { NextPage } from "next";
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
          </div>
          <SettingsRightNav selectedTab="Tài khoản" />
        </div>
      </div>
    </div>
  );
};

export default Account;

export async function getServerSideProps({ req }) {
  const cookies = String(req?.headers?.cookie) ?? "";

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
