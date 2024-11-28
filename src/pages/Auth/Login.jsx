import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasError, setHasError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/workspaces");
    }
  }, [user]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setHasError(false);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setHasError(true);
    }

    setLoading(false);
  };

  return (
    <div className="container items-center">
      <div className="col-6 form-widget">
        <h1 className="header">Welcome Back!</h1>

        {hasError && <h3>Invalid Credential!</h3>}

        <form className="form-widget" onSubmit={handleLogin}>
          <div>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <button className="button block primary" disabled={loading}>
              {loading ? "Please Wait ..." : "Sign In"}
            </button>
          </div>
        </form>
        <Link to="/signup">Create an account</Link>
      </div>
    </div>
  );
}
