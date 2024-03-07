import {
  Button,
  Card,
  Pagination,
  Spinner,
  TextInput,
  Tooltip,
} from "flowbite-react";
import React, { useContext, useEffect, useState } from "react";
import { IoIosSearch, IoMdChatboxes } from "react-icons/io";
import { CiBookmark } from "react-icons/ci";
import { GrHide } from "react-icons/gr";
import { AiOutlineThunderbolt } from "react-icons/ai";
import QuizModal from "../components/QuizModal";
import GlobalContext from "../context/GlobalContext";
import { useParams } from "react-router-dom";
import { supabase } from "../utils/config";
import { RxCross2 } from "react-icons/rx";
import { FaArrowRight, FaCheckSquare, FaStar } from "react-icons/fa";
import {
  MdIndeterminateCheckBox,
  MdOutlineCheckBoxOutlineBlank,
} from "react-icons/md";
import { IoChatboxOutline } from "react-icons/io5";
import toast from "react-hot-toast";

const AttemptQuiz = () => {
  const itemsPerPage = 1; // Display one question at a time
  const [currentPage, setCurrentPage] = useState(1);

  const onPageChange = (page) => setCurrentPage(page);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const { sub_quiz_id } = useParams();

  // const [IsCorrect, setIsCorrect] = useState('');
  // console.log("is Correct abcd", IsCorrect);
  const [isCorrectMap, setIsCorrectMap] = useState({});
   const [IsInCorrect, setIsInCorrect] = useState(false);

  const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);

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

      toast.success("Question Unbookmarked");

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

      toast.success("Question Bookmarked");

      // Update state to add the question to bookmarkedQuestions
      setBookmarkedQuestions((prevBookmarks) => [...prevBookmarks, questionId]);
    }
  };

  const { setOpenQuizAnswerModal } = useContext(GlobalContext);

  const [isAnswer, setIsAnswer] = useState({
    question_no: "",
    question: "",
    allChoices: [],
    correct_choice:""
  });

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAnswer = (question_no, question, choice1, choice2, choice3, choice4,correct_choice) => {
    setOpenQuizAnswerModal(true);
    setIsAnswer({
      question_no,
      question,
      allChoices: [choice1, choice2, choice3, choice4],
      correct_choice:correct_choice
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

    // commented HY code

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

      // find HY votes
      const { data: hy_data, error: hy_error } = await supabase
        .from("hy_questions")
        .select("*")
        .eq("question_id", question.id);

      if (hy_error) {
        console.error(hy_error);
        setLoading(false);
        return;
      }

      const userAnswer =
        userAnswers.length > 0 ? userAnswers[0].user_answer : null;
      const userAnswerIsCorrect =
        userAnswers.length > 0 ? userAnswers[0].is_correct : false;

      const questionWithUserAnswer = {
        ...question,
        user_answer: userAnswer,
        user_answer_is_correct: userAnswerIsCorrect,
        totalHYVotes: hy_data.length > 0 ? hy_data.length : 0,
      };

      questionsWithUserAnswers.push(questionWithUserAnswer);
    }

    setQuestions(questionsWithUserAnswers);
 


    
    //  setQuestions(questionData);
    
    setLoading(false);
  };

  // const handleChoiceSelection = async (questionId, selectedChoice) => {
  //   console.log("selected_choice" , selectedChoice)
  //   console.log("selected_questionId" , questionId)

  //   const { data, error } = await supabase.auth.refreshSession();
  //   if (error) {
  //     console.log(error);
  //     return;
  //   }

  //   const { user } = data;
  //   console.log("user is", user.id)
  //    // Find the question data for the selected question
  //   const selectedQuestion = questions.find((item) => item.id === questionId);
  //   console.log("selectedQuestions",selectedQuestion)
  
  //   // Check if the selected choice is correct
    
  // const isCorrect = selectedChoice === selectedQuestion.correct_choice;
  // console.log("is Correct", isCorrect)






  
  
  // //   // Update the attempted_question table
  //   const { data: insertData, error: insertError } = await supabase
  //     .from("attempted_question")
  //     .insert(
  //       [
  //         {
  //            user_id: user.id, // Assuming you have the user's ID
  //           question_id: questionId,
  //           is_correct: isCorrect,
  //         },
  //       ],
  //     );
  
  //   if (insertError) {
  //     console.error(insertError);
  //     return;
  //   }
  
  //   // Handle success, e.g., update UI state
  //   console.log("Attempted question inserted:");
  //  };


  const handleChoiceSelection = async (questionId, selectedChoice) => {
    console.log("selected_choice", selectedChoice);
    console.log("selected_questionId", questionId);
  
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      console.log(error);
      return;
    }
  
    const { user } = data;
    console.log("user is", user.id);
    const selectedQuestion = questions.find((item) => item.id === questionId);
    const isCorrect = selectedChoice === selectedQuestion.correct_choice;
        // Set state for each button individually
        // setIsCorrect((prevIsCorrect) => ({
        //   ...prevIsCorrect,
        //   [questionId]: isCorrect,
        // }));




        // Update the state with the correctness of the selected question
  setIsCorrectMap((prevMap) => ({
    ...prevMap,
    [questionId]: isCorrect,
  }));






        
       
          // setIsCorrect(isCorrect);
    
      
        
      

    
  
    // Check if the record already exists
    const { data: existingRecord, error: selectError } = await supabase
      .from("attempted_questions")
      .select("*")
      .eq("user_id", user.id)
      .eq("question_id", questionId);
  
    if (selectError) {
      console.error(selectError);
      return;
    }
  
    if (existingRecord.length > 0) {
      // Record exists, perform update
      const { data: updateData, error: updateError } = await supabase
        .from("attempted_questions")
        .update({ is_correct:  isCorrect })
        .eq("user_id", user.id)
        .eq("question_id", questionId);
  
      if (updateError) {
        console.error(updateError);
        return;
      }
  
      console.log("Record updated:", updateData);
    } else {
      // // Record doesn't exist, perform insert
      const { data: insertData, error: insertError } = await supabase
        .from("attempted_questions")
        .insert([
          {
            user_id: user.id,
            question_id: questionId,
            is_correct: isCorrect,
          },
        ]);
  
      if (insertError) {
        console.error(insertError);
        return;
      }
  
      console.log("Record inserted:", insertData);
      
    }

    setQuestions(prevQuestions => {
      return prevQuestions.map(question => {
        if (question.id === questionId) {
          // Update the isCorrect property for the selected question
          return {
            ...question,
            isCorrect: selectedChoice === question.correct_choice,
          };
        }
        return question;
      });
    });
  };
  console.log("is map is", isCorrectMap);

  
  























  // insert code end here 














  

  const addUserAnswer = async (
    question_id,
    choice_id,
    correct_ans,
    sub_quiz_id,
    totalQuestionCount
  ) => {
    console.log("question", totalQuestionCount);
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

      // Check if the question is already attempted
  const { data: existingAnswer, error: existingAnswerError } = await supabase
  .from("attempted_questions")
  .select("id,is_correct,question_id,user_id")
  .eq("user_id", user.id)
  .eq("question_id", question_id);

  const existingAnswers = existingAnswer.map((item)=> item.id)
  const existingAnswersquestions = existingAnswer.map((item)=> item.question_id)
  console.log("existing answerhjvjhj", existingAnswer);

if (existingAnswerError) {
  console.log(existingAnswerError);
  return;
}
if (existingAnswer.length > 0) {
  console.log("Updating existing answer...");
  // If the question is already attempted, update the existing answer
  const { error: updateAnswerError } = await supabase
    .from("attempted_questions")
    .update({
      user_answer: choice_id,
      is_correct: correct_ans,
    })
    .in("id", existingAnswers);

  if (updateAnswerError) {
    console.log(updateAnswerError);
    return;
  }
  console.log("Existing answer updated successfully!");
} else {

  console.log("Inserting a new answer...");
  const { error: insertAnswerError } = await supabase
    .from("attempted_questions")
    .insert([
      {
        user_id: user.id,
        question_id: question_id,
        user_answer: choice_id,
        is_correct: correct_ans,
      },
    ]);
    console.log("New answer inserted successfully!");

  if (insertAnswerError) {
    console.log(insertAnswerError);
    return;
    
  }
}

// ammad bhai code
    const { data: quizProgress, error: quizProgressError } = await supabase
      .from("quiz_progress")
      .select("*")
      .eq("user_id", user.id)
      .eq("question_id", question_id);
  
   if (existingAnswerError) {
      console.log(existingAnswerError);
      return;
    }

    if(existingAnswer.length > 0){
      console.log("Updating existing answer...");
      // If the question is already attempted, update the existing answer
      const { error: updateAnswerError } = await supabase
        .from("attempted_questions")
        .update({
          user_id: user.id,
          sub_quiz_id,
          total_question_attempt: quizProgress[0].total_question_attempt + 1,
          total_correct: correct_ans
            ? quizProgress[0].total_correct + 1
            : quizProgress[0].total_correct,
          total_incorrect: !correct_ans
            ? quizProgress[0].total_incorrect + 1
            : quizProgress[0].total_incorrect,
          quiz_progress:
          totalQuestionCount > 0
    ? Math.round(((quizProgress[0].total_question_attempt + 1) / totalQuestionCount) * 100)
    : 0,
        })
        .eq("id", existingAnswer[0].id);
  
      if (updateAnswerError) {
        console.log(updateAnswerError);
        return;
      }
      console.log("Existing answer updated successfully!");

      /*
        ! first get all quiz progress with user id and sub quiz id
        ! now get correct and incorrect 
        ! then if my selected ans if correct then increment it in the correct one and decrement it from incorrect one and vice versa
        ! then update the quiz progress only with the correct and incorrect
      */

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
        let correct = quizProgress[0].total_correct;
        let incorrect = quizProgress[0].total_incorrect;

        if(correct_ans){
          correct = correct + 1;
          incorrect = incorrect - 1;
        }
        else{
          correct = correct - 1;
          incorrect = incorrect + 1;
        }

        const { error: updateQuizProgressError } = await supabase
          .from("quiz_progress")
          .update({
            user_id: user.id,
            sub_quiz_id,
            total_correct: correct,
            total_incorrect: incorrect,
          })
          .eq("user_id", user.id)
          .eq("sub_quiz_id", sub_quiz_id);

        if (updateQuizProgressError) {
          console.log(updateQuizProgressError);
          return;
        }
      }
    }else{
      console.log("Inserting a new answer...");
      const { error: insertAnswerError } = await supabase
        .from("attempted_questions")
        .insert([
          {
            user_id: user.id,
            question_id,
            user_answer: choice_id,
            is_correct: correct_ans,
          },
        ]);
  
      if (insertAnswerError) {
        console.log(insertAnswerError);
        console.log("New answer inserted successfully!");
        return;
      }

      // add quiz progress
      const { data: quizProgress, error: quizProgressError } = await supabase
      .from("quiz_progress")
      .select("*")
      .eq("user_id", user.id)
      .eq("sub_quiz_id", sub_quiz_id);

      console.log("logs", quizProgress)

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
            total_incorrect: !correct_ans
              ? quizProgress[0].total_incorrect + 1
              : quizProgress[0].total_incorrect,
            quiz_progress:
              totalQuestionCount > 0
                ? Math.round(
                    (quizProgress[0].total_question_attempt) /
                      totalQuestionCount
                  ) * 100
                : 0,
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
              quiz_progress:
                totalQuestionCount > 0 ? (1 / totalQuestionCount) * 100 : 0,
            },
          ]);

        console.log(
          "progress inserted",
          totalQuestionCount > 0 ? (1 / totalQuestionCount) * 100 : 0
        );
        if (insertQuizProgressError) {
          console.log(insertQuizProgressError);
          return;
        }
      }

    }
  
  };
  
  
  
  // handly hy question code
  const handleHYQuestion = async (qid) => {
    const { data, error } = await supabase.auth.refreshSession();

    if (error) {
      console.error(error);
      return;
    }

    const { user } = data;

    const { data: hy_data, error: hy_error } = await supabase
      .from("hy_questions")
      .select("*")
      .eq("user_id", user.id)
      .eq("question_id", qid);

    if (hy_error) {
      console.error(hy_error);
      return;
    }

    if (hy_data.length > 0) {
      const { error: deleteError } = await supabase
        .from("hy_questions")
        .delete()
        .eq("user_id", user.id)
        .eq("question_id", qid);

      if (deleteError) {
        console.error(deleteError);
        return;
      }
    } else {
      const { error: insertError } = await supabase
        .from("hy_questions")
        .insert([{ user_id: user.id, question_id: qid }]);

      if (insertError) {
        console.error(insertError);
        return;
      }
    }

    toast.success(`${hy_data.length > 0 ? "Removed" : "Added"} as HY Question`);
    setQuestions((prev) => {
      return prev.map((question) => {
        if (question.id === qid) {
          return {
            ...question,
            totalHYVotes:
              hy_data.length > 0
                ? question.totalHYVotes - 1
                : question.totalHYVotes + 1,
          };
        }
        return question;
      });
    });
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
          <div className="my-5">
        
            <Card className="min-w-full">
              {questions.slice(startIndex, endIndex).map((question, index) => {
                const matchcorrect1 = question.choice1 === question.correct_choice
                const matchcorrect_2 = question.choice_2 === question.correct_choice
                const matchcorrect_3 = question.choice_3 === question.correct_choice
                const matchcorrect_4 = question.choice_4 === question.correct_choice
                // console.log("is matching", matchcorrect1)
                // console.log("is not  matching", matchcorrect_2)
                // console.log("is not  matching", matchcorrect_3)
                // console.log("is not  matching", matchcorrect_4)
                
                return(                
                <div key={index}>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div>
                      <h1 className="text-xl font-semibold my-2">
                        Question {startIndex + index + 1} / {questions.length}
                      </h1>
                      <p className="text-sm text-gray-500">
                        {question.question}
                      </p>
                    </div>
                    {/* Your existing buttons (bookmark, answer, HYQuestion) */}
                    <div className="flex justify-start items-start gap-2 my-2 md:my-0">
                      <Tooltip
                        content={
                          bookmarkedQuestions.includes(question.id)
                            ? "Bookmarked"
                            : "Bookmark"
                        }
                      >
                        <Button
                          className={
                            bookmarkedQuestions.includes(question.id)
                              ? "bg-indigo-600"
                              : ""
                          }
                          color="light"
                          onClick={() => handleBookmarkClick(question.id)}
                        >
                          <CiBookmark
                            size={25}
                            className={
                              bookmarkedQuestions.includes(question.id)
                                ? "text-white"
                                : ""
                            }
                          />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Answer">
                        <Button
                          color="light"
                          onClick={() =>
                            handleAnswer(
                              `Question`,
                              question.question,
                              // question.choices
                              question.choice1,
                              question.choice_2,
                              question.choice_3,
                              question.choice_4,
                              question.correct_choice
                            )
                          }
                        >
                          <GrHide size={25} />
                        </Button>
                      </Tooltip>
                      <Tooltip
                        content={`${question?.totalHYVotes} votes as HY Question`}
                      >
                        <Button
                          color="light"
                          className={
                            question.totalHYVotes > 0 ? "bg-indigo-600" : ""
                          }
                          onClick={() => handleHYQuestion(question?.id)}
                        >
                          <IoChatboxOutline
                            size={25}
                            className={
                              question.totalHYVotes > 0 ? "text-white" : ""
                            }
                          />
                        </Button>
                      </Tooltip>
                    </div>

                    {/* jkdbjhsdfbksdf */}
                  </div>
                    {/* Log the value of trueans */}
                  <div>
               {/* {console.log("user is",question.choice1 === question.correct_choice)} */}
              
                  <Button
      color="bg-gray-200"
      className={`w-full flex justify-start items-center my-2 py-3 px-3 bg-gray-200 `}
      onClick={() => handleChoiceSelection(question.id, question.choice1)}
    >
      {question.choice1}
      
      {isCorrectMap[question.id] === matchcorrect1 && (
  <div className="bg-white py-1 px-3 rounded-md">
    <FaCheckSquare className="text-xl my-auto text-green-400 font-bold" />
  </div>
)}

{isCorrectMap[question.id] !== matchcorrect1 && (
  <div className="bg-white py-1 px-3 rounded-md">
    <RxCross2 className="text-xl my-auto text-red-500" />
  </div>
)}
      {/* {question.choice1 === question.correct_choice && (
          <div className="bg-white py-1 px-3 rounded-md">
            <FaCheckSquare className="text-xl my-auto text-green-400 font-bold" />
          </div>
        )}
        {question.choice1 !== question.correct_choice &&(
          <div className="bg-white py-1 px-3 rounded-md">
              <RxCross2 className="text-xl my-auto text-red-500" />
          </div>
        )} */}
 
    </Button>
                  <Button
      color="bg-gray-200"
      className={`w-full flex justify-start items-center my-2 py-3 px-3 bg-gray-200 `}
      onClick={() => handleChoiceSelection(question.id, question.choice_2)}
    >
      {question.choice_2}
      {/* {question.choice_2 === question.correct_choice && (
          <div className="bg-white py-1 px-3 rounded-md">
            <FaCheckSquare className="text-xl my-auto text-green-400 font-bold" />
          </div>
        )}
        {question.choice_2 !== question.correct_choice &&(
          <div className="bg-white py-1 px-3 rounded-md">
            <RxCross2 className="text-xl my-auto text-red-500" />
          </div>
        )} */}

{isCorrectMap[question.id] === matchcorrect_2 && (
  <div className="bg-white py-1 px-3 rounded-md">
    <FaCheckSquare className="text-xl my-auto text-green-400 font-bold" />
  </div>
)}

{isCorrectMap[question.id] !== matchcorrect_2 && (
  <div className="bg-white py-1 px-3 rounded-md">
    <RxCross2 className="text-xl my-auto text-red-500" />
  </div>
)}
    
    </Button>
                  <Button
      color="bg-gray-200"
      className={`w-full flex justify-start items-center my-2 py-3 px-3 bg-gray-200 `}
      onClick={() => handleChoiceSelection(question.id, question.choice_3)}
    >
      {question.choice_3}
      {/* {question.choice_3 === question.correct_choice && (
          <div className="bg-white py-1 px-3 rounded-md">
            <FaCheckSquare className="text-xl my-auto text-green-400 font-bold" />
          </div>
        )}
        {question.choice_3 !== question.correct_choice &&(
          <div className="bg-white py-1 px-3 rounded-md">
              <RxCross2 className="text-xl my-auto text-red-500" />
          </div>
        )} */}
      {isCorrectMap[question.id] === matchcorrect_3 && (
  <div className="bg-white py-1 px-3 rounded-md">
    <FaCheckSquare className="text-xl my-auto text-green-400 font-bold" />
  </div>
)}

{isCorrectMap[question.id] !== matchcorrect_3 && (
  <div className="bg-white py-1 px-3 rounded-md">
    <RxCross2 className="text-xl my-auto text-red-500" />
  </div>
)}
      
    </Button>
                  <Button
      color="bg-gray-200"
      className={`w-full flex justify-start items-center my-2 py-3 px-3 bg-gray-200`}
      onClick={() => handleChoiceSelection(question.id, question.choice_4)}
    >
      {question.choice_4}

      {/* {question.choice_4 === question.correct_choice && (
          <div className="bg-white py-1 px-3 rounded-md">
            <FaCheckSquare className="text-xl my-auto text-green-400 font-bold" />
          </div>
        )}
        {question.choice_4 !== question.correct_choice &&(
          <div className="bg-white py-1 px-3 rounded-md">
              <RxCross2 className="text-xl my-auto text-red-500" />
          </div>
        )} */}
      {isCorrectMap[question.id] === matchcorrect_4 && (
  <div className="bg-white py-1 px-3 rounded-md">
    <FaCheckSquare className="text-xl my-auto text-green-400 font-bold" />
  </div>
)}

{isCorrectMap[question.id] !== matchcorrect_4 && (
  <div className="bg-white py-1 px-3 rounded-md">
    <RxCross2 className="text-xl my-auto text-red-500" />
  </div>
)}
    </Button>
                  {/* <Button color="bg-gray-300" className="w-full flex justify-start items-center my-2 py-3 px-3 bg-gray-300" onClick={() => handleChoiceSelection(question.id, question.choice_2)}>{question.choice_2}</Button>
                  <Button color="bg-gray-300" className="w-full flex justify-start items-center my-2 py-3 px-3 bg-gray-300" onClick={() => handleChoiceSelection(question.id, question.choice_3)}>{question.choice_3}</Button>
                  <Button color="bg-gray-300" className="w-full flex justify-start items-center my-2 py-3 px-3 bg-gray-300" onClick={() => handleChoiceSelection(question.id, question.choice_4)}>{question.choice_4}</Button> */}
                    {/* {question.choices.map((choice, _index) => (
                      <button
                        style={{
                          backgroundColor:
                            question.user_answer === choice.c_id &&
                            question.user_answer_is_correct
                              ? ""
                              : question.user_answer === choice.c_id &&
                                !question.user_answer_is_correct
                              ? ""
                              : "",
                        }}
                        className={`w-full flex justify-start items-center my-2 py-3 px-3 ${
                          question.user_answer === choice.c_id &&
                          question.user_answer_is_correct
                            ? "bg-gray-200"
                            : question.user_answer === choice.c_id &&
                              !question.user_answer_is_correct
                            ? "bg-gray-200"
                            : "bg-gray-200"
                        } rounded`}
                        key={_index}
                        onClick={() => {
                          if (!question.isAnswerSelected) {
                            addUserAnswer(
                              question.id,
                              choice.c_id,
                              choice.is_correct,
                              question.sub_quiz_id,
                              questions.length
                            );
                          }
                        }}
                      >
                        <div className="flex justify-between items-center w-full">
                          <div>{choice.option}</div>
                          <div>
                            {question.user_answer === choice.c_id &&
                              question.user_answer_is_correct && (
                                <div className="bg-white py-1 px-3 rounded-md">
                                  <FaCheckSquare className="text-xl my-auto text-green-400 font-bold" />
                                </div>
                              )}
                            {question.user_answer === choice.c_id &&
                              !question.user_answer_is_correct && (
                                <div className="bg-white py-1 px-3 rounded-md">
                                  <RxCross2 className="text-xl my-auto text-red-500" />
                                </div>
                              )}
                            {question.user_answer !== choice.c_id && (
                              <div className="bg-white py-1 px-3 rounded-md">
                                <MdIndeterminateCheckBox className="text-xl my-auto text-gray-300" />
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))} */}
                  </div>
                </div>
                )
})}
              <div className="flex justify-center mt-4">
                <Pagination
                  layout="table"
                  currentPage={currentPage}
                  totalPages={Math.ceil(questions.length / itemsPerPage)}
                  onPageChange={onPageChange}
                />
              </div>
            </Card>
          </div>
        ) : (
          <div className="text-center py-10">No questions found</div>
        )}
      </div>
      <QuizModal data={isAnswer} />
    </>
  );
};

export default AttemptQuiz;
