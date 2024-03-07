import { Button, Modal, TextInput } from "flowbite-react";
import { useContext, useState } from "react";
import GlobalContext from "../context/GlobalContext";
import { IoIosSearch } from "react-icons/io";

function QuizModal({ data }) {
  const { question_no, question, allChoices,correct_choice } = data;
  const {
    openQuizAnswerModal: openModal,
    setOpenQuizAnswerModal: setOpenModal,
  } = useContext(GlobalContext);

  return (
    <>
      <Modal show={openModal} size={"xl"} onClose={() => setOpenModal(false)}>
        <Modal.Header>{question_no}</Modal.Header>
        <Modal.Body>
          <div className="space-y-6 px-1 py-2">
            <p className="text-sm text-gray-500">{question}</p>
            {allChoices.map((choice, index) => (
        <Button
          key={index}
          color={" "}
          className={`w-full flex justify-start items-center my-2  bg-gray-200 
        ${choice === correct_choice ? 'bg-blue-400':'bg-gray-200'}
`}
          rounded
        >
          {choice}
        </Button>
      ))}

            <div className="py-2">
              <TextInput
                id="search"
                type="text"
                rightIcon={IoIosSearch}
                placeholder="search"
              />
            </div>

            <div className="border border-gray-200 p-3 rounded-md">
                <h4 className="font-semibold">answer by chatgpt</h4>
                <h3 className="text-4xl font-semibold my-2">Header</h3>
                <p className="text-sm text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Venenatis enim vitae quam curabitur id.</p>
                <ul className="text-sm text-gray-500">
                    <li>- One</li>
                    <li>- Two</li>
                    <li>- Three</li>
                </ul>

                <div className="flex flex-col md:flex-row justify-center items-center gap-2">
                <Button color="purple" className="bg-indigo-500 w-full my-2">233 Approved</Button>
                <Button color="light" className="w-full">Secondary</Button>
                </div>
            </div>

            <div className="border border-gray-200 p-3 rounded-md">
                <h4 className="font-semibold">answer by Perplexity</h4>
                <h3 className="text-4xl font-semibold my-2">Header</h3>
                <p className="text-sm text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Venenatis enim vitae quam curabitur id.</p>
                <ul className="text-sm text-gray-500">
                    <li>- One</li>
                    <li>- Two</li>
                    <li>- Three</li>
                </ul>

                <div className="flex flex-col md:flex-row justify-center items-center gap-2">
                <Button color="purple" className="bg-indigo-500 w-full my-2">233 Approved</Button>
                <Button color="light" className="w-full">Secondary</Button>
                </div>
            </div>

            <div className="border border-gray-200 p-3 rounded-md">
                <h4 className="font-semibold">answer by user 1 (users)</h4>
                <h3 className="text-4xl font-semibold my-2">Header</h3>
                <p className="text-sm text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Venenatis enim vitae quam curabitur id.</p>
                <ul className="text-sm text-gray-500">
                    <li>- One</li>
                    <li>- Two</li>
                    <li>- Three</li>
                </ul>

                <div className="flex flex-col md:flex-row justify-center items-center gap-2">
                <Button color="purple" className="bg-indigo-500 w-full my-2">233 Approved</Button>
                <Button color="light" className="w-full">Secondary</Button>
                </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default QuizModal;
