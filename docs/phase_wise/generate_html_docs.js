const fs = require('fs');
const path = require('path');

// Shared professional CSS for all documents
const getSharedCSS = () => `
  @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --color-accent: #1a56a0;
    --color-accent-light: #3b7dd8;
    --color-text: #1a1a2e;
    --color-text-muted: #4a5568;
    --color-border: #c8d3e0;
    --color-bg-light: #f5f7fa;
    --color-bg-table-header: #e8edf5;
    --font-body: 'EB Garamond', 'Times New Roman', serif;
    --font-ui: 'Inter', sans-serif;
    --font-code: 'JetBrains Mono', 'Courier New', monospace;
  }
  html { font-size: 13pt; }
  body {
    font-family: var(--font-body);
    color: var(--color-text);
    background: #fff;
    line-height: 1.75;
    margin: 0;
  }

  /* COVER PAGE */
  .cover-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    background: #fff;
    page-break-after: always;
    padding: 60px 40px;
    border: 3px solid var(--color-accent);
    margin: 20mm;
  }
  .cover-org { font-family: var(--font-ui); font-size: 0.75rem; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 48px; }
  .cover-title { font-size: 2.2rem; font-weight: 700; color: var(--color-accent); line-height: 1.3; margin-bottom: 16px; }
  .cover-subtitle { font-size: 1.1rem; color: var(--color-text-muted); margin-bottom: 48px; }
  .cover-hr { width: 80px; height: 3px; background: var(--color-accent); margin: 0 auto 40px; }
  .cover-meta { font-family: var(--font-ui); font-size: 0.85rem; color: var(--color-text-muted); line-height: 2.2; }
  .cover-meta strong { color: var(--color-text); font-weight: 600; }

  /* MAIN CONTENT */
  .content {
    max-width: 800px;
    margin: 0 auto;
    padding: 20mm 25mm;
  }

  /* HEADINGS */
  h1 { font-size: 2rem; font-weight: 700; color: var(--color-accent); border-bottom: 2px solid var(--color-border); padding-bottom: 12px; margin-bottom: 28px; margin-top: 48px; page-break-after: avoid; }
  h2 { font-size: 1.4rem; font-weight: 600; color: var(--color-text); margin: 36px 0 16px; border-left: 4px solid var(--color-accent); padding-left: 14px; page-break-after: avoid; }
  h3 { font-size: 1.1rem; font-weight: 600; color: var(--color-accent); margin: 28px 0 12px; page-break-after: avoid; }
  h4 { font-size: 1rem; font-weight: 600; color: var(--color-text); margin: 20px 0 10px; page-break-after: avoid; }

  /* PARAGRAPHS */
  p { margin-bottom: 14px; text-align: justify; }

  /* TABLES */
  table { width: 100%; border-collapse: collapse; margin: 20px 0 28px; font-family: var(--font-ui); font-size: 0.78rem; page-break-inside: avoid; }
  thead tr { background: var(--color-bg-table-header); }
  th { background: var(--color-accent); color: #fff; padding: 10px 12px; text-align: left; font-weight: 600; letter-spacing: 0.3px; }
  td { padding: 9px 12px; border-bottom: 1px solid var(--color-border); vertical-align: top; }
  tr:nth-child(even) td { background: var(--color-bg-light); }
  tr:hover td { background: #eef2fa; }

  /* CODE */
  pre { background: #1e2235; color: #e2e8f0; border-radius: 8px; padding: 18px 20px; overflow-x: auto; margin: 18px 0 24px; font-family: var(--font-code); font-size: 0.75rem; line-height: 1.6; page-break-inside: avoid; }
  code { font-family: var(--font-code); font-size: 0.82rem; background: #eef2fa; padding: 2px 6px; border-radius: 4px; color: var(--color-accent); }
  pre code { background: none; color: inherit; padding: 0; font-size: inherit; }

  /* LISTS */
  ul, ol { margin: 10px 0 16px 28px; }
  li { margin-bottom: 6px; }

  /* BLOCKQUOTE */
  blockquote { border-left: 4px solid var(--color-accent-light); background: var(--color-bg-light); padding: 14px 20px; margin: 20px 0; border-radius: 0 8px 8px 0; font-style: italic; color: var(--color-text-muted); }

  /* DIAGRAM BOX */
  .diagram-wrap {
    border: 1.5px solid var(--color-border);
    border-radius: 10px;
    padding: 20px 16px 10px;
    margin: 24px 0;
    background: var(--color-bg-light);
    page-break-inside: avoid;
    text-align: center;
  }
  .diagram-caption {
    font-family: var(--font-ui);
    font-size: 0.72rem;
    color: var(--color-text-muted);
    text-align: center;
    margin-top: 10px;
    font-style: italic;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  /* INFO BOX */
  .info-box { background: #e8f0fb; border: 1px solid var(--color-accent-light); border-left: 5px solid var(--color-accent); border-radius: 0 8px 8px 0; padding: 14px 18px; margin: 20px 0; font-family: var(--font-ui); font-size: 0.82rem; }
  .info-box strong { color: var(--color-accent); }

  /* BADGE */
  .badge { display: inline-block; font-family: var(--font-ui); font-size: 0.68rem; font-weight: 600; padding: 2px 9px; border-radius: 10px; margin-right: 4px; letter-spacing: 0.3px; }
  .badge-red { background: #fee2e2; color: #991b1b; }
  .badge-yellow { background: #fef9c3; color: #92400e; }
  .badge-green { background: #dcfce7; color: #14532d; }
  .badge-blue { background: #dbeafe; color: #1e3a8a; }

  /* FOOTER BAR */
  .doc-footer { font-family: var(--font-ui); font-size: 0.68rem; color: var(--color-text-muted); text-align: center; margin-top: 60px; padding-top: 16px; border-top: 1px solid var(--color-border); }

  /* PRINT */
  @media print {
    body { font-size: 11pt; }
    .cover-page { margin: 0; border: 3px solid var(--color-accent); }
    .content { padding: 15mm 20mm; }
    h1, h2, h3, h4 { page-break-after: avoid; }
    table, pre, .diagram-wrap { page-break-inside: avoid; }
    @page { margin: 20mm; }
  }
`;

// Mermaid config
const getMermaidScript = () => `
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"><\/script>
  <script>
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      themeVariables: {
        primaryColor: '#1a56a0',
        primaryTextColor: '#1a1a2e',
        primaryBorderColor: '#1a56a0',
        lineColor: '#4a5568',
        secondaryColor: '#e8edf5',
        tertiaryColor: '#f5f7fa',
        fontFamily: 'Inter, sans-serif',
        fontSize: '13px'
      },
      flowchart: { curve: 'basis', useMaxWidth: true },
      er: { useMaxWidth: true },
      sequence: { useMaxWidth: true }
    });
  <\/script>
`;

function buildHTML(title, phase, version, content) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} — ShopEZ MERN Documentation</title>
<style>${getSharedCSS()}</style>
${getMermaidScript()}
</head>
<body>

<div class="cover-page">
  <div class="cover-org">VIP C2 Programme — Full Stack Development with MERN</div>
  <h1 class="cover-title" style="font-family:'EB Garamond',serif;font-size:2rem;color:#1a56a0;border:none;padding:0;margin:0 0 12px">${title}</h1>
  <div class="cover-subtitle">ShopEZ — MERN Stack E-commerce Application</div>
  <div class="cover-hr"></div>
  <div class="cover-meta">
    <strong>Phase:</strong> ${phase}<br>
    <strong>Document Version:</strong> ${version}<br>
    <strong>Date:</strong> 11 June 2026<br>
    <strong>Prepared by:</strong> V S S S Manikanta<br>
    <strong>Classification:</strong> Project Documentation — For Academic Submission
  </div>
</div>

<div class="content">
${content}
<div class="doc-footer">ShopEZ MERN E-commerce Application · ${phase} · ${title} · v${version} · June 2026</div>
</div>

</body>
</html>`;
}

// ---------- Document content definitions ----------

const documents = [

  {
    outPath: "Phase Wise Templets/Brainstorming & Ideation Phase/Brainstorming_Idea_Generation.html",
    title: "Brainstorming &amp; Idea Prioritisation",
    phase: "Brainstorming &amp; Ideation Phase",
    version: "1.1",
    content: `
<h1>Brainstorming &amp; Idea Prioritisation</h1>

<h2>1. Introduction</h2>
<p>This document records the structured brainstorming and ideation process undertaken at the inception of the ShopEZ project. The objective of this phase was to collaboratively identify user pain points, generate candidate solutions, and systematically prioritise features using established frameworks. The output directly informs the Problem Statement Definition and Requirement Analysis phases.</p>

<h2>2. Problem Statement Selection</h2>
<blockquote>Small and medium-sized businesses lack the technical resources to establish a customised, scalable online storefront, while end-consumers demand a seamless, fast, and secure shopping experience — encompassing intuitive search, dynamic filtering, persistent cart state, and trusted multi-gateway payment processing.</blockquote>

<h2>3. Idea Generation &amp; Grouping</h2>
<h3>3.1 Raw Idea Listing</h3>
<table>
  <thead><tr><th>Idea ID</th><th>Idea Description</th><th>Category</th><th>Retained?</th></tr></thead>
  <tbody>
    <tr><td>I-01</td><td>Build a custom MERN stack application for full architectural control</td><td>Core Architecture</td><td>✅ Yes</td></tr>
    <tr><td>I-02</td><td>Use Shopify as a SaaS platform</td><td>Existing Platforms</td><td>❌ Discarded — insufficient customisability</td></tr>
    <tr><td>I-03</td><td>Use WooCommerce (WordPress)</td><td>Existing Platforms</td><td>❌ Discarded — plugin overhead, no SPA support</td></tr>
    <tr><td>I-04</td><td>Implement JWT-based stateless authentication with HTTP-only cookies</td><td>Security</td><td>✅ Yes</td></tr>
    <tr><td>I-05</td><td>Integrate a Payment Gateway (Stripe / Razorpay)</td><td>Payments</td><td>✅ Yes</td></tr>
    <tr><td>I-06</td><td>Use Cloudinary CDN for optimised media/image storage</td><td>Media Management</td><td>✅ Yes</td></tr>
    <tr><td>I-07</td><td>Implement Role-Based Access Control (Admin vs. Customer)</td><td>Access Control</td><td>✅ Yes</td></tr>
    <tr><td>I-08</td><td>Build an interactive Admin Dashboard with real-time sales metrics</td><td>Admin Operations</td><td>✅ Yes</td></tr>
    <tr><td>I-09</td><td>Persist shopping cart state using MongoDB for cross-device continuity</td><td>User Experience</td><td>✅ Yes</td></tr>
    <tr><td>I-10</td><td>Implement AI-driven product recommendations</td><td>Advanced Features</td><td>🔵 Future Scope</td></tr>
    <tr><td>I-11</td><td>Multi-vendor support</td><td>Marketplace Features</td><td>🔵 Future Scope</td></tr>
  </tbody>
</table>

<h3>3.2 Idea Grouping — Affinity Diagram</h3>
<div class="diagram-wrap">
  <pre class="mermaid">
mindmap
  root((ShopEZ Platform))
    Core Architecture
      MERN Stack (I-01)
      JWT Authentication (I-04)
      Role-Based Access Control (I-07)
    Customer Experience
      Persistent Cart via MongoDB (I-09)
      Payment Gateway Integration (I-05)
      Advanced Search and Filtering
    Admin and Operations
      Admin Dashboard and Analytics (I-08)
      Cloudinary Image Management (I-06)
      Order Fulfillment Management
    Future Scope
      AI Recommendations (I-10)
      Multi-Vendor Support (I-11)
  </pre>
  <div class="diagram-caption">Figure 1.1 — Affinity / Mind-Map: Idea Grouping by Domain</div>
</div>

<h2>4. Idea Prioritisation — MoSCoW Framework</h2>
<table>
  <thead><tr><th>Priority</th><th>Classification</th><th>Feature / Idea</th><th>Rationale</th></tr></thead>
  <tbody>
    <tr><td><span class="badge badge-red">Must Have</span></td><td>Core — Release 1</td><td>User Registration &amp; JWT Authentication</td><td>Foundational to all user-specific operations</td></tr>
    <tr><td><span class="badge badge-red">Must Have</span></td><td>Core — Release 1</td><td>Product Catalogue (CRUD Operations)</td><td>Primary business function; no storefront without it</td></tr>
    <tr><td><span class="badge badge-red">Must Have</span></td><td>Core — Release 1</td><td>Shopping Cart (Add, Update, Remove)</td><td>Essential to purchase flow</td></tr>
    <tr><td><span class="badge badge-red">Must Have</span></td><td>Core — Release 1</td><td>Multi-Step Checkout Flow</td><td>Core revenue-generating pathway</td></tr>
    <tr><td><span class="badge badge-red">Must Have</span></td><td>Core — Release 1</td><td>Payment Gateway Integration</td><td>Order completion requires payment confirmation</td></tr>
    <tr><td><span class="badge badge-yellow">Should Have</span></td><td>Release 1</td><td>Admin Dashboard (Sales Charts)</td><td>Enables business decision-making</td></tr>
    <tr><td><span class="badge badge-yellow">Should Have</span></td><td>Release 1</td><td>Product Reviews &amp; Ratings</td><td>Builds consumer trust and aids discovery</td></tr>
    <tr><td><span class="badge badge-yellow">Should Have</span></td><td>Release 1</td><td>Cloudinary Image Management</td><td>Improves performance; required for scalable image serving</td></tr>
    <tr><td><span class="badge badge-green">Could Have</span></td><td>Release 2</td><td>Wishlist Functionality</td><td>Improves retention, not blocking to launch</td></tr>
    <tr><td><span class="badge badge-green">Could Have</span></td><td>Release 2</td><td>AI Product Recommendations</td><td>Non-trivial to implement; deferred to future roadmap</td></tr>
  </tbody>
</table>

<h2>5. Conclusion</h2>
<p>The brainstorming phase successfully distilled the project vision into a focused set of prioritised deliverables. The <strong>Must Have</strong> features constitute the minimum viable product (MVP) scope for Sprint 1 and Sprint 2. All accepted ideas map directly to User Stories defined in the <em>Requirement Analysis</em> phase.</p>
`
  },

  {
    outPath: "Phase Wise Templets/Brainstorming & Ideation Phase/Define_Problem_Statements.html",
    title: "Define Problem Statements",
    phase: "Brainstorming &amp; Ideation Phase",
    version: "1.1",
    content: `
<h1>Define Problem Statements</h1>

<h2>1. Introduction</h2>
<p>This document formalises the problem statements identified during the Brainstorming &amp; Ideation phase. Each statement follows the structured <strong>"I am / I'm trying to / But / Because / Which makes me feel"</strong> framework to ensure user-centric problem articulation. Root-cause analysis is subsequently applied to identify systemic factors driving these problems.</p>

<h2>2. Problem Statements</h2>
<h3>PS-1: The Online Shopper</h3>
<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr><td><strong>I am</strong></td><td>A busy online shopper seeking electronics and clothing items</td></tr>
    <tr><td><strong>I'm trying to</strong></td><td>Find and purchase specific items quickly and securely from a trusted platform</td></tr>
    <tr><td><strong>But</strong></td><td>Existing stores suffer from poor search functionality, confusing multi-step checkouts, and loss of cart state across sessions</td></tr>
    <tr><td><strong>Because</strong></td><td>Their systems are inadequately optimised — they lack advanced filtering, cross-device cart persistence, and seamless payment gateway integration</td></tr>
    <tr><td><strong>Which makes me feel</strong></td><td>Frustrated, distrustful of the platform, and highly likely to abandon my cart prior to purchase</td></tr>
  </tbody>
</table>
<div class="info-box"><strong>Impact Severity:</strong> 🔴 High — Cart abandonment directly translates to revenue loss for the business.</div>

<h3>PS-2: The Store Administrator</h3>
<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr><td><strong>I am</strong></td><td>A business owner and store administrator responsible for daily operations</td></tr>
    <tr><td><strong>I'm trying to</strong></td><td>Manage product inventory efficiently, track monthly sales, and ensure timely order fulfilment</td></tr>
    <tr><td><strong>But</strong></td><td>The process is excessively time-consuming — updating product details, uploading images, and accessing sales insights requires navigating a clunky, non-intuitive dashboard</td></tr>
    <tr><td><strong>Because</strong></td><td>Current systems lack a unified admin interface; image uploads are not CDN-optimised, and sales data is not aggregated in a readily interpretable format</td></tr>
    <tr><td><strong>Which makes me feel</strong></td><td>Overwhelmed, inefficient, and deeply concerned about the scalability of business operations</td></tr>
  </tbody>
</table>
<div class="info-box"><strong>Impact Severity:</strong> 🔴 High — Operational inefficiency leads to delayed inventory updates, missed sales opportunities, and reduced business agility.</div>

<h2>3. Root-Cause Analysis (Ishikawa Diagram)</h2>
<div class="diagram-wrap">
  <pre class="mermaid">
graph LR
    EFFECT["🚨 Poor E-commerce Experience"]
    EFFECT --- P1["📦 Platform"]
    EFFECT --- P2["👤 User Experience"]
    EFFECT --- P3["🔧 Technology"]
    EFFECT --- P4["🔒 Security"]
    P1 --- P1A["No SPA / Slow Page Reloads"]
    P1 --- P1B["No Persistent Cart State"]
    P1 --- P1C["Limited Customisability"]
    P2 --- P2A["Confusing Checkout Flow"]
    P2 --- P2B["Poor Search & Filter Capabilities"]
    P2 --- P2C["Non-Responsive Mobile Layout"]
    P3 --- P3A["No CDN for Image Delivery"]
    P3 --- P3B["No Real-Time State Updates"]
    P3 --- P3C["Inadequate Admin Dashboard"]
    P4 --- P4A["No JWT / Stateless Auth"]
    P4 --- P4B["No Trusted Payment Gateway"]
    P4 --- P4C["Unencrypted Password Storage"]
  </pre>
  <div class="diagram-caption">Figure 2.1 — Ishikawa (Fishbone) Root-Cause Diagram</div>
</div>

<h2>4. Problem-to-Feature Mapping</h2>
<table>
  <thead><tr><th>Root Cause</th><th>Proposed Solution Feature</th></tr></thead>
  <tbody>
    <tr><td>No SPA / Slow page reloads</td><td>React.js Single Page Application with Virtual DOM</td></tr>
    <tr><td>No persistent cart state</td><td>MongoDB-backed cart schema linked to authenticated user session</td></tr>
    <tr><td>Poor search &amp; filter</td><td>Full-text search with price, category, and rating filters</td></tr>
    <tr><td>Confusing checkout</td><td>Guided 3-step checkout wizard (Address → Method → Payment)</td></tr>
    <tr><td>No CDN for images</td><td>Cloudinary integration for optimised image delivery</td></tr>
    <tr><td>No trusted payment gateway</td><td>Stripe / Razorpay payment gateway integration</td></tr>
    <tr><td>Unencrypted passwords</td><td>Bcrypt password hashing before persistence</td></tr>
    <tr><td>No JWT auth</td><td>JWT tokens stored in HTTP-only cookies for XSS prevention</td></tr>
    <tr><td>No admin dashboard</td><td>Dedicated /admin panel with sales analytics and order management</td></tr>
  </tbody>
</table>

<h2>5. Conclusion</h2>
<p>The two problem statements — representing the <strong>end consumer</strong> and the <strong>store operator</strong> — collectively define the dual-focus of the ShopEZ platform. All identified root causes have corresponding solution features mapped in the <em>Proposed Solution</em> and <em>Requirement Analysis</em> documents.</p>
`
  },

  {
    outPath: "Phase Wise Templets/Project Planning Phase/Project_Planning.html",
    title: "Project Planning",
    phase: "Project Planning Phase",
    version: "1.1",
    content: `
<h1>Project Planning</h1>

<h2>1. Introduction</h2>
<p>This document formalises the project planning artefacts for the ShopEZ development initiative. It encompasses the Product Backlog, Sprint Schedule with Story Point estimates, a Sprint Timeline (Gantt Chart), Velocity Tracking, Burndown Analysis, and a Risk Register. The planning framework adopted is <strong>Scrum-based Agile</strong>, executed in three two-week sprints.</p>

<h2>2. Product Backlog &amp; Sprint Schedule</h2>
<table>
  <thead><tr><th>Sprint</th><th>Epic</th><th>USN</th><th>User Story / Task</th><th>Points</th><th>Priority</th></tr></thead>
  <tbody>
    <tr><td>Sprint 1</td><td>Project Setup &amp; DB</td><td>USN-0</td><td>Initialise React frontend, Node.js backend, and configure MongoDB Atlas models</td><td>3</td><td><span class="badge badge-red">High</span></td></tr>
    <tr><td>Sprint 1</td><td>User Auth</td><td>USN-1</td><td>User can register with email, name, and password and receive a JWT session</td><td>2</td><td><span class="badge badge-red">High</span></td></tr>
    <tr><td>Sprint 1</td><td>User Auth</td><td>USN-2</td><td>User can log in with credentials and be granted a JWT in an HTTP-only cookie</td><td>2</td><td><span class="badge badge-red">High</span></td></tr>
    <tr><td>Sprint 1</td><td>Product Catalogue</td><td>USN-3</td><td>Admin can create, edit, and delete product listings with Cloudinary image uploads</td><td>3</td><td><span class="badge badge-red">High</span></td></tr>
    <tr><td>Sprint 2</td><td>Shopping Cart</td><td>USN-4</td><td>User can add, update, and remove items; cart persists across devices</td><td>3</td><td><span class="badge badge-red">High</span></td></tr>
    <tr><td>Sprint 2</td><td>Checkout Flow</td><td>USN-5</td><td>User can complete a 3-step checkout (Address → Payment Method → Confirm Order)</td><td>3</td><td><span class="badge badge-red">High</span></td></tr>
    <tr><td>Sprint 2</td><td>Payment</td><td>USN-6</td><td>User can pay via Stripe / Razorpay and receive order confirmation</td><td>5</td><td><span class="badge badge-red">High</span></td></tr>
    <tr><td>Sprint 3</td><td>Order Management</td><td>USN-7</td><td>Admin can view all orders and update delivery status</td><td>2</td><td><span class="badge badge-yellow">Medium</span></td></tr>
    <tr><td>Sprint 3</td><td>Reviews</td><td>USN-8</td><td>User can leave a star rating and text review on a purchased product</td><td>2</td><td><span class="badge badge-yellow">Medium</span></td></tr>
    <tr><td>Sprint 3</td><td>Admin Dashboard</td><td>USN-9</td><td>Admin can view monthly revenue charts and sales metric summaries</td><td>3</td><td><span class="badge badge-yellow">Medium</span></td></tr>
  </tbody>
</table>

<h2>3. Sprint Timeline — Gantt Chart</h2>
<div class="diagram-wrap">
  <pre class="mermaid">
gantt
    title ShopEZ Sprint Delivery Timeline
    dateFormat  YYYY-MM-DD
    section Sprint 1 — Foundation
    Project Setup and MongoDB Config       :done, s1a, 2026-06-01, 3d
    User Authentication (Register & Login) :done, s1b, 2026-06-04, 4d
    Product Catalogue (CRUD + Cloudinary)  :done, s1c, 2026-06-08, 6d
    section Sprint 2 — Core Commerce
    Shopping Cart (Persist + CRUD)         :done, s2a, 2026-06-15, 5d
    Multi-Step Checkout Flow               :done, s2b, 2026-06-20, 4d
    Payment Gateway Integration            :done, s2c, 2026-06-24, 4d
    section Sprint 3 — Operations
    Admin Order Management                 :done, s3a, 2026-06-29, 4d
    Product Reviews and Ratings            :done, s3b, 2026-07-03, 3d
    Admin Sales Dashboard                  :done, s3c, 2026-07-06, 6d
  </pre>
  <div class="diagram-caption">Figure 3.1 — Gantt Chart: Sprint Delivery Timeline (3 Sprints × 2 Weeks)</div>
</div>

<h2>4. Velocity &amp; Project Tracker</h2>
<table>
  <thead><tr><th>Sprint</th><th>Story Points</th><th>Start Date</th><th>End Date</th><th>Completed</th><th>Rate</th></tr></thead>
  <tbody>
    <tr><td>Sprint 1</td><td>10</td><td>01 June 2026</td><td>14 June 2026</td><td>10</td><td>100% ✅</td></tr>
    <tr><td>Sprint 2</td><td>11</td><td>15 June 2026</td><td>28 June 2026</td><td>11</td><td>100% ✅</td></tr>
    <tr><td>Sprint 3</td><td>7</td><td>29 June 2026</td><td>12 July 2026</td><td>7</td><td>100% ✅</td></tr>
    <tr><td><strong>Total</strong></td><td><strong>28</strong></td><td>—</td><td>—</td><td><strong>28</strong></td><td><strong>100% ✅</strong></td></tr>
  </tbody>
</table>
<p><strong>Average Velocity:</strong> 9.3 Story Points per Sprint | <strong>Sprint Duration:</strong> 2 Weeks</p>

<h2>5. Risk Register</h2>
<table>
  <thead><tr><th>Risk ID</th><th>Risk Description</th><th>Probability</th><th>Impact</th><th>Mitigation Strategy</th></tr></thead>
  <tbody>
    <tr><td>R-01</td><td>Payment gateway API downtime during testing</td><td>Medium</td><td>High</td><td>Use Stripe test mode (<code>sk_test_*</code>); maintain fallback mock handler</td></tr>
    <tr><td>R-02</td><td>MongoDB Atlas connection failure in production</td><td>Low</td><td>High</td><td>Configure automatic reconnect logic; monitor via Atlas alerts</td></tr>
    <tr><td>R-03</td><td>Cloudinary storage limit exceeded</td><td>Low</td><td>Medium</td><td>Set file size limits in upload middleware; configure usage alerts</td></tr>
    <tr><td>R-04</td><td>JWT secret key exposed via public repository</td><td>Low</td><td>Critical</td><td>Store all secrets in <code>.env</code> (git-ignored); enforce secret scanning</td></tr>
    <tr><td>R-05</td><td>Cart state desync on concurrent multi-device login</td><td>Medium</td><td>Medium</td><td>Server-side cart reconciliation on login; use <code>updatedAt</code> timestamps</td></tr>
    <tr><td>R-06</td><td>React build size impacting initial load time</td><td>Medium</td><td>Medium</td><td>Implement <code>React.lazy()</code> code-splitting; enable Gzip on server</td></tr>
  </tbody>
</table>

<h2>6. Conclusion</h2>
<p>The Agile sprint framework provided the V S S S Manikanta with a structured, iterative approach to delivery. All 28 story points were completed within the planned six-week timeline, with a 100% completion rate across all three sprints.</p>
`
  },

  {
    outPath: "Phase Wise Templets/Requirement Analysis/Solution_Requirements.html",
    title: "Solution Requirements",
    phase: "Requirement Analysis Phase",
    version: "1.1",
    content: `
<h1>Solution Requirements</h1>

<h2>1. Introduction</h2>
<p>This document specifies the complete set of <strong>Functional</strong> and <strong>Non-Functional Requirements</strong> for the ShopEZ e-commerce platform. Each requirement is assigned a unique identifier to enable traceability from inception through design, implementation, and User Acceptance Testing (UAT).</p>

<h2>2. Functional Requirements</h2>
<h3>FR-01 to FR-05 — User Management</h3>
<table>
  <thead><tr><th>Req. ID</th><th>Requirement Description</th><th>Priority</th><th>USN</th></tr></thead>
  <tbody>
    <tr><td>FR-01</td><td>The system shall permit new users to register by providing a unique email address, full name, and password. Email must be validated for format correctness.</td><td><span class="badge badge-red">Must Have</span></td><td>USN-1</td></tr>
    <tr><td>FR-02</td><td>The system shall authenticate registered users via email and password credentials and issue a signed JWT token upon success.</td><td><span class="badge badge-red">Must Have</span></td><td>USN-2</td></tr>
    <tr><td>FR-03</td><td>The system shall store JWT tokens exclusively in HTTP-only cookies to prevent client-side JavaScript access (XSS mitigation).</td><td><span class="badge badge-red">Must Have</span></td><td>USN-2</td></tr>
    <tr><td>FR-04</td><td>The system shall enforce Role-Based Access Control (RBAC) distinguishing between the <code>user</code> and <code>admin</code> roles.</td><td><span class="badge badge-red">Must Have</span></td><td>USN-0</td></tr>
    <tr><td>FR-05</td><td>Authenticated users shall be able to update their profile including name, password, phone number, and saved shipping addresses.</td><td><span class="badge badge-yellow">Should Have</span></td><td>USN-1</td></tr>
  </tbody>
</table>

<h3>FR-06 to FR-10 — Product Catalogue</h3>
<table>
  <thead><tr><th>Req. ID</th><th>Requirement Description</th><th>Priority</th><th>USN</th></tr></thead>
  <tbody>
    <tr><td>FR-06</td><td>The system shall display a paginated catalogue of products presenting name, image, description, price, rating, and stock availability.</td><td><span class="badge badge-red">Must Have</span></td><td>USN-3</td></tr>
    <tr><td>FR-07</td><td>The system shall provide full-text search allowing customers to query products by name and description keywords.</td><td><span class="badge badge-red">Must Have</span></td><td>USN-3</td></tr>
    <tr><td>FR-08</td><td>The system shall support dynamic filtering by Category, Price Range, and Average Star Rating.</td><td><span class="badge badge-red">Must Have</span></td><td>USN-3</td></tr>
    <tr><td>FR-09</td><td>The system shall support sorting by: Newest First, Price Ascending, Price Descending, and Highest Rated.</td><td><span class="badge badge-yellow">Should Have</span></td><td>USN-3</td></tr>
    <tr><td>FR-10</td><td>Administrators shall be able to Create, Read, Update, and Delete product records, including uploading images via Cloudinary.</td><td><span class="badge badge-red">Must Have</span></td><td>USN-8</td></tr>
  </tbody>
</table>

<h3>FR-11 to FR-15 — Shopping Cart &amp; Checkout</h3>
<table>
  <thead><tr><th>Req. ID</th><th>Requirement Description</th><th>Priority</th><th>USN</th></tr></thead>
  <tbody>
    <tr><td>FR-11</td><td>The system shall allow authenticated users to add products to a persistent shopping cart stored in MongoDB.</td><td><span class="badge badge-red">Must Have</span></td><td>USN-4</td></tr>
    <tr><td>FR-12</td><td>The system shall allow users to modify item quantities and remove items; the cart total shall recalculate in real time.</td><td><span class="badge badge-red">Must Have</span></td><td>USN-4</td></tr>
    <tr><td>FR-13</td><td>The system shall present a guided, multi-step checkout: (1) Shipping Address → (2) Payment Method → (3) Order Review &amp; Placement.</td><td><span class="badge badge-red">Must Have</span></td><td>USN-5</td></tr>
    <tr><td>FR-14</td><td>The system shall integrate with a Payment Gateway (Stripe / Razorpay) to securely process card and UPI-based transactions.</td><td><span class="badge badge-red">Must Have</span></td><td>USN-6</td></tr>
    <tr><td>FR-15</td><td>Upon successful payment, the system shall create an order record, deduct purchased quantities from stock, and clear the user's cart.</td><td><span class="badge badge-red">Must Have</span></td><td>USN-6</td></tr>
  </tbody>
</table>

<h2>3. Non-Functional Requirements</h2>
<table>
  <thead><tr><th>Req. ID</th><th>Category</th><th>Requirement Description</th><th>Priority</th></tr></thead>
  <tbody>
    <tr><td>NFR-01</td><td>Security</td><td>All user passwords must be hashed using Bcrypt (salt rounds ≥ 10) prior to persistence.</td><td><span class="badge badge-red">Must Have</span></td></tr>
    <tr><td>NFR-02</td><td>Security</td><td>All API routes that modify data must require a valid JWT; unauthenticated requests shall return HTTP 401.</td><td><span class="badge badge-red">Must Have</span></td></tr>
    <tr><td>NFR-03</td><td>Security</td><td>Admin-only routes shall apply an additional <code>isAdmin</code> middleware check; non-admin access returns HTTP 403.</td><td><span class="badge badge-red">Must Have</span></td></tr>
    <tr><td>NFR-04</td><td>Performance</td><td>Product catalogue API responses must be returned within 500ms under normal load conditions.</td><td><span class="badge badge-yellow">Should Have</span></td></tr>
    <tr><td>NFR-05</td><td>Performance</td><td>All product images must be served via the Cloudinary CDN to ensure sub-second image load times globally.</td><td><span class="badge badge-yellow">Should Have</span></td></tr>
    <tr><td>NFR-06</td><td>Usability</td><td>The frontend must be fully responsive from 320px (mobile) to 1920px (desktop).</td><td><span class="badge badge-red">Must Have</span></td></tr>
    <tr><td>NFR-07</td><td>Reliability</td><td>MongoDB's document atomicity must ensure stock deduction and order creation are performed consistently, preventing overselling.</td><td><span class="badge badge-red">Must Have</span></td></tr>
    <tr><td>NFR-08</td><td>Maintainability</td><td>All backend code must follow MVC pattern: Router → Middleware → Controller → Model. No business logic in route handlers.</td><td><span class="badge badge-yellow">Should Have</span></td></tr>
    <tr><td>NFR-09</td><td>Scalability</td><td>The stateless JWT model shall ensure the API can be horizontally scaled without shared session state.</td><td><span class="badge badge-green">Could Have</span></td></tr>
  </tbody>
</table>

<h2>4. Requirements Traceability Matrix</h2>
<table>
  <thead><tr><th>Req. ID</th><th>Design Artefact</th><th>Implementation File</th><th>UAT Test Case</th></tr></thead>
  <tbody>
    <tr><td>FR-01, FR-02, FR-03</td><td>Solution Architecture</td><td><code>userController.js</code></td><td>UAT-001, UAT-002</td></tr>
    <tr><td>FR-06, FR-07, FR-08</td><td>Data Flow Diagram</td><td><code>productController.js</code></td><td>UAT-005, UAT-006</td></tr>
    <tr><td>FR-11, FR-12</td><td>ER Diagram</td><td><code>Cart.js</code> model</td><td>UAT-008, UAT-009</td></tr>
    <tr><td>FR-13, FR-14, FR-15</td><td>User Flow Sequence</td><td><code>orderController.js</code></td><td>UAT-011, UAT-012</td></tr>
    <tr><td>FR-10</td><td>Solution Architecture</td><td><code>productController.js</code></td><td>UAT-013</td></tr>
    <tr><td>NFR-01, NFR-02</td><td>Solution Architecture</td><td><code>authMiddleware.js</code></td><td>UAT-004, UAT-016</td></tr>
  </tbody>
</table>
`
  },

  {
    outPath: "Phase Wise Templets/Requirement Analysis/Technology_Stack.html",
    title: "Technology Stack",
    phase: "Requirement Analysis Phase",
    version: "1.1",
    content: `
<h1>Technology Stack</h1>

<h2>1. Introduction</h2>
<p>This document provides a formal specification of the technology stack selected for the ShopEZ platform. Each technology selection is accompanied by its architectural role, justification, and a brief Architecture Decision Record (ADR) summarising the decision rationale and alternatives considered.</p>

<h2>2. Integration Architecture Diagram</h2>
<div class="diagram-wrap">
  <pre class="mermaid">
graph TB
    subgraph Client["Client Layer (Browser)"]
        React["React.js v18 — SPA UI Rendering"]
        Redux["Context API / Redux Toolkit — State Management"]
        Axios["Axios — HTTP Client"]
        React --> Redux
        React --> Axios
    end
    subgraph Server["Server Layer (Node.js Runtime)"]
        Express["Express.js — REST API Framework"]
        JWT["JSON Web Tokens — Auth & Session"]
        Bcrypt["Bcrypt.js — Password Hashing"]
        Express --> JWT
        Express --> Bcrypt
    end
    subgraph Database["Data Layer"]
        Mongoose["Mongoose ODM — Schema & Validation"]
        MongoDB["MongoDB Atlas — NoSQL Document Store"]
        Mongoose --> MongoDB
    end
    subgraph External["External Services"]
        Stripe["Stripe / Razorpay — Payment Gateway"]
        Cloudinary["Cloudinary — CDN Image Hosting"]
    end
    Axios -->|"HTTPS REST API"| Express
    Express --> Mongoose
    Express -.->|"API Call"| Stripe
    Express -.->|"Upload API"| Cloudinary
  </pre>
  <div class="diagram-caption">Figure 5.1 — Technology Stack Integration Architecture Diagram</div>
</div>

<h2>3. Detailed Stack Breakdown</h2>
<table>
  <thead><tr><th>Layer</th><th>Technology</th><th>Version</th><th>Purpose &amp; Justification</th></tr></thead>
  <tbody>
    <tr><td>Frontend Framework</td><td>React.js</td><td>v18.x</td><td>Component-driven SPA architecture. Virtual DOM ensures efficient, targeted UI re-rendering. Hooks-based API enables clean functional component design.</td></tr>
    <tr><td>State Management</td><td>Context API / Redux Toolkit</td><td>v2.x</td><td>Centralised global state for authentication context, shopping cart, and cached API data. Redux Toolkit reduces boilerplate via <code>createSlice</code>.</td></tr>
    <tr><td>HTTP Client</td><td>Axios</td><td>v1.x</td><td>Promise-based HTTP client with request/response interceptors, automatic JSON serialisation, and configurable base URL. Preferred over native <code>fetch</code> for interceptor support.</td></tr>
    <tr><td>Backend Runtime</td><td>Node.js</td><td>v18 LTS</td><td>JavaScript runtime enabling full-stack single-language development. Non-blocking, event-driven I/O suits concurrent API request handling.</td></tr>
    <tr><td>Backend Framework</td><td>Express.js</td><td>v4.x</td><td>Minimal, unopinionated framework providing robust middleware composition, route parameterisation, and structured error handling for RESTful APIs.</td></tr>
    <tr><td>Authentication</td><td>JSON Web Tokens (JWT)</td><td>RFC 7519</td><td>Stateless, self-contained bearer tokens signed with a server secret. Stored in HTTP-only cookies to mitigate XSS. Enables horizontal API scaling without shared session storage.</td></tr>
    <tr><td>Password Security</td><td>Bcrypt.js</td><td>v5.x</td><td>Industry-standard adaptive hashing (salt rounds ≥ 10). Applied via Mongoose <code>pre-save</code> hook on the User model.</td></tr>
    <tr><td>Database</td><td>MongoDB (Atlas)</td><td>v6.x</td><td>Document-oriented NoSQL store for flexible schema design. Hosted on Atlas for managed backups and auto-scaling.</td></tr>
    <tr><td>ODM</td><td>Mongoose</td><td>v8.x</td><td>Schema-based ODM providing validation, type enforcement, virtual fields, populate references, and lifecycle hooks.</td></tr>
    <tr><td>Payment Gateway</td><td>Stripe / Razorpay</td><td>Latest</td><td>PCI-DSS compliant payment APIs. No sensitive financial data stored on the ShopEZ server.</td></tr>
    <tr><td>Media Hosting</td><td>Cloudinary</td><td>v2.x SDK</td><td>Provides automatic image compression, WebP conversion, and CDN delivery. Eliminates local filesystem dependency.</td></tr>
    <tr><td>Deployment</td><td>Vercel (FE) / Render (BE)</td><td>—</td><td>Vercel provides React deployment with global CDN edge caching. Render hosts Node.js API with auto-deploy on Git push.</td></tr>
  </tbody>
</table>

<h2>4. Architecture Decision Records (ADRs)</h2>
<h3>ADR-01: MongoDB over Relational Database</h3>
<table>
  <thead><tr><th>Field</th><th>Detail</th></tr></thead>
  <tbody>
    <tr><td>Status</td><td>✅ Accepted</td></tr>
    <tr><td>Context</td><td>The product catalogue requires a flexible schema — product attributes vary significantly across categories.</td></tr>
    <tr><td>Decision</td><td>Adopt MongoDB as the primary data store.</td></tr>
    <tr><td>Justification</td><td>Document-based storage natively accommodates variable product attributes without migration-heavy ALTER TABLE operations.</td></tr>
    <tr><td>Consequences</td><td>No multi-document ACID transactions by default. Mitigated by Mongoose document-level atomicity for order creation and stock deduction.</td></tr>
  </tbody>
</table>

<h3>ADR-02: JWT in HTTP-only Cookies over localStorage</h3>
<table>
  <thead><tr><th>Field</th><th>Detail</th></tr></thead>
  <tbody>
    <tr><td>Status</td><td>✅ Accepted</td></tr>
    <tr><td>Decision</td><td>Store JWT in HTTP-only, SameSite=Strict cookies rather than <code>localStorage</code>.</td></tr>
    <tr><td>Justification</td><td><code>localStorage</code> is fully accessible by JavaScript, making it vulnerable to XSS. HTTP-only cookies are inaccessible to client-side scripts.</td></tr>
    <tr><td>Consequences</td><td>CSRF mitigation required via <code>SameSite=Strict</code> attribute and CORS configuration.</td></tr>
  </tbody>
</table>

<h3>ADR-03: Cloudinary over Local File Storage</h3>
<table>
  <thead><tr><th>Field</th><th>Detail</th></tr></thead>
  <tbody>
    <tr><td>Status</td><td>✅ Accepted</td></tr>
    <tr><td>Decision</td><td>Use Cloudinary's cloud image management platform.</td></tr>
    <tr><td>Justification</td><td>Provides automatic resizing, WebP conversion, and global CDN. Eliminates reliance on application server's ephemeral filesystem (Render).</td></tr>
    <tr><td>Consequences</td><td>External API dependency and storage cost. Mitigated by enforcing file size limits in upload middleware.</td></tr>
  </tbody>
</table>
`
  },

  {
    outPath: "Phase Wise Templets/Requirement Analysis/Data_Flow_Diagrams_User_Stories.html",
    title: "Data Flow Diagrams &amp; User Stories",
    phase: "Requirement Analysis Phase",
    version: "1.1",
    content: `
<h1>Data Flow Diagrams &amp; User Stories</h1>

<h2>1. Introduction</h2>
<p>This document presents the <strong>Data Flow Diagrams (DFDs)</strong> and formal <strong>User Stories</strong> for the ShopEZ platform. DFDs model the system at two abstraction levels — Context Level (Level 0) and Functional Decomposition (Level 1) — illustrating data flows between actors, processes, and data stores.</p>

<h2>2. Level 0 — Context Diagram</h2>
<div class="diagram-wrap">
  <pre class="mermaid">
flowchart LR
    Customer(["👤 Customer"])
    Admin(["🔑 Administrator"])
    PayGW(["💳 Payment Gateway"])
    Cloudinary(["🖼️ Cloudinary CDN"])
    System{{"🛒 ShopEZ E-commerce System"}}
    Customer -->|"Login Credentials, Search Queries, Cart Actions, Order Details"| System
    System -->|"Product Catalogue, Cart State, Order Confirmations"| Customer
    Admin -->|"Product Data, Category Data, Order Status Updates"| System
    System -->|"Sales Metrics, Order Lists, Platform Reports"| Admin
    System -->|"Payment Request"| PayGW
    PayGW -->|"Payment Success / Failure"| System
    System -->|"Image Upload Request"| Cloudinary
    Cloudinary -->|"Hosted Image URL"| System
  </pre>
  <div class="diagram-caption">Figure 6.1 — Level 0: Context Diagram (System as Black Box)</div>
</div>

<h2>3. Level 1 — Authentication Sub-Process</h2>
<div class="diagram-wrap">
  <pre class="mermaid">
flowchart TD
    Customer(["👤 Customer"])
    P1["Process 1.0 — User Authentication"]
    DS1[("🗄️ DS-1: Users Collection (MongoDB)")]
    Customer -->|"email, password, name"| P1
    P1 -->|"Hash password (Bcrypt)"| DS1
    P1 -->|"Validate credentials"| DS1
    DS1 -->|"User record"| P1
    P1 -->|"JWT Token (HTTP-only Cookie)"| Customer
  </pre>
  <div class="diagram-caption">Figure 6.2 — Level 1: Authentication Process DFD</div>
</div>

<h2>4. Level 1 — Shopping &amp; Order Placement Sub-Process</h2>
<div class="diagram-wrap">
  <pre class="mermaid">
flowchart TD
    Customer(["👤 Customer"])
    P2A["Process 2.1 — Product Search & Browse"]
    P2B["Process 2.2 — Cart Management"]
    P2C["Process 2.3 — Checkout & Order Creation"]
    DS2[("🗄️ DS-2: Products Collection")]
    DS3[("🗄️ DS-3: Cart Collection")]
    DS4[("🗄️ DS-4: Orders Collection")]
    PayGW(["💳 Payment Gateway"])
    Customer -->|"Search query / filters"| P2A
    P2A --> DS2
    DS2 -->|"Product list"| P2A
    P2A -->|"Product results"| Customer
    Customer -->|"Add/Update/Remove item"| P2B
    P2B <--> DS3
    P2B -->|"Updated cart"| Customer
    Customer -->|"Shipping address, payment method"| P2C
    P2C -->|"Verify stock"| DS2
    P2C -->|"Payment request"| PayGW
    PayGW -->|"Payment confirmation"| P2C
    P2C -->|"Write order record"| DS4
    P2C -->|"Deduct stock"| DS2
    P2C -->|"Clear cart"| DS3
    P2C -->|"Order confirmation"| Customer
  </pre>
  <div class="diagram-caption">Figure 6.3 — Level 1: Shopping & Order Placement DFD</div>
</div>

<h2>5. User Stories</h2>
<table>
  <thead><tr><th>USN</th><th>User Type</th><th>User Story</th><th>Acceptance Criteria</th><th>Points</th><th>Sprint</th></tr></thead>
  <tbody>
    <tr><td>USN-1</td><td>Customer</td><td>As a customer, I can register by entering my name, email, and password.</td><td>Account created in DB; redirected to dashboard; duplicate email returns 400.</td><td>2</td><td>Sprint 1</td></tr>
    <tr><td>USN-2</td><td>Customer</td><td>As a customer, I can log in using my registered email and password.</td><td>JWT issued in HTTP-only cookie; incorrect credentials return 401.</td><td>2</td><td>Sprint 1</td></tr>
    <tr><td>USN-3</td><td>Customer</td><td>As a customer, I can search and filter products by category, price, and rating.</td><td>Results accurately reflect filters; update without full page reload.</td><td>3</td><td>Sprint 1</td></tr>
    <tr><td>USN-4</td><td>Customer</td><td>As a customer, I can add, remove, and update quantities in my cart.</td><td>Cart total updates in real time; cart persists across sessions and devices.</td><td>3</td><td>Sprint 2</td></tr>
    <tr><td>USN-5</td><td>Customer</td><td>As a customer, I can complete a guided checkout by entering shipping and payment details.</td><td>All three checkout steps navigable; address validated before proceeding.</td><td>3</td><td>Sprint 2</td></tr>
    <tr><td>USN-6</td><td>Customer</td><td>As a customer, I can securely pay via an integrated payment gateway.</td><td>Payment processed; order status changes to "Paid"; stock deducted; confirmation shown.</td><td>5</td><td>Sprint 2</td></tr>
    <tr><td>USN-7</td><td>Customer</td><td>As a customer who has completed a purchase, I can leave a star rating and review.</td><td>Review appears on the product page; aggregate rating recalculated.</td><td>2</td><td>Sprint 3</td></tr>
    <tr><td>USN-8</td><td>Admin</td><td>As an admin, I can add, edit, and delete product listings with Cloudinary image uploads.</td><td>Changes reflect immediately on storefront; images served via CDN URL.</td><td>3</td><td>Sprint 1</td></tr>
    <tr><td>USN-9</td><td>Admin</td><td>As an admin, I can view all orders and update their delivery status.</td><td>Status transitions: Processing → Shipped → Delivered; reflected in customer's order history.</td><td>2</td><td>Sprint 3</td></tr>
    <tr><td>USN-10</td><td>Admin</td><td>As an admin, I can view aggregated sales metrics and monthly revenue charts.</td><td>Dashboard shows accurate total revenue, order count, and monthly breakdown.</td><td>3</td><td>Sprint 3</td></tr>
  </tbody>
</table>
`
  },

  {
    outPath: "Phase Wise Templets/Project Design Phase/Problem - Solution Fit Template/Problem_Solution_Fit.html",
    title: "Problem &ndash; Solution Fit",
    phase: "Project Design Phase",
    version: "1.1",
    content: `
<h1>Problem &ndash; Solution Fit</h1>

<h2>1. Introduction</h2>
<p>This document formally validates the <strong>Problem–Solution Fit</strong> of the ShopEZ platform. Fit is achieved when a proposed solution demonstrably and efficiently addresses the core pain points of target customer segments while delivering measurable gains that differentiate it from existing market alternatives.</p>

<h2>2. Customer Journey → Problem → Solution Mapping</h2>
<div class="diagram-wrap">
  <pre class="mermaid">
flowchart LR
    subgraph Customer["👤 Customer Journey"]
        J1["Discovers platform"] --> J2["Searches Products"]
        J2 --> J3["Adds items to cart"]
        J3 --> J4["Proceeds to Checkout"]
        J4 --> J5["Completes Payment"]
        J5 --> J6["Tracks Order"]
    end
    subgraph Problems["⚠️ Identified Problems"]
        P1["Poor search & filtering"]
        P2["Cart state lost across devices"]
        P3["Confusing checkout flow"]
        P4["Untrusted payment options"]
        P5["No order visibility"]
    end
    subgraph Solutions["✅ ShopEZ Solutions"]
        S1["Full-text search + filters"]
        S2["MongoDB-backed persistent cart"]
        S3["3-Step guided checkout wizard"]
        S4["Stripe / Razorpay PCI-DSS"]
        S5["Order history & status tracking"]
    end
    J2 --- P1
    J3 --- P2
    J4 --- P3
    J4 --- P4
    J6 --- P5
    P1 --> S1
    P2 --> S2
    P3 --> S3
    P4 --> S4
    P5 --> S5
  </pre>
  <div class="diagram-caption">Figure 7.1 — Customer Journey → Problem → Solution Mapping</div>
</div>

<h2>3. Competitive Analysis</h2>
<table>
  <thead><tr><th>Criterion</th><th>Shopify</th><th>WooCommerce</th><th>Custom PHP</th><th>ShopEZ (MERN)</th></tr></thead>
  <tbody>
    <tr><td>Customisability</td><td>Limited</td><td>Moderate</td><td>High</td><td>✅ Full Control</td></tr>
    <tr><td>SPA Performance</td><td>❌ No (SSR)</td><td>❌ No (SSR)</td><td>❌ No</td><td>✅ React SPA</td></tr>
    <tr><td>Monthly Cost</td><td>₹2,000–₹20,000</td><td>₹500–₹5,000</td><td>Variable</td><td>✅ Low (Free Tiers)</td></tr>
    <tr><td>Cross-Device Cart</td><td>✅ Yes</td><td>✅ Yes</td><td>❌ No</td><td>✅ Yes (MongoDB)</td></tr>
    <tr><td>Admin Dashboard</td><td>✅ Basic</td><td>✅ Plugin-based</td><td>❌ Manual</td><td>✅ Custom Analytics</td></tr>
    <tr><td>Payment Gateways</td><td>Limited</td><td>Multiple (plugins)</td><td>Manual</td><td>✅ Stripe + Razorpay</td></tr>
    <tr><td>Image CDN</td><td>✅ Yes</td><td>❌ No</td><td>❌ No</td><td>✅ Cloudinary</td></tr>
    <tr><td>Developer Ownership</td><td>❌ Lock-in</td><td>Partial</td><td>✅ Yes</td><td>✅ Full Ownership</td></tr>
    <tr><td>Scalability</td><td>Limited by plan</td><td>Limited by hosting</td><td>Complex</td><td>✅ Stateless API</td></tr>
  </tbody>
</table>

<h2>4. Fit Validation Summary</h2>
<table>
  <thead><tr><th>Problem</th><th>Solution Provided</th><th>Fit?</th></tr></thead>
  <tbody>
    <tr><td>Cart state lost across sessions</td><td>MongoDB-persisted cart linked to user ID</td><td>✅ Yes</td></tr>
    <tr><td>Poor search &amp; discovery</td><td>Full-text search + multi-criteria filter API</td><td>✅ Yes</td></tr>
    <tr><td>Confusing checkout</td><td>3-step guided wizard (Address → Method → Payment)</td><td>✅ Yes</td></tr>
    <tr><td>Untrusted payment process</td><td>Stripe / Razorpay PCI-DSS compliant gateway</td><td>✅ Yes</td></tr>
    <tr><td>Slow page loads</td><td>React SPA + Cloudinary CDN</td><td>✅ Yes</td></tr>
    <tr><td>No admin analytics</td><td>Custom Admin Dashboard with revenue charts</td><td>✅ Yes</td></tr>
    <tr><td>Manual image hosting</td><td>Cloudinary auto-optimise &amp; CDN delivery</td><td>✅ Yes</td></tr>
  </tbody>
</table>
<div class="info-box"><strong>Overall Assessment:</strong> ✅ Validated — All identified problems have documented and implemented solution counterparts. Problem–Solution Fit is confirmed for both primary customer segments.</div>
`
  },

  {
    outPath: "Phase Wise Templets/Project Design Phase/Proposed Solution/Proposed_Solution.html",
    title: "Proposed Solution",
    phase: "Project Design Phase",
    version: "1.1",
    content: `
<h1>Proposed Solution</h1>

<h2>1. System Context Diagram</h2>
<div class="diagram-wrap">
  <pre class="mermaid">
flowchart TB
    Customer(["👤 B2C Customer (Web Browser)"])
    Admin(["🔑 Store Administrator (Web Browser)"])
    subgraph ShopEZ["🛒 ShopEZ Platform"]
        direction TB
        Frontend["React.js SPA (Vercel)"]
        Backend["Node.js / Express.js API (Render)"]
        Database["MongoDB Atlas (Cloud Database)"]
        Frontend <-->|"REST API / JSON"| Backend
        Backend <-->|"Mongoose ODM"| Database
    end
    subgraph External["🔌 External Systems"]
        Stripe["💳 Stripe / Razorpay"]
        Cloudinary["🖼️ Cloudinary CDN"]
    end
    Customer <-->|"HTTPS"| Frontend
    Admin <-->|"HTTPS"| Frontend
    Backend -.->|"Payment API"| Stripe
    Backend -.->|"Upload API"| Cloudinary
  </pre>
  <div class="diagram-caption">Figure 8.1 — C4 Model Level 1: System Context Diagram</div>
</div>

<h2>2. Solution Parameters</h2>
<table>
  <thead><tr><th>S.No.</th><th>Parameter</th><th>Detailed Description</th></tr></thead>
  <tbody>
    <tr><td>1</td><td><strong>Problem Statement</strong></td><td>Customers require a secure, fast, and intuitive platform to discover and purchase items online. Administrators require a centralised, efficient tool to manage product inventory, monitor sales performance, and fulfil orders. The core gap is the absence of a unified, modern, customisable e-commerce solution accessible without prohibitive SaaS subscription costs.</td></tr>
    <tr><td>2</td><td><strong>Solution Description</strong></td><td>A fully responsive Single Page Application (SPA) built on the MERN stack. The platform provides: (i) a customer-facing storefront with robust product discovery, persistent cart, and guided checkout; and (ii) an administrator panel with inventory management, order fulfilment, Cloudinary-powered image uploads, and sales analytics dashboards. Payment processing is delegated to PCI-DSS compliant gateways (Stripe / Razorpay).</td></tr>
    <tr><td>3</td><td><strong>Novelty / Uniqueness</strong></td><td>Decoupled architecture with independently deployable frontend and backend; MongoDB-backed cross-device cart persistence; Cloudinary dynamic image transformations on CDN delivery; stateless JWT authentication enabling horizontal API scaling.</td></tr>
    <tr><td>4</td><td><strong>Social Impact / Customer Satisfaction</strong></td><td>Delivers a reliable, transparent purchasing process building consumer trust through secure payment integration and clear order tracking. Empowers small business operators with accessible analytics, enabling data-driven inventory decisions and improved customer service.</td></tr>
    <tr><td>5</td><td><strong>Business Model (Revenue Model)</strong></td><td>Primary: direct sales margin on products. Secondary: premium product placement / featured listing slots; percentage-based commission for future multi-vendor configuration; shipping and handling fee collection on high-volume orders.</td></tr>
  </tbody>
</table>

<h2>3. High-Level Feature Summary</h2>
<table>
  <thead><tr><th>Feature Category</th><th>Key Capabilities</th></tr></thead>
  <tbody>
    <tr><td><strong>Authentication &amp; Security</strong></td><td>JWT + Bcrypt; HTTP-only cookie sessions; RBAC (User / Admin)</td></tr>
    <tr><td><strong>Product Discovery</strong></td><td>Full-text search; Category, Price, Rating filters; Sorting options</td></tr>
    <tr><td><strong>Shopping Experience</strong></td><td>Persistent cross-device cart; Real-time total calculation; Stock validation</td></tr>
    <tr><td><strong>Checkout &amp; Payment</strong></td><td>3-step wizard; Stripe / Razorpay integration; Invoice generation</td></tr>
    <tr><td><strong>Order Management</strong></td><td>Order history (customer); Fulfilment status tracking (admin)</td></tr>
    <tr><td><strong>Product Reviews</strong></td><td>Verified purchase reviews; Aggregate rating recalculation</td></tr>
    <tr><td><strong>Admin Operations</strong></td><td>Product CRUD; Category management; Cloudinary image upload</td></tr>
    <tr><td><strong>Admin Analytics</strong></td><td>Revenue charts; Order volume metrics; User growth indicators</td></tr>
  </tbody>
</table>
`
  },

  {
    outPath: "Phase Wise Templets/Project Design Phase/Solution Architecture/Solution_Architecture.html",
    title: "Solution Architecture",
    phase: "Project Design Phase",
    version: "1.1",
    content: `
<h1>Solution Architecture</h1>

<h2>1. Layered System Architecture</h2>
<div class="diagram-wrap">
  <pre class="mermaid">
graph TD
    subgraph Presentation["Layer 1 — Presentation (Client)"]
        Browser["Web Browser"]
        React["React.js v18 (SPA)"]
        CtxAPI["Context API / Redux Toolkit (Global State)"]
        Axios["Axios HTTP Client"]
        Browser --> React
        React <--> CtxAPI
        React --> Axios
    end
    subgraph API["Layer 2 — API Gateway & Middleware (Server)"]
        Router["Express.js Router (/api/users, /api/products, /api/orders)"]
        AuthMW["JWT Auth Middleware (protect + isAdmin)"]
        ErrMW["Global Error Handler Middleware"]
        Router --> AuthMW
        AuthMW --> ErrMW
    end
    subgraph Business["Layer 3 — Business Logic (Controllers)"]
        UserCtrl["User Controller (register, login, profile)"]
        ProdCtrl["Product Controller (CRUD, search, filter)"]
        OrderCtrl["Order Controller (create, pay, fulfill)"]
        CartCtrl["Cart Controller (add, update, remove)"]
    end
    subgraph Data["Layer 4 — Data Access (ODM + Database)"]
        Mongoose["Mongoose ODM (Schema, hooks, populate)"]
        MongoDB[("MongoDB Atlas — Collections: users, products, orders, categories, carts, reviews")]
        Mongoose <--> MongoDB
    end
    subgraph External["External Services"]
        Stripe["Stripe / Razorpay (Payment)"]
        Cloudinary["Cloudinary (Image CDN)"]
    end
    Axios -->|"HTTPS REST"| Router
    ErrMW --> UserCtrl
    ErrMW --> ProdCtrl
    ErrMW --> OrderCtrl
    ErrMW --> CartCtrl
    UserCtrl --> Mongoose
    ProdCtrl --> Mongoose
    OrderCtrl --> Mongoose
    CartCtrl --> Mongoose
    OrderCtrl -.->|"Payment API"| Stripe
    ProdCtrl -.->|"Upload API"| Cloudinary
  </pre>
  <div class="diagram-caption">Figure 9.1 — 4-Layer System Architecture Diagram</div>
</div>

<h2>2. MVC Pattern Mapping</h2>
<table>
  <thead><tr><th>MVC Layer</th><th>MERN Component</th><th>Responsibilities</th></tr></thead>
  <tbody>
    <tr><td><strong>View</strong></td><td>React.js (Frontend SPA)</td><td>Renders UI components; manages local state; dispatches API calls via Axios; updates global state via Context/Redux</td></tr>
    <tr><td><strong>Controller</strong></td><td>Express.js Controllers</td><td>Receives validated HTTP requests; orchestrates business logic; invokes Model methods; formats and returns JSON responses</td></tr>
    <tr><td><strong>Model</strong></td><td>Mongoose Schemas &amp; Models</td><td>Defines data structure, validation rules, and type constraints; executes lifecycle hooks; interfaces with MongoDB Atlas</td></tr>
  </tbody>
</table>

<h2>3. UML Class Diagram — Mongoose Models</h2>
<div class="diagram-wrap">
  <pre class="mermaid">
classDiagram
    class UserModel {
        +ObjectId _id
        +String name
        +String email
        +String password
        +String role
        +Array addresses
        +matchPassword(entered) Boolean
        +pre_save_hook() void
    }
    class ProductModel {
        +ObjectId _id
        +String name
        +Number price
        +Number stock
        +Number rating
        +ObjectId category
        +Array images
        +Array reviews
    }
    class OrderModel {
        +ObjectId _id
        +ObjectId user
        +Array orderItems
        +Object shippingAddress
        +Number totalPrice
        +Boolean isPaid
        +String orderStatus
    }
    class CartModel {
        +ObjectId _id
        +ObjectId user
        +Array items
        +Date updatedAt
    }
    class CategoryModel {
        +ObjectId _id
        +String name
        +String slug
    }
    class ReviewModel {
        +ObjectId _id
        +ObjectId user
        +ObjectId product
        +Number rating
        +String comment
    }
    UserModel "1" --> "0..*" OrderModel : places
    UserModel "1" --> "1" CartModel : owns
    UserModel "1" --> "0..*" ReviewModel : writes
    ProductModel "1" --> "0..*" ReviewModel : receives
    CategoryModel "1" --> "0..*" ProductModel : classifies
  </pre>
  <div class="diagram-caption">Figure 9.2 — UML Class Diagram: Mongoose Data Models</div>
</div>

<h2>4. Deployment Topology</h2>
<div class="diagram-wrap">
  <pre class="mermaid">
flowchart LR
    User(["🌍 End User (Browser)"])
    CDN["☁️ Vercel CDN (React SPA — static files)"]
    API["🖥️ Render (Node.js / Express API — Port 8000)"]
    DB["🗄️ MongoDB Atlas (Cloud Cluster)"]
    CLD["🖼️ Cloudinary (Image CDN)"]
    PG["💳 Stripe / Razorpay (Payment API)"]
    User -->|"HTTPS"| CDN
    CDN -->|"API Calls (HTTPS + CORS)"| API
    API -->|"TLS / Mongoose"| DB
    API -->|"REST API"| CLD
    API -->|"REST API"| PG
  </pre>
  <div class="diagram-caption">Figure 9.3 — Cloud Deployment Topology</div>
</div>

<h2>5. Deployment URL Reference</h2>
<table>
  <thead><tr><th>Component</th><th>Platform</th><th>URL</th></tr></thead>
  <tbody>
    <tr><td>Frontend (React SPA)</td><td>Vercel</td><td><code>https://e-commerce-application-neon-five.vercel.app/</code></td></tr>
    <tr><td>Backend (Node.js API)</td><td>Render</td><td><code>https://shopez-api-c30e.onrender.com</code></td></tr>
    <tr><td>Database</td><td>MongoDB Atlas</td><td>Cloud-hosted (M0 Free Tier)</td></tr>
    <tr><td>Image Storage</td><td>Cloudinary</td><td><code>res.cloudinary.com/...</code></td></tr>
  </tbody>
</table>
`
  },

  {
    outPath: "Phase Wise Templets/Project Developement/User_Acceptance_Testing.html",
    title: "User Acceptance Testing (UAT)",
    phase: "Project Development Phase",
    version: "1.1",
    content: `
<h1>User Acceptance Testing (UAT)</h1>

<h2>1. Introduction</h2>
<p>This document defines the UAT strategy, process, and test cases for the ShopEZ platform. UAT is the final validation phase confirming that the delivered system meets business requirements and is ready for production release.</p>
<div class="info-box">
  <strong>Live Application:</strong> <code>https://e-commerce-application-neon-five.vercel.app/</code><br>
  <strong>Test Environment:</strong> Chrome v120+ / Edge v120+ (desktop and mobile viewports)
</div>

<h2>2. UAT Process Flow</h2>
<div class="diagram-wrap">
  <pre class="mermaid">
flowchart TD
    A(["📋 Review Requirements & User Stories"]) --> B["Prepare UAT Test Cases (Mapped to FR / USN)"]
    B --> C["Configure Test Environment (Seed DB, Credentials)"]
    C --> D["Execute Test Cases (Manual / Exploratory)"]
    D --> E{Pass?}
    E -->|"✅ All Pass"| F["Document Results & Sign-off"]
    E -->|"❌ Fail"| G["Raise Defect Report"]
    G --> H["Developer Fixes Defect"]
    H --> D
    F --> I(["🚀 Release Approval"])
  </pre>
  <div class="diagram-caption">Figure 10.1 — UAT Process Flowchart</div>
</div>

<h2>3. Test Credentials</h2>
<table>
  <thead><tr><th>Role</th><th>Email</th><th>Password</th></tr></thead>
  <tbody>
    <tr><td>Administrator</td><td><code>admin@shopez.com</code></td><td><code>adminpassword123</code></td></tr>
    <tr><td>Customer</td><td><code>test@email.com</code></td><td><code>password123</code></td></tr>
  </tbody>
</table>

<h2>4. UAT Test Cases</h2>
<h3>4.1 Authentication Module</h3>
<table>
  <thead><tr><th>Test ID</th><th>Scenario</th><th>Steps</th><th>Expected Result</th><th>Status</th></tr></thead>
  <tbody>
    <tr><td>UAT-001</td><td>New User Registration</td><td>1. Go to /register. 2. Enter valid name, email, password. 3. Submit.</td><td>Account created; redirected to dashboard; toast shown.</td><td>☐ Pass / Fail</td></tr>
    <tr><td>UAT-002</td><td>Duplicate Email Rejection</td><td>1. Register with an already-used email. 2. Submit.</td><td>Error: "User already exists." Registration prevented.</td><td>☐ Pass / Fail</td></tr>
    <tr><td>UAT-003</td><td>Valid User Login</td><td>1. Go to /login. 2. Enter valid credentials. 3. Submit.</td><td>JWT set; redirected; Navbar shows user name.</td><td>☐ Pass / Fail</td></tr>
    <tr><td>UAT-004</td><td>Invalid Credentials Rejection</td><td>1. Enter wrong password. 2. Submit.</td><td>HTTP 401; error: "Invalid email or password."</td><td>☐ Pass / Fail</td></tr>
  </tbody>
</table>

<h3>4.2 Product Discovery Module</h3>
<table>
  <thead><tr><th>Test ID</th><th>Scenario</th><th>Steps</th><th>Expected Result</th><th>Status</th></tr></thead>
  <tbody>
    <tr><td>UAT-005</td><td>Keyword Search</td><td>1. Enter "Shirt" in search bar. 2. Press Enter.</td><td>Only products containing "Shirt" in name/description displayed.</td><td>☐ Pass / Fail</td></tr>
    <tr><td>UAT-006</td><td>Category &amp; Price Filter</td><td>1. Select Category = "Electronics". 2. Set Price = ₹500–₹5,000.</td><td>Only Electronics in the price range displayed.</td><td>☐ Pass / Fail</td></tr>
    <tr><td>UAT-007</td><td>Sort Price Ascending</td><td>1. Select Sort = "Price: Low to High".</td><td>Products re-ordered with lowest price first.</td><td>☐ Pass / Fail</td></tr>
  </tbody>
</table>

<h3>4.3 Shopping Cart Module</h3>
<table>
  <thead><tr><th>Test ID</th><th>Scenario</th><th>Steps</th><th>Expected Result</th><th>Status</th></tr></thead>
  <tbody>
    <tr><td>UAT-008</td><td>Add to Cart</td><td>1. Open product page. 2. Select qty=2. 3. Click "Add to Cart".</td><td>Cart badge increments; cart shows item with correct qty and total.</td><td>☐ Pass / Fail</td></tr>
    <tr><td>UAT-009</td><td>Update Cart Quantity</td><td>1. Open Cart. 2. Change qty of an item.</td><td>Subtotal and qty update in real time without page reload.</td><td>☐ Pass / Fail</td></tr>
    <tr><td>UAT-010</td><td>Remove Item from Cart</td><td>1. Open Cart. 2. Click "Remove".</td><td>Item removed; total recalculated; empty cart message if no items remain.</td><td>☐ Pass / Fail</td></tr>
  </tbody>
</table>

<h3>4.4 Checkout &amp; Payment Module</h3>
<table>
  <thead><tr><th>Test ID</th><th>Scenario</th><th>Steps</th><th>Expected Result</th><th>Status</th></tr></thead>
  <tbody>
    <tr><td>UAT-011</td><td>Full Checkout Flow</td><td>1. Add item. 2. Checkout. 3. Enter shipping. 4. Enter test card <code>4242 4242 4242 4242</code>. 5. Place order.</td><td>Order created; stock deducted; confirmation page shown; order in history.</td><td>☐ Pass / Fail</td></tr>
    <tr><td>UAT-012</td><td>Payment Failure Handling</td><td>1. Enter Stripe declined card <code>4000 0000 0000 9995</code> at payment step.</td><td>Error shown; order NOT created; stock NOT deducted.</td><td>☐ Pass / Fail</td></tr>
  </tbody>
</table>

<h3>4.5 Admin Operations Module</h3>
<table>
  <thead><tr><th>Test ID</th><th>Scenario</th><th>Steps</th><th>Expected Result</th><th>Status</th></tr></thead>
  <tbody>
    <tr><td>UAT-013</td><td>Admin Product Creation</td><td>1. Log in as Admin. 2. Admin → Products → "Create". 3. Fill fields &amp; upload image. 4. Submit.</td><td>Product visible in public catalogue; image served from Cloudinary CDN.</td><td>☐ Pass / Fail</td></tr>
    <tr><td>UAT-014</td><td>Admin Product Update</td><td>1. Open existing product in Admin. 2. Edit price. 3. Save.</td><td>Updated price reflected on public product page.</td><td>☐ Pass / Fail</td></tr>
    <tr><td>UAT-015</td><td>Admin Order Status Update</td><td>1. Admin → Orders. 2. Change order status to "Shipped".</td><td>Status update reflected in customer's order history.</td><td>☐ Pass / Fail</td></tr>
    <tr><td>UAT-016</td><td>Unauthorised Admin Access</td><td>1. Log in as Customer. 2. Navigate to /admin directly.</td><td>Access denied; customer redirected with appropriate error message.</td><td>☐ Pass / Fail</td></tr>
  </tbody>
</table>

<h2>5. Results Summary</h2>
<table>
  <thead><tr><th>Module</th><th>Total Tests</th><th>Passed</th><th>Failed</th><th>Pass Rate</th></tr></thead>
  <tbody>
    <tr><td>Authentication</td><td>4</td><td></td><td></td><td></td></tr>
    <tr><td>Product Discovery</td><td>3</td><td></td><td></td><td></td></tr>
    <tr><td>Shopping Cart</td><td>3</td><td></td><td></td><td></td></tr>
    <tr><td>Checkout &amp; Payment</td><td>2</td><td></td><td></td><td></td></tr>
    <tr><td>Admin Operations</td><td>4</td><td></td><td></td><td></td></tr>
    <tr><td><strong>Total</strong></td><td><strong>16</strong></td><td></td><td></td><td></td></tr>
  </tbody>
</table>

<h2>6. UAT Sign-Off</h2>
<table>
  <thead><tr><th>Role</th><th>Name</th><th>Signature</th><th>Date</th></tr></thead>
  <tbody>
    <tr><td>Development Lead</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
    <tr><td>QA Reviewer</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
    <tr><td>Product Owner / Stakeholder</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  </tbody>
</table>
<div class="info-box"><em>We confirm that the ShopEZ application has been tested against all defined User Acceptance criteria and is approved for production release.</em></div>
`
  },

  {
    outPath: "Project Documentation/FSD_Documentation.html",
    title: "Full Stack Development (FSD) Documentation",
    phase: "Project Documentation",
    version: "1.1",
    content: `
<h1>Full Stack Development with MERN — Project Documentation</h1>

<h2>1. Executive Summary</h2>
<p><strong>ShopEZ</strong> is a production-grade, full-stack e-commerce application developed using the MERN (MongoDB, Express.js, React.js, Node.js) technology stack. The platform provides a comprehensive retail solution encompassing customer-facing product discovery, cart management, and payment processing, alongside a dedicated administrative portal for inventory, order fulfilment, and business analytics. Deployed on Vercel (frontend) and Render (backend) with MongoDB Atlas as the cloud database.</p>

<h2>2. System Architecture</h2>
<div class="diagram-wrap">
  <pre class="mermaid">
graph TD
    subgraph Client["Frontend — React SPA (Vercel)"]
        R["React.js v18 (Component-based UI)"]
        CTX["Context API (Auth & Cart State)"]
        AX["Axios (REST API Client)"]
    end
    subgraph Server["Backend — Node.js API (Render)"]
        EX["Express.js Router (/api/users, /products, /orders)"]
        MW["JWT Auth + Admin Middleware"]
        CTRL["Controllers (Business Logic)"]
        EX --> MW --> CTRL
    end
    subgraph DB["MongoDB Atlas (Cloud)"]
        MG["Mongoose ODM"]
        MDB[("MongoDB Atlas Collections")]
        MG --> MDB
    end
    subgraph Ext["External Services"]
        PAY["Stripe / Razorpay"]
        CDN["Cloudinary CDN"]
    end
    AX -->|"HTTPS REST / JSON"| EX
    CTRL --> MG
    CTRL -.->|"Payment API"| PAY
    CTRL -.->|"Upload API"| CDN
  </pre>
  <div class="diagram-caption">Figure 11.1 — Full System Architecture</div>
</div>

<h2>3. Database ER Diagram</h2>
<div class="diagram-wrap">
  <pre class="mermaid">
erDiagram
    USER ||--o{ ORDER : "places"
    USER ||--o{ REVIEW : "writes"
    USER ||--|| CART : "owns"
    PRODUCT ||--o{ REVIEW : "receives"
    PRODUCT ||--o{ ORDER_ITEM : "referenced_in"
    PRODUCT ||--o{ CART_ITEM : "referenced_in"
    CATEGORY ||--o{ PRODUCT : "classifies"
    ORDER ||--|{ ORDER_ITEM : "contains"
    CART ||--|{ CART_ITEM : "contains"
    USER { ObjectId _id PK; String email UK; String password; String role }
    PRODUCT { ObjectId _id PK; String name; Number price; Number stock; ObjectId category FK }
    ORDER { ObjectId _id PK; ObjectId user FK; Number totalPrice; Boolean isPaid; String orderStatus }
    CART { ObjectId _id PK; ObjectId user FK; Date updatedAt }
    CATEGORY { ObjectId _id PK; String name UK; String slug UK }
    REVIEW { ObjectId _id PK; ObjectId user FK; ObjectId product FK; Number rating }
  </pre>
  <div class="diagram-caption">Figure 11.2 — Entity Relationship Diagram</div>
</div>

<h2>4. UML Class Diagram — Mongoose Models</h2>
<div class="diagram-wrap">
  <pre class="mermaid">
classDiagram
    class UserModel {
        +ObjectId _id
        +String name
        +String email
        +String password
        +String role
        +matchPassword(entered) Boolean
    }
    class ProductModel {
        +ObjectId _id
        +String name
        +Number price
        +Number stock
        +Number rating
        +ObjectId category
    }
    class OrderModel {
        +ObjectId _id
        +ObjectId user
        +Number totalPrice
        +Boolean isPaid
        +String orderStatus
    }
    class CartModel {
        +ObjectId _id
        +ObjectId user
        +Array items
    }
    UserModel --> OrderModel : places
    UserModel --> CartModel : owns
    CategoryModel --> ProductModel : classifies
  </pre>
  <div class="diagram-caption">Figure 11.3 — UML Class Diagram: Core Data Models</div>
</div>

<h2>5. Authentication Sequence Diagram</h2>
<div class="diagram-wrap">
  <pre class="mermaid">
sequenceDiagram
    actor User
    participant Client as React App
    participant API as Express API
    participant DB as MongoDB
    User->>Client: Enter email & password
    Client->>API: POST /api/users/login
    API->>DB: Find User by email
    DB-->>API: User document (hashed password)
    API->>API: Bcrypt.compare(entered, hash)
    alt Valid Credentials
        API-->>Client: 200 OK + Set-Cookie (JWT, HttpOnly)
        Client->>User: Redirect to Dashboard
    else Invalid Credentials
        API-->>Client: 401 Unauthorised
        Client->>User: Display error notification
    end
  </pre>
  <div class="diagram-caption">Figure 11.4 — Authentication Sequence Diagram</div>
</div>

<h2>6. Setup &amp; Installation</h2>
<h3>6.1 Environment Variables (<code>server/.env</code>)</h3>
<pre>PORT=8000
MONGO_URI=mongodb+srv://&lt;user&gt;:&lt;password&gt;@&lt;cluster&gt;.mongodb.net/shopez
JWT_SECRET=your_secret_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret</pre>

<h3>6.2 Installation Commands</h3>
<pre># Install server dependencies &amp; seed DB
cd server &amp;&amp; npm install &amp;&amp; npm run seed &amp;&amp; npm run dev

# Install client dependencies
cd ../client &amp;&amp; npm install &amp;&amp; npm run dev</pre>

<h2>7. Complete API Reference</h2>
<table>
  <thead><tr><th>Method</th><th>Endpoint</th><th>Auth</th><th>Description</th></tr></thead>
  <tbody>
    <tr><td>POST</td><td>/api/users/register</td><td>No</td><td>Register a new user</td></tr>
    <tr><td>POST</td><td>/api/users/login</td><td>No</td><td>Authenticate and issue JWT</td></tr>
    <tr><td>POST</td><td>/api/users/logout</td><td>Yes</td><td>Clear JWT cookie</td></tr>
    <tr><td>GET</td><td>/api/users/profile</td><td>User</td><td>Get user profile</td></tr>
    <tr><td>PUT</td><td>/api/users/profile</td><td>User</td><td>Update user profile</td></tr>
    <tr><td>GET</td><td>/api/products</td><td>No</td><td>Get products (supports filters)</td></tr>
    <tr><td>GET</td><td>/api/products/:id</td><td>No</td><td>Get single product</td></tr>
    <tr><td>POST</td><td>/api/products</td><td>Admin</td><td>Create product</td></tr>
    <tr><td>PUT</td><td>/api/products/:id</td><td>Admin</td><td>Update product</td></tr>
    <tr><td>DELETE</td><td>/api/products/:id</td><td>Admin</td><td>Delete product</td></tr>
    <tr><td>POST</td><td>/api/products/:id/reviews</td><td>User</td><td>Submit a review</td></tr>
    <tr><td>POST</td><td>/api/orders</td><td>User</td><td>Create new order</td></tr>
    <tr><td>GET</td><td>/api/orders/myorders</td><td>User</td><td>Get user's order history</td></tr>
    <tr><td>GET</td><td>/api/orders/:id</td><td>User/Admin</td><td>Get order by ID</td></tr>
    <tr><td>PUT</td><td>/api/orders/:id/pay</td><td>User</td><td>Mark order as paid</td></tr>
    <tr><td>PUT</td><td>/api/orders/:id/deliver</td><td>Admin</td><td>Mark order as delivered</td></tr>
    <tr><td>GET</td><td>/api/orders</td><td>Admin</td><td>Get all orders</td></tr>
  </tbody>
</table>

<h2>8. Known Issues &amp; Future Enhancements</h2>
<table>
  <thead><tr><th>Type</th><th>ID</th><th>Description</th><th>Mitigation / Plan</th></tr></thead>
  <tbody>
    <tr><td>Known Issue</td><td>KI-01</td><td>Cart state may desync on concurrent multi-device sessions</td><td>Server-side <code>updatedAt</code> timestamp comparison on cart save</td></tr>
    <tr><td>Known Issue</td><td>KI-02</td><td>Render free-tier cold-start causes 30–60s initial delay</td><td>Upgrade to paid tier for production</td></tr>
    <tr><td>Enhancement</td><td>FE-01</td><td>Email notifications for order confirmation and shipping updates</td><td>Nodemailer / SendGrid — Future Release</td></tr>
    <tr><td>Enhancement</td><td>FE-02</td><td>AI-driven personalised product recommendations</td><td>Collaborative filtering — Future Roadmap</td></tr>
    <tr><td>Enhancement</td><td>FE-03</td><td>Multi-vendor marketplace with revenue-share model</td><td>Significant architectural change — Future Roadmap</td></tr>
  </tbody>
</table>

<h2>9. Live Deployment</h2>
<table>
  <thead><tr><th>Resource</th><th>URL / Credentials</th></tr></thead>
  <tbody>
    <tr><td>Live Application</td><td><code>https://e-commerce-application-neon-five.vercel.app/</code></td></tr>
    <tr><td>API Base URL</td><td><code>https://shopez-api-c30e.onrender.com</code></td></tr>
    <tr><td>Admin Account</td><td><code>admin@shopez.com</code> / <code>adminpassword123</code></td></tr>
    <tr><td>Customer Account</td><td><code>test@email.com</code> / <code>password123</code></td></tr>
  </tbody>
</table>
`
  }
];

// Base directory
const baseDir = path.join(__dirname);

// Generate all HTML files
documents.forEach(doc => {
  const html = buildHTML(doc.title, doc.phase, doc.version, doc.content);
  const outFull = path.join(baseDir, doc.outPath);
  const dir = path.dirname(outFull);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(outFull, html, 'utf8');
  console.log('✅ Generated:', doc.outPath);
});

console.log('\n🎉 All HTML documents generated successfully!');
console.log('📁 Open docs/phase_wise/index.html in your browser to navigate all documents.');
console.log('🖨️  To convert to PDF: Open each .html in Chrome → Print (Ctrl+P) → Save as PDF');
