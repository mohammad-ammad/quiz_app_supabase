import { TextInput } from "flowbite-react";
import {React,useState,useEffect} from "react";
import { Link } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import ReportPieChart from "../components/PieChart";
import { supabase } from "../utils/config";
import {RxCross2} from 'react-icons/rx'
import {  FaArrowRight,  FaCheckSquare, FaStar } from "react-icons/fa";


const Review = () => {
  const [userData, setUserData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [fetchQuestions, setfetchQuestions] = useState(null);
  const [subQuizTitles, setSubQuizTitles] = useState([]);
  const [truecounts, settruecounts] = useState([]);
  const [falsecounts, setfalsecounts] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data from the session
        const { data, error } = await supabase.auth.refreshSession();

        if (error) {
          console.error('Error fetching user data:', error);
          return;
        }

        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      fetchData(userData.user.id);
    }
  }, [userData]);

  const fetchData = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('attempted_questions')
        .select('is_correct', { count: 'exact' })
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching attempted questions data:', error);
        return;
      }

      // Count the number of correct and wrong answers
      const correctCount = data.filter((q) => q.is_correct).length;
      const wrongCount = data.length - correctCount;

      // Set chart data state
      setChartData([
        { name: 'Correct', value: correctCount },
        { name: 'Incorrect', value: wrongCount },
      ]);
    } catch (error) {
      console.error('Error fetching attempted questions data:', error);
    }
  };







// Call the fetchBookmarkedQuestions function
useEffect(() => {
  fetchBookmarkedQuestions();
}, []);




  const fetchBookmarkedQuestions = async () => {
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
     const bookmarkcount = bookmarkedData.length;
    setfetchQuestions(bookmarkcount);
  
    // Extract question_ids from the bookmarkedData
    const questionIds = bookmarkedData.map((item) => item.question_id);
   
  
    
    const { data: titlesData, error: titlesError } = await supabase
      .from("questions")
      .select("sub_quiz_id")
      .in("id", questionIds);
  
    if (titlesError) {
      console.error(titlesError);
      return;
    }
   const sub_quiz_ids = titlesData.map((item) => item.sub_quiz_id);
    const {data: sub_quiz_title, error:sub_quiz_error} = await supabase
    .from("sub_quizes")
    .select("*")
    .in("id", sub_quiz_ids)
    if (sub_quiz_error) {
      console.error(sub_quiz_error);
      return;
    }
    
    const subQuizTitlesArray = sub_quiz_title.map((item) => ({
      id: item.id,
      quiz_title: item.quiz_title,
    }));
    setSubQuizTitles(subQuizTitlesArray); 
    // console.log("subquizTitleArrray", subQuizTitlesArray);
  };
  

  const fetchTrueFalseCounts = async () => {
    try {
      // Refresh the user session
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Error refreshing session:', error);
        return;
      }
  
      const { user } = data;
  
      // Fetch the attempted questions data
      const { data: questionsData, error: questionsError } = await supabase
        .from("attempted_questions")
        .select("is_correct")
        .eq("user_id", user.id);
  
      if (questionsError) {
        console.error('Error fetching attempted questions:', questionsError);
        return;
      }
  
      // Group the data to calculate true and false counts
      const groupedCounts = questionsData.reduce((counts, question) => {
        counts[question.is_correct] = (counts[question.is_correct] || 0) + 1;
        return counts;
      }, {});
  
      // Display the counts
      const truecount =  groupedCounts[true] || 0;
      const falsecount =  groupedCounts[false] || 0;

      settruecounts(truecount);
      setfalsecounts(falsecount);
      
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };
  

  
  
  // Call the function to fetch counts
  useEffect(()=>{
  fetchTrueFalseCounts();
  
  },[])













  return (
    <div className="pt-10 px-5 md:px-19">
      <div className="border border-gray-200 p-3 rounded-md">
        <h1 className="text-2xl font-semibold my-2">User Report</h1>
        <div className="flex justify-center items-center">
        {chartData && <ReportPieChart data={chartData} />}
        </div>
      </div>

      <h1 className="text-2xl font-semibold my-2">Bookedmarks</h1>

      <div className="container mx-auto py-2">
        <ul
          role="list"
          className="divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl"
        >
          <li className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6">
            <div className="flex min-w-0 gap-x-4">
              <img
                className="h-12 w-12 flex-none rounded-full bg-gray-50"
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
         
              {subQuizTitles.map((subQuizTitle,index)=> (
      <div key={index}>
        <Link
          to={`/attempt_quiz/${subQuizTitle.id}`}
          className="relative truncate hover:underline"
        >
          {subQuizTitle.quiz_title}
        </Link>
      </div>
    ))}
            </div>
            <div className="flex shrink-0 items-center gap-x-4">
              <svg
                className="h-5 w-5 flex-none text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </li>
        </ul>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mt-5">
        <h1 className="text-[30px] font-bold">Reviews</h1>
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

      <div className="my-10 border">
        <Link>
        <div className="flex flex-row justify-between">
        <div className="p-5 flex flex-row">
          <FaStar className="text-yellow-300 text-2xl my-auto"/>
          <div className="flex flex-col mx-4 ">
            <h2>Bookmark</h2>
            <p className="text-sm text-gray-400">{fetchQuestions} Items</p>
          </div>
      
        </div>
        <div className="my-auto mx-10 text-gray-400 text-md">
          <FaArrowRight/>
        </div>
        </div>

        </Link>
      </div>
      <div className="my-10 border">
        <Link>
        <div className="flex flex-row justify-between">
        <div className="p-5 flex flex-row">
          <FaCheckSquare className=" text-2xl my-auto text-green-400"/>
          <div className="flex flex-col mx-4 ">
            <h2>Correct</h2>
            <p className="text-sm text-gray-400">{truecounts} Items</p>
          </div>
      
        </div>
        <div className="my-auto mx-10 text-gray-400 text-md">
          <FaArrowRight/>
        </div>
        </div>

        </Link>
      </div>
      <div className="my-10 border">
        <Link to=''>
        <div className="flex flex-row justify-between">
        <div className="p-5 flex flex-row">
          <RxCross2 className=" text-2xl my-auto text-red-500"/>
          <div className="flex flex-col mx-4 ">
            <h2>Incorrect</h2>
            <p className="text-sm text-gray-400">{falsecounts} Items</p>
          </div>
      
        </div>
        <div className="my-auto mx-10 text-gray-400 text-md">
          <FaArrowRight/>
        </div>
        </div>
        </Link>
      </div>
    </div>
  );
};

export default Review;
