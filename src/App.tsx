import { useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import Registration from "./Registration";

import {
  LayoutDashboard,
  Users,
  Target,
  IndianRupee,
  TrendingUp,
  UserPlus,
  Download,
  Menu,
  X,
  Search,
  Bell,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Share2,
  RefreshCw,
  Copy,
  Gift,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import "./App.css";

const API_URL = "https://backend-psi-two-78.vercel.app/api";

type RegistrationRecord = {
  name: string;
  college: string;
  year: string;
  source: string;
  status: string;
  email?: string;
  referral_code?: string;
  isDemo?: boolean;
};

type Ambassador = {
  name: string;
  college: string;
  referral_code: string;
  registrations: number;
};

const demoRegistrations: RegistrationRecord[] = [
  {
    name: "Rahul Sharma",
    college: "SRM University AP",
    year: "3rd Year",
    source: "WhatsApp",
    status: "Registered",
    referral_code: "CAMPUS01",
    isDemo: true,
  },
  {
    name: "Priya Reddy",
    college: "VIT Vellore",
    year: "Final Year",
    source: "Campus Ambassador",
    status: "Registered",
    referral_code: "CAMPUS02",
    isDemo: true,
  },
  {
    name: "Arjun Kumar",
    college: "Amrita University",
    year: "Pre-Final Year",
    source: "Campus Ambassador",
    status: "Registered",
    referral_code: "TEJA01",
    isDemo: true,
  },
  {
    name: "Sneha Patel",
    college: "SRM University AP",
    year: "Final Year",
    source: "Instagram",
    status: "Registered",
    isDemo: true,
  },
  {
    name: "Karthik Rao",
    college: "KL University",
    year: "3rd Year",
    source: "WhatsApp",
    status: "Registered",
    isDemo: true,
  },
  {
    name: "Ananya Gupta",
    college: "VIT Chennai",
    year: "Pre-Final Year",
    source: "Campus Ambassador",
    status: "Registered",
    referral_code: "CAMPUS04",
    isDemo: true,
  },
  {
    name: "Vikram Reddy",
    college: "SRM University AP",
    year: "Final Year",
    source: "LinkedIn",
    status: "Registered",
    isDemo: true,
  },
];

const ambassadorDefaults: Ambassador[] = [
  {
    name: "Ananya Singh",
    college: "VIT Vellore",
    referral_code: "CAMPUS01",
    registrations: 86,
  },
  {
    name: "Rohit Varma",
    college: "SRM University AP",
    referral_code: "CAMPUS02",
    registrations: 72,
  },
  {
    name: "Meera Nair",
    college: "Amrita University",
    referral_code: "TEJA01",
    registrations: 64,
  },
  {
    name: "Aditya Reddy",
    college: "KL University",
    referral_code: "CAMPUS04",
    registrations: 48,
  },
];

const growthData = [
  { day: "Day 1", registrations: 20 },
  { day: "Day 2", registrations: 60 },
  { day: "Day 3", registrations: 130 },
  { day: "Day 4", registrations: 210 },
  { day: "Day 5", registrations: 300 },
  { day: "Day 6", registrations: 410 },
  { day: "Day 7", registrations: 500 },
];

const channels = [
  { name: "Campus Ambassadors", value: 60, color: "#14b8a6" },
  { name: "WhatsApp", value: 20, color: "#6366f1" },
  { name: "Instagram", value: 10, color: "#ec4899" },
  { name: "Technical Clubs", value: 10, color: "#f59e0b" },
];

const navigation = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Registrations", icon: Users },
  { label: "Campaigns", icon: Target },
  { label: "Ambassadors", icon: Share2 },
  { label: "Budget", icon: IndianRupee },
];

function App() {
  if (window.location.pathname === "/register") {
    return <Registration />;
  }

  return <Dashboard />;
}

function Dashboard() {
  const [activePage, setActivePage] = useState("Overview");

  // Demo data remains visible even when the backend is empty.
  const [registrations, setRegistrations] =
    useState<RegistrationRecord[]>(demoRegistrations);

  const [ambassadors, setAmbassadors] =
    useState<Ambassador[]>(ambassadorDefaults);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const [budget, setBudget] = useState(2000);
  const [spent] = useState(1450);

  const [newName, setNewName] = useState("");
  const [newCollege, setNewCollege] = useState("");
  const [newYear, setNewYear] = useState("Pre-Final Year");
  const [newSource, setNewSource] = useState("WhatsApp");

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  const demoCount = registrations.filter((r) => r.isDemo).length;
  const actualCount = registrations.filter((r) => !r.isDemo).length;
  const totalRegistrations = registrations.length;

  const remaining = Math.max(budget - spent, 0);

  const targetPercentage = Math.min(
    Math.round((totalRegistrations / 500) * 100),
    100
  );

  // Fetch real registrations and retain demo records.
  async function fetchRegistrations() {
    try {
      const response = await fetch(`${API_URL}/registrations`);

      if (!response.ok) {
        throw new Error(`Registration API returned ${response.status}`);
      }

      const result = await response.json();

      const records = Array.isArray(result)
        ? result
        : result.registrations ?? result.data ?? [];

      if (!Array.isArray(records)) {
        throw new Error("Unexpected registration API response.");
      }

      const actualRecords: RegistrationRecord[] = records.map(
        (record: Record<string, unknown>) => {
          const referralCode = String(record.referral_code ?? "");

          const matchingAmbassador = ambassadorDefaults.find(
            (ambassador) => ambassador.referral_code === referralCode
          );

          return {
            name: String(record.name ?? "Unknown"),
            college: String(record.college ?? "Not provided"),
            year: String(
              record.year ?? record.academic_year ?? "Not specified"
            ),
            source: String(
              record.source ??
                matchingAmbassador?.name ??
                referralCode ??
                "Direct"
            ),
            status: String(record.status ?? "Registered"),
            email: record.email ? String(record.email) : undefined,
            referral_code: referralCode || undefined,
            isDemo: false,
          };
        }
      );

      // Avoid duplicates if a record appears in the API.
      const uniqueActualRecords = actualRecords.filter(
        (record, index, array) =>
          array.findIndex((other) => {
            if (record.email && other.email) {
              return (
                record.email.toLowerCase() === other.email.toLowerCase()
              );
            }

            return (
              record.name === other.name &&
              record.college === other.college
            );
          }) === index
      );

      setRegistrations([...demoRegistrations, ...uniqueActualRecords]);
      setApiError("");
    } catch (error) {
      console.error("Registration API error:", error);

      // Keep demo records visible when the backend is unavailable.
      setRegistrations(demoRegistrations);

      setApiError(
        "Backend unavailable. Demo registrations are displayed."
      );
    } finally {
      setLoading(false);
    }
  }

  async function fetchAmbassadors() {
    try {
      const response = await fetch(`${API_URL}/ambassadors`);

      if (!response.ok) {
        throw new Error(`Ambassador API returned ${response.status}`);
      }

      const result = await response.json();

      const apiAmbassadors = Array.isArray(result)
        ? result
        : result.ambassadors ?? result.data ?? [];

      if (!Array.isArray(apiAmbassadors)) {
        throw new Error("Unexpected ambassador API response.");
      }

      // Keep the preferred display names and college details.
      // Fetch the current registration counts from Flask.
      const updatedAmbassadors = ambassadorDefaults.map((defaultItem) => {
        const apiRecord = apiAmbassadors.find(
          (item: Record<string, unknown>) =>
            String(item.referral_code ?? "") ===
            defaultItem.referral_code
        );

        const countFromApi = apiRecord
          ? Number(apiRecord.registrations ?? 0)
          : 0;

        return {
          ...defaultItem,
          registrations: countFromApi,
        };
      });

      setAmbassadors(updatedAmbassadors);
    } catch (error) {
      console.error("Ambassador API error:", error);

      // Keep example ambassador figures available for the demo.
      setAmbassadors(ambassadorDefaults);
    }
  }

  async function refreshDashboard() {
    await Promise.all([fetchRegistrations(), fetchAmbassadors()]);
  }

  useEffect(() => {
    void refreshDashboard();
  }, []);

  // Count actual registrations by referral code.
  // Demo figures are kept separate from these live counts.
  const actualAmbassadorCounts = ambassadorDefaults.map((ambassador) => ({
    ...ambassador,
    registrations: registrations.filter(
      (record) =>
        !record.isDemo &&
        record.referral_code === ambassador.referral_code
    ).length,
  }));

  const filteredRegistrations = registrations.filter((record) =>
    `${record.name} ${record.college} ${record.source} ${
      record.email ?? ""
    } ${record.referral_code ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function addRegistration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const newRecord: RegistrationRecord = {
      name: newName,
      college: newCollege,
      year: newYear,
      source: newSource,
      status: "Demo",
      isDemo: true,
    };

    setRegistrations((previous) => [newRecord, ...previous]);

    setNewName("");
    setNewCollege("");
    setNewYear("Pre-Final Year");
    setNewSource("WhatsApp");
    setShowForm(false);
  }

  function exportCSV() {
    const header =
      "Name,Email,College,Year,Source,Referral Code,Status,Record Type";

    const rows = registrations.map((record) =>
      [
        record.name,
        record.email ?? "",
        record.college,
        record.year,
        record.source,
        record.referral_code ?? "",
        record.status,
        record.isDemo ? "Demo" : "Actual",
      ]
        .map((value) => `"${value.replaceAll('"', '""')}"`)
        .join(",")
    );

    const blob = new Blob([[header, ...rows].join("\n")], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "growth-registrations.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  function changeBudget() {
    const value = window.prompt(
      "Enter total campaign budget (₹):",
      String(budget)
    );

    if (value && Number.isFinite(Number(value)) && Number(value) > 0) {
      setBudget(Number(value));
    }
  }

  async function copyCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      window.alert(`Promocode ${code} copied!`);
    } catch {
      window.prompt("Copy this promocode:", code);
    }
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">N</div>

          <div>
            <h2>
              growth<span>lab.</span>
            </h2>
            <p>CAMPAIGN WORKSPACE</p>
          </div>

          <button
            className="mobile-close"
            onClick={() => setMobileMenu(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="workspace-label">WORKSPACE</div>

        <nav className="nav-list">
          {navigation.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${
                activePage === label ? "active" : ""
              }`}
              onClick={() => {
                setActivePage(label);
                setMobileMenu(false);
              }}
            >
              <Icon size={19} />
              <span>{label}</span>

              {label === "Registrations" && (
                <span className="nav-count">{totalRegistrations}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-campaign">
          <div className="campaign-icon">
            <Target size={19} />
          </div>

          <span className="eyebrow">ACTIVE CAMPAIGN</span>
          <h3>Build Your First AI Project</h3>
          <p>Free online workshop · 60 min</p>

          <div className="campaign-progress">
            <span style={{ width: `${targetPercentage}%` }} />
          </div>

          <div className="progress-caption">
            <span>{totalRegistrations} demo/live records</span>
            <b>{targetPercentage}%</b>
          </div>
        </div>

        <div className="sidebar-bottom">
          <div className="profile-avatar">TM</div>
          <div className="profile-info">
            <strong>Campaign Manager</strong>
            <span>Growth Team</span>
          </div>
          <span className="online-dot" />
        </div>
      </aside>

      {mobileMenu && (
        <button
          className="mobile-overlay"
          onClick={() => setMobileMenu(false)}
          aria-label="Close navigation"
        />
      )}

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="menu-button"
              onClick={() => setMobileMenu(true)}
              aria-label="Open menu"
            >
              <Menu />
            </button>

            <div className="breadcrumb">
              Workspace <span>/</span> <strong>{activePage}</strong>
            </div>
          </div>

          <div className="topbar-right">
            <span className="live-status">
              <span />
              Demo workspace
            </span>

            <button
              className="icon-button"
              aria-label="Notifications"
            >
              <Bell size={19} />
            </button>

            <div className="top-avatar">TM</div>
          </div>
        </header>

        <div className="page-container">
          <section className="page-heading">
            <div>
              <div className="date-label">
                <CalendarDays size={14} />
                7-DAY CAMPAIGN
              </div>

              <h1>
                {activePage === "Overview"
                  ? "Growth Campaign Overview"
                  : activePage}
              </h1>

              <p>
                {activePage === "Overview"
                  ? "Track registrations, ambassadors, and campaign performance."
                  : `Track and manage your ${activePage.toLowerCase()}.`}
              </p>
            </div>

            <div className="heading-actions">
              <button
                className="button button-secondary"
                onClick={exportCSV}
              >
                <Download size={16} />
                Export CSV
              </button>

              <button
                className="button button-secondary"
                onClick={() => void refreshDashboard()}
              >
                <RefreshCw size={16} />
                Refresh
              </button>

              <button
                className="button button-primary"
                onClick={() => setShowForm(true)}
              >
                <UserPlus size={17} />
                Add demo student
              </button>
            </div>
          </section>

          {apiError && (
            <div
              role="status"
              style={{
                padding: "12px 16px",
                marginBottom: "16px",
                borderRadius: "8px",
                background: "#fff7ed",
                color: "#9a3412",
              }}
            >
              {apiError}
            </div>
          )}

          {activePage === "Overview" && (
            <>
              <section className="campaign-banner">
                <div className="banner-content">
                  <div className="banner-tag">
                    <span />
                    REGISTRATION CAMPAIGN
                  </div>

                  <h2>
                    Build Your First AI Project
                    <br />
                    <span>in 60 Minutes.</span>
                  </h2>

                  <p>
                    A free, hands-on AI workshop designed for pre-final-year
                    and final-year engineering students.
                  </p>

                  <div className="banner-details">
                    <span>
                      <CalendarDays size={15} />
                      7-day outreach sprint
                    </span>

                    <span>
                      <Users size={15} />
                      Target: 500 students
                    </span>
                  </div>
                </div>

                <div className="banner-visual">
                  <div className="visual-orbit orbit-one" />
                  <div className="visual-orbit orbit-two" />

                  <div className="visual-core">
                    AI<span>✳</span>
                  </div>

                  <div className="floating-chip chip-one">
                    01 · Discover
                  </div>

                  <div className="floating-chip chip-two">
                    02 · Build
                  </div>

                  <div className="floating-chip chip-three">
                    03 · Launch
                  </div>
                </div>
              </section>

              <section className="stats-grid">
                <StatCard
                  label="Demo + live records"
                  value={loading ? "..." : String(totalRegistrations)}
                  change={`${demoCount} demo`}
                  note={`${actualCount} actual`}
                  icon={<Users />}
                  tone="purple"
                />

                <StatCard
                  label="Campaign target"
                  value="500"
                  change={`${targetPercentage}%`}
                  note="of target records"
                  icon={<Target />}
                  tone="green"
                />

                <StatCard
                  label="Budget remaining"
                  value={`₹${remaining.toLocaleString("en-IN")}`}
                  change={`${Math.round((spent / budget) * 100)}%`}
                  note="budget spent"
                  icon={<IndianRupee />}
                  tone="orange"
                />

                <StatCard
                  label="Campus ambassadors"
                  value={String(ambassadors.length)}
                  change="4 promocodes"
                  note="configured for demo"
                  icon={<Gift />}
                  tone="blue"
                />
              </section>

              <section className="charts-grid">
                <div className="panel growth-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Registration growth target</h3>
                      <p>Planned cumulative registrations over seven days</p>
                    </div>

                    <span className="chart-period">7 days</span>
                  </div>

                  <div className="chart-legend">
                    <span />
                    Planned registrations
                  </div>

                  <div className="area-chart">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={growthData}
                        margin={{
                          top: 12,
                          right: 8,
                          left: -20,
                          bottom: 0,
                        }}
                      >
                        <defs>
                          <linearGradient
                            id="growthGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#7565e8"
                              stopOpacity={0.23}
                            />
                            <stop
                              offset="100%"
                              stopColor="#7565e8"
                              stopOpacity={0.01}
                            />
                          </linearGradient>
                        </defs>

                        <CartesianGrid
                          stroke="#ececf3"
                          strokeDasharray="4 4"
                          vertical={false}
                        />

                        <XAxis
                          dataKey="day"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#9293a5", fontSize: 11 }}
                          dy={9}
                        />

                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#9293a5", fontSize: 11 }}
                        />

                        <Tooltip />

                        <Area
                          type="monotone"
                          dataKey="registrations"
                          stroke="#7565e8"
                          strokeWidth={3}
                          fill="url(#growthGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <p className="table-footnote">
                    Planned targets only; not actual campaign results.
                  </p>
                </div>

                <div className="panel channel-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Acquisition channels</h3>
                      <p>Illustrative campaign plan</p>
                    </div>
                  </div>

                  <div className="donut-wrap">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={channels}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={63}
                          outerRadius={88}
                          paddingAngle={4}
                          stroke="none"
                        >
                          {channels.map((channel) => (
                            <Cell
                              key={channel.name}
                              fill={channel.color}
                            />
                          ))}
                        </Pie>

                        <Tooltip
                          formatter={(value) => `${value}%`}
                        />
                      </PieChart>
                    </ResponsiveContainer>

                    <div className="donut-center">
                      <strong>4</strong>
                      <span>channels</span>
                    </div>
                  </div>

                  <div className="channel-legend">
                    {channels.map((channel) => (
                      <div
                        className="channel-row"
                        key={channel.name}
                      >
                        <span
                          className="channel-dot"
                          style={{ background: channel.color }}
                        />

                        <span>{channel.name}</span>
                        <strong>{channel.value}%</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Ambassador summary visible directly in Overview */}
              <section className="panel full-panel">
                <div className="panel-heading">
                  <div>
                    <h3>Campus ambassador team</h3>
                    <p>
                      Names, referral promocodes, and demo performance
                    </p>
                  </div>

                  <button
                    className="text-button"
                    onClick={() => setActivePage("Ambassadors")}
                  >
                    View leaderboard <ArrowUpRight size={15} />
                  </button>
                </div>

                <div className="ambassador-cards">
                  {ambassadors.map((ambassador, index) => (
                    <div
                      className="ambassador-card"
                      key={ambassador.referral_code}
                    >
                      <div className="ambassador-card-top">
                        <div className={`student-avatar avatar-${index % 4}`}>
                          {ambassador.name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)}
                        </div>

                        <span className="status-pill status-registered">
                          Ambassador
                        </span>
                      </div>

                      <h3>{ambassador.name}</h3>
                      <p>{ambassador.college}</p>

                      <div className="promo-code-box">
                        <div>
                          <small>PROMOCODE</small>
                          <strong>{ambassador.referral_code}</strong>
                        </div>

                        <button
                          className="icon-button"
                          title="Copy promocode"
                          aria-label={`Copy ${ambassador.referral_code}`}
                          onClick={() =>
                            void copyCode(ambassador.referral_code)
                          }
                        >
                          <Copy size={16} />
                        </button>
                      </div>

                      <div className="ambassador-card-bottom">
                        <span>API registrations</span>
                        <strong>{ambassador.registrations}</strong>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="table-footnote">
                  Ambassador names are demo display names. Replace them
                  with the actual team members' names when confirmed.
                  Registration counts are fetched from the backend when
                  available.
                </p>
              </section>

              <section className="bottom-grid">
                <div className="panel registrations-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Recent registrations</h3>
                      <p>Demo and backend records</p>
                    </div>

                    <button
                      className="text-button"
                      onClick={() => setActivePage("Registrations")}
                    >
                      View all <ArrowUpRight size={15} />
                    </button>
                  </div>

                  <RegistrationTable data={registrations.slice(0, 5)} />
                </div>

                <div className="panel budget-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Budget overview</h3>
                      <p>Campaign spending tracker</p>
                    </div>

                    <IndianRupee size={19} />
                  </div>

                  <div className="budget-amount">
                    <strong>₹{spent.toLocaleString("en-IN")}</strong>
                    <span>of ₹{budget.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="budget-track">
                    <span
                      style={{
                        width: `${Math.min((spent / budget) * 100, 100)}%`,
                      }}
                    />
                  </div>

                  <div className="budget-caption">
                    <span>
                      {Math.round((spent / budget) * 100)}% utilised
                    </span>

                    <strong>
                      ₹{remaining.toLocaleString("en-IN")} left
                    </strong>
                  </div>

                  <div className="budget-divider" />

                  <div className="budget-line">
                    <span>Campaign budget</span>
                    <strong>₹{budget.toLocaleString("en-IN")}</strong>
                  </div>

                  <div className="budget-line">
                    <span>Spent so far</span>
                    <strong>₹{spent.toLocaleString("en-IN")}</strong>
                  </div>

                  <button
                    className="button button-secondary budget-button"
                    onClick={changeBudget}
                  >
                    Manage budget <ArrowUpRight size={15} />
                  </button>
                </div>
              </section>
            </>
          )}

          {activePage === "Registrations" && (
            <section className="panel full-panel">
              <div className="panel-heading">
                <div>
                  <h3>Student registrations</h3>
                  <p>Search demo and actual registration records</p>
                </div>

                <div className="search-box">
                  <Search size={17} />

                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search name, college or promocode..."
                  />
                </div>
              </div>

              <div className="stats-grid">
                <StatCard
                  label="All records"
                  value={String(totalRegistrations)}
                  change="Demo + actual"
                  note="combined"
                  icon={<Users />}
                  tone="purple"
                />

                <StatCard
                  label="Demo records"
                  value={String(demoCount)}
                  change="Sample"
                  note="not actual sign-ups"
                  icon={<UserPlus />}
                  tone="orange"
                />

                <StatCard
                  label="Actual records"
                  value={String(actualCount)}
                  change="Backend"
                  note="loaded from API"
                  icon={<CheckCircle2 />}
                  tone="green"
                />

                <StatCard
                  label="Campaign target"
                  value="500"
                  change={`${targetPercentage}%`}
                  note="combined record count"
                  icon={<Target />}
                  tone="blue"
                />
              </div>

              <RegistrationTable data={filteredRegistrations} />

              <p className="table-footnote">
                Demo records are examples for presentation. Actual records
                come from the backend. Adding a demo student does not save
                it to Flask.
              </p>
            </section>
          )}

          {activePage === "Campaigns" && (
            <section className="panel full-panel">
              <div className="panel-heading">
                <div>
                  <h3>Active campaign</h3>
                  <p>Workshop promotion plan</p>
                </div>

                <span className="status-pill status-registered">
                  Planned
                </span>
              </div>

              <div className="campaign-list-card">
                <div className="campaign-list-icon">
                  <Target size={23} />
                </div>

                <div className="campaign-list-info">
                  <span className="eyebrow">ONLINE WORKSHOP</span>

                  <h3>
                    Build Your First AI Project in 60 Minutes
                  </h3>

                  <p>
                    Audience: pre-final-year and final-year engineering
                    students
                  </p>

                  <div className="campaign-progress wide-progress">
                    <span style={{ width: `${targetPercentage}%` }} />
                  </div>

                  <small>
                    {totalRegistrations} combined demo/live records out
                    of a 500 target
                  </small>
                </div>
              </div>

              <div className="campaign-note">
                <CheckCircle2 size={19} />

                <div>
                  <strong>Recommended next action</strong>
                  <p>
                    Share ambassador promocodes in college groups and
                    measure verified registrations.
                  </p>
                </div>
              </div>
            </section>
          )}

          {activePage === "Ambassadors" && (
            <section className="panel full-panel">
              <div className="panel-heading">
                <div>
                  <h3>Ambassador leaderboard</h3>
                  <p>Promocodes and registration counts</p>
                </div>

                <button
                  className="button button-secondary"
                  onClick={fetchAmbassadors}
                >
                  <RefreshCw size={16} />
                  Refresh
                </button>
              </div>

              <div className="ambassador-cards">
                {ambassadors.map((ambassador, index) => (
                  <div
                    className="ambassador-card"
                    key={ambassador.referral_code}
                  >
                    <div className="ambassador-card-top">
                      <div className={`student-avatar avatar-${index % 4}`}>
                        {ambassador.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)}
                      </div>

                      <span className="leader-rank">
                        #{index + 1}
                      </span>
                    </div>

                    <h3>{ambassador.name}</h3>
                    <p>{ambassador.college}</p>

                    <div className="promo-code-box">
                      <div>
                        <small>REFERRAL PROMOCODE</small>
                        <strong>{ambassador.referral_code}</strong>
                      </div>

                      <button
                        className="icon-button"
                        title="Copy promocode"
                        onClick={() =>
                          void copyCode(ambassador.referral_code)
                        }
                      >
                        <Copy size={16} />
                      </button>
                    </div>

                    <div className="ambassador-card-bottom">
                      <span>API registrations</span>
                      <strong>{ambassador.registrations}</strong>
                    </div>
                  </div>
                ))}
              </div>

              <p className="table-footnote">
                Names and colleges are illustrative. Confirm the actual
                ambassador identities before publishing.
              </p>

              <div className="panel-heading">
                <div>
                  <h3>Actual referral performance</h3>
                  <p>Registrations submitted to the backend</p>
                </div>
              </div>

              <div className="leaderboard">
                {actualAmbassadorCounts
                  .sort((a, b) => b.registrations - a.registrations)
                  .map((ambassador, index) => (
                    <div
                      className="leader-row"
                      key={ambassador.referral_code}
                    >
                      <span className="leader-rank">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div className="leader-details">
                        <strong>{ambassador.name}</strong>
                        <span>{ambassador.referral_code}</span>
                      </div>

                      <div className="leader-bar">
                        <span
                          style={{
                            width: `${
                              (ambassador.registrations /
                                Math.max(
                                  ...actualAmbassadorCounts.map(
                                    (item) => item.registrations
                                  ),
                                  1
                                )) *
                              100
                            }%`,
                          }}
                        />
                      </div>

                      <strong className="leader-count">
                        {ambassador.registrations}{" "}
                        <small>actual</small>
                      </strong>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {activePage === "Budget" && (
            <section className="panel full-panel">
              <div className="panel-heading">
                <div>
                  <h3>Campaign budget</h3>
                  <p>Seven-day campaign allocation</p>
                </div>
              </div>

              <div className="budget-big-grid">
                <div className="budget-summary-card">
                  <span>Total budget</span>
                  <strong>₹{budget.toLocaleString("en-IN")}</strong>
                  <p>Planned for seven days</p>
                </div>

                <div className="budget-summary-card">
                  <span>Spent</span>
                  <strong>₹{spent.toLocaleString("en-IN")}</strong>
                  <p>Manually recorded expenses</p>
                </div>

                <div className="budget-summary-card">
                  <span>Remaining</span>
                  <strong>₹{remaining.toLocaleString("en-IN")}</strong>
                  <p>Available budget</p>
                </div>
              </div>

              <div className="budget-breakdown">
                <div>
                  <span>Creative materials</span>
                  <strong>₹500</strong>
                </div>

                <div>
                  <span>Referral incentives</span>
                  <strong>₹600</strong>
                </div>

                <div>
                  <span>Digital promotion</span>
                  <strong>₹600</strong>
                </div>

                <div>
                  <span>Contingency</span>
                  <strong>₹300</strong>
                </div>
              </div>

              <button
                className="button button-primary"
                onClick={changeBudget}
              >
                Edit total budget
              </button>

              <p className="table-footnote">
                Planned budget allocation totals ₹2,000. Actual expenses
                must be entered separately.
              </p>
            </section>
          )}

          <footer className="footer">
            <span>
              growthlab. <b>·</b> Campaign workspace
            </span>

            <span>
              Prototype dashboard <b>·</b> 2026
            </span>
          </footer>
        </div>
      </main>

      {showForm && (
        <div
          className="modal-backdrop"
          onClick={() => setShowForm(false)}
        >
          <form
            className="student-modal"
            onSubmit={addRegistration}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => setShowForm(false)}
              aria-label="Close form"
            >
              <X size={19} />
            </button>

            <div className="modal-icon">
              <UserPlus size={22} />
            </div>

            <h2>Add a demo student</h2>
            <p>This creates a temporary sample record.</p>

            <label>
              Student name
              <input
                required
                value={newName}
                onChange={(event) => setNewName(event.target.value)}
                placeholder="Enter full name"
              />
            </label>

            <label>
              College / university
              <input
                required
                value={newCollege}
                onChange={(event) => setNewCollege(event.target.value)}
                placeholder="Enter college name"
              />
            </label>

            <div className="form-row">
              <label>
                Academic year
                <select
                  value={newYear}
                  onChange={(event) => setNewYear(event.target.value)}
                >
                  <option>Pre-Final Year</option>
                  <option>3rd Year</option>
                  <option>Final Year</option>
                </select>
              </label>

              <label>
                Source
                <select
                  value={newSource}
                  onChange={(event) => setNewSource(event.target.value)}
                >
                  <option>WhatsApp</option>
                  <option>Instagram</option>
                  <option>Campus Ambassador</option>
                  <option>LinkedIn</option>
                  <option>Technical Club</option>
                </select>
              </label>
            </div>

            <button
              className="button button-primary modal-submit"
              type="submit"
            >
              <UserPlus size={17} />
              Add demo student
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  change,
  note,
  icon,
  tone,
}: {
  label: string;
  value: string;
  change: string;
  note: string;
  icon: ReactNode;
  tone: string;
}) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>{icon}</div>

      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>

      <div className="stat-footer">
        <span className="stat-change">
          <TrendingUp size={13} /> {change}
        </span>

        <span>{note}</span>
      </div>
    </div>
  );
}

function RegistrationTable({
  data,
}: {
  data: RegistrationRecord[];
}) {
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>STUDENT</th>
            <th>ACADEMIC YEAR</th>
            <th>SOURCE / PROMOCODE</th>
            <th>STATUS</th>
          </tr>
        </thead>

        <tbody>
          {data.map((record, index) => (
            <tr key={`${record.email ?? record.name}-${index}`}>
              <td>
                <div className="student-cell">
                  <div className={`student-avatar avatar-${index % 4}`}>
                    {record.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)}
                  </div>

                  <div>
                    <strong>{record.name}</strong>
                    <span>{record.college}</span>

                    {record.email && <span>{record.email}</span>}
                  </div>
                </div>
              </td>

              <td>{record.year}</td>

              <td>
                <span className="source-label">
                  {record.referral_code || record.source}
                </span>
              </td>

              <td>
                <span
                  className={`status-pill ${
                    record.isDemo
                      ? "status-pending"
                      : "status-registered"
                  }`}
                >
                  {record.isDemo ? (
                    <Clock3 size={13} />
                  ) : (
                    <CheckCircle2 size={13} />
                  )}

                  {record.isDemo ? "Demo" : record.status}
                </span>
              </td>
            </tr>
          ))}

          {data.length === 0 && (
            <tr>
              <td colSpan={4} className="empty-state">
                No matching registrations found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;