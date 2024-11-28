import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabaseClient";

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasError, setHasError] = useState(null);

  const handleSignUp = async (event) => {
    event.preventDefault();
    setHasError(false);
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);
    if (error) {
      setHasError(true);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="container items-center">
      <div className="col-6 form-widget">
        <h1 className="header">Sign Up</h1>

        {hasError && <h3>Something went wrong!</h3>}

        <form className="form-widget" onSubmit={handleSignUp}>
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
              {loading ? "Please Wait ..." : "Sign Up"}
            </button>
          </div>
        </form>
        <Link to="/">Sign in</Link>
      </div>
    </div>
  );
}
