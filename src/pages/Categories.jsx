import { Spinner, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import CategoryList from "../components/CategoryList";
import { supabase } from "../utils/config";

const Categories = () => {
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);

  async function getCategories() {
    setLoading(true);
    let { data: category, error } = await supabase
      .from("categories")
      .select("*")
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
    <div className="pt-10 px-5 md:px-19">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-[30px] font-bold">Browes exams by categories</h1>
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
        <div className="container mx-auto">
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
            ) : categories.length > 0 ? (
              categories?.map((category, index) => (
                <CategoryList data={category} key={index} />
              ))
            ) : null}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Categories;
