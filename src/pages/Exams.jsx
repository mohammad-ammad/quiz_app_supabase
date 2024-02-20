import { Spinner, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import ExamList from "../components/ExamList";
import { useParams } from "react-router-dom";
import { supabase } from "../utils/config";

const Exams = () => {
  const { cat_id } = useParams();

  const [exams, setExams] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchExams = async () => {
    setLoading(true);
    let { data: exam, error } = await supabase
      .from("exams")
      .select("*")
      .eq("category_id", cat_id)
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      setLoading(false);
      return;
    } else {
      setExams(exam);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, [cat_id]);
  return (
    <div className="pt-10">
      <div className=" mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <h1 className=" text-lg md:text-xl font-bold">Browes quiz from exams</h1>
        <div className="py-5 md:py-0">
          <TextInput
            id="search"
            type="text"
            rightIcon={IoIosSearch}
            placeholder="search"
          />
        </div>
      </div>

      </div>

      <div className="my-5">
        <div className="">
          <ul
            role="list"
            className="divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl"
          >
            {loading ? (
              <div className="text-center py-10">
                <Spinner
                  color="purple"
                  aria-label="Center-aligned spinner example"
                />
              </div>
            ) : exams.length > 0 ? (
              exams.map((exam, index) => <ExamList data={exam} key={index} />)
            ) : (
              <div className="text-center py-5">No exams found</div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Exams;
