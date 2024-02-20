import { Spinner, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { IoIosSearch } from 'react-icons/io'
import { useParams } from 'react-router-dom'
import { supabase } from '../utils/config'
import QuizList from '../components/QuizList'

const Quizes = () => {
    const {exam_id} = useParams()

    const [quizes, setQuizes] = useState([])

    const [loading, setLoading] = useState(false)

    const fetchQuizes = async () => {
      setLoading(true)
        const {data : quiz, error} = await supabase
        .from('quizes')
        .select('*')
        .eq('exam_id', exam_id)
        .order('created_at', {ascending: false})

        if(error){
            console.log(error)
            setLoading(false)
            return
        }
        else{
            setQuizes(quiz)
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchQuizes()
    }
    , [exam_id])
  return (
    <div className="pt-10 px-5 md:px-19">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-[30px] font-bold">Quizes</h1>
        <div className="py-5 md:py-0">
          <TextInput
            id="search"
            type="text"
            rightIcon={IoIosSearch}
            placeholder="search"
          />
        </div>
      </div>

      <div className="my-5">
        <div className="">
          <ul
            role="list"
            className="divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl"
          >
            {
              loading ? (
                <div className="text-center py-10">
                <Spinner
                  color="purple"
                  aria-label="Center-aligned spinner example"
                />
              </div>
              ) : quizes.length > 0 ? quizes.map((quiz, index) => (
                <QuizList data={quiz} key={index}/>
            )) : <div className="text-center py-5">No quiz found</div>
            }
            
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Quizes