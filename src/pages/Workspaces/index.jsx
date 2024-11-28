import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../utils/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";

export default function Workspaces() {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("workspaces")
        .select(
          `
        id,
        name,
        description,
        files (
          path
        )
      `
        )
        .eq("ownerid", user.id);

      setLoading(false);
      if (error) {
        setHasError(true);
      } else {
        setWorkspaces(
          data.map((workspace) => ({
            ...workspace,
            fileCount: workspace.files.length,
          }))
        );
        setHasError(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setHasError(true);
    } else {
      setHasError(false);
    }
  };

  return (
    <div className="container">
      <div className="navbar">
        <h1 className="header">Workspaces</h1>
        <div className="button-wrapper">
          <Link className="button no-decoration primary" to="/create">
            Create Workspace
          </Link>
          <button className="primary" onClick={signOut}>
            Sign Out
          </button>
        </div>
      </div>

      {hasError && <h3>Something went wrong!</h3>}

      {loading ? (
        <div className="loading">Loading Now...</div>
      ) : workspaces.length > 0 ? (
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Workspace Name</th>
              <th>Workspace Description</th>
              <th>Number of Pdfs</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {workspaces.map(({ id, name, description, fileCount }) => (
              <tr key={id}>
                <td>
                  <Link to={`/workspaces/${id}`}>{name}</Link>
                </td>
                <td>{description}</td>
                <td>{fileCount}</td>
                <td>
                  <Link className="goto" to={`/workspaces/${id}`}>
                    Go To
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty">No Workspaces</div>
      )}
    </div>
  );
}
