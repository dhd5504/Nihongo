import { redirect } from "next/navigation";
import { BottomBar } from "~/components/BottomBar";
import { LeftBar } from "~/components/LeftBar";
import { RightBar } from "~/components/RightBar";
import { TopBar } from "~/components/TopBar";
import { FeedWrapper } from "~/components/feedwrapper";
import { getUnits, getUserProgress } from "~/db/queries";
import { Header } from "~/components/header";
import { Unit } from "~/components/unit";
import { NextPage } from "next";
import { manualParsedCoolies } from "~/utils/JWTService";
import { jwtDecode } from "jwt-decode";

const LearnPage: NextPage = ({ userProgress, units }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />

      <div className="flex flex-1">
        <LeftBar selectedTab="Học" />

        <div className="flex flex-1 items-start justify-center px-6 md:ml-32 lg:ml-64">
          <FeedWrapper>
            <Header title="Tiếng Nhật" />
            {units
              .sort(
                (unitFirst, unitLast) =>
                  unitFirst.displayOrder - unitLast.displayOrder,
              )
              .map(
                (unit: {
                  id: number;
                  order: number;
                  description: string;
                  title: string;
                  lessons: {
                    id: number;
                    order: number;
                    name: string;
                    type: string;
                    status: string;
                  }[];
                }) => {
                  let activeLesson = null;
                  let isFirst = false;
                  let isLast = false;
                  for (let i = 0; i < unit.lessons.length; i++) {
                    if (unit.lessons[i]?.status === "current") {
                      if (i === 0) isFirst = true;
                      if (i === unit.lessons.length - 1) isLast = true;
                      activeLesson = unit.lessons[i];
                      break;
                    }
                  }

                  // const activeLesson = unit.lessons.find(
                  //   (lesson) => lesson.status === "current",
                  // );

                  return (
                    <div key={unit.id} className="mb-10">
                      <Unit
                        id={unit.id}
                        order={unit.order}
                        description={unit.description}
                        title={unit.title}
                        lessons={unit.lessons}
                        activeLesson={
                          activeLesson
                            ? {
                                id: activeLesson.id,
                                unit: { id: unit.id },
                                isFirst: isFirst,
                                isLast: isLast,
                              }
                            : undefined
                        }
                        activeLessonPercentage={userProgress.lessonPercentage}
                      />
                    </div>
                  );
                },
              )}
          </FeedWrapper>
        </div>

        <RightBar />
      </div>

      <BottomBar selectedTab="Học" />
    </div>
  );
};

export default LearnPage;

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

  const [userProgress, units] = await Promise.all([
    getUserProgress(),
    getUnits(jwtPayload.id),
  ]);

  if (!userProgress) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  return {
    props: {
      userProgress,
      units,
    },
  };
}
