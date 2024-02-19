import React, { useContext, useEffect, useState } from "react";
import GlobalContext from "../context/GlobalContext";
import LoginModal from "../components/LoginModal";
import { supabase } from "../utils/config";
import CategoryList from "../components/CategoryList";
import { Spinner } from "flowbite-react";

const Home = () => {
  const { openModal, setOpenModal, session } = useContext(GlobalContext);

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);

  async function getCategories() {
    setLoading(true);
    let { data: category, error } = await supabase
      .from("categories")
      .select("*")
      .limit(5)
      .order("created_at", { ascending: false });
    if (error) {
      console.log(error);
      setLoading(false);
      return;
    } else {
      setCategories(category);
      setLoading(false);
    }
  }

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div>
      <div className="bg-white">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Welcome to scoorly (category list).
              <br />
              prep for your exam today.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
              More than 10 categories
            </p>
            {session ? null : (
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <button className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  Signup for free
                </button>
                <button
                  onClick={() => setOpenModal(!openModal)}
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  login <span aria-hidden="true">→</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto">
        <ul
          role="list"
          className="divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl"
        >
          {loading ? (
            <div className="text-center pt-10">
              <Spinner
                color="purple"
                aria-label="Center-aligned spinner example"
              />
            </div>
          ) : categories.length > 0 ? (
            categories?.map((category, index) => (
              <CategoryList data={category} key={index} />
            ))
          ) : null}
        </ul>
      </div>

      <LoginModal />
    </div>
  );
};

export default Home;
