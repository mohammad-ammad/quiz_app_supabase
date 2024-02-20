import { Button, Card, Progress } from 'flowbite-react';
import { FaArrowUp } from "react-icons/fa";
import { MdOutlineVideoLibrary, MdOutlineCancel  } from "react-icons/md";
import { CiStar } from "react-icons/ci";
import { TbArrowElbowRight } from "react-icons/tb";
import { Link } from 'react-router-dom';
import { useState,useEffect } from 'react';
import { supabase } from "../utils/config";

function QuizProgressCard({data, key}) {
  const [bookmarkCount, setBookmarkCount] = useState(0);
  useEffect(() => {
  
    fetchBookmarkCount();
  }, []);

  const fetchBookmarkCount = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Error refreshing session:', error);
        return;
      }
  
      const { user } = data;
      console.log('Logged-in user:', user.id);
        
          const { data: bookmarkedData, error: bookmarkedError } = await supabase
          .from("question_bookmarks")
          .select("*")
          .eq("user_id", user.id);
  
        if (bookmarkedError) {
          console.error('Error fetching bookmarked questions:', bookmarkedError);
          return;
        }
  
      
         console.log('Number of bookmarked questions:', bookmarkedData.length);
       setBookmarkCount(bookmarkedData.length || 0);
        
  
   
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };
  
    
      

 
  
  return (
    <Link to={`/attempt-quiz/${data?.id}`} className='block' key={key}>
    <Card className="min-w-full my-5">
      <h2 className='text-xl font-semibold'>{data?.quiz_title}</h2>
      <p className='text-md text-gray-500'>Progress {data?.stats?.quiz_progress || 0}%</p>
      <Progress progress={data?.stats?.quiz_progress || 0} color='indigo' />
      <div className='grid grid-cols-1 md:grid-cols-5 gap-2'>
      <Button color='purple' className='bg-indigo-600'><FaArrowUp /> <span className='ml-2'>{data?.stats?.total_question_attempt || 0}</span></Button>
      <Button color="light"><MdOutlineVideoLibrary /> <span className='ml-2'>{data?._totalQuestions} Questions</span></Button>
      <Button color="light"><TbArrowElbowRight /> <span className='ml-2'>{data?.stats?.total_correct || 0}</span></Button>
      <Button color="light"><MdOutlineCancel /> <span className='ml-2'>{data?.stats?.total_incorrect || 0}</span></Button>
      <Button color="light"><CiStar /> <span className='ml-2'></span>{bookmarkCount}</Button>
      </div>
    </Card>
    </Link>
  );
}

export default QuizProgressCard;