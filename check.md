platform on  master [?] via 🥟 took 2s 
❯ # View the main branch run
gh run view 24985688021

X main Code Quality · 24985688021
Triggered via push about 13 minutes ago

JOBS
X quality in 18s (ID 73158271708)
  ✓ Set up job
  ✓ Checkout
  ✓ Setup Node.js
  ✓ Install dependencies
  X Lint
  - Type check
  - Run tests
  - Build
  - Post Setup Node.js
  ✓ Post Checkout
  ✓ Complete job

ANNOTATIONS
! Node.js 20 actions are deprecated. The following actions are running on Node.js 20 and may not work as expected: actions/checkout@v4, actions/setup-node@v4. Actions will be forced to run with Node.js 24 by default starting June 2nd, 2026. Node.js 20 will be removed from the runner on September 16th, 2026. Please check if updated versions of these actions are available that support Node.js 24. To opt into Node.js 24 now, set the FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true environment variable on the runner or in your workflow file. Once Node.js 24 becomes the default, you can temporarily opt out by setting ACTIONS_ALLOW_USE_UNSECURE_NODE_VERSION=true. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/
quality: .github#2

! React Hook useEffect has a missing dependency: 'fetchHistory'. Either include it or remove the dependency array
quality: src/modules/UserChat.tsx#98

! The 'data' conditional could make the dependencies of useMemo Hook (at line 86) change on every render. To fix this, wrap the initialization of 'data' in its own useMemo() Hook
quality: src/modules/DoctorPatients.tsx#21

X Unexpected any. Specify a different type
quality: src/modules/AdminDevices.tsx#157

X Unexpected any. Specify a different type
quality: src/modules/AdminDevices.tsx#52

X Unexpected any. Specify a different type
quality: src/modules/AdminClinics.tsx#24

X Unexpected any. Specify a different type
quality: src/modules/AdminBilling.tsx#51

! Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components
quality: src/components/ui/toggle.tsx#37

X An interface declaring no members is equivalent to its supertype
quality: src/components/ui/textarea.tsx#5

! Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components
quality: src/components/ui/sonner.tsx#27

! Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components
quality: src/components/ui/sidebar.tsx#636

! Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components
quality: src/components/ui/navigation-menu.tsx#111

! Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components
quality: src/components/ui/form.tsx#129

X An interface declaring no members is equivalent to its supertype
quality: src/components/ui/command.tsx#24

! Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components
quality: src/components/ui/button.tsx#47

! Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components
quality: src/components/ui/badge.tsx#29

X 'points' is never reassigned. Use 'const' instead
quality: src/components/layout/AuthLayout.tsx#17

X Unexpected any. Specify a different type
quality: src/components/UserTutorial.tsx#39

X Unexpected any. Specify a different type                                                                      
quality: src/components/PlatformShell.tsx#137

! React Hook useEffect has a missing dependency: 'sandboxMode'. Either include it or remove the dependency array
quality: src/components/PlatformShell.tsx#111

X Unexpected any. Specify a different type
quality: src/components/DoctorOnboarding.tsx#5


To see what failed, try: gh run view 24985688021 --log-failed
View this run on GitHub: https://github.com/neurolab-0x/neurolab_webapp/actions/runs/24985688021
k