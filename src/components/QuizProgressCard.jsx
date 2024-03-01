import { Button, Card, Progress, Spinner } from 'flowbite-react';
import { FaArrowUp } from "react-icons/fa";
import { MdOutlineVideoLibrary, MdOutlineCancel  } from "react-icons/md";
import { CiStar } from "react-icons/ci";
import { TbArrowElbowRight } from "react-icons/tb";
import { Link } from 'react-router-dom';

function QuizProgressCard({data, key, bookmarkCount, quizUpVoteHandler, upvoteLoading, falsecount, truecount , progress}) {
  


  
  return (
    <Link to={`/attempt-quiz/${data?.id}`} className='block' key={key}>
    <Card className="min-w-full my-5">
      <div className="flex flex-col sm:flex-row justify-between space-y-6 sm:space-y-0 text-center sm:text-left">
      <h2 className='text-xl font-semibold '>{data?.quiz_title}</h2>
      <Button onClick={(e) => { e.preventDefault(); quizUpVoteHandler(data?.id); }} color='purple' className='bg-indigo-600 sm:w-28'>
        {upvoteLoading ? 
        <div className="text-center">
          <Spinner color="purple" aria-label="Center-aligned spinner example" />
        </div>
         : <>
          <FaArrowUp /> <span className='ml-2'>{data?._totalUpvotes || 0}</span>
        </>}
      </Button>

      </div>
      <p className='text-md text-gray-500'>Progress {progress || 0}%</p>
      <Progress progress={progress || 0} color='indigo' />
      <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
      {/* <Button color="" className='bg-gray-100 border-gray-100'><MdOutlineVideoLibrary className='text-gray-900' /> <span className='ml-2 text-gray-900'>{data?._totalQuestions} Questions</span></Button>
      <Button color="" className='bg-green-200 border-green-200'><TbArrowElbowRight className='text-green-600' /> <span className='ml-2 text-green-600'>{data?.stats?.total_correct || 0}</span></Button>
      <Button color="" className='bg-red-100 border-red-100'><MdOutlineCancel className='text-red-600' /> <span className='ml-2 text-red-600'>{data?.stats?.total_incorrect || 0}</span></Button>   
      <Button color="" className='bg-blue-100'><CiStar className='text-blue-500' /> <span className='ml-2 text-blue-900'></span>{bookmarkCount}</Button> */}

        <div className='flex flex-col space-y-4  justify-center text-center'>
        <span class="rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
        <h2 className='font-bold text-gray-600'>{data?._totalQuestions} Q</h2>
          <h3 className='font-bold text-md text-gray-600'>Total Question</h3>
        </span>
         
        </div>

      <div className='flex flex-col space-y-4 justify-center text-center'>
      <span class=" rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
          <h2 className='font-bold'>{truecount || 0} Q</h2>
          <h3 className='font-bold text-md'>Correct Question</h3>
      </span>
        </div>
        <div className='flex flex-col space-y-4 justify-center text-center'>
        <span class=" rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
          <h2 className='font-bold'>{falsecount || 0} Q</h2>
          <h3 className='font-bold text-md'>Incorrect Question</h3>
          
          </span>
        </div>
        <div className='flex flex-col space-y-4 justify-center text-center'>
        <span class="rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
          <h2 className='font-bold'>{bookmarkCount} Q</h2>
          <h3 className='font-bold text-md'>Bookmark Question</h3>

        </span>
        </div>
      </div>
    </Card>
    </Link>
  );
}

export default QuizProgressCard;