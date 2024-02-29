import React, { useEffect, useState, useContext } from "react";
import { Spinner, TextInput } from "flowbite-react";
import { IoIosSearch } from "react-icons/io";
import QuizProgressCard from "../components/QuizProgressCard";
import { supabase } from "../utils/config";
import { useParams } from "react-router-dom";
import GlobalContext from "../context/GlobalContext";
import LoginModal from "../components/LoginModal";
import toast from "react-hot-toast";

const Quiz = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { openModal, setOpenModal } =
    useContext(GlobalContext);
  const { quiz_id } = useParams();
  const [quizes, setQuizes] = useState([]);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [subquizesid, setsubquizesid] = useState(0);
  const [loading, setLoading] = useState(false);
  const [falsecount, setfalsecount] = useState('');
  const [truecount, settruecount] = useState('');
  // const [percentquestion, setpercentquestion] = useState(0);
  const [upvoteLoading, setUpvoteLoading] = useState({});

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

    // find total upvotes for each sub_quiz
    const totalUpvotes = await supabase
      .from("sub_quiz_upvotes")
      .select("sub_quiz_id")
      .in(
        "sub_quiz_id",
        subQuizes.map((subQuiz) => subQuiz.id)
      );

    const quizes = subQuizes.map((subQuiz) => {
      const stats = quizStats.find((stat) => stat.sub_quiz_id === subQuiz.id);
      const _totalQuestions = totalQuestions.data.filter(
        (question) => question.sub_quiz_id === subQuiz.id
      ).length;
      const _totalUpvotes = totalUpvotes.data.filter(
        (upvote) => upvote.sub_quiz_id === subQuiz.id
      ).length;
      return { ...subQuiz, stats, _totalQuestions, _totalUpvotes };
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

  // useEffect(() => {
  //   fetchTotalQuestionAttempt();
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
    const bookmarkCount = sub_quiz_id.length;
    setBookmarkCount(bookmarkCount);
  };


  // const fetchTotalQuestionAttempt = async () => {
  //   try {
  //     const { data, error } = await supabase.auth.refreshSession();
  //     if (error) {
  //       console.error(error);
  //       return;
  //     }
  
  //     const { user } = data;
  
  //     // Fetch sub_quiz_id data based on user_id
  //     const { data: subQuizIdData, error: subQuizError } = await supabase
  //       .from("quiz_progress")
  //       .select("sub_quiz_id")
  //       .eq("user_id", user.id);
  
  //     if (subQuizError) {
  //       console.error(subQuizError);
  //       return;
  //     }

  //     console.log("subQuizIdData", subQuizIdData);
  
  //     // Extract sub_quiz_id values
  //     const subQuizIds = subQuizIdData.map((item) => item.sub_quiz_id);
  
  //     // Fetch sub_quiz data based on sub_quiz_id
  //     const { data: subQuizData, error: subQuizDataError } = await supabase
  //       .from("sub_quizes")
  //       .select("id")
  //       .in("id", subQuizIds);
  
  //     const matchedCardId = subQuizData[0]?.id;
  
  //     if (subQuizDataError) {
  //       console.error(subQuizDataError);
  //       return;
  //     }
  
  //     // Fetch total_question_attempt for the current user from Supabase
  //     const { data: totalAttemptData, error: totalAttemptError } = await supabase
  //       .from("quiz_progress")
  //       .select("total_question_attempt")
  //       .eq("user_id", user.id);
  
  //     if (totalAttemptError) {
  //       console.error(totalAttemptError);
  //       return;
  //     }
  
  //     // Extract total_question_attempt value
  //     const totalQuestionAttempt =
  //       totalAttemptData[0]?.total_question_attempt || 0;
  
  //     // Fetch total_question_attempt for the current user from Supabase
  //     const { data: totalquestionAttemptData, error: totalquestionAttemptError } =
  //       await supabase.from("questions").select("question");
  
  //     if (totalAttemptError) {
  //       console.error(totalquestionAttemptError);
  //       return;
  //     }
  
  //     // Extract total_question_attempt value
  //     const totalQuestionAttempts = totalquestionAttemptData.length || 0;
    
  
  //     const percentquestionsattempt =
  //       (totalQuestionAttempt / totalQuestionAttempts) * 100;
  
  //     // Set progress for the matched card
  //     setpercentquestion((prevPercentQuestion) => ({
  //       ...prevPercentQuestion,
  //       [matchedCardId]: percentquestionsattempt,
  //     }));
  
  //     console.log("percent is ", percentquestionsattempt);
  //   } catch (error) {
  //     console.error("Unexpected error:", error);
  //   }
  // };


  const quizUpVoteHandler = async (sub_quiz_id) => {
    setUpvoteLoading(prevLoading => ({
      ...prevLoading,
      [sub_quiz_id]: true
    }));

    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      console.error(error);
      setUpvoteLoading(prevLoading => ({
        ...prevLoading,
        [sub_quiz_id]: false
      }));
      return;
    }

    const { user } = data;

    // check if record exists in sub_quiz_upvotes wrt to user_id and sub_quiz_id
    const { data: subQuizUpvotes, error: subQuizUpvotesError } = await supabase
      .from("sub_quiz_upvotes")
      .select("*")
      .eq("user_id", user.id)
      .eq("sub_quiz_id", sub_quiz_id);

    if (subQuizUpvotesError) {
      console.error(subQuizUpvotesError);
      setUpvoteLoading(prevLoading => ({
        ...prevLoading,
        [sub_quiz_id]: false
      }));
      return;
    }

    // if record exists, then delete it
    if (subQuizUpvotes.length > 0) {
      const { error: deleteError } = await supabase
        .from("sub_quiz_upvotes")
        .delete()
        .eq("user_id", user.id)
        .eq("sub_quiz_id", sub_quiz_id);

      if (deleteError) {
        console.error(deleteError);
        setUpvoteLoading(prevLoading => ({
          ...prevLoading,
          [sub_quiz_id]: false
        }));
        return;
      }
    } else {
      // else insert a new record
      const { error: insertError } = await supabase
        .from("sub_quiz_upvotes")
        .insert([{ user_id: user.id, sub_quiz_id }]);

      if (insertError) {
        console.error(insertError);
        setUpvoteLoading(prevLoading => ({
          ...prevLoading,
          [sub_quiz_id]: false
        }));
        return;
      }
    }

    toast.success(`Upvote ${subQuizUpvotes.length > 0 ? "removed" : "added"}`);

    // update the state
    setQuizes((prevQuizes) => {
      return prevQuizes.map((prevQuiz) => {
        if (prevQuiz.id === sub_quiz_id) {
          return {
            ...prevQuiz,
            _totalUpvotes:
              subQuizUpvotes.length > 0
                ? prevQuiz._totalUpvotes - 1
                : prevQuiz._totalUpvotes + 1,
          };
        }
        return prevQuiz;
      });
    });

    setUpvoteLoading(prevLoading => ({
      ...prevLoading,
      [sub_quiz_id]: false
    }));
  };


  const filteredquizes = quizes.filter((quiz) =>
  quiz.quiz_title.toLowerCase().includes(searchQuery.toLowerCase())
);

  const handleSearch = (event) => {
    console.log(event)
    setSearchQuery(event.target.value);
  };

  const correctfalse = async () => {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      console.log(error);
      return;
    }

    const { user } = data;

    const { data: questions} = await supabase
    .from("questions")
    .select("id")
    
    const question = questions.map((item)=> item.id)
    
    
    const { data: correctFalseCount, error: correctFalseError } = await supabase
    .from("attempted_questions")
    .select("is_correct")
    .in("question_id",question);
    console.log(correctFalseCount)
    
// const getcount = correctFalseCount.filter((item)=> item.is_correct === true).length
// const getcountfalse = correctFalseCount.filter((item)=> item.is_correct === false).length
setfalsecount(getcountfalse);
settruecount(getcount);
console.log(getcountfalse);

  if (correctFalseError) {
    console.log(correctFalseError);
    setLoading(false);
    return;
  }

    
  }
  useEffect(() => {
correctfalse();
  },[])

  return (
    <div className="pt-10 px-5 md:px-28">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-[30px] font-bold"></h1>
        <div className="py-5 md:py-0">
          <TextInput
            id="search"
            type="text"
            rightIcon={IoIosSearch}
            placeholder="search"
            // value={searchQuery}
             onChange={handleSearch}
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
          {filteredquizes.length > 0 ? (
            filteredquizes.map((quiz, index) => {
              const isMatched =
                Array.isArray(subquizesid) && subquizesid.includes(quiz.id);
              return (
                <QuizProgressCard
                falsecount = {falsecount}
                truecount = {truecount}
                  data={quiz}
                  key={index}
                  bookmarkCount={isMatched ? bookmarkCount : 0}
                  quizUpVoteHandler={quizUpVoteHandler}
                  upvoteLoading={upvoteLoading[quiz.id] || false}
                />
              );
            })
          ) : (
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-6 sm:gap-y-0">
             <div className="text-center p-3">No quiz found 
             </div>
          </div>
          )}
        </div>
      )}
      <LoginModal />
    </div>
  );
};

export default Quiz;
