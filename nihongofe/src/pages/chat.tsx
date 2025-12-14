import { NextPage } from "next";
import { BottomBar } from "~/components/BottomBar";
import { LeftBar } from "~/components/LeftBar";
import { RightBar } from "~/components/RightBar";
import { TopBar } from "~/components/TopBar";

const ChatPage: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <div className="flex flex-1">
        <LeftBar selectedTab={null} />
        <main className="flex flex-1 flex-col items-center justify-center px-6 md:ml-32 lg:ml-64">
          <div className="w-full max-w-3xl rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-sm">
            <h1 className="mb-4 text-2xl font-bold text-gray-800">
              Chat Bot AI
            </h1>
            <p className="text-gray-500">
              Tính năng chatbot đang được phát triển. Vui lòng quay lại sau.
            </p>
          </div>
        </main>
        <RightBar />
      </div>
      <BottomBar selectedTab={null} />
    </div>
  );
};

export default ChatPage;
