import {
  Button,
  Card,
  Pagination,
  Spinner,
  TextInput,
  Tooltip,
} from "flowbite-react";
import React, { useContext, useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { CiBookmark } from "react-icons/ci";
import { GrHide } from "react-icons/gr";
import { AiOutlineThunderbolt } from "react-icons/ai";
import QuizModal from "../components/QuizModal";
import GlobalContext from "../context/GlobalContext";
import { useParams } from "react-router-dom";
import { supabase } from "../utils/config";


const AttemptQuiz = () => { 

  const { sub_quiz_id } = useParams();
  const [isAnswerSelected, setIsAnswerSelected] = useState(false);

  const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
  
  // fbsdjhfbjdsf
  useEffect(() => {
  
    fetchBookmarkedQuestions();
  }, []);
  const fetchBookmarkedQuestions = async () => {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      console.log(error);
      return;
    }

    const { user } = data;

    // Fetch bookmarked questions for the current user from Supabase
    const { data: bookmarkedData, error: bookmarkedError } = await supabase
      .from("question_bookmarks")
      .select("question_id")
      .eq("user_id", user.id);

    if (bookmarkedError) {
      console.log(bookmarkedError);
      return;
    }

    // Update state with bookmarked questions
    setBookmarkedQuestions(bookmarkedData.map((entry) => entry.question_id));
  };

  const handleBookmarkClick = async (questionId) => {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      console.log(error);
      return;
    }

    const { user } = data;

    // Check if the question is already bookmarked
    const isBookmarked = bookmarkedQuestions.includes(questionId);

    if (isBookmarked) {
      // If bookmarked, remove it from bookmarks
      const { error: removeBookmarkError } = await supabase
        .from("question_bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("question_id", questionId);

      if (removeBookmarkError) {
        console.log(removeBookmarkError);
        return;
      }

      // Update state to remove the question from bookmarkedQuestions
      setBookmarkedQuestions((prevBookmarks) =>
        prevBookmarks.filter((id) => id !== questionId)
      );
    } else {
      // If not bookmarked, add it to bookmarks
      const { error: addBookmarkError } = await supabase
        .from("question_bookmarks")
        .insert([
          {
            user_id: user.id,
            question_id: questionId,
          },
        ]);

      if (addBookmarkError) {
        console.log(addBookmarkError);
        return;
      }

      // Update state to add the question to bookmarkedQuestions
      setBookmarkedQuestions((prevBookmarks) => [...prevBookmarks, questionId]);
    }
  };


  
  // const handleBookmarkClick = async (questionId) => {
  //   const { data, error } = await supabase.auth.refreshSession();
  //   if (error) {
  //     console.log(error);
  //     return;
  //   }

  //   const { user } = data;

  //   // Check if the question is already bookmarked
  //   const isBookmarked = await supabase
  //     .from("question_bookmarks")
  //     .select("*")
  //     .eq("user_id", user.id)
  //     .eq("question_id", questionId);

  //   if (isBookmarked.data.length > 0) {
  //     // If bookmarked, remove it from bookmarks
  //     const { error: removeBookmarkError } = await supabase
  //       .from("question_bookmarks")
  //       .delete()
  //       .eq("user_id", user.id)
  //       .eq("question_id", questionId);

  //     if (removeBookmarkError) {
  //       console.log(removeBookmarkError);
  //       return;
  //     }

  //     // Update state to remove the question from bookmarkedQuestions
  //     setBookmarkedQuestions((prevBookmarks) =>
  //       prevBookmarks.filter((id) => id !== questionId)
  //     );
  //   } else {
  //     // If not bookmarked, add it to bookmarks
  //     const { error: addBookmarkError } = await supabase
  //       .from("question_bookmarks")
  //       .insert([
  //         {
  //           user_id: user.id,
  //           question_id: questionId,
  //         },
  //       ]);

  //     if (addBookmarkError) {
  //       console.log(addBookmarkError);
  //       return;
  //     }

  //     // Update state to add the question to bookmarkedQuestions
  //     setBookmarkedQuestions((prevBookmarks) => [...prevBookmarks, questionId]);
  //   }
  // };

  
  
  


// hjdsfjhdsbfj
  const { setOpenQuizAnswerModal } = useContext(GlobalContext);

  const [isAnswer, setIsAnswer] = useState({
    question_no: "",
    question: "",
    allChoices: [],
  });

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAnswer = (question_no, question, choices) => {
    setOpenQuizAnswerModal(true);
    setIsAnswer({
      question_no,
      question,
      allChoices: choices,
    });
  };

  const fetchQuestions = async () => {
    setLoading(true);
    const { data: questionData, error } = await supabase
      .from("questions")
      .select("*")
      .eq("sub_quiz_id", sub_quiz_id)
      .order("created_at", { ascending: true });

    if (error) {
      console.log(error);
      setLoading(false);
      return;
    }

    const { data, error: userError } = await supabase.auth.refreshSession();

    if (userError) {
      console.log(userError);
      setLoading(false);
      return;
    }

    const { user } = data;

    const questionsWithUserAnswers = [];

    for (const question of questionData) {
      const { data: userAnswers, error: userAnswersError } = await supabase
        .from("attempted_questions")
        .select("user_answer, is_correct")
        .eq("question_id", question.id)
        .eq("user_id", user.id);

      if (userAnswersError) {
        console.log(userAnswersError);
        setLoading(false);
        return;
      }

      console.log(userAnswers);

      const userAnswer =
        userAnswers.length > 0 ? userAnswers[0].user_answer : null;
      const userAnswerIsCorrect =
        userAnswers.length > 0 ? userAnswers[0].is_correct : false;

      const questionWithUserAnswer = {
        ...question,
        user_answer: userAnswer,
        user_answer_is_correct: userAnswerIsCorrect,
      };

      questionsWithUserAnswers.push(questionWithUserAnswer);
    }

    setQuestions(questionsWithUserAnswers);
    setLoading(false);
  };

  const addUserAnswer = async (question_id, choice_id, correct_ans, sub_quiz_id) => {
    setQuestions((prev) => {
      return prev.map((question) => {
        if (question.id === question_id) {
          return {
            ...question,
            user_answer: choice_id,
            user_answer_is_correct: correct_ans,
          };
        }
        return question;
      });
    });
    

    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      console.log(error);
      return;
    }

    const { user } = data;

    const { error: userAnswerError } = await supabase
      .from("attempted_questions")
      .insert([
        {
          user_id: user.id,
          question_id,
          user_answer: choice_id,
          is_correct: correct_ans,
        },
      ]);

    if (userAnswerError) {
      console.log(userAnswerError);
      return;
    }


    // check if quiz progress exists then update else insert

    const { data: quizProgress, error: quizProgressError } = await supabase
      .from("quiz_progress")
      .select("*")
      .eq("user_id", user.id)
      .eq("sub_quiz_id", sub_quiz_id);

    if (quizProgressError) {
      console.log(quizProgressError);
      return;
    }

    if (quizProgress.length > 0) {
      const { error: updateQuizProgressError } = await supabase
        .from("quiz_progress")
        .update({
          user_id: user.id,
          sub_quiz_id,
          total_question_attempt: quizProgress[0].total_question_attempt + 1,
          total_correct: correct_ans
            ? quizProgress[0].total_correct + 1
            : quizProgress[0].total_correct,
          total_incorrect: !correct_ans ? quizProgress[0].total_incorrect + 1 : quizProgress[0].total_incorrect,
          quiz_progress: quizProgress[0].quiz_progress + 10,
        })
        .eq("user_id", user.id)
        .eq("sub_quiz_id", sub_quiz_id);

      if (updateQuizProgressError) {
        console.log(updateQuizProgressError);
        return;
      }
    } else {  
      const { error: insertQuizProgressError } = await supabase
        .from("quiz_progress")
        .insert([
          {
            user_id: user.id,
            sub_quiz_id,
            total_question_attempt: 1,
            total_correct: correct_ans ? 1 : 0,
            total_incorrect: !correct_ans ? 1 : 0,
            quiz_progress: 10,
          },
        ]);

      if (insertQuizProgressError) {
        console.log(insertQuizProgressError);
        return;
      }
    }

  };

  useEffect(() => {
    fetchQuestions();
  }, [sub_quiz_id]);

  return (
    
    <>
    
      <div className="pt-10 px-5 md:px-28">
        <div className="float-end mb-10">
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
          <div className="text-center my-20">
            <Spinner
              color="purple"
              aria-label="Center-aligned spinner example"
            />
          </div>
        ) : questions.length > 0 ? (
          questions.map((question, index) => (
            <div className="my-5">
              <Card className="min-w-full">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div>
                    <h1 className="text-xl font-semibold my-2">
                      Question {index + 1}
                    </h1>
                    <p className="text-sm text-gray-500">{question.question}</p>
                  </div>
                  <div className="flex justify-start items-start gap-2 my-2 md:my-0">
                    <Tooltip content={bookmarkedQuestions.includes(question.id) ? 'Bookmarked' : 'Bookmark'}>
                    <Button
                    className={bookmarkedQuestions.includes(question.id) ? 'bg-indigo-600' : '' }
                    color="light"
                    onClick={() => handleBookmarkClick(question.id)}
                  >
                    <CiBookmark size={25} className={bookmarkedQuestions.includes(question.id) ? 'text-white' : ''} />
                  </Button>
                    </Tooltip>
                    <Tooltip content="Answer">
                      <Button
                        color="light"
                        onClick={() =>
                          handleAnswer(
                            `Question ${index + 1}`,
                            question.question,
                            question.choices
                          )
                        }
                      >
                        <GrHide size={25} />
                      </Button>
                    </Tooltip>
                    <Tooltip content="333 votes as HY Question">
                      <Button color="light">
                        <AiOutlineThunderbolt size={25} />
                      </Button>
                    </Tooltip>
                  </div>
                </div>
                <div>
                  {question.choices.map((choice, _index) => (
                 <Button
                 color={
                   question.user_answer === choice.c_id &&
                   question.user_answer_is_correct
                     ? ""
                     : question.user_answer === choice.c_id &&
                       !question.user_answer_is_correct
                     ? ""
                     : ""
                 }
                 className={`w-full flex justify-start items-center my-2  ${
                   question.user_answer === choice.c_id &&
                   question.user_answer_is_correct
                     ? "bg-green-300 text-green-600"
                     : question.user_answer === choice.c_id &&
                       !question.user_answer_is_correct
                     ? "bg-red-100 text-red-600"
                     : ""
                 }`}
                 rounded
                 key={_index}
                 onClick={() => {
                   if (!isAnswerSelected) {
                     addUserAnswer(
                       question.id,
                       choice.c_id,
                       choice.is_correct,
                       question.sub_quiz_id
                     );
                      setIsAnswerSelected(true);
                   }
                 }}
                 disabled={
                   isAnswerSelected ||
                   (question.user_answer !== null && question.user_answer !== choice.c_id)
                 }
               >
                 {choice.option} {question.user_answer_is_correct}
               </Button>
                  ))}
                </div>
              </Card>
            </div>
          ))
        ) : (
          <div className="text-center py-10">No questions found</div>
        )}
      </div>
      <QuizModal data={isAnswer} />
    </>
  );
};

export default AttemptQuiz;
