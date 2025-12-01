import { FeedWrapper } from "~/components/feedwrapper";
import { getPracticeUnit, getUnits } from "~/db/queries";
import { Header } from "~/components/header";
import { UnitBanner } from "~/components/unit-banner";
import { Quiz } from "~/lesson/quiz";
import { BottomBar } from "~/components/BottomBar";
import { LeftBar } from "~/components/LeftBar";
import { RightBar } from "~/components/RightBar";
import { TopBar } from "~/components/TopBar";
import { NextPage } from "next";
import { manualParsedCoolies } from "~/utils/JWTService";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";

type Props = {
  children: React.ReactNode;
};

const PracticeLayout = ({ children }: Props) => {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />

      <div className="flex flex-1">
        <LeftBar selectedTab="Luyện tập" />

        <div className="flex flex-1 justify-center">{children}</div>

        <RightBar />
      </div>

      <BottomBar selectedTab="Luyện tập" />
    </div>
  );
};

const PracticePage: NextPage = ({ practiceLessons, practices, unitId }) => {
  if (practiceLessons) {
    return (
      <PracticeLayout>
        <div className="flex flex-1 flex-col md:ml-32 lg:ml-64">
          {practiceLessons.length === 0 ? (
            <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
              <div className="text-center">
                <p className="text-5xl font-medium text-gray-600">
                  Oops! Trang này chưa khả dụng
                </p>
                <p className="mt-4 text-gray-500">
                  Có vẻ bạn đã hoàn thành hoặc chưa đến phần này!
                </p>
                <div className="mt-6">
                  <Link
                    href="/practice"
                    className="rounded-lg bg-blue-500 px-6 py-2 text-white transition hover:bg-blue-600"
                  >
                    Go to Practice
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <Quiz
              initialLessonId={Number(unitId)}
              initialLessonChallenges={practiceLessons.map((challenge) => ({
                ...challenge,
                id: Number(challenge.id),
                challengeId: Number(challenge.id),
                challengeOptions: challenge.challengeOptions.map((option) => ({
                  ...option,
                  challengeId: Number(challenge.id),
                })),
              }))}
              initialPercentage={
                (practiceLessons.filter(
                  (challenge: { completed: boolean }) => challenge.completed,
                ).length /
                  practiceLessons.length) *
                100
              }
              isPractice={true}
            />
          )}
        </div>
      </PracticeLayout>
    );
  }

  return (
    <PracticeLayout>
      <div className="flex w-full flex-row-reverse gap-[48px] px-6 md:ml-32 lg:ml-64">
        <FeedWrapper>
          <Header title="Japanese" />
          <div className="flex flex-col gap-3">
            {practices.map((practice) => (
              <UnitBanner
                key={practice.id}
                title={practice.title}
                description={practice.description}
                activeLessonId={practice.id}
                isPractice
              />
            ))}
          </div>
        </FeedWrapper>
      </div>
    </PracticeLayout>
  );
};

export default PracticePage;

export async function getServerSideProps({ query, req }) {
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

  const { unitId } = query; // Access searchParams

  if (unitId) {
    const practiceLessons = await getPracticeUnit(
      jwtPayload.id,
      Number(unitId.toString()),
    );

    return {
      props: {
        practiceLessons,
        practices: null,
        unitId,
      },
    };
  }

  const practices = await getUnits(jwtPayload.id);

  return {
    props: {
      practiceLessons: null,
      practices,
      unitId: null,
    },
  };
}
