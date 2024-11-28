import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../../utils/supabaseClient";

export default function Show() {
  const { id } = useParams();
  const [workspaceName, setWorkspaceName] = useState("");
  const [filePaths, setFilePaths] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("workspaces")
        .select(
          `
        name,
        files (
          path
        )
      `
        )
        .eq("id", id);

      setLoading(false);
      if (error) {
        setHasError(true);
      } else {
        setWorkspaceName(data[0].name);
        setFilePaths(data[0].files.map(({ path }) => path));
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uploadFiles = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    setUploading(true);

    const files = event.target.files;
    const newFilePaths = [];
    let uploadError = false;
    // Upload File
    for (const file of files) {
      const { data, error } = await supabase.storage
        .from("pdfs")
        .upload(`uploads/${workspaceName}/${file.name}`, file);

      if (error) {
        uploadError = true;
      } else {
        newFilePaths.push(data.path);
      }
    }

    // Insert records into db table
    const { error: insertError } = await supabase.from("files").insert(
      newFilePaths.map((filePath) => ({
        workspaceId: id,
        path: filePath,
      }))
    );

    setHasError(uploadError || !!insertError);
    setFilePaths((prevFilePaths) => [...prevFilePaths, ...newFilePaths]);
    setUploading(false);
  };

  const openFile = async (filePath) => {
    const { data } = await supabase.storage
      .from("pdfs")
      .createSignedUrl(filePath, 3600);
    window.open(data.signedUrl);
  };

  return (
    <div className="container">
      <div className="navbar">
        <h1 className="header">{workspaceName}</h1>
        <div className="button-wrapper">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            multiple
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          <button
            className="button primary"
            onClick={uploadFiles}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload PDF"}
          </button>
          <Link className="button no-decoration primary" to="/workspaces">
            Back
          </Link>
        </div>
      </div>

      {hasError && <h3>Something went wrong!</h3>}

      {loading ? (
        <div className="loading">Loading Now...</div>
      ) : filePaths.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Document Name</th>
            </tr>
          </thead>
          <tbody>
            {filePaths.map((filePath) => (
              <tr key={filePath}>
                <td>
                  <Link onClick={() => openFile(filePath)}>
                    {filePath.split("/")[2]}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty">No Documents</div>
      )}
    </div>
  );
}
