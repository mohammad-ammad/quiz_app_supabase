import React, { useEffect, useState,useContext } from "react";
import { Spinner, TextInput } from "flowbite-react";
import { IoIosSearch } from "react-icons/io";
import QuizProgressCard from "../components/QuizProgressCard";
import { supabase } from "../utils/config";
import { useParams } from "react-router-dom";
import GlobalContext from '../context/GlobalContext'
import LoginModal from "../components/LoginModal";

const Quiz = () => {
  const { openModal, setOpenModal,session, logout} = useContext(GlobalContext)
  const { quiz_id } = useParams();
  const [quizes, setQuizes] = useState([]);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [subquizesid, setsubquizesid] = useState(0);
  const [loading, setLoading] = useState(false);
  const [percentquestion,setpercentquestion] = useState(0);
 

  const fetchQuizes = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      console.log(error);
      setLoading(false);
      return;
    }

    const { user } = data;

    const { data: subQuizes, error: subQuizesError } = await supabase
      .from("sub_quizes")
      .select("*")
      .eq("quizes_id", quiz_id);

    if (subQuizesError) {
      console.log("subQuizesError", subQuizesError);
      setLoading(false);
      return;
    }

    const { data: quizStats, error: quizStatsError } = await supabase
      .from("quiz_progress")
      .select("*")
      .eq("user_id", user.id)
      .in(
        "sub_quiz_id",
        subQuizes.map((subQuiz) => subQuiz.id)
      );

    if (quizStatsError) {
      console.log("quizStatsError", quizStatsError);
      setLoading(false);
      return;
    }








    // find total count of questions 
    const totalQuestions = await supabase
      .from("questions")
      .select("*")
      .in(
        "sub_quiz_id",
        subQuizes.map((subQuiz) => subQuiz.id)
      );

    const quizes = subQuizes.map((subQuiz) => {
      const stats = quizStats.find((stat) => stat.sub_quiz_id === subQuiz.id);
      const _totalQuestions = totalQuestions.data.filter(question => question.sub_quiz_id === subQuiz.id).length;
      return { ...subQuiz, stats, _totalQuestions };
    });

    setQuizes(quizes);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuizes();
  }, [quiz_id]);


useEffect(() => {
  fetchBookmarkCount();
}, []);


useEffect(() => {
  fetchTotalQuestionAttempt();
}, []);
// useEffect(() => {
//   fetchTotalQuestionAttempts();
// }, []);



const fetchBookmarkCount = async () => {
  const { data, error } = await supabase.auth.refreshSession();
  if (error) {
    console.error(error);
    return;
  }

  const { user } = data;

  // Fetch bookmarked questions for the current user from Supabase
  const { data: bookmarkedData, error: bookmarkedError } = await supabase
    .from("question_bookmarks")
    .select("question_id")
    .eq("user_id", user.id);

  if (bookmarkedError) {
    console.error(bookmarkedError);
    return;
  }

  // Extract question_ids from the bookmarkedData
  const questionIds = bookmarkedData.map((item) => item.question_id);
  // Check if there are any bookmarked questions
  if (questionIds.length === 0) {
    console.log("No bookmarked questions for the user.");
    return;
  }

  // Fetch sub_quiz_id for each question_id
  const { data: titlesData, error: titlesError } = await supabase
    .from("questions")
    .select("sub_quiz_id")
    .in("id", questionIds);

  if (titlesError) {
    console.error(titlesError);
    return;
  }

 
const sub_quiz_id = titlesData.map((item) => item.sub_quiz_id);
setsubquizesid(sub_quiz_id);
const bookmarkCount = sub_quiz_id.length
setBookmarkCount(bookmarkCount);
};


const fetchTotalQuestionAttempt = async () => {
  const { data, error } = await supabase.auth.refreshSession();
  if (error) {
    console.error(error);
    return;
  }

  const { user } = data;

  // Fetch total_question_attempt for the current user from Supabase
  const { data: totalAttemptData, error: totalAttemptError } = await supabase
    .from("quiz_progress")
    .select("total_question_attempt")
    .eq("user_id", user.id);

  if (totalAttemptError) {
    console.error(totalAttemptError);
    return;
  }

  // Extract total_question_attempt value
  const totalQuestionAttempt = totalAttemptData[0]?.total_question_attempt || 0;
  console.log("Total Question Attempt:", totalQuestionAttempt);

    // Fetch total_question_attempt for the current user from Supabase
    const { data: totalquestionAttemptData, error: totalquestionAttemptError } = await supabase
    .from("questions")
    .select("question")
  if (totalAttemptError) {
    console.error(totalquestionAttemptError);
    return;
  }

  // Extract total_question_attempt value
  const totalQuestionAttempts = totalquestionAttemptData.length || 0;
  console.log("Total Questions :", totalQuestionAttempts);

  const percentquestionsattempt = (totalQuestionAttempt/totalQuestionAttempts)*100;
  setpercentquestion(percentquestionsattempt);
  console.log("percent is ", percentquestionsattempt);
};
// const fetchTotalQuestionAttempts = async () => {
//   const { data, error } = await supabase.auth.refreshSession();
//   if (error) {
//     console.error(error);
//     return;
//   }

//   const { user } = data;

//   // Fetch total_question_attempt for the current user from Supabase
//   const { data: totalAttemptData, error: totalAttemptError } = await supabase
//     .from("questions")
//     .select("question")
   

//   if (totalAttemptError) {
//     console.error(totalAttemptError);
//     return;
//   }

//   // Extract total_question_attempt value
//   const totalQuestionAttempt = totalAttemptData.length || 0;
//   console.log("Total Questions :", totalQuestionAttempt);
// };


  return (
  
    <div className="pt-10 px-5 md:px-28">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-[30px] font-bold">Quiz View</h1>
        <div className="py-5 md:py-0">
          <TextInput
            id="search"
            type="text"
            rightIcon={IoIosSearch}
            placeholder="search"
            required
          />
        </div>
      </div>
      {loading ? (
        <div className="text-center mt-10">
          <Spinner color="purple" aria-label="Center-aligned spinner example" />
        </div>
      ) : (
        <div className="my-5">
{quizes.length > 0 ? (
  quizes.map((quiz, index) => {
    const isMatched = Array.isArray(subquizesid) && subquizesid.includes(quiz.id);
    return (
      <QuizProgressCard data={quiz} key={index} bookmarkCount={isMatched ? bookmarkCount : 0} percentquestion= {percentquestion} />
    );
  })

          ) : (
            <div className="text-center py-5">No quiz found</div>
          )}
        </div>
      )}
  <LoginModal/>
    </div>
  );
};

export default Quiz;
