import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  get_all_problems,
  get_problem_by_id,
  run_compiler,
  submit_compiler,
} from "../controllers/ProblemRoutes";
import { get_user_by_id, auth_user } from "../controllers/UserRoutes";
import Navbar from "../components/Navbar";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { ThreeCircles } from "react-loader-spinner";

export default function Problem() {
  const [problem, setProblem] = useState([]);
  const [codeLang, setCodeLang] = useState("");
  var [code, setcode] = useState("");
  const [submitCode, setSubmitCode] = useState("");
  const [runCode, setRunCode] = useState("");
  const [stateVerdict, setStateVerdict] = useState(false);
  const [outputVerdict, setOutputVerdict] = useState(false);
  const [outputMessage, setOutputMessage] = useState("");
  const [userInput, setUserInput] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [userId, setUserId] = useState("");
  const [smallLoader, setSmallLoader] = useState(false);
  // console.log(code);
  const { id } = useParams();
  var valext = [cpp()];

  useEffect(() => {
    if (localStorage.getItem("user_token")) {
      let obj = {
        token: localStorage.getItem("user_token"),
      };
      auth_user(obj).then((data) => {
        if (data.tag) {
          setIsUserLoggedIn(true);
          let obj = {
            id: JSON.parse(
              atob(localStorage.getItem("user_token").split(".")[1])
            ).id,
          };
          console.log(obj, "#######");
          setUserId(obj.id);
        } else {
          setIsUserLoggedIn(false);
        }
      });
    }

    const obj = { _id: id };
    // console.log(obj);
    get_problem_by_id(obj).then((data) => {
      console.log(data.message);
      setProblem(data.message);
    });
    get_all_problems().then((data) => {
      console.log(data.message);
      setProblem(data.message);
    });
    setRunCode("");
    setStateVerdict(false);
  }, []);

  const probIndex = String(id);

  const handleRun = () => {
    // setIsLoading(true);
    console.log("Yess", code);
    const payload = {
      lang: codeLang,
      code,
      user_input: userInput,
    };
    console.log(payload);

    try {
      run_compiler(payload).then((data) => {
        console.log(data);
        setRunCode(data.output);
      });
    } catch (err) {
      console.log(err);
    }
  };


  const handleSubmit = () => {
    setIsLoading(true);
    console.log("Yess", code);
    const payload = {
      lang: codeLang,
      code,
      probid: probIndex,
      user_id: userId,
    };
    console.log(payload);
    try {
      submit_compiler(payload).then((data) => {
        console.log(data, "hemlo");
        // setSubmitCode(data.output);
        console.log(data.results);
        setStateVerdict(true);
        setOutputVerdict(data.results[data.results.length - 1].isCorrect);
        setOutputMessage(data.results[data.results.length - 1].output);
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      });

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Navbar />
      {loading ? (
        <>
          <div className="h-screen flex items-center justify-center">
            <ThreeCircles
              height="100"
              width="100"
              color="#FFD700"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel="three-circles-rotating"
              outerCircleColor=""
              innerCircleColor=""
              middleCircleColor=""
            />
            <h1 className="m-3 p-2 text-gold text-2xl font-bold">Compiling your code..</h1>
          </div>
        </>
      ) : (
        <>
          {isUserLoggedIn ? (
            <>
              {problem
                .filter((prob) => prob._id === probIndex)
                .map((temp) => (
                  <>
                    <div className="grid grid-rows-2 text-gold md:grid-cols-2">
                      <div className="bg-gray-700 rounded m-3 p-2">
                        <h1 className="text-3xl m-3 uppercase font-semibold">
                          Problem:{" "}
                          <span className="text-white capitalize">
                            {temp.name}
                          </span>
                        </h1>
                        <br></br>
                        <h3 className="text-2xl m-3 uppercase font-semibold">
                          Description: <br></br>
                          <span className="text-white normal-case font-medium">
                            {temp.statement}
                          </span>
                        </h3>
                        <br></br>
                        <h3 className="text-2xl m-3 uppercase font-semibold">
                          Difficulty:{" "}
                          <span className="text-white normal-case font-medium">
                            {temp.difficulty}
                          </span>
                        </h3>
                        <h3 className="text-2xl m-3 uppercase font-semibold">
                          Sample Input:{" "}
                          <span className="text-white normal-case font-medium">
                            {temp.testCases[0].input}
                          </span>
                        </h3>
                      </div>
                      <div className="bg-gray-700 rounded m-3 p-2">
                        <div className="flex flex-row">
                          <select
                            className="text-xl w-[40%] p-2 bg-gray-800 outline-none rounded-lg m-3"
                            value={codeLang}
                            onChange={(e) => {
                              setCodeLang(e.target.value);
                            }}
                          >
                            <option value="cpp">C++</option>
                            <option value="python">Python</option>
                            {/* <option value="java">Java</option> */}
                          </select>
                        </div>

                        <CodeMirror
                          className="m-3 text-lg rounded-lg"
                          value={code}
                          onChange={(value) => setcode(value)}
                          theme="dark"
                          height="400px"
                          extensions={valext}
                        />
                        <h1 className="text-3xl m-3 uppercase font-semibold">
                          Input:
                        </h1>
                        <div>
                          <textarea
                            value={userInput}
                            className="bg-gray-600 m-3 p-2 outline-none text-xl rounded-lg"
                            onChange={(e) => setUserInput(e.target.value)}
                            rows={4}
                            cols={50}
                            placeholder="Type your input here..."
                          />
                        </div>
                        <div className="">
                          <button
                            onClick={() => {
                              handleRun();
                            }}
                            className="m-3 p-2 bg-gray-600 rounded-lg font-semibold hover:bg-gray-500 text-xl"
                          >
                            Run
                          </button>
                          <button
                            onClick={() => {
                              handleSubmit();
                            }}
                            className="m-3 p-2 bg-gray-600 rounded-lg font-semibold hover:bg-gray-500 text-xl"
                          >
                            Submit
                          </button>
                        </div>

                        {runCode && (
                          <>
                            <h1 className="text-3xl m-3 uppercase font-semibold">
                              Output:
                            </h1>
                            <div className="m-3 p-2 bg-gray-600 rounded-lg">
                              <h3 className="text-xl font-monocode">
                                {runCode}
                              </h3>
                            </div>
                          </>
                        )}

                        {stateVerdict ? (
                          outputVerdict ? (
                            <>
                              <h1 className="text-3xl m-3 uppercase font-semibold">
                                Verdict:
                              </h1>
                              <div className="m-3 p-2 bg-gray-600 rounded-lg">
                                <h3 className="text-xl font-monocode">
                                  Accepted
                                </h3>
                              </div>
                            </>
                          ) : (
                            <>
                              <h1 className="text-3xl m-3 uppercase font-semibold">
                                Verdict:
                              </h1>
                              {
                                <div className="m-3 p-2 bg-gray-600 rounded-lg">
                                  {outputMessage === "Compilation timed out." ? (
                                    <h3 className="text-xl font-monocode">
                                      Time Limit Exceeded
                                    </h3>
                                  ) : (
                                    <h3 className="text-xl font-monocode">
                                      Wrong Answer
                                    </h3>
                                  )}
                                </div>
                              }
                            </>
                          )
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </>
                ))}
            </>
          ) : (
            <>
              {" "}
              <div className="m-3 p-5 text-center">
                <h1 className="text-[3rem] font-medium text-gold">
                  Please{" "}
                  <span className="hover:underline font-bold">
                    <Link to="/signup">login</Link>
                  </span>{" "}
                  to submit the problem
                </h1>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
