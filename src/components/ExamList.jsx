import {React,useState,useEffect} from "react"
import { Link } from "react-router-dom";
import { supabase } from "../utils/config";
const ExamList = ({ data, key }) => {
  const [quiz_round_count, setquizroundcount] = useState([]);

  const fetchquizround  = async () => {
    
    const {data : quiz_round, error} = await supabase
    .from('quizes')
    .select('exam_id')
    .eq('exam_id', data.id)
    //  console.log("sjdfjhdbfhds",quiz_round)

  
   const quiz_round_count = quiz_round.map((item) => item.exam_id).length
    // console.log("tottal number",quiz_round_count)
    setquizroundcount(quiz_round_count);

    if(error){
        console.log(error)
        setLoading(false)
        return
    }
  
};
useEffect(()=> {
  fetchquizround();
},[])




















  return (
    <li
      key={key}
      className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6"
    >
      <div className="flex min-w-0 gap-x-4">
        <img
          className="h-12 w-12 flex-none rounded-full bg-gray-50"
          src={data.exam_image}
          alt=""
        />
        <div className="min-w-0 flex-auto">
          <p className="text-sm font-semibold leading-6 text-gray-900">
            <Link to={`/quizes/${data.id}`}>
              <span className="absolute inset-x-0 -top-px bottom-0"></span>
              {data.exam_name}
            </Link>
          </p>
          <p className="mt-1 flex text-xs leading-5 text-gray-500">
            <Link to={`/quizes/${data.id}`} className="relative truncate hover:underline">
              {quiz_round_count} Quize Round 
              {/* {data.total_questions} Questions */}
            </Link>
          </p>
        </div>
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
  );
};

export default ExamList;
