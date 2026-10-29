import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowRight, CheckCircle2, Sparkles, Users, Zap } from "lucide-react";
import "./Registration.css";

const API_URL = "https://backend-psi-two-78.vercel.app";

export default function Registration() {
  const [searchParams] = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [college, setCollege] = useState("");
  const [year, setYear] = useState("Final year");
  const [referralCode, setReferralCode] = useState(
    searchParams.get("ref")?.toUpperCase() || ""
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setSuccess(false);

    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          college,
          year,
          referral_code: referralCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      setSuccess(true);
      setMessage("You're registered! Get ready to build your first AI project.");
      setName("");
      setEmail("");
      setCollege("");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to connect to the registration server."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="registration-page">
      <nav className="registration-nav">
        <a className="registration-brand" href="/">
          <span className="brand-mark">N</span>
          <span>NxtWave <small>GROWTH CHALLENGE</small></span>
        </a>
        <span className="free-badge">100% FREE WORKSHOP</span>
      </nav>

      <section className="registration-hero">
        <div className="registration-copy">
          <div className="eyebrow"><Sparkles size={15} /> YOUR AI JOURNEY STARTS HERE</div>
          <h1>Build Your First <span>AI Project</span> in 60 Minutes.</h1>
          <p className="hero-description">
            Stop just learning about AI. Start building with it.
            Join a practical online workshop designed for engineering students.
          </p>

          <div className="benefit-list">
            <div><CheckCircle2 /> Build a practical AI project</div>
            <div><CheckCircle2 /> Learn by doing, not just watching</div>
            <div><CheckCircle2 /> No prior AI experience required</div>
          </div>

          <div className="social-proof">
            <span className="social-proof-icon"><Users size={20} /></span>
            <div><strong>Your next project starts here.</strong><small>For pre-final-year and final-year engineering students</small></div>
          </div>
        </div>

        <div className="registration-card">
          <div className="card-icon"><Zap size={22} /></div>
          <p className="card-kicker">SAVE YOUR FREE SPOT</p>
          <h2>Register for the workshop</h2>
          <p className="card-subtitle">Fill in your details to reserve your place.</p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="student-name">Full name</label>
            <input
              id="student-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
              maxLength={100}
            />

            <label htmlFor="student-email">Email address</label>
            <input
              id="student-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              maxLength={254}
            />

            <label htmlFor="student-college">Engineering college</label>
            <input
              id="student-college"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              placeholder="Enter your college name"
              required
              maxLength={150}
            />

            <label htmlFor="student-year">Year of study</label>
            <select
              id="student-year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            >
              <option>Pre-final year</option>
              <option>Final year</option>
            </select>

            <label htmlFor="referral-code">Ambassador referral code <span>(optional)</span></label>
            <input
              id="referral-code"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
              placeholder="e.g. CAMPUS01"
              maxLength={30}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register for free"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          {message && (
            <div className={`registration-message ${success ? "success" : "error"}`} role="status">
              {message}
            </div>
          )}

          <p className="privacy-note">Free to attend · No payment required</p>
        </div>
      </section>

      <footer className="registration-footer">
        <span>Made for the next generation of builders.</span>
        <span>Learn AI. Build something real.</span>
      </footer>
    </main>
  );
}