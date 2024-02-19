import { TextInput } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import ExamList from "../components/ExamList";
import ReportPieChart from "../components/PieChart";

const Review = () => {
    const data = [
        { name: 'Correct', value: 30 },
        { name: 'Incorrect', value: 20 },
      ];
  return (
    <div className="pt-10 px-5 md:px-19">
      <div className="border border-gray-200 p-3 rounded-md">
        <h1 className="text-2xl font-semibold my-2">User Report</h1>
        <div className="flex justify-center items-center">
            <ReportPieChart data={data} />
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
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  <Link to="/">
                    <span className="absolute inset-x-0 -top-px bottom-0"></span>
                    Math exam
                  </Link>
                </p>
                <p className="mt-1 flex text-xs leading-5 text-gray-500">
                  <Link to="/" className="relative truncate hover:underline">
                    Progress 50% , Score 34%, 32 Questions
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
        </ul>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center">
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

      <div className="my-5">
        {/* <ExamList /> */}
      </div>
    </div>
  );
};

export default Review;
