import { useEffect } from "react";
import Dropzone from "../components/dropzone";
import axios from "axios";
import { useState } from "react";
import { LoaderIcon } from "../icons";
import { getCookie, setCookie } from "../lib/cookies";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../hooks/debounce";

const Gallery = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  useEffect(() => {
    setLoading(true);
    getImages();
  }, [debouncedSearch]);
  const getImages = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/images/search", {
        params: { q: debouncedSearch },
        headers: { "auth-token": getCookie("token") },
      });
      setImages(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleImage = async (files) => {
    const formData = new FormData();
    formData.append("file", files[0]);
    try {
      await axios.post("http://localhost:3000/api/images/upload", formData, {
        headers: {
          "auth-token": getCookie("token"),
        },
      });
      getImages();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="container-custom mx-auto">
      <div className="tobar flex gap-2">
        <input
          type="search"
          className="w-full rounded-lg border border-slate-400 bg-slate-100/50 mt-4 mb-2 focus-within:outline-none px-6 py-4"
          placeholder="Search for images"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          name=""
          id=""
        />
        <button
          onClick={() => {
            setCookie("token", "");
            navigate("/");
          }}
          className="bg-red-500 text-white px-6 py-4 mt-4 mb-2 w-fit rounded-lg border "
        >
          Logout
        </button>
      </div>
      <Dropzone onDrop={handleImage} />
      <div className="grid sm:grid-cols-2 gap-2 mb-4">
        {loading ? (
          <LoaderIcon size="3rem" />
        ) : (
          Array.isArray(images) &&
          images?.map((image, index) => (
            <div key={index} className="image-container">
              <img
                className="rounded-lg w-full h-full object-cover"
                src={image.path}
                alt={image.name}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Gallery;
