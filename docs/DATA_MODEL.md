# Data model

Legacy MongoDB: User(name,email,password,role,reset fields); Request(tenantName,property text,issueDescription,priority,status,assignedTo text,notes,createdAt). There is no organization partition in existing records.

Disposable workspace: organization display name; people with role and manager property/tenant unit grants; properties; units with property references; requests with property/unit/tenant/contractor references, unique workspace reference, category, priority, status, due/created/resolved timestamps, resolution text, version and activity; recipient-scoped notifications; audit events. Workspace expiration lives in the server session. IDs are private to a workspace, not MongoDB identifiers. Assignments are stored on the request and changes recorded in its timeline. No attachment bytes or private file URLs are accepted.

Production migration is pending and requires operator mapping, explicit ownership references, compound organization indexes and isolation tests before customer onboarding. See IMPLEMENTATION_PLAN.md.
