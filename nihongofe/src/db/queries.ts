import axios from "axios";

// const API_BASE_URL = "https://nihongo-nhom26-latest.onrender.com";
const API_BASE_URL = "http://localhost:8080";

axios.defaults.withCredentials = true;

export const getPractices = () => {
  return;
};

export const updateProfile = async ({
  userId,
  name,
  phoneNumber,
  password,
}: {
  userId: number;
  name: string;
  phoneNumber: string;
  password: string;
}) => {
  return await axios.put(`${API_BASE_URL}/api/user/update-info`, {
    userId,
    name,
    phoneNumber,
    password,
  });
};

export const getProfile = async (userId: number) => {
  try {
    const response = await axios.get<{
      name: string;
      userXP: number;
      phone: string;
      email: string;
    }>(`${API_BASE_URL}/api/user/info/${userId}`);

    return response.data;
  } catch (error) {
    return {
      name: "",
      userXP: 0,
      phone: "",
      email: "",
    };
  }
};

export const experienceByLevel = async (level: string) => {
  try {
    const response = await axios.get<
      {
        userId: number;
        name: string;
        exp: number;
      }[]
    >(`${API_BASE_URL}/api/user/experience-by-level?level=${level}`);

    return response.data;
  } catch (error) {
    console.error("Error updating right answer:", error);
    return null;
  }
};

export const updateQuestionRightAnswer = async (
  questionId: number,
  userId: number,
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/questions/right-answer?userId=${userId}&questionId=${questionId}&type=MULTIPLE_CHOICE`,
    );

    return response.data;
  } catch (error) {
    console.error("Error updating right answer:", error);
    throw error;
  }
};

export const updateQuestionWrongAnswer = async (
  questionId: number,
  userId: number,
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/questions/wrong-answer?userId=${userId}&questionId=${questionId}&type=MULTIPLE_CHOICE`,
    );
    console.log(response.data.message);
    return response.data;
  } catch (error) {
    console.error("Error updating wrong answer:", error);
    throw error;
  }
};

export const updateStatusLesson = async (lessonId: number, userId: number) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/units/update-status?userId=${userId}&lessonId=${lessonId}`,
    );
  } catch (error) {
    if (error.status === 400) {
      return null;
    }
    console.log("Error updating lesson status:", error);
    throw error;
  }
};

export const getUnits = async (userId: number) => {
  try {
    const response = await axios.get<{
      units: {
        id: number;
        displayOrder: number;
        title: string;
        description: string;
        level: string;
        lessons: {
          id: number;
          order: number;
          name: string;
          type: string;
          status: string;
        }[];
      }[];
    }>(`${API_BASE_URL}/api/units?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching units:", error);
    throw error;
  }
};
export const getLessonById = async (lessonId: number) => {
  const response = await axios.get(`${API_BASE_URL}/lessons/${lessonId}`);
  return response.data;
};

export const getCurrentLesson = async () => {
  const units = await getUnits();
  const currentLesson = units
    .flatMap((unit: { lessons: any[] }) => unit.lessons)
    .find((lesson: { status: string }) => lesson.status === "current");

  if (!currentLesson) return null;
  return await getLessonById(currentLesson.id);
};

export const getPreviousLessons = async () => {
  const units = await getUnits();
  const lessons = units.flatMap((unit: { lessons: any[] }) => unit.lessons);
  const currentLesson = lessons.find(
    (lesson: { status: string }) => lesson.status === "current",
  );
  if (!currentLesson) return [];
  return lessons.filter(
    (lesson: { id: number }) => lesson.id < currentLesson.id,
  );
};

export const getPracticeChallenges = async () => {
  const previousLessons = await getPreviousLessons();
  const challenges = [];
  for (const lesson of previousLessons) {
    const lessonDetails = await getLessonById(lesson.id);
    const incompleteChallenges = lessonDetails.challenges.filter(
      (challenge: { completed: boolean }) => !challenge.completed,
    );
    challenges.push(...incompleteChallenges);
  }

  return challenges;
};

export const isLessonCompleted = async (lessonId: number, userId: number) => {
  const units = await getUnits();
  const lesson = units
    .flatMap((unit: { lessons: any[] }) => unit.lessons)
    .find((lesson: { id: number; status: string }) => lesson.id === lessonId);

  return lesson?.status === "completed" || false;
};

export const getLesson = async (
  lessonId: number,
  userId: number,
  type: string,
) => {
  const response = await axios.get<
    {
      id: number;
      word: string;
      meaning: string;
      question: string;
      completed: boolean;
      challengeOptions: any;
    }[]
  >(`${API_BASE_URL}/api/questions/${lessonId}?userId=${userId}&type=${type}`);

  return response.data;
};

export const getPracticeUnit = async (
  userId: number,
  unitId: number | undefined,
) => {
  if (unitId === undefined) return null;

  const response = await axios.get(
    `${API_BASE_URL}/api/questions/practice-by-unit?userId=${userId}&unitId=${unitId}&type=MULTIPLE_CHOICE`,
  );

  return response.data;
};
export const checkNewUser = async (
  userId: number,
) => {
  const A = 36;
  const response = await axios.get(
    `${API_BASE_URL}/api/user/check-new-user/${userId}`,
  );

  return response.data;
};
export const setUserLevel = async (
  userId: number,
  level: string,
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/units/set-level?userId=${userId}&level=${level}`,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error; // Re-throw the error after logging it
  }
};
export const getUserProgress = async () => {
  // const response = await axios.get(`${API_BASE_URL}/user-progress`);
  // return response.data;

  return {
    points: 10,
    lessonPercentage: 100,
  };
};

export const signup = async ({
  age,
  username,
  email,
  password,
}: {
  age: string;
  username: string;
  email: string;
  password: string;
}) => {
  const response = await axios.post(`${API_BASE_URL}/account/signup`, {
    username,
    email,
    password,
    firstName: age,
  });
  return response.data;
};

export const signin = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  const response = await axios.post<{
    jwt: string;
  }>(`${API_BASE_URL}/account/login`, {
    username,
    password,
  });
  return response.data;
};
