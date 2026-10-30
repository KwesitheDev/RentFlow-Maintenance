// Shared by the browser and the static HTML generator. Keep public claims factual.
export const SITE_ORIGIN = (
  process.env.REACT_APP_SITE_URL || "https://rentflow-maintenance.vercel.app"
).replace(/\/$/, "");
export const publicPages = {
  "/": {
    title: "RentFlow Maintenance | Property Maintenance Management",
    description:
      "Bring rental property repairs into one clear workspace. Explore request tracking, manager workflows and a four-role maintenance demo.",
  },
  "/features": {
    title: "Maintenance Request Tracking Features | RentFlow",
    description:
      "Explore maintenance intake, priorities, assignments, activity history and repair reporting in the RentFlow product demo.",
  },
  "/property-managers": {
    title: "Maintenance Workflows for Property Managers | RentFlow",
    description:
      "See how property managers review tenant issues, assign repair work, track progress and verify maintenance completion in RentFlow.",
  },
  "/tenant-portal": {
    title: "Tenant Maintenance Request Portal | RentFlow",
    description:
      "Explore how tenants report repairs, follow maintenance updates and confirm completed work in a private RentFlow demo workspace.",
  },
  "/reporting": {
    title: "Property Maintenance Reports & Analytics | RentFlow",
    description:
      "Explore maintenance workload, overdue repairs, completion rates and resolution metrics with scoped reports and CSV export in the demo.",
  },
  "/faq": {
    title: "RentFlow Questions | Demo, Access & Maintenance Workflows",
    description:
      "Find answers about the RentFlow demo, supported roles, maintenance workflows, access controls and current product availability.",
  },
  "/contact": {
    title: "Contact RentFlow | Discuss Your Maintenance Workflow",
    description:
      "Contact the RentFlow project maintainer to discuss maintenance workflows, share product feedback or report an issue.",
  },
};
export const faqs = [
  [
    "Can I try RentFlow without an account?",
    "Yes. Open the demo and choose a role. A temporary, private workspace is created with fictional records. No email address or shared password is required.",
  ],
  [
    "Which roles can I explore?",
    "The demo supports an owner or administrator, property manager, tenant and contractor. Switch roles in the same workspace to follow one repair from submission through closure.",
  ],
  [
    "Will my demo changes affect another visitor?",
    "No. Each demo session has isolated data. You can reset your workspace at any time. Sessions expire after one hour and are discarded when the demo server restarts.",
  ],
  [
    "How does the maintenance lifecycle work?",
    "In the demo, a tenant submits a request, a manager reviews and assigns it, a contractor starts and resolves the repair, and the tenant or manager closes it. Repairs can also be put on hold or reopened.",
  ],
  [
    "Is the demo the same as the customer workspace?",
    "The demo showcases four roles and an extended lifecycle. The existing customer workspace supports administrator and manager accounts with a simpler request workflow. Production organization isolation, invitations and secure attachments are still in development.",
  ],
  [
    "Can I upload photos or send invitations in the demo?",
    "No. Uploads, external invitations, email delivery and production integrations are disabled in the public demo. It uses fictional data and in-app notifications.",
  ],
  [
    "Can I sign up for a new customer account?",
    "Public signup is currently closed. Existing users can sign in. Contact the project maintainer to discuss your workflow; do not enter real tenant information in the demonstration environment.",
  ],
];
export const productPages = {
  "/features": {
    eyebrow: "A clear path from issue to outcome",
    heading: "Every repair needs a next step.",
    intro:
      "Give requests a place to land, a person responsible and a history your team can follow. Explore the extended workflow in the four-role demo.",
    sections: [
      [
        "01 / Capture",
        "Start with the right details.",
        "Record the authorized unit, category, description and priority. Tenants can see their own requests without sorting through someone else’s repairs.",
      ],
      [
        "02 / Coordinate",
        "Make responsibility visible.",
        "Review incoming work, assign a contractor and distinguish public updates from internal notes. The activity timeline explains what changed and who changed it.",
      ],
      [
        "03 / Verify",
        "Close the loop on repairs.",
        "Contractors provide resolution details. Tenants or managers confirm closure, with a path to reopen work when the problem returns.",
      ],
    ],
  },
  "/property-managers": {
    eyebrow: "For property managers",
    heading: "Less chasing. Clearer ownership.",
    intro:
      "Move from an incoming issue to assigned work without losing the context. The manager demo is scoped to assigned properties, with reports and request history in the same workspace.",
    sections: [
      [
        "Triage",
        "Know what needs attention.",
        "Review submitted requests, distinguish urgent repairs and search the maintenance queue by issue or reference.",
      ],
      [
        "Assign",
        "Put a name against the work.",
        "Choose a contractor after reviewing the request. Keep updates and internal coordination attached to the repair rather than scattered across conversations.",
      ],
      [
        "Follow through",
        "Verify the outcome.",
        "Review the contractor’s resolution, close the repair or reopen it. Check overdue work and contractor workload before planning the next job.",
      ],
    ],
  },
  "/tenant-portal": {
    eyebrow: "For tenants",
    heading: "Report it. Follow it. Get back to your day.",
    intro:
      "A straightforward request flow for the people who live in your properties. Try the tenant perspective in the demo without creating an account.",
    sections: [
      [
        "Report",
        "Explain the problem once.",
        "Select your authorized unit, choose a repair category and describe the issue. Priority helps the property team understand the request.",
      ],
      [
        "Follow",
        "See where your repair stands.",
        "Your request history and tenant-visible updates stay together. Internal management notes and other tenants’ records stay out of your view.",
      ],
      [
        "Confirm",
        "Have a say in completion.",
        "Review the resolution details, confirm that the issue is fixed or reopen the repair if it needs more attention.",
      ],
    ],
  },
  "/reporting": {
    eyebrow: "Maintenance reporting",
    heading: "A clearer view of the work ahead.",
    intro:
      "The demo turns the requests you are permitted to see into practical operational measures. Explore reports as an owner for the full fictional portfolio or as a manager for assigned properties.",
    sections: [
      [
        "Priorities",
        "See active and overdue work.",
        "Open work excludes resolved, closed and cancelled requests. Overdue counts active requests whose due date has passed. Breakdowns show priorities and work by property.",
      ],
      [
        "Outcomes",
        "Understand completion.",
        "Completion rate is closed requests divided by non-cancelled requests. Mean resolution time measures creation to resolution for requests that are currently resolved or closed.",
      ],
      [
        "Capacity",
        "Review workloads and share reports.",
        "See active assignments by contractor. Export the visible request list to CSV or print an operational report. Time-series reporting and date-range filters are still planned.",
      ],
    ],
  },
};
