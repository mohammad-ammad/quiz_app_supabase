import {React,useContext,useEffect,useState} from "react"
import { Link } from "react-router-dom";
import GlobalContext from '../context/GlobalContext'
import { supabase } from "../utils/config";
const QuizList = ({ data, key }) => {

  const [subquizitem, setsubquizcount] = useState([])
  const { session, setOpenModal } = useContext(GlobalContext);

  const handleQuizClick = (event) => {
    if (!session) {
 
      setOpenModal(true);
     
      event.preventDefault();
    } else {
     
  
      console.log("User is logged in. Handle the click event.");
    }
  };

  const fetchquizcount = async () => {
  const {data : sub_quiz_item , error:catError} = await supabase
    .from('sub_quizes')
    .select('quizes_id')
    .eq('quizes_id', data.id);

    if(catError){
      console.log(error)    
  }

   const sub_quizes_count = sub_quiz_item.map((item) => item.quizes_id).length  
     setsubquizcount(sub_quizes_count);

 
  }

  useEffect(()=> {
    fetchquizcount();
  },[])




















  return (
    <li
      key={key}
      className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6"
    >
      <div className="flex min-w-0 gap-x-4">
        <img
          className="h-12 w-12 flex-none rounded-full bg-gray-50"
          src={data.quiz_image}
          alt=""
        />
        <div className="min-w-0 flex-auto">
          <p className="text-sm font-semibold leading-6 text-gray-900">
            <Link to={`/quiz/${data.id}`} onClick={handleQuizClick}>
              <span className="absolute inset-x-0 -top-px bottom-0"></span>
              {data.quiz_name}
            </Link>
          </p>
          <p className="mt-1 flex text-xs leading-5 text-gray-500">
            <Link
              to={`/quiz/${data.id}`}
              className="relative truncate hover:underline"
              onClick={handleQuizClick}
            >
              {subquizitem} Items
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




export default QuizList;
