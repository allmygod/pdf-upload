import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";

export default function Create() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [hasError, setHasError] = useState(null);
  const { user } = useAuth();

  const createWorkspace = async (event) => {
    event.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("workspaces")
      .insert({ name, description, ownerid: user.id });

    setLoading(false);
    if (error) {
      setHasError(true);
    } else {
      navigate("/workspaces");
    }
  };

  return (
    <div className="container items-center">
      <div className="col-6 form-widget">
        <h1 className="header">Create Workspace</h1>

        {hasError && <h3>Something went wrong!</h3>}

        <form className="form-widget" onSubmit={createWorkspace}>
          <div>
            <input
              type="text"
              placeholder="Workspace Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Workspace Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <button className="button block primary" disabled={loading}>
              {loading ? "Please Wait ..." : "Create"}
            </button>
          </div>
        </form>

        <Link className="button block no-decoration primary" to="/workspaces">
          Back
        </Link>
      </div>
    </div>
  );
}
