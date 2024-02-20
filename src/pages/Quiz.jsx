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
  const [loading, setLoading] = useState(false);

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
            quizes.map((quiz, index) => (
              <QuizProgressCard data={quiz} key={index} />
            ))
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
