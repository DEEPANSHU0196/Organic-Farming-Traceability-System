# AgroVerse Organic Farming Traceability System

## Quality and Feasibility Study

**Prepared for:** Project Evaluation
**System type:** Web-based agricultural traceability and marketplace platform
**Assessment basis:** Current source code, architecture, automated checks, and production build
**Assessment date:** September 2026

## 1. Executive Summary

AgroVerse is a role-based web platform designed to improve trust and coordination in the organic farming supply chain. It connects farmers, buyers, transporters, and administrators through product listings, ordering, shipment tracking, reviews, notifications, and QR-based product traceability.

The project is **technically feasible and suitable as a working MVP/prototype**. The current implementation has a coherent full-stack architecture, a successful production frontend build, authenticated APIs, role-aware portals, MongoDB data models, cloud media support, and a passing backend test suite.

The project is **not yet ready to be described as a fully production-certified traceability network**. Before commercial deployment, it needs stronger authorization checks on every resource, automated API/integration tests, validation of organic certificates, audit logs, rate limiting, security hardening, monitoring, backup procedures, and deployment documentation.

### Overall decision

| Area | Assessment | Decision |
|---|---:|---|
| Technical feasibility | High | Proceed with controlled pilot |
| Operational feasibility | Medium to high | Proceed after user training and workflow validation |
| Economic feasibility | Medium to high | Viable if launched incrementally using managed services |
| Quality maturity | Medium | Strong MVP foundation; production controls remain |
| Academic/project feasibility | High | Suitable for demonstration and evaluation |

## 2. Problem and Proposed Solution

### Problem

Organic agricultural products often pass through several actors. Without a shared digital record, buyers may struggle to verify origin, farmers may have limited visibility after sale, and transport updates may be fragmented. This reduces transparency, weakens trust, and makes coordination inefficient.

### Proposed solution

AgroVerse creates one digital workflow:

1. A farmer registers and publishes product and farming details.
2. A buyer discovers products and places an order.
3. A transporter receives and updates shipment progress.
4. A buyer or other stakeholder scans a QR code to view the public traceability record.
5. Administrators supervise users, products, orders, and operational activity.

The result is a traceable chain from farm to delivery, supported by role-specific dashboards rather than one confusing interface for every user.

## 3. Scope of the Current System

### Implemented capabilities

- React and Vite web frontend with routed user journeys.
- Express and Node.js backend API.
- MongoDB and Mongoose data persistence.
- Authentication using JWT and protected routes.
- Role-based access for farmer, buyer, transporter, and administrator portals.
- Product creation, listing, update, deletion, images, pricing, quantity, harvest date, and farming details.
- Order and shipment workflows.
- Transporter assignment and shipment status updates.
- Public product traceability page.
- QR code generation linked to a product trace URL.
- Reviews and notifications.
- Cloudinary integration for media storage.
- Dashboard charts and responsive user-facing interfaces.
- Automated backend checks for portal access, product validation, cloud configuration, and farmer order views.

### Boundaries and assumptions

- The current QR record is application/database based; it is not an immutable blockchain record.
- `organicCertified` and `certificationNumber` are stored as product data, but external certification verification is not yet demonstrated.
- Real deployment requires configured MongoDB, JWT secret, frontend URL, Cloudinary credentials, and an operational hosting environment.
- The current test suite is focused and useful, but it does not yet provide broad end-to-end coverage.

## 4. Quality Assessment

Scores use a five-point scale: 1 = weak, 3 = acceptable for an MVP, 5 = strong production maturity.

| Quality attribute | Score | Evidence | Evaluation |
|---|---:|---|---|
| Functional suitability | 4/5 | Separate portals, product/order/shipment/QR/review/notification routes | Strong coverage of the intended workflow |
| Usability | 4/5 | Role-specific dashboards, responsive React UI, trace page | Good for demonstrations; field-user testing is still needed |
| Security foundation | 3/5 | JWT authentication, protected routes, role middleware, CORS allowlist | Good foundation; resource ownership and operational hardening need review |
| Reliability | 3/5 | Mongoose persistence, error responses, passing tests | Needs monitoring, retries, backups, and integration tests |
| Maintainability | 3/5 | Separated routes, controllers, models, middleware, contexts, and API modules | Clear structure; duplicated conventions and inconsistent naming should be reduced |
| Performance | 3/5 | Successful Vite production build and asset chunking | Acceptable for pilot traffic; image optimization and load testing remain |
| Scalability | 3/5 | Stateless Express API and MongoDB are suitable starting points | Requires indexes, pagination, caching, and deployment scaling at growth |
| Portability | 4/5 | Standard JavaScript ecosystem and environment-based configuration | Deployable to common Node/Vite hosting platforms |
| Testability | 3/5 | Five backend tests pass | Add API contract, authorization, UI, and database integration tests |

### Verified quality checks

- Frontend production build: **passed**.
- Backend automated tests: **5 passed, 0 failed**.
- Build output is generated successfully by Vite.
- Backend tests cover cloud configuration, farmer order mapping, portal access, and product validation.

## 5. Feasibility Study

### 5.1 Technical feasibility: High

The selected technologies are mature, widely supported, and appropriate for the problem:

- React/Vite supports a responsive browser application.
- Express provides a lightweight API layer.
- MongoDB fits product, order, shipment, and event-like update documents.
- JWT supports stateless authentication for multiple portals.
- QR generation is practical using the existing server-side library.
- Cloudinary reduces the need to operate a custom image-storage service.

The architecture is feasible for a pilot and can scale horizontally because the API is broadly stateless. The main technical work before production is security and operational maturity, not a complete rewrite.

### 5.2 Operational feasibility: Medium to high

The platform matches the responsibilities of the supply chain. Farmers manage products, buyers interact with listings and orders, transporters update deliveries, and administrators supervise the ecosystem. This separation reduces role confusion and supports accountability.

Operational success depends on:

- Simple onboarding for users with limited technical experience.
- Mobile-first testing in low-bandwidth conditions.
- Clear shipment status definitions.
- Training for QR scanning and product data entry.
- A support process for incorrect product or delivery information.

### 5.3 Economic feasibility: Medium to high

An incremental launch is financially realistic because the initial platform can use managed or low-cost services rather than dedicated infrastructure. Major cost categories are hosting, MongoDB, image storage, domain/SSL, monitoring, maintenance, user training, and support.

The platform can create value by reducing manual coordination, improving buyer confidence, increasing product visibility, and giving farmers a clearer digital sales channel. The recommended financial approach is a small pilot with measured adoption before investing in advanced integrations.

### 5.4 Schedule feasibility: High for a pilot

| Phase | Indicative duration | Output |
|---|---:|---|
| Hardening and security review | 1-2 weeks | Authorization audit, validation, secrets, error handling |
| Integration and acceptance testing | 1-2 weeks | Tested farmer-to-buyer-to-delivery workflow |
| Pilot deployment | 1 week | Hosted environment, database, media storage, monitoring |
| User training and feedback | 1-2 weeks | Feedback from representative stakeholders |
| Pilot evaluation | 1 week | KPI report and prioritized next-release backlog |

### 5.5 Legal and compliance feasibility: Conditional

The project is feasible from a software perspective, but real deployment must address privacy, consent, data retention, user rights, secure credential handling, and applicable agricultural or organic-certification requirements. Certification claims should be backed by a trusted verifier or clearly presented as user-provided information until verification is implemented.

## 6. Main Risks and Mitigations

| Risk | Impact | Likelihood | Mitigation |
|---|---|---:|---|
| Incorrect product or certification information | High | Medium | Admin review, evidence upload, verifier workflow, audit history |
| Unauthorized access to another user's resource | High | Medium | Enforce ownership checks in every controller; add negative authorization tests |
| Credential or secret exposure | High | Low to medium | Environment secrets, secret rotation, production configuration review |
| Poor connectivity in rural areas | Medium | High | Lightweight pages, image compression, retry behavior, progressive enhancement |
| Shipment status inconsistency | Medium | Medium | Controlled status transitions and timestamped event history |
| Database or media outage | High | Low to medium | Backups, restore drills, monitoring, failure alerts |
| Low user adoption | High | Medium | Pilot with real users, training, feedback, and simplified onboarding |
| Growing media and query volume | Medium | Medium | Pagination, indexes, CDN delivery, lifecycle policies |

## 7. Priority Improvements Before Production

### Must have

1. Audit every controller for resource ownership and role authorization.
2. Add request validation for quantities, prices, IDs, dates, and shipment transitions.
3. Add integration tests for login, product creation, order creation, shipment updates, QR access, and forbidden actions.
4. Add security middleware, rate limiting, secure headers, production logging, and secret-rotation procedures.
5. Define database backup, restore, and failure-recovery procedures.
6. Verify organic certification through an administrative or external verification workflow.

### Should have

1. Add immutable audit events for product and shipment changes.
2. Add pagination, indexes, and image optimization.
3. Improve API documentation and deployment instructions.
4. Add accessibility and low-bandwidth usability testing.
5. Add monitoring for uptime, response time, failed requests, and QR usage.

### Could have

1. SMS or WhatsApp delivery notifications.
2. Offline-first mobile support for field updates.
3. Analytics for demand, delivery performance, and farmer income.
4. Integration with recognized certification providers and logistics services.
5. Tamper-evident event storage or blockchain anchoring if a business requirement justifies its cost.

## 8. Success Metrics for a Pilot

- At least 90% of pilot products contain complete traceability data.
- At least 95% of valid requests complete without an application error.
- Product trace pages load successfully in at least 98% of QR scans.
- 100% of tested forbidden portal actions are rejected.
- Median shipment status update time is under two minutes.
- At least 80% of pilot users can complete their primary workflow without assistance after training.
- No critical security findings remain open before public launch.

## 9. Recommended Demonstration Flow

Use one product and tell one uninterrupted story:

1. Log in as a farmer and create an organic product with harvest and location details.
2. Show the product in the marketplace and explain the farmer-owned record.
3. Log in as a buyer and place an order.
4. Show the transporter workflow and update the shipment through its stages.
5. Generate the QR code and open the public traceability page.
6. Show the buyer the same product history and delivery status.
7. End with the admin portal and explain supervision, review, and issue resolution.

This sequence demonstrates the project's central value better than listing isolated screens: one shared record follows the product across the supply chain.

## 10. Evaluator Questions and Strong Answers

**Is this a real traceability system or only an e-commerce application?**

It combines marketplace and traceability functions. The differentiator is the product record and QR-linked public trace page, supplemented by shipment updates and role-specific accountability. The current version is an MVP, and stronger audit and certification verification are planned for production maturity.

**Why did you choose MongoDB?**

The domain contains related but evolving documents such as products, shipment updates, reviews, and notifications. MongoDB provides flexible document storage while Mongoose adds schema validation and references. It is practical for the current prototype and can be strengthened with indexes and transaction boundaries where required.

**How is unauthorized access handled?**

JWT authentication identifies the user, protected routes require a valid token, and role-aware middleware restricts portal access. For production, every controller must also enforce ownership at the individual resource level, and this should be covered by negative authorization tests.

**Is the data stored on a blockchain?**

No. The current system uses MongoDB with QR links. This is simpler, cheaper, and sufficient for an MVP. Blockchain would only be justified if independent tamper resistance is a verified business or regulatory requirement.

**Can the system scale?**

Yes for a pilot and moderate initial usage. The API can be deployed as stateless services, while MongoDB and Cloudinary handle persistence and media. At higher scale, pagination, indexes, caching, queues, monitoring, and load testing are required.

**What is the main limitation today?**

The main limitation is not the core workflow; it is production assurance. The next priority is proving authorization, data integrity, recovery, and certification verification under realistic conditions.

## 11. Final Conclusion

AgroVerse is a credible and feasible solution to the transparency and coordination problems of organic agricultural supply chains. Its current architecture and successful validation results demonstrate a functioning MVP rather than a purely conceptual design. The project has clear social and operational value, a realistic technology stack, and a practical path to pilot deployment.

The recommended evaluator conclusion is:

> **Approve the project for pilot progression and further development. The system is technically feasible, operationally relevant, and academically demonstrable. Production launch should follow a focused hardening phase covering authorization, testing, certification verification, monitoring, and recovery.**
