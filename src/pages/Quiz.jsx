import React, { useEffect, useState, useContext } from "react";
import { Card, Spinner, TextInput } from "flowbite-react";
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
  const [bookmarkCounts, setBookmarkCount] = useState(0);
  const [subquizesid, setsubquizesid] = useState(0);
  const [subquizesdata, setsubquizesdata] = useState([]);
  const [counts, setCounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [falsecount, setfalsecount] = useState('');
  const [truecount, settruecount] = useState('');
  const [subquizes, setsubquiz] = useState([]);
  const [progress, setprogress] = useState({});
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
    fetchCounts();
    progressbar();
  
  }, []);


 

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

         // Initialize an object to store bookmark counts for each quiz card
  const newBookmarkCounts = {};
    if (bookmarkedError) {
      console.error(bookmarkedError);
      return;
    }

    // Extract question_ids from the bookmarkedData
    const questionIds = bookmarkedData.map((item) => item.question_id);
    // console.log("question ids", questionIds)
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
      // Count bookmarks for each quiz card
  titlesData.forEach((item) => {
    const subQuizId = item.sub_quiz_id;
    newBookmarkCounts[subQuizId] = (newBookmarkCounts[subQuizId] || 0) + 1;
  });

    // const sub_quiz_id = titlesData.map((item) => item.sub_quiz_id);
 
    // console.log("sub_quiz_id", sub_quiz_id)
    // setsubquizesid(sub_quiz_id);
    // const bookmarkCount = sub_quiz_id.length;
    setBookmarkCount(newBookmarkCounts);
  };


 



   




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





const fetchCounts = async () => {
  
  const { data, error } = await supabase.auth.refreshSession();
  if (error) {
    console.error(error);
    return;
  }

  const { user } = data;

  const { data: attemptedQuestions, error: attemptedQuestionsError } = await supabase
  .from("attempted_questions")
  .select("*")
  .eq("user_id", user.id);


  // Filter question IDs based on is_correct values 
  const trueQuestionIds = attemptedQuestions.filter((question) => question.is_correct === true).map((q) => q.question_id);
  const falseQuestionIds = attemptedQuestions.filter((question) => question.is_correct === false).map((q) => q.question_id);

  // console.log("True question IDs:", trueQuestionIds);
  // console.log("False question IDs:", falseQuestionIds);

if (attemptedQuestionsError) {
  console.error(attemptedQuestionsError);
  return;
}


 const falsequestioncount = {}

const { data: falsequestionsData, error: falsequestionsError } = await supabase
  .from("questions")
  .select("sub_quiz_id")
  .in("id", falseQuestionIds);

      
       falsequestionsData.forEach((item) => {
        const subQuizId = item.sub_quiz_id;
        falsequestioncount[subQuizId] = (falsequestioncount[subQuizId] || 0) + 1;
       
      });
     
      setfalsecount(falsequestioncount);
 

if (falsequestionsError) {
  console.error(falsequestionsError);
  return;
}


const truequestioncount = {}
const { data: turequestionsData, error: truequestionsError } = await supabase
  .from("questions")
  .select("sub_quiz_id")
  .in("id", trueQuestionIds);

      
       turequestionsData.forEach((item) => {
        const subQuizId = item.sub_quiz_id;
       
        truequestioncount[subQuizId] = (truequestioncount[subQuizId] || 0) + 1;
      });
      
      settruecount(truequestioncount);
};

const progressbar = async () => {
  const { data, error } = await supabase.auth.refreshSession();
  if (error) {
    console.error(error);
    return;
  }

  const { user } = data;
  const { data: attemptedQuestions, error: attemptedQuestionsError } = await supabase
    .from("attempted_questions")
    .select("question_id")
    .eq("user_id", user.id);

  if (attemptedQuestionsError) {
    console.error(attemptedQuestionsError);
    return;
  }

  const subQuizProgress = {};

// Fetch sub_quiz_id for each attempted question
attemptedQuestions.forEach(async (attemptedQuestion) => {
  const questionId = attemptedQuestion.question_id;

  // Fetch the question data using question_id
  const { data: questionData, error: questionError } = await supabase
    .from("questions")
    .select("sub_quiz_id")
    .eq("id", questionId)
    .single();

  if (questionError) {
    console.error(questionError);
    return;
  }

    // Check if questionData is available
    if (questionData) {
      const subQuizId = questionData.sub_quiz_id;
  
      // Count the number of attempted questions for each sub_quiz_id
      subQuizProgress[subQuizId] = (subQuizProgress[subQuizId] || 0) + 1;
    }
})
console.log("Sub Quiz Progress:", subQuizProgress);




  // Get unique question_ids from attempted questions
  const uniqueQuestionIds = [...new Set(attemptedQuestions.map((item) => item.question_id))];

  // Fetch sub_quiz_id for each question_id
  const { data: questionsData, error: questionsError } = await supabase
    .from("questions")
    .select("sub_quiz_id", "id"); // Include 'id' in the select statement

  if (questionsError) {
    console.error(questionsError);
    return;
  }

  // Calculate the percentage for each sub_quiz_id
const subQuizPercentages = {};
Object.keys(subQuizProgress).forEach((subQuizId) => {
  const attemptedCount = subQuizProgress[subQuizId];
  console.log("attempted count", attemptedCount)
  console.log("subQuizId:", subQuizId);
  const totalQuestionsCount = questionsData.filter((q) => q.sub_quiz_id === subQuizId).length;
  console.log(totalQuestionsCount)
  const percentage = Math.round((attemptedCount / totalQuestionsCount) * 100);

  subQuizPercentages[subQuizId] = percentage;
});


console.log("Sub Quiz Percentages:", subQuizPercentages);
 setprogress(subQuizPercentages)

  
  



}
// useEffect(() => {
 
//   progressbar();
// }, []);

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
          const subQuizId = quiz.id;
          const bookmarkCount = bookmarkCounts[subQuizId] || 0;
          const falseCounts = falsecount[subQuizId] || 0;
          const trueCounts = truecount[subQuizId] || 0;
          const totalprogress = progress[subQuizId] || 0;
          // console.log("progress is",totalprogress)
          // const progress_count = progress[subQuizId]|| 0; 
      
          // const ismatched = Array.isArray(subquizesid) && subquizesid.includes(quiz.id);
        

          return (
            <QuizProgressCard
              // falsecount={matchedSubQuiz ? falsecount : 0}
              // truecount={matchedSubQuiz ? truecount : 0}
              // progress={matchedSubQuiz ? progress : 0}
              data={quiz}
              key={index}
              bookmarkCount={ bookmarkCount }
              progress={totalprogress}
              falsecount={ falseCounts }
              truecount={ trueCounts }
              // progress={progress_count}
              quizUpVoteHandler={quizUpVoteHandler}
              upvoteLoading={upvoteLoading[quiz.id] || false}
            />
          );
        
        })
      ) : (
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-6 sm:gap-y-0">
          <div className="text-center p-3">No quiz found </div>
        </div>
      )}
    </div>
  )}
  <LoginModal />
</div>



  );
};

export default Quiz;
