import React from 'react'
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import Home from './pages/Home';
import Root from './pages/Root';
import { GlobalProvider } from './context/GlobalContext';
import Quiz from './pages/Quiz';
import AttemptQuiz from './pages/AttemptQuiz';
import Categories from './pages/Categories';
import Review from './pages/Review';
import Exams from './pages/Exams';
import Quizes from './pages/Quizes';


const router = createBrowserRouter([
  {
    path: "/",
    element: <GlobalProvider><Root/></GlobalProvider>,
    children: [
      { path: "", element: <Home /> },
      { path: "/categories", element: <Categories />},
      { path: "/exams/:cat_id", element: <Exams />},
      { path: "/quizes/:exam_id", element: <Quizes />},
      { path: "/reviews", element: <Review />},
      { path: "/quiz/:quiz_id", element: <Quiz/> },
      { path: "/attempt-quiz/:sub_quiz_id", element: <AttemptQuiz/> },
    ],
  }
]);

const App = () => {
  return (
    <div className='md:px-20 px-5 pb-10'>
      <RouterProvider router={router} />
    </div>
  )
}

export default App