# HMS Frontend Implementation Todo

## Foundation
- [x] Audit current frontend/backend route and response shapes
- [x] Create implementation tracker
- [x] Add shared route helpers and auth ID utilities
- [x] Normalize API helpers for common data access
- [x] Refresh global design tokens and base layout styles

## Navigation And Shell
- [x] Rework header navigation to use route config and role-aware links
- [x] Refresh footer and public shell presentation
- [ ] Add shared page section/header patterns where still missing

## Public Experience
- [x] Redesign home page
- [x] Redesign login page
- [x] Redesign patient registration page
- [x] Redesign doctor registration page
- [x] Redesign doctor directory page

## Core Integration Fixes
- [x] Standardize user ID access across contexts and pages
- [x] Fix prescription creation patient loading flow
- [x] Remove or redirect broken UI targets to real routes
- [x] Stop relying on `user.role` where `AuthContext.role` is the source of truth

## Patient Experience
- [x] Refresh patient dashboard
- [x] Refresh patient profile view/edit
- [x] Refresh medical history page
- [x] Improve appointment booking flow
- [x] Improve appointment list page
- [x] Improve prescription list page
- [ ] Refresh appointment detail/confirmation page

## Doctor Experience
- [x] Refresh doctor dashboard
- [x] Refresh doctor profile view/edit
- [x] Improve doctor schedule manager
- [x] Improve prescription creation page
- [ ] Refresh prescription detail page
- [ ] Improve appointment calendar page

## Quality
- [ ] Add/update auth route protection tests
- [ ] Add dashboard rendering regression coverage
- [ ] Add integration regression coverage for fixed mismatches
- [ ] Final polish pass for remaining mojibake and spacing inconsistencies
