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
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  useEffect(() => {
    getImages();
  }, [debouncedSearch]);
  const getImages = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://subid-das-dobby.onrender.com/api/images/search",
        {
          params: { q: debouncedSearch },
          headers: { "auth-token": getCookie("token") },
        }
      );
      setImages(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleImage = async (files) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", files[0]);
    try {
      await axios.post(
        "https://subid-das-dobby.onrender.com/api/images/upload",
        formData,
        {
          headers: {
            "auth-token": getCookie("token"),
          },
        }
      );
      getImages();
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
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
      {uploading ? (
        <div className="flex justify-center my-4">
          <LoaderIcon size="3rem" />
        </div>
      ) : (
        <Dropzone onDrop={handleImage} />
      )}
      {loading ? (
        <div className="flex justify-center">
          <LoaderIcon size="3rem" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-2 mb-4">
          {Array.isArray(images) &&
            images?.map((image, index) => (
              <div key={index} className="image-container">
                <img
                  className="rounded-lg w-full h-full bg-gray-300 object-cover"
                  src={image.path}
                  alt={image.name}
                />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;
