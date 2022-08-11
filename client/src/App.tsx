// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";

// We import all the components we need in our app
import Navbar from "./components/navbar";
import RecordList from "./components/recordList";
import Edit from "./components/edit";
import Create from "./components/create";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<RecordList />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/create" element={<Create />} />
      </Routes>
      <div
        style={{
          margin: "0 auto",
          marginTop: "10px",
          border: "1px solid black",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <a href="/login">Login</a>
        <button>Fetch user</button>
        No longer a git repo...
      </div>
    </div>
  );
};

export default App;
