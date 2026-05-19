# Business Rules

## Product purpose

The platform acts as an intermediary between:
- customers requesting services
- organizations offering services through their users

The platform is responsible for:
- check and analize the lead quality constantly implementing multiple strategies
- capturing customer service requests
- generating tenders
- matching organizations with tenders
- selling tenders to organizations
- helping organizations manage customer follow-up

The platform is NOT:
- a direct service provider
- a freelancer marketplace
- a real-time bidding platform
- an organization-to-organization marketplace

---

# Core domain concepts

## Tenders

A tender represents:
- a customer service request
- a business opportunity
- a licitation visible to multiple organizations

A tender is created from:
- public service request forms

Tenders contain:
- requested service
- customer problem details
- geographic reference
- questionnaire answers
- internal matching metadata

A tender may be purchased by multiple organizations.

Purchasing a tender does NOT grant:
- exclusivity
- ownership of the customer
- ownership of the tender itself

Organizations purchase:
- access to customer information
- the ability to follow up with the customer
- the ability to compete for the customer

---

## Tender visibility

Before purchase:
- customer personal information is hidden
- exact address is hidden
- only approximate geographic references are visible
- organizations can only see limited tender details

Visible information before purchase:
- service category
- problem summary
- postal code reference
- questionnaire answers
- approximate location
- tender price

The platform must NEVER expose:
- customer contact information
- exact customer address
- sensitive customer information

before a successful purchase.

---

## Tender distribution

Tenders are automatically matched using:
- service category
- organization coverage area
- geographic proximity

Only organizations matching the tender category should see the tender.

Organizations outside the geographic coverage area should not receive the tender.

The platform controls tender visibility and distribution.

---

## Purchases & payments

Tender purchases are processed through Stripe.

Each tender has its own individual price.

Payments are one-time purchases.

Stripe webhook events are the source of truth for payment status.

Frontend success pages or redirects do NOT finalize payments.

An organization only gains access to protected tender information after payment confirmation.

Unpaid organizations must never access protected customer information.

---

## Organizations

Organizations are the primary business entity of the platform.

Users operate inside organizations.

Organizations may contain:
- founders
- admins
- members
- operational users

Users may belong to multiple organizations.

All purchased tenders belong to the organization context.

Tender follow-up data is organization-scoped.

Cross-organization data leakage must never occur.

---

## Service tickets

After purchasing a tender, the system creates the service ticket automatically:
- Service Tickets

Service tickets are used for:
- customer follow-up
- appointment tracking
- quotation tracking
- service status tracking
- internal operational notes

Service tickets belong to the organization context.

Some Service Ticket information may be visible to customers, including:
- service status
- appointment updates
- quotations
- selected progress updates

Internal operational information must remain private.

Customer visibility must always be explicitly controlled server-side.

Cross-organization Service Ticket access must never occur.

---

## Customer-facing service flow

Service tickets are primarily organization-scoped operational workflows, but selected information may also be visible to customers.

Customer-visible information may include:
- service status
- appointment updates
- quotations
- progress updates
- selected service milestones

Internal-only information includes:
- operational notes
- internal comments
- assignments
- workflow metadata
- provider/internal strategy data

Internal organization data must NEVER be exposed to customers.

Customer visibility must always be explicitly controlled server-side.

Organizations manage the operational workflow through Service tickets, while customers only see approved customer-facing information.

---

## Authorization & security

Authorization must always be enforced server-side.

UI visibility does NOT replace authorization validation.

Membership validation is mandatory for:
- tender access
- Service tickets access
- organization-scoped operations
- tender purchases

The platform must never expose:
- tenders outside organization permissions
- organization-private operational data
- customer sensitive information
- tender information to unpaid leads or tenders by organizations

---

## Workflow invariants

A tender may be purchased by multiple organizations.

Organizations compete for the customer outside the platform after purchase.

The platform does not guarantee:
- customer conversion
- organization selection
- service completion

Payment confirmation is required before protected tender access is granted.

Service tickets ownership remains organization-scoped.

---

## Forbidden business behaviors

The platform must NEVER:
- expose customer private data before payment
- allow unpaid organizations to access customer contact details
- expose cross-organization Service tickets data
- trust frontend authorization
- auto-grant tender exclusivity
- assume ownership after tender purchase
- expose exact customer location before purchase

---

## Product boundaries

The platform focuses on:
- tender generation
- tender distribution
- organization matching
- customer acquisition
- organization workflow management

The platform does NOT currently handle:
- direct organization-to-customer payments
- escrow
- service guarantees
- dispute resolution
- organization-to-organization transactions
- real-time auctions
- customer/provider chat systems