import PropTypes from "prop-types";
import { useDropzone } from "react-dropzone";
import { useEffect } from "react";

const Dropzone = ({
  onDrop,
  accept = {
    "image/*": [".png", ".jpg", ".jpeg"],
  },
}) => {
  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: {
        ...accept,
      },
    });
  useEffect(() => {
    if (fileRejections.length) {
      alert("File rejected, please upload a valid image file");
    }
  }, [fileRejections.length]);
  return (
    <div
      className="dropzone-div my-4 rounded-lg border border-dashed border-slate-400 bg-slate-100/50 p-4"
      {...getRootProps()}
    >
      <input className="dropzone-input hidden" {...getInputProps()} />
      <div className="text-center">
        {isDragActive ? (
          <p className="dropzone-content">Release to drop the file here</p>
        ) : (
          <p className="dropzone-content">
            Drag {"'n'"} drop an image file here, or click to select a file
            <br />
            Supported formats: .png, .jpg, .jpeg
          </p>
        )}
      </div>
    </div>
  );
};

export default Dropzone;

Dropzone.propTypes = {
  onDrop: PropTypes.func.isRequired,
  docs: PropTypes.bool,
  accept: PropTypes.object,
};
