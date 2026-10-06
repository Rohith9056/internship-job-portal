import { useEffect, useState } from 'react';
import './responsive.css';
function App() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminToken, setAdminToken] = useState('');
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [domain, setDomain] = useState('');
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [selectedMode, setSelectedMode] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [submittedOpportunity, setSubmittedOpportunity] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newDomain, setNewDomain] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newExperience, setNewExperience] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newApplicationLink, setNewApplicationLink] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editCompany, setEditCompany] = useState('');
  const [editDomain, setEditDomain] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editExperience, setEditExperience] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editApplicationLink, setEditApplicationLink] = useState('');
  const loadApplications = async (token = adminToken) => {
    if (!token) return;
try {
  const response = await fetch(
    'https://internship-job-portal-2.onrender.com/api/applications',
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error(data.message);
    return;
  }

  setApplications(data);
} catch (error) {
  console.error('Load applications error:', error);
}

  };
  const handleAdminLogin = async (event) => {
    event.preventDefault();
    setAdminError('');
try {
  const response = await fetch(
    'https://internship-job-portal-2.onrender.com/api/admin/login',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: adminUsername,
        password: adminPassword
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    setAdminError(data.message || 'Login failed');
    return;
  }

  setAdminToken(data.token);
  setIsAdminLoggedIn(true);
  setShowAdminLogin(false);
  setAdminUsername('');
  setAdminPassword('');

  loadApplications(data.token);
} catch (error) {
  console.error(error);
  setAdminError('Unable to connect to the backend');
}

  };
  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminToken('');
    setApplications([]);
    setSelectedOpportunity(null);
    setSelectedMode('');
    setConfirmationMessage('');
  };
  const addOpportunity = async () => {
    if (!isAdminLoggedIn || !adminToken) {
      alert('Please login as admin first.');
      return;
    }
if (
  !newTitle.trim() ||
  !newCompany.trim() ||
  !newDomain.trim() ||
  !newLocation.trim() ||
  !newExperience.trim() ||
  !newDescription.trim() ||
  !newApplicationLink.trim()
) {
  alert('Please fill all opportunity fields.');
  return;
}

const opportunityData = {
  title: newTitle.trim(),
  company: newCompany.trim(),
  domain: newDomain.trim(),
  location: newLocation.trim(),
  experience: newExperience.trim(),
  description: newDescription.trim(),
  applicationLink: newApplicationLink.trim()
};

try {
  const response = await fetch(
    'https://internship-job-portal-2.onrender.com/api/opportunities',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify(opportunityData)
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to add opportunity');
  }

  setOpportunities((current) => [...current, data]);

  setNewTitle('');
  setNewCompany('');
  setNewDomain('');
  setNewLocation('');
  setNewExperience('');
  setNewDescription('');
  setNewApplicationLink('');

  setSelectedMode('');
  setConfirmationMessage('Opportunity added successfully!');
} catch (error) {
  alert('Failed to add opportunity: ' + error.message);
}

  };
  const updateOpportunity = async () => {
    if (!isAdminLoggedIn || !adminToken || !selectedOpportunity) {
      alert('Please login as admin first.');
      return;
    }
try {
  const response = await fetch(
    `https://internship-job-portal-2.onrender.com/api/opportunities/${selectedOpportunity._id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        title: editTitle,
        company: editCompany,
        domain: editDomain,
        location: editLocation,
        experience: editExperience,
        description: editDescription,
        applicationLink: editApplicationLink
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update opportunity');
  }

  setOpportunities((current) =>
    current.map((item) =>
      item._id === selectedOpportunity._id
        ? data.opportunity
        : item
    )
  );

  setSelectedOpportunity(data.opportunity);
  setSelectedMode('view');
  setConfirmationMessage(
    data.message || 'Opportunity updated successfully!'
  );
} catch (error) {
  alert('Failed to update opportunity: ' + error.message);
}

  };
  const deleteOpportunity = async (opportunityId) => {
    if (!isAdminLoggedIn || !adminToken) {
      alert('Please login as admin first.');
      return;
    }
if (!window.confirm('Are you sure you want to delete this opportunity?')) {
  return;
}

try {
  const response = await fetch(
    `https://internship-job-portal-2.onrender.com/api/opportunities/${opportunityId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${adminToken}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete opportunity');
  }

  setOpportunities((current) =>
    current.filter((item) => item._id !== opportunityId)
  );

  setSelectedOpportunity(null);
  setSelectedMode('');
  setConfirmationMessage(
    data.message || 'Opportunity deleted successfully!'
  );
} catch (error) {
  alert('Failed to delete opportunity: ' + error.message);
}

  };
  const submitApplication = async () => {
    if (!name.trim() || !email.trim()) {
      alert('Please enter your name and email.');
      return;
    }
if (!selectedOpportunity) {
  alert('Please select an opportunity.');
  return;
}

try {
  const response = await fetch(
    'https://internship-job-portal-2.onrender.com/api/applications',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        opportunityId: selectedOpportunity._id
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    alert(data.message || 'Failed to submit application');
    return;
  }

  setSubmittedOpportunity(selectedOpportunity);
  setConfirmationMessage('Application submitted successfully!');
  setName('');
  setEmail('');
  setSelectedOpportunity(null);
  setSelectedMode('');

  if (isAdminLoggedIn && adminToken) {
    loadApplications(adminToken);
  }
} catch (error) {
  alert('Failed to submit application: ' + error.message);
}

  };
  const deleteApplication = async (applicationId) => {
    if (!isAdminLoggedIn || !adminToken) {
      alert('Please login as admin first.');
      return;
    }
if (!window.confirm('Are you sure you want to delete this application?')) {
  return;
}

try {
  const response = await fetch(
    `https://internship-job-portal-2.onrender.com/api/applications/${applicationId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${adminToken}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete application');
  }

  setApplications((current) =>
    current.filter((item) => item._id !== applicationId)
  );

  setConfirmationMessage(
    data.message || 'Application deleted successfully!'
  );
} catch (error) {
  alert('Failed to delete application: ' + error.message);
}

  };
  useEffect(() => {
    setIsLoading(true);
    setLoadError('');
fetch('https://internship-job-portal-2.onrender.com/api/opportunities')
  .then((response) => response.json())
  .then((data) => {
    setOpportunities(data);
    setIsLoading(false);
  })
  .catch((error) => {
    console.error(error);
    setLoadError('Unable to load opportunities. Please try again.');
    setIsLoading(false);
  });

  }, []);
  const filteredOpportunities = opportunities.filter(
    (opportunity) =>
      (
        opportunity.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        opportunity.company
          .toLowerCase()
          .includes(search.toLowerCase())
      ) &&
      (domain === '' || opportunity.domain === domain)
  );
  const startEdit = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setSelectedMode('edit');
setEditTitle(opportunity.title);
setEditCompany(opportunity.company);
setEditDomain(opportunity.domain);
setEditLocation(opportunity.location);
setEditExperience(opportunity.experience);
setEditDescription(opportunity.description);
setEditApplicationLink(opportunity.applicationLink);

  };
  if (showAdminLogin) {
    return (
      <div
        className="login-screen"
        style={{
          minHeight: '100vh',
          padding: '40px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f5f7fb'
        }}
      >
        <div
          className="login-card"
          style={{
            backgroundColor: '#ffffff',
            padding: '35px',
            borderRadius: '12px',
            width: '400px',
            maxWidth: '100%',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
          }}
        >
          <h2>Admin Login</h2>
      <p style={{ color: '#666', marginBottom: '25px' }}>
        Login to manage opportunities and applications.
      </p>

      <form onSubmit={handleAdminLogin}>
        <label
          style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 'bold'
          }}
        >
          Username
        </label>

        <input
          type="text"
          value={adminUsername}
          onChange={(event) =>
            setAdminUsername(event.target.value)
          }
          placeholder="Enter username"
          required
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '18px',
            boxSizing: 'border-box'
          }}
        />

        <label
          style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 'bold'
          }}
        >
          Password
        </label>

        <input
          type="password"
          value={adminPassword}
          onChange={(event) =>
            setAdminPassword(event.target.value)
          }
          placeholder="Enter password"
          required
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '18px',
            boxSizing: 'border-box'
          }}
        />

        {adminError && (
          <p style={{ color: '#dc2626' }}>
            {adminError}
          </p>
        )}

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Login
        </button>
      </form>

      <button
        onClick={() => {
          setShowAdminLogin(false);
          setAdminError('');
          setAdminUsername('');
          setAdminPassword('');
        }}
        style={{
          marginTop: '15px',
          width: '100%',
          padding: '10px',
          backgroundColor: '#ffffff',
          color: '#333',
          border: '1px solid #ccc',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        ← Back to Opportunities
      </button>
    </div>
  </div>
);

  }
  return (
    <div
      className="portal-root"
      style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '30px',
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#eef3f8'
      }}
    >
      <style>{`
        * {
          box-sizing: border-box;
        }
    html,
    body,
    #root {
      margin: 0;
      min-height: 100%;
    }

    body {
      font-family: Inter, ui-sans-serif, -apple-system,
        BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
      background: linear-gradient(
        135deg,
        #eef2ff 0%,
        #f5f3ff 50%,
        #eaf6ff 100%
      );
      color: #172033;
    }

    button,
    input,
    select,
    textarea {
      font: inherit;
    }

    button,
    a {
      transition: all 160ms ease;
    }

    button:hover,
    a:hover {
      transform: translateY(-1px);
    }

    .portal-root {
      width: 100%;
      max-width: 1180px !important;
      min-height: 100vh !important;
      margin: 0 auto !important;
      padding: 32px 24px 60px !important;
      background: transparent !important;
    }

    .portal-root > div {
      border: 1px solid #e5eaf1 !important;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
    }

    .portal-root > div:first-of-type {
      position: relative;
      overflow: hidden;
      padding: 34px !important;
      border-radius: 20px !important;
      background: linear-gradient(
        135deg,
        #ffffff 0%,
        #f8fbff 100%
      ) !important;
    }

    .portal-root > div:first-of-type::before {
      content: "";
      position: absolute;
      width: 180px;
      height: 180px;
      right: -55px;
      top: -65px;
      border-radius: 50%;
      background: rgba(37, 99, 235, 0.08);
      pointer-events: none;
    }

    .portal-root > div:first-of-type h1 {
      position: relative;
      font-size: clamp(28px, 4vw, 40px) !important;
      line-height: 1.15;
      margin: 0 0 10px !important;
      color: #0f172a !important;
    }

    .portal-root > div:first-of-type p {
      position: relative;
      font-size: 16px !important;
      color: #64748b !important;
    }

    .portal-root input,
    .portal-root select,
    .portal-root textarea {
      border: 1px solid #d8e0ea !important;
      border-radius: 10px !important;
      background: #ffffff !important;
      color: #172033 !important;
    }

    .portal-root input:focus,
    .portal-root select:focus,
    .portal-root textarea:focus {
      outline: none !important;
      border-color: #2563eb !important;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
    }

    .portal-root strong {
      color: #475569 !important;
    }

    .loading-state,
    .empty-state,
    .error-state {
      background: #ffffff;
      border: 1px solid #e5eaf1;
      padding: 40px 25px;
      margin: 20px 0;
      border-radius: 16px;
      text-align: center;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
    }

    .loading-spinner {
      width: 38px;
      height: 38px;
      margin: 0 auto 15px;
      border: 4px solid #e2e8f0;
      border-top-color: #2563eb;
      border-radius: 50%;
      animation: portal-spin 0.8s linear infinite;
    }

    @keyframes portal-spin {
      to {
        transform: rotate(360deg);
      }
    }

    .career-3d-image {
      display: block;
      width: 320px;
      max-width: 100%;
      height: auto;
      margin: 10px auto;
      object-fit: contain;
      filter: drop-shadow(
        0 18px 25px rgba(37, 99, 235, 0.16)
      );
      animation: careerFloat 5s ease-in-out infinite;
    }

    @keyframes careerFloat {
      0%,
      100% {
        transform: translateY(0);
      }

      50% {
        transform: translateY(-8px);
      }
    }

    .opportunity-card {
      transition: all 200ms ease;
    }

    .opportunity-card:hover {
      transform: translateY(-6px);
      box-shadow:
        0 18px 40px rgba(37, 99, 235, 0.12) !important;
    }

    .portal-footer {
      position: relative;
      margin-top: 35px;
      padding: 24px 28px;
      border-radius: 20px;
      background: linear-gradient(
        135deg,
        #ffffff,
        #f5f8ff
      );
      border: 1px solid rgba(148, 163, 184, 0.25);
      box-shadow:
        0 12px 30px rgba(15, 23, 42, 0.08);
      text-align: center;
      overflow: hidden;
    }

    .portal-footer p {
      margin: 0;
      color: #64748b;
      line-height: 1.7;
    }

    .portal-footer strong {
      color: #2563eb !important;
    }

    @media (max-width: 700px) {
      .portal-root {
        padding: 16px 12px 40px !important;
      }

      .portal-root > div:first-of-type {
        padding: 24px !important;
      }

      .career-3d-image {
        width: 260px;
      }
    }
  `}</style>

  {/* Header */}
  <div
    style={{
      backgroundColor: '#ffffff',
      padding: '30px',
      borderRadius: '12px',
      marginBottom: '25px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
    }}
  >
    <h1
      style={{
        fontSize: '32px',
        marginBottom: '8px',
        color: '#1f2937'
      }}
    >
      Internship & Job Listing Portal
    </h1>

    <p
      style={{
        fontSize: '16px',
        color: '#64748b',
        margin: '0'
      }}
    >
      Find internships and job opportunities in one place.
    </p>

    <img
      src="/career-3d.svg"
      alt="Career opportunities illustration"
      className="career-3d-image"
    />

    <div
      style={{
        marginTop: '18px',
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap'
      }}
    >
      {!isAdminLoggedIn ? (
        <button
          onClick={() => {
            setShowAdminLogin(true);
            setAdminError('');
          }}
          style={{
            padding: '10px 18px',
            backgroundColor: '#111827',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: 'bold'
          }}
        >
          Admin Login
        </button>
      ) : (
        <button
          onClick={handleAdminLogout}
          style={{
            padding: '10px 18px',
            backgroundColor: '#c62828',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: 'bold'
          }}
        >
          Logout
        </button>
      )}
    </div>
  </div>

  {/* Admin Panel */}
  {isAdminLoggedIn && (
    <div
      style={{
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '25px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px'
      }}
    >
      <div>
        <h2 style={{ margin: '0 0 5px 0' }}>
          Admin Panel
        </h2>

        <p style={{ margin: '0', color: '#666' }}>
          Manage internship and job opportunities.
        </p>
      </div>

      <button
        onClick={() => {
          setSelectedOpportunity(null);
          setSelectedMode('add');
        }}
        style={{
          padding: '12px 20px',
          border: 'none',
          borderRadius: '7px',
          cursor: 'pointer',
          backgroundColor: '#1976d2',
          color: '#ffffff',
          fontWeight: 'bold'
        }}
      >
        + Add Opportunity
      </button>
    </div>
  )}

  {/* Search and Filter */}
  <div
    style={{
      backgroundColor: '#ffffff',
      padding: '20px',
      borderRadius: '12px',
      marginBottom: '25px',
      display: 'flex',
      gap: '15px',
      flexWrap: 'wrap'
    }}
  >
    <input
      type="text"
      placeholder="Search by job title or company..."
      value={search}
      onChange={(event) => setSearch(event.target.value)}
      style={{
        padding: '14px 16px',
        fontSize: '16px',
        flex: '1',
        minWidth: '280px',
        boxSizing: 'border-box'
      }}
    />

    <select
      value={domain}
      onChange={(event) => setDomain(event.target.value)}
      style={{
        padding: '14px 16px',
        fontSize: '16px',
        minWidth: '220px',
        cursor: 'pointer',
        boxSizing: 'border-box'
      }}
    >
      <option value="">All Domains</option>
      <option value="Software Development">
        Software Development
      </option>
      <option value="Data Science">
        Data Science
      </option>
      <option value="AI/ML">
        AI/ML
      </option>
      <option value="Web Development">
        Web Development
      </option>
    </select>
  </div>

  {/* Opportunity Cards */}
  {isLoading ? (
    <div className="loading-state">
      <div className="loading-spinner"></div>
      <h3>Loading opportunities...</h3>
      <p>
        Please wait while we fetch the latest opportunities.
      </p>
    </div>
  ) : loadError ? (
    <div className="error-state">
      <h3>Unable to load opportunities</h3>
      <p>{loadError}</p>
    </div>
  ) : filteredOpportunities.length === 0 ? (
    <div className="empty-state">
      <h3>No opportunities found</h3>
      <p>
        {search || domain
          ? 'Try changing your search or domain filter.'
          : 'No opportunities have been added yet.'}
      </p>
    </div>
  ) : (
    filteredOpportunities.map((opportunity) => (
      <div
        key={opportunity._id}
        className="opportunity-card"
        style={{
          border: '1px solid #e0e0e0',
          padding: '25px',
          margin: '20px 0',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          backgroundColor: '#ffffff'
        }}
      >
        <h2
          style={{
            marginTop: '0',
            marginBottom: '18px',
            fontSize: '24px',
            color: '#222'
          }}
        >
          {opportunity.title}
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '12px',
            marginBottom: '18px'
          }}
        >
          <div>
            <strong>Company</strong>
            <p style={{ margin: '5px 0' }}>
              {opportunity.company}
            </p>
          </div>

          <div>
            <strong>Domain</strong>
            <p style={{ margin: '5px 0' }}>
              {opportunity.domain}
            </p>
          </div>

          <div>
            <strong>Location</strong>
            <p style={{ margin: '5px 0' }}>
              {opportunity.location}
            </p>
          </div>

          <div>
            <strong>Experience</strong>
            <p style={{ margin: '5px 0' }}>
              {opportunity.experience}
            </p>
          </div>
        </div>

        <p
          style={{
            color: '#555',
            lineHeight: '1.6',
            marginBottom: '20px'
          }}
        >
          {opportunity.description}
        </p>

        <button
          onClick={() => {
            setSelectedOpportunity(opportunity);
            setSelectedMode('view');
          }}
          style={{
            padding: '10px 16px',
            marginRight: '10px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            backgroundColor: '#1976d2',
            color: '#ffffff'
          }}
        >
          View Details
        </button>

        <a
          href={opportunity.applicationLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '10px 16px',
            marginRight: '10px',
            backgroundColor: '#2e7d32',
            color: '#ffffff',
            textDecoration: 'none',
            borderRadius: '6px'
          }}
        >
          Apply Now
        </a>

        {isAdminLoggedIn && (
          <button
            onClick={() => startEdit(opportunity)}
            style={{
              padding: '10px 16px',
              marginRight: '10px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              backgroundColor: '#f57c00',
              color: '#ffffff'
            }}
          >
            Edit
          </button>
        )}

        {isAdminLoggedIn && (
          <button
            onClick={() =>
              deleteOpportunity(opportunity._id)
            }
            style={{
              padding: '10px 16px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              backgroundColor: '#c62828',
              color: '#ffffff'
            }}
          >
            Delete
          </button>
        )}

        {/* Opportunity Details */}
        {selectedOpportunity &&
          selectedMode === 'view' &&
          selectedOpportunity._id === opportunity._id && (
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e0e0e0',
                padding: '30px',
                marginTop: '30px',
                borderRadius: '12px',
                boxShadow:
                  '0 3px 10px rgba(0,0,0,0.08)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                  gap: '15px',
                  flexWrap: 'wrap'
                }}
              >
                <h2 style={{ margin: '0' }}>
                  Opportunity Details
                </h2>

                <button
                  onClick={() => {
                    setSelectedOpportunity(null);
                    setSelectedMode('');
                  }}
                  style={{
                    padding: '9px 15px',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    backgroundColor: '#757575',
                    color: '#ffffff'
                  }}
                >
                  Close
                </button>
              </div>

              <h3
                style={{
                  fontSize: '26px',
                  marginBottom: '20px',
                  color: '#1976d2'
                }}
              >
                {opportunity.title}
              </h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '18px',
                  marginBottom: '25px'
                }}
              >
                <div>
                  <strong>Company</strong>
                  <p>{opportunity.company}</p>
                </div>

                <div>
                  <strong>Domain</strong>
                  <p>{opportunity.domain}</p>
                </div>

                <div>
                  <strong>Location</strong>
                  <p>{opportunity.location}</p>
                </div>

                <div>
                  <strong>Experience</strong>
                  <p>{opportunity.experience}</p>
                </div>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <strong>Description</strong>
                <p
                  style={{
                    color: '#555',
                    lineHeight: '1.7'
                  }}
                >
                  {opportunity.description}
                </p>
              </div>

              <button
                onClick={() => setSelectedMode('apply')}
                style={{
                  padding: '11px 18px',
                  marginRight: '10px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  backgroundColor: '#2e7d32',
                  color: '#ffffff'
                }}
              >
                Apply Now
              </button>

              <a
                href={opportunity.applicationLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  padding: '11px 18px',
                  backgroundColor: '#757575',
                  color: '#ffffff',
                  textDecoration: 'none',
                  borderRadius: '6px'
                }}
              >
                Visit Application Link
              </a>
            </div>
          )}
      </div>
    ))
  )}

  {/* Add Opportunity */}
  {isAdminLoggedIn && selectedMode === 'add' && (
    <div
      style={{
        backgroundColor: '#ffffff',
        padding: '30px',
        marginTop: '30px',
        borderRadius: '12px'
      }}
    >
      <h2>Add New Opportunity</h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '15px'
        }}
      >
        <input
          type="text"
          placeholder="Title"
          value={newTitle}
          onChange={(event) =>
            setNewTitle(event.target.value)
          }
          style={{ padding: '12px' }}
        />

        <input
          type="text"
          placeholder="Company"
          value={newCompany}
          onChange={(event) =>
            setNewCompany(event.target.value)
          }
          style={{ padding: '12px' }}
        />

        <input
          type="text"
          placeholder="Domain"
          value={newDomain}
          onChange={(event) =>
            setNewDomain(event.target.value)
          }
          style={{ padding: '12px' }}
        />

        <input
          type="text"
          placeholder="Location"
          value={newLocation}
          onChange={(event) =>
            setNewLocation(event.target.value)
          }
          style={{ padding: '12px' }}
        />

        <input
          type="text"
          placeholder="Experience"
          value={newExperience}
          onChange={(event) =>
            setNewExperience(event.target.value)
          }
          style={{ padding: '12px' }}
        />

        <input
          type="text"
          placeholder="Application Link"
          value={newApplicationLink}
          onChange={(event) =>
            setNewApplicationLink(event.target.value)
          }
          style={{ padding: '12px' }}
        />
      </div>

      <textarea
        placeholder="Description"
        value={newDescription}
        onChange={(event) =>
          setNewDescription(event.target.value)
        }
        style={{
          width: '100%',
          minHeight: '120px',
          padding: '12px',
          marginTop: '15px',
          resize: 'vertical'
        }}
      />

      <div style={{ marginTop: '20px' }}>
        <button
          onClick={addOpportunity}
          style={{
            padding: '11px 18px',
            marginRight: '10px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            backgroundColor: '#1976d2',
            color: '#ffffff'
          }}
        >
          Add Opportunity
        </button>

        <button
          onClick={() => {
            setSelectedOpportunity(null);
            setSelectedMode('');
          }}
          style={{
            padding: '11px 18px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            backgroundColor: '#757575',
            color: '#ffffff'
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  )}

  {/* Application Form */}
  {selectedOpportunity && selectedMode === 'apply' && (
    <div
      style={{
        backgroundColor: '#ffffff',
        padding: '30px',
        marginTop: '30px',
        borderRadius: '12px'
      }}
    >
      <h2>Apply for Opportunity</h2>

      <p style={{ color: '#666' }}>
        Applying for:{' '}
        <strong>{selectedOpportunity.title}</strong>
      </p>

      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(event) =>
          setName(event.target.value)
        }
        style={{
          width: '100%',
          padding: '12px',
          marginTop: '15px',
          marginBottom: '12px'
        }}
      />

      <input
        type="email"
        placeholder="Your Email"
        value={email}
        onChange={(event) =>
          setEmail(event.target.value)
        }
        style={{
          width: '100%',
          padding: '12px',
          marginBottom: '15px'
        }}
      />

      <button
        onClick={submitApplication}
        style={{
          padding: '11px 18px',
          marginRight: '10px',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          backgroundColor: '#1976d2',
          color: '#ffffff'
        }}
      >
        Submit Application
      </button>

      <button
        onClick={() => setSelectedMode('view')}
        style={{
          padding: '11px 18px',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          backgroundColor: '#757575',
          color: '#ffffff'
        }}
      >
        Back to Details
      </button>
    </div>
  )}

  {/* Edit Opportunity */}
  {isAdminLoggedIn &&
    selectedOpportunity &&
    selectedMode === 'edit' && (
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '30px',
          marginTop: '30px',
          borderRadius: '12px'
        }}
      >
        <h2>Edit Opportunity</h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '15px'
          }}
        >
          <input
            type="text"
            placeholder="Title"
            value={editTitle}
            onChange={(event) =>
              setEditTitle(event.target.value)
            }
            style={{ padding: '12px' }}
          />

          <input
            type="text"
            placeholder="Company"
            value={editCompany}
            onChange={(event) =>
              setEditCompany(event.target.value)
            }
            style={{ padding: '12px' }}
          />

          <input
            type="text"
            placeholder="Domain"
            value={editDomain}
            onChange={(event) =>
              setEditDomain(event.target.value)
            }
            style={{ padding: '12px' }}
          />

          <input
            type="text"
            placeholder="Location"
            value={editLocation}
            onChange={(event) =>
              setEditLocation(event.target.value)
            }
            style={{ padding: '12px' }}
          />

          <input
            type="text"
            placeholder="Experience"
            value={editExperience}
            onChange={(event) =>
              setEditExperience(event.target.value)
            }
            style={{ padding: '12px' }}
          />

          <input
            type="text"
            placeholder="Application Link"
            value={editApplicationLink}
            onChange={(event) =>
              setEditApplicationLink(event.target.value)
            }
            style={{ padding: '12px' }}
          />
        </div>

        <textarea
          placeholder="Description"
          value={editDescription}
          onChange={(event) =>
            setEditDescription(event.target.value)
          }
          style={{
            width: '100%',
            minHeight: '120px',
            padding: '12px',
            marginTop: '15px',
            resize: 'vertical'
          }}
        />

        <div style={{ marginTop: '20px' }}>
          <button
            onClick={updateOpportunity}
            style={{
              padding: '11px 18px',
              marginRight: '10px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              backgroundColor: '#1976d2',
              color: '#ffffff'
            }}
          >
            Save Changes
          </button>

          <button
            onClick={() => {
              setSelectedOpportunity(null);
              setSelectedMode('');
            }}
            style={{
              padding: '11px 18px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              backgroundColor: '#757575',
              color: '#ffffff'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    )}

  {/* Admin Applications */}
  {isAdminLoggedIn && (
    <div
      style={{
        backgroundColor: '#ffffff',
        padding: '25px',
        marginTop: '40px',
        borderRadius: '12px'
      }}
    >
      <h2>Admin - Applications</h2>

      {applications.length === 0 ? (
        <p style={{ color: '#666' }}>
          No applications submitted yet.
        </p>
      ) : (
        applications.map((application) => (
          <div
            key={application._id}
            style={{
              border: '1px solid #ddd',
              padding: '15px',
              margin: '15px 0',
              borderRadius: '8px',
              backgroundColor: '#fafafa'
            }}
          >
            <p>
              <strong>Name:</strong>{' '}
              {application.name}
            </p>

            <p>
              <strong>Email:</strong>{' '}
              {application.email}
            </p>

            <p>
              <strong>Opportunity:</strong>{' '}
              {application.opportunityId?.title ||
                'Opportunity Deleted'}
            </p>

            <button
              onClick={() =>
                deleteApplication(application._id)
              }
              style={{
                padding: '9px 15px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: '#c62828',
                color: '#ffffff'
              }}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  )}

  {/* Confirmation Message */}
  {confirmationMessage && (
    <div
      className="success-message"
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #66bb6a',
        padding: '25px',
        marginTop: '25px',
        borderRadius: '12px'
      }}
    >
      <h2
        style={{
          marginTop: '0',
          color: '#2e7d32'
        }}
      >
        ✓ Application Submitted Successfully!
      </h2>

      {submittedOpportunity ? (
        <>
          <p style={{ color: '#555' }}>
            Your application has been submitted for:
          </p>

          <p
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#222'
            }}
          >
            {submittedOpportunity.title}
          </p>

          <p style={{ color: '#555' }}>
            Company: {submittedOpportunity.company}
          </p>
        </>
      ) : (
        <p style={{ color: '#555' }}>
          {confirmationMessage}
        </p>
      )}

      <button
        onClick={() => {
          setConfirmationMessage('');
          setSubmittedOpportunity(null);
        }}
        style={{
          marginTop: '15px',
          padding: '10px 18px',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          backgroundColor: '#1976d2',
          color: '#ffffff'
        }}
      >
        Close
      </button>
    </div>
  )}

  {/* Premium Footer */}
  <div className="portal-footer">
    <p>
      © 2026 <strong>Internship & Job Listing Portal</strong>
      <br />
      Find opportunities. Build your career. 🚀
    </p>
  </div>
</div>

  );
}
export default App;