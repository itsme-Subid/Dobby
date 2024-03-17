import { Suspense } from "react";
import { LoaderIcon } from "./icons";
import { lazy } from "react";
import { Routes, Route } from "react-router-dom";

const Login = lazy(() => import("./pages/login"));
const Register = lazy(() => import("./pages/register"));
const Gallery = lazy(() => import("./pages/gallery"));

const App = () => {
  return (
    <div>
      <Suspense
        fallback={
          <div className="flex w-full items-center justify-center h-screen">
            <LoaderIcon size="3rem" />
          </div>
        }
      >
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/signup" element={<Register />} />
          <Route exact path="/gallery" element={<Gallery />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
