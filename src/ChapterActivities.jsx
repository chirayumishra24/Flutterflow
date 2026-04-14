import { useState, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox, Text, OrbitControls, Float, MeshDistortMaterial, Environment, ContactShadows, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

const activityVisuals = {
  audit: { accent: '#61a8ff', label: 'REVIEW' },
  map: { accent: '#00f5d4', label: 'MAP' },
  build: { accent: '#ff9a5c', label: 'BUILD' },
  compare: { accent: '#ffd166', label: 'CHECK' },
  configure: { accent: '#00bcd4', label: 'SETUP' },
  organize: { accent: '#7b2ff7', label: 'SORT' },
  test: { accent: '#86ffb7', label: 'TEST' },
  debug: { accent: '#ff5c8d', label: 'DEBUG' },
  collaborate: { accent: '#6cf0a8', label: 'TEAM' },
  deploy: { accent: '#4361ee', label: 'SHIP' },
  theme: { accent: '#ff8fab', label: 'STYLE' },
  pipeline: { accent: '#00f5d4', label: 'PIPELINE' },
  xray: { accent: '#7b2ff7', label: 'X-RAY' },
  journey: { accent: '#ff9a5c', label: 'JOURNEY' },
}

const chapterActivities = {}

chapterActivities['1-1'] = {
  accent: '#00f5d4',
  subtitle: 'Build the MVP pipeline — but avoid the over-engineering traps!',
  activity: {
    type: 'pipeline_3d',
    visualKind: 'build',
    title: '3D Factory Floor',
    instructions: 'Route the app conveyor belt by selecting only the essential MVP stations. Decoy stations will jam the factory!',
    success: 'A perfect, lean MVP pipeline established!',
    stations: [
      { id: '1', label: 'Create Blank App', desc: 'Initialize the core project infrastructure.', decoy: false },
      { id: '2', label: 'Build Core UI', desc: 'Assemble the minimum screens for the user flow.', decoy: false },
      { id: 'd1', label: 'Microservice Architecture', desc: 'Create a highly scalable kubernetes cluster.', decoy: true, warning: 'Over-engineering! Keep it simple for an MVP.' },
      { id: '3', label: 'Hook up Data', desc: 'Connect Firebase or basic Supabase tables.', decoy: false },
      { id: 'd2', label: 'Custom Animation Engine', desc: 'Write a bespoke physics engine for transitions.', decoy: true, warning: 'Scope creep! Built-in animations are fine.' },
      { id: '4', label: 'Test Locally', desc: 'Run on device to verify immediate logic.', decoy: false },
      { id: '5', label: 'Deploy & Iterate', desc: 'Launch v1 and gather user feedback.', decoy: false },
    ]
  },
}

chapterActivities['1-2'] = {
  accent: '#7b2ff7',
  subtitle: 'Isolate the mobile phone layers in 3D to diagnose the architectural bugs.',
  activity: {
    type: 'xray_3d',
    visualKind: 'xray',
    title: '3D Device Exploder',
    instructions: 'Explode the device into its 3 UI, Logic, and Data layers. Then, assign the bug reports to the layer responsible for fixing them.',
    success: 'You can instantly diagnose where a bug lives in a full-stack application!',
    layers: [
      { id: 'ui', label: 'UI Layer', color: '#ff2d55', desc: 'Visuals, styling, static layout' },
      { id: 'logic', label: 'Logic Layer', color: '#7b2ff7', desc: 'State, actions, API calls, routing' },
      { id: 'data', label: 'Data Layer', color: '#f59e0b', desc: 'Database, storage, external API backend' }
    ],
    bugs: [
      { id: 'b1', prompt: 'The "Add to Cart" button is overlapping the product title on small screens.', answer: 'ui' },
      { id: 'b2', prompt: 'Tapping "Checkout" does nothing when the cart is empty, but no error is shown.', answer: 'logic' },
      { id: 'b3', prompt: 'New users are seeing products that were deleted from the catalog yesterday.', answer: 'data' },
      { id: 'b4', prompt: 'The loading spinner spins forever after entering payment details.', answer: 'logic' },
      { id: 'b5', prompt: 'The font size in the header is completely illegible on dark mode.', answer: 'ui' },
    ]
  },
}

chapterActivities['1-3'] = {
  accent: '#ff9a5c',
  subtitle: 'Route the API request journey, but beware of dead-ends and dropped packets.',
  activity: {
    type: 'journey_3d',
    visualKind: 'journey',
    title: '3D Request Journey',
    instructions: 'Direct the energy packet from User to Server and back. Wrong turns result in dropped packets!',
    success: 'You perfectly grasp the client-server request/response loop!',
    scenarios: [
      {
        id: 'login',
        title: 'User Login Flow',
        path: [
          { id: 'tap', label: 'Frontend: Taps "Login"', decoy: false },
          { id: 'd1', label: 'Backend: Immediately redirect', decoy: true, warning: 'The frontend has not sent credentials yet!' },
          { id: 'send', label: 'Frontend: Sends Auth API Post', decoy: false },
          { id: 'validate', label: 'Backend: Validates Database', decoy: false },
          { id: 'd2', label: 'Frontend: Generates Auth Token', decoy: true, warning: 'The frontend cannot securely generate auth tokens!' },
          { id: 'token', label: 'Backend: Returns JWT Token', decoy: false },
          { id: 'store', label: 'Frontend: Stores Token & Navigates', decoy: false }
        ]
      }
    ]
  },
}

chapterActivities['2-1'] = {
  accent: '#00e676',
  subtitle: 'Place dashboard actions in the correct area.',
  activity: {
    type: 'dashboard',
    visualKind: 'map',
    title: 'Dashboard Navigator',
    instructions: 'Click the correct zone on the dashboard for the scenario given.',
    success: 'You navigate the dashboard like a pro!',
    scenarios: [
      { id: 'templates', prompt: 'You want to browse templates and reusable widgets.', zoneId: 'learning' },
      { id: 'duplicate', prompt: 'You want to duplicate an existing project.', zoneId: 'project' },
      { id: 'plan', prompt: 'You need to review your subscription plan information.', zoneId: 'team' },
    ],
    zones: [
      { id: 'project', label: 'Project Area', x: 5, y: 15, w: 90, h: 42 },
      { id: 'learning', label: 'Learning & Community', x: 5, y: 62, w: 42, h: 33 },
      { id: 'team', label: 'Team & Account', x: 52, y: 62, w: 43, h: 33 },
    ]
  },
}

chapterActivities['2-2'] = {
  accent: '#ff2d55',
  subtitle: 'Rebuild the most logical app-builder workflow.',
  activity: {
    type: 'circuit',
    visualKind: 'build',
    title: 'Builder Flow Assembly',
    instructions: 'Connect the nodes in the correct logical sequence to form a complete builder circuit.',
    success: 'Your mental model of the building workflow is rock solid!',
    nodes: [
      { id: 'createPage', label: 'Create Page', pos: {x: 10, y: 30} },
      { id: 'dragWidgets', label: 'Drag Widgets', pos: {x: 40, y: 15} },
      { id: 'selectWidget', label: 'Select Widget', pos: {x: 70, y: 40} },
      { id: 'editProperties', label: 'Edit Properties', pos: {x: 40, y: 75} },
      { id: 'preview', label: 'Preview Change', pos: {x: 15, y: 65} },
    ],
    correctSequence: ['createPage', 'dragWidgets', 'selectWidget', 'editProperties', 'preview'],
  },
}

chapterActivities['2-3'] = {
  accent: '#61a8ff',
  subtitle: 'Choose the correct toolbar action for each scenario.',
  activity: {
    type: 'toolbar',
    visualKind: 'configure',
    title: 'Toolbar Command Center',
    instructions: 'For each scenario, pick the correct toolbar action that solves the problem.',
    success: 'You know exactly which toolbar instrument to grab for any task!',
    actions: [
      { id: 'preview', icon: '👁️', label: 'Preview' },
      { id: 'localrun', icon: '📱', label: 'Local Run' },
      { id: 'branching', icon: '🌿', label: 'Branching' },
      { id: 'export', icon: '📦', label: 'Export Code' },
    ],
    scenarios: [
      { id: 's1', prompt: 'You want the fastest visual check after changing some spacing.', answer: 'preview' },
      { id: 's2', prompt: 'You want to test features safely without affecting the stable main version.', answer: 'branching' },
      { id: 's3', prompt: 'You want a shareable functional web build for project members.', answer: 'localrun' },
    ]
  },
}

chapterActivities['2-4'] = {
  accent: '#ffd166',
  subtitle: 'Put the canvas layout workflow in order.',
  activity: {
    type: 'wireframe',
    visualKind: 'build',
    title: 'Canvas Wireframer',
    instructions: 'Click the next logical step to build the layout wireframe from scratch.',
    success: 'Your layout technique is flawless—moving from structure down to details!',
    steps: [
      { id: 'parent', label: 'Add main parent container', icon: '1' },
      { id: 'layout', label: 'Choose layout direction (Row/Col)', icon: '2' },
      { id: 'children', label: 'Place child widgets', icon: '3' },
      { id: 'spacing', label: 'Adjust alignment & sibling spacing', icon: '4' },
      { id: 'responsive', label: 'Test responsive views', icon: '5' },
    ]
  },
}

chapterActivities['2-5'] = {
  accent: '#ff9a5c',
  subtitle: 'Arrange the storyboard planning flow.',
  activity: {
    type: 'mapper',
    visualKind: 'map',
    title: 'Storyboard Mapper',
    instructions: 'Apply the correct planning concept to fix the broken parts of the navigation map.',
    success: 'You are ready to plan complex routing and visual flow patterns!',
    problems: [
      { id: 'p1', desc: 'Missing screen inventory list', solution: 'Screen Inventory' },
      { id: 'p2', desc: 'Pages exist but have no navigation arrows between them', solution: 'Navigation Map' },
      { id: 'p3', desc: 'App crashes because it does not know which page opens first', solution: 'Entry Page' },
    ],
    tools: ['Navigation Map', 'Entry Page', 'Screen Inventory']
  },
}

chapterActivities['2-6'] = {
  accent: '#f59e0b',
  subtitle: 'Sort common widgets by what they are mainly used for.',
  activity: {
    type: 'sorter',
    visualKind: 'organize',
    title: 'Widget Sorter Kiosk',
    instructions: 'Click the correct bucket quickly for the incoming widget cards!',
    success: 'You can instantly categorize any widget you see!',
    buckets: [
      { id: 'layout', label: 'Layout' },
      { id: 'input', label: 'Input' },
      { id: 'display', label: 'Display' },
    ],
    items: [
      { label: 'Row', bucketId: 'layout' },
      { label: 'TextField', bucketId: 'input' },
      { label: 'Image', bucketId: 'display' },
      { label: 'Column', bucketId: 'layout' },
      { label: 'Checkbox', bucketId: 'input' },
      { label: 'Text', bucketId: 'display' },
    ]
  },
}

chapterActivities['2-7'] = {
  accent: '#61a8ff',
  subtitle: 'Place reusable team assets in the right shared location.',
  activity: {
    type: 'distributor',
    visualKind: 'collaborate',
    title: 'Team Hub Distributor',
    instructions: 'Route the arriving shared resource to the correct team vault.',
    success: 'Your team will never misplace a shared asset again!',
    vaults: [
      { id: 'media', label: 'Media Assets', color: '#ff2d55' },
      { id: 'design', label: 'Design Library', color: '#7b2ff7' },
      { id: 'code', label: 'Shared Code', color: '#00e676' },
    ],
    resources: [
      { label: 'Brand color system', vaultId: 'design' },
      { label: 'Reusable onboarding image', vaultId: 'media' },
      { label: 'Custom search function', vaultId: 'code' },
    ]
  },
}

chapterActivities['2-8'] = {
  accent: '#ff2d55',
  subtitle: 'Sort resources into the correct level of the project hierarchy.',
  activity: {
    type: 'elevator',
    visualKind: 'map',
    title: 'Hierarchy Elevator',
    instructions: 'Send the resource on the elevator to the correct floor (scope level).',
    success: 'You completely understand the scope hierarchy from a single widget up to the global project!',
    floors: [
      { id: 'design', label: 'Design System', icon: '🎨' },
      { id: 'component', label: 'Component', icon: '🧱' },
      { id: 'page', label: 'Page', icon: '📄' },
      { id: 'project', label: 'Project', icon: '🚀' },
    ],
    items: [
      { label: 'App package name', floorId: 'project' },
      { label: 'Checkout screen layout', floorId: 'page' },
      { label: 'Reusable pricing card block', floorId: 'component' },
      { label: 'Primary brand color token', floorId: 'design' },
    ]
  },
}

chapterActivities['3-1'] = {
  accent: '#00f5d4',
  subtitle: 'Rebuild the recommended project setup flow.',
  activity: {
    type: 'setup_console',
    visualKind: 'configure',
    title: 'Setup Wizard Console',
    instructions: 'Initialize the app engine by clicking the setup commands in the correct sequence.',
    success: 'System booted! You perfectly executed the foundational project setup.',
    steps: [
      { id: 'create', label: 'create-project --base', log: 'Workspace initialized.' },
      { id: 'details', label: 'set-info --package', log: 'Package details configured.' },
      { id: 'initial', label: 'route --entry', log: 'Initial routing logic verified.' },
      { id: 'assets', label: 'import --assets', log: 'Core media loaded into memory.' },
      { id: 'test', label: 'build --test', log: 'Diagnostics passed. Ready for layout.' },
    ],
    correctSequence: ['create', 'details', 'initial', 'assets', 'test']
  },
}

chapterActivities['3-2'] = {
  accent: '#7b2ff7',
  subtitle: 'Sort design and state responsibilities into the correct scope.',
  activity: {
    type: 'scope_rings',
    visualKind: 'theme',
    title: 'Scope Radar Rings',
    instructions: 'Place the floating variable onto the correct radar ring indicating its scope.',
    success: 'Your state architecture is perfectly scoped from global design down to isolated widgets.',
    rings: [
      { id: 'design', label: 'Design System', radius: 100 },
      { id: 'app', label: 'App State', radius: 76 },
      { id: 'page', label: 'Page State', radius: 52 },
      { id: 'widget', label: 'Widget State', radius: 28 },
    ],
    items: [
      { id: 'app1', label: 'Global Cart Item Count', ringId: 'app' },
      { id: 'wid1', label: 'Dropdown Menu Selection', ringId: 'widget' },
      { id: 'des1', label: 'Primary Brand Color', ringId: 'design' },
      { id: 'pag1', label: 'Current Profile Tab', ringId: 'page' },
    ]
  },
}

chapterActivities['3-3'] = {
  accent: '#ff9a5c',
  subtitle: 'Pick the right advanced utility for each task.',
  activity: {
    type: 'toolbelt',
    visualKind: 'debug',
    title: 'Utility Toolbelt',
    instructions: 'Grab the correct tool to resolve the feature request ticket on the bench.',
    success: 'You are equipped to handle advanced edge cases perfectly!',
    tools: [
      { id: 'file', icon: '📂', label: 'File Handler' },
      { id: 'code', icon: '🔧', label: 'Custom Code' },
      { id: 'motion', icon: '✨', label: 'Animation' },
    ],
    tickets: [
      { id: 't1', prompt: 'A barcode scanner feature is not native to FlutterFlow yet.', answer: 'code' },
      { id: 't2', prompt: 'A profile page requires users to select and upload an avatar.', answer: 'file' },
      { id: 't3', prompt: 'A success card needs to slide up smoothly when a form is submitted.', answer: 'motion' },
    ]
  },
}

chapterActivities['4-1'] = {
  accent: '#ffd700',
  subtitle: 'Build the branching workflow visually — watch out for decoy commands.',
  activity: {
    type: 'branch_graph',
    visualKind: 'collaborate',
    title: 'Git Graph Builder',
    instructions: 'Click only the correct workflow commands in order. Decoys will jam the graph if selected.',
    success: 'Branch created, committed, and merged safely back to main!',
    steps: [
      { id: 'create', label: 'Create Branch', desc: 'Fork a new line from the stable base.' },
      { id: 'deploy', label: 'Deploy to Prod', desc: 'Push directly to production servers.', decoy: true },
      { id: 'switch', label: 'Switch Context', desc: 'Move your working pointer onto the branch.' },
      { id: 'rebase', label: 'Rebase onto Main', desc: 'Replay commits on top of main tip.', decoy: true },
      { id: 'changes', label: 'Make Changes', desc: 'Edit code on the isolated branch.' },
      { id: 'force_push', label: 'Force Push', desc: 'Overwrite the remote history completely.', decoy: true },
      { id: 'commit', label: 'Commit', desc: 'Checkpoint your progress as a node.' },
      { id: 'merge', label: 'Merge to Main', desc: 'Bring the branch back into stable.' },
    ],
    correctSequence: ['create', 'switch', 'changes', 'commit', 'merge'],
  },
}

chapterActivities['4-2'] = {
  accent: '#ff9a5c',
  subtitle: 'Choose the correct recovery or history action — read the scenario carefully.',
  activity: {
    type: 'time_machine',
    visualKind: 'audit',
    title: 'Time Machine Console',
    instructions: 'Resolve each timeline crisis with the single safest tool. Similar tools exist — pick precisely.',
    success: 'Every timeline crisis resolved with surgical precision!',
    tools: [
      { id: 'peek', label: 'Peek', desc: 'View older work without changing or replacing anything.' },
      { id: 'commit', label: 'Commits', desc: 'Create traceable checkpoints the team can review.' },
      { id: 'deprecated', label: 'Deprecated Versions', desc: 'Acknowledge the old version system that is no longer the workflow.' },
      { id: 'restore', label: 'Restore', desc: 'Permanently bring back an older state, replacing current work.' },
    ],
    crises: [
      { id: 'c1', prompt: 'The client wants to compare yesterday\'s header color to today\'s without losing any current work.', answer: 'peek' },
      { id: 'c2', prompt: 'Three developers are working simultaneously and need traceable save points to review each other\'s progress.', answer: 'commit' },
      { id: 'c3', prompt: 'After a full team review, a broken release must be permanently rolled back to the last stable state.', answer: 'restore' },
      { id: 'c4', prompt: 'Your PM asks why the old "Save Version" button is gone. You need to explain what replaced it.', answer: 'deprecated' },
      { id: 'c5', prompt: 'A designer wants to inspect the old onboarding flow side-by-side with the new one, but NOT revert anything.', answer: 'peek' },
    ],
  },
}

chapterActivities['4-3'] = {
  accent: '#6cf0a8',
  subtitle: 'Sort environment targets — some are tricky to classify.',
  activity: {
    type: 'server_deploy',
    visualKind: 'configure',
    title: 'Server Rack Deployer',
    instructions: 'Route each config disk to the correct 3D server rack. Think carefully about edge cases.',
    success: 'All endpoints are correctly routed to the right environments!',
    racks: [
      { id: 'dev', label: 'Development', color: '#61a8ff' },
      { id: 'staging', label: 'Staging', color: '#ffd166' },
      { id: 'prod', label: 'Production', color: '#ff2d55' },
    ],
    disks: [
      { id: 'd1', label: 'Experimental API base URL for new feature testing', rackId: 'dev' },
      { id: 'd2', label: 'Local-only mock database used during development', rackId: 'dev' },
      { id: 'd3', label: 'Near-real backend that mirrors production for final QA', rackId: 'staging' },
      { id: 'd4', label: 'Prelaunch Firebase project used for sign-off testing', rackId: 'staging' },
      { id: 'd5', label: 'Live Stripe payments endpoint handling real money', rackId: 'prod' },
      { id: 'd6', label: 'Final customer-facing web domain with SSL', rackId: 'prod' },
      { id: 'd7', label: 'Test Stripe endpoint with sandbox API keys', rackId: 'staging' },
      { id: 'd8', label: 'Hot-reload debug server running on localhost', rackId: 'dev' },
      { id: 'd9', label: 'CDN-cached production asset delivery pipeline', rackId: 'prod' },
    ],
  },
}

chapterActivities['4-4'] = {
  accent: '#61a8ff',
  subtitle: 'Match each testing need to the right mode — distinctions are subtle.',
  activity: {
    type: 'launchpad',
    visualKind: 'test',
    title: 'Launchpad Selector',
    instructions: 'Pick the correct launch mode. Pay attention to subtle differences between the scenarios.',
    success: 'You will never pick the wrong run mode again!',
    modes: [
      { id: 'preview', label: 'Preview', desc: 'Fastest UI-only check, no real APIs or backend.' },
      { id: 'test', label: 'Test Mode', desc: 'Browser session with hot reload and live data.' },
      { id: 'run', label: 'Run Mode', desc: 'Fully functional shareable web build for team.' },
      { id: 'local', label: 'Local Run', desc: 'Real device testing with logs and local code.' },
    ],
    scenarios: [
      { id: 's1', prompt: 'You just changed padding on a card and want the fastest possible visual check — no backend needed.', answer: 'preview' },
      { id: 's2', prompt: 'You are iterating on a form that hits a real API and need instant browser refreshes as you code.', answer: 'test' },
      { id: 's3', prompt: 'The client needs a stable link to test the full app themselves before the meeting tomorrow.', answer: 'run' },
      { id: 's4', prompt: 'A push notification is not appearing on your physical Android phone and you need console logs.', answer: 'local' },
      { id: 's5', prompt: 'You want to check that a gradient looks right on the homepage hero — no interactions needed.', answer: 'preview' },
      { id: 's6', prompt: 'Your QA team needs a deployed build they can open in their browsers to run test cases.', answer: 'run' },
    ],
  },
}

chapterActivities['5-1'] = {
  accent: '#00f5d4',
  subtitle: 'Arrange the Android release workflow in the correct order.',
  activity: {
    type: 'sequence',
    visualKind: 'deploy',
    title: 'Play Store Release Order',
    instructions: 'Move the release steps into a sensible submission order.',
    success: 'You know the main flow from console setup to release rollout.',
    items: [
      { id: 'console', label: 'Create the app in Google Play Console' },
      { id: 'signing', label: 'Configure service account and signing setup' },
      { id: 'build', label: 'Build the Android App Bundle' },
      { id: 'testing', label: 'Upload to a testing track and verify the release' },
      { id: 'rollout', label: 'Roll out to the target release track' },
    ],
    startOrder: ['rollout', 'build', 'console', 'testing', 'signing'],
    correctOrder: ['console', 'signing', 'build', 'testing', 'rollout'],
  },
}

chapterActivities['5-2'] = {
  accent: '#4361ee',
  subtitle: 'Arrange the Apple App Store workflow in the correct order.',
  activity: {
    type: 'sequence',
    visualKind: 'deploy',
    title: 'App Store Submission Order',
    instructions: 'Put the iOS release steps into the right sequence.',
    success: 'You understand the main App Store flow from signing setup to review submission.',
    items: [
      { id: 'signing', label: 'Configure bundle details, certificates, and signing' },
      { id: 'archive', label: 'Build the iOS archive or release build' },
      { id: 'upload', label: 'Upload the build to App Store Connect or TestFlight' },
      { id: 'metadata', label: 'Add metadata, screenshots, and testing details' },
      { id: 'review', label: 'Submit the app for review' },
    ],
    startOrder: ['review', 'metadata', 'signing', 'upload', 'archive'],
    correctOrder: ['signing', 'archive', 'upload', 'metadata', 'review'],
  },
}

function hexToRgba(hex, alpha) {
  const clean = hex.replace('#', '')
  if (clean.length !== 6) return `rgba(255,255,255,${alpha})`
  const value = Number.parseInt(clean, 16)
  const r = (value >> 16) & 255
  const g = (value >> 8) & 255
  const b = value & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function ActivityScene({ kind, accent }) {
  const common = {
    stroke: accent,
    strokeWidth: 4,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    fill: 'none',
  }

  switch (kind) {
    case 'audit':
      return (
        <>
          <rect x="24" y="28" width="56" height="42" rx="10" fill={accent} fillOpacity="0.12" stroke={accent} strokeOpacity="0.65" />
          <path {...common} d="M36 58h12M36 48h22M36 38h30" />
          <circle cx="102" cy="52" r="16" fill={accent} fillOpacity="0.12" stroke={accent} />
          <path {...common} d="M113 63l13 13" />
        </>
      )
    case 'map':
      return (
        <>
          <circle cx="38" cy="36" r="11" fill={accent} fillOpacity="0.15" stroke={accent} />
          <circle cx="82" cy="52" r="11" fill={accent} fillOpacity="0.15" stroke={accent} />
          <circle cx="126" cy="34" r="11" fill={accent} fillOpacity="0.15" stroke={accent} />
          <circle cx="108" cy="80" r="11" fill={accent} fillOpacity="0.15" stroke={accent} />
          <path {...common} d="M49 39l22 9M93 48l22-10M87 60l15 14" />
        </>
      )
    case 'build':
      return (
        <>
          <rect x="26" y="62" width="32" height="20" rx="6" fill={accent} fillOpacity="0.18" stroke={accent} />
          <rect x="66" y="48" width="32" height="34" rx="6" fill={accent} fillOpacity="0.14" stroke={accent} />
          <rect x="106" y="34" width="28" height="48" rx="6" fill={accent} fillOpacity="0.1" stroke={accent} />
          <path {...common} d="M54 30h22M65 19v22" />
        </>
      )
    case 'compare':
      return (
        <>
          <rect x="24" y="26" width="42" height="56" rx="10" fill={accent} fillOpacity="0.1" stroke={accent} />
          <rect x="94" y="26" width="42" height="56" rx="10" fill={accent} fillOpacity="0.1" stroke={accent} />
          <path {...common} d="M76 38h8M76 54h8M76 70h8M66 54h20" />
          <path {...common} d="M34 40h18M34 54h24M34 68h12M104 40h12M104 54h20M104 68h24" />
        </>
      )
    case 'configure':
      return (
        <>
          <path {...common} d="M28 38h68M28 56h96M28 74h82" />
          <circle cx="84" cy="38" r="8" fill={accent} />
          <circle cx="58" cy="56" r="8" fill={accent} />
          <circle cx="96" cy="74" r="8" fill={accent} />
        </>
      )
    case 'organize':
      return (
        <>
          <path d="M26 44h38l7 8h52v26H26z" fill={accent} fillOpacity="0.14" stroke={accent} strokeWidth="4" strokeLinejoin="round" />
          <rect x="34" y="26" width="36" height="14" rx="6" fill={accent} fillOpacity="0.22" />
          <path {...common} d="M46 62h26M82 62h28M46 74h18M82 74h20" />
        </>
      )
    case 'test':
      return (
        <>
          <rect x="26" y="30" width="18" height="18" rx="4" fill={accent} fillOpacity="0.1" stroke={accent} />
          <path {...common} d="M31 39l4 4 8-9" />
          <rect x="26" y="56" width="18" height="18" rx="4" fill={accent} fillOpacity="0.1" stroke={accent} />
          <path {...common} d="M52 38h46M52 64h34" />
          <circle cx="112" cy="66" r="14" fill={accent} fillOpacity="0.12" stroke={accent} />
          <path {...common} d="M106 66h12M112 60v12" />
        </>
      )
    case 'debug':
      return (
        <>
          <rect x="26" y="30" width="66" height="44" rx="10" fill={accent} fillOpacity="0.1" stroke={accent} />
          <path {...common} d="M38 46l8 8 8-8M56 58h14" />
          <circle cx="112" cy="52" r="16" fill={accent} fillOpacity="0.12" stroke={accent} />
          <path {...common} d="M123 63l11 11M108 52h8M112 48v8" />
        </>
      )
    case 'collaborate':
      return (
        <>
          <circle cx="42" cy="38" r="10" fill={accent} fillOpacity="0.15" stroke={accent} />
          <circle cx="118" cy="38" r="10" fill={accent} fillOpacity="0.15" stroke={accent} />
          <circle cx="80" cy="78" r="10" fill={accent} fillOpacity="0.15" stroke={accent} />
          <path {...common} d="M52 42l18 20M108 42L90 62M52 38h56" />
        </>
      )
    case 'deploy':
      return (
        <>
          <rect x="34" y="64" width="92" height="18" rx="8" fill={accent} fillOpacity="0.12" stroke={accent} />
          <path {...common} d="M80 30v32M66 44l14-14 14 14" />
          <path {...common} d="M54 64c0-11 9-20 20-20 5 0 10 2 13 5 2-5 8-9 15-9 9 0 17 8 17 17" />
        </>
      )
    case 'theme':
      return (
        <>
          <circle cx="48" cy="44" r="20" fill={accent} fillOpacity="0.16" stroke={accent} />
          <circle cx="42" cy="38" r="4" fill={accent} />
          <circle cx="58" cy="36" r="4" fill={accent} />
          <circle cx="56" cy="52" r="4" fill={accent} />
          <rect x="86" y="28" width="42" height="10" rx="5" fill={accent} fillOpacity="0.32" />
          <rect x="86" y="46" width="32" height="10" rx="5" fill={accent} fillOpacity="0.2" />
          <rect x="86" y="64" width="52" height="10" rx="5" fill={accent} fillOpacity="0.12" />
        </>
      )
    case 'pipeline':
      return (
        <>
          <circle cx="30" cy="54" r="12" fill={accent} fillOpacity="0.18" stroke={accent} strokeWidth="3" />
          <circle cx="60" cy="54" r="12" fill={accent} fillOpacity="0.18" stroke={accent} strokeWidth="3" />
          <circle cx="90" cy="54" r="12" fill={accent} fillOpacity="0.18" stroke={accent} strokeWidth="3" />
          <circle cx="120" cy="54" r="12" fill={accent} fillOpacity="0.18" stroke={accent} strokeWidth="3" />
          <path {...common} d="M42 54h6M72 54h6M102 54h6" />
          <path {...common} d="M24 54l6-6M24 54l6 6" strokeOpacity="0.4" />
          <path d="M27 36l6 6 12-12" {...common} />
        </>
      )
    case 'xray':
      return (
        <>
          <rect x="30" y="24" width="100" height="64" rx="10" fill={accent} fillOpacity="0.06" stroke={accent} strokeWidth="2" strokeOpacity="0.3" />
          <rect x="38" y="30" width="84" height="16" rx="6" fill="#ff2d55" fillOpacity="0.14" stroke="#ff2d55" strokeWidth="2" strokeOpacity="0.4" />
          <rect x="38" y="50" width="84" height="12" rx="6" fill="#7b2ff7" fillOpacity="0.14" stroke="#7b2ff7" strokeWidth="2" strokeOpacity="0.4" />
          <rect x="38" y="66" width="84" height="16" rx="6" fill="#f59e0b" fillOpacity="0.14" stroke="#f59e0b" strokeWidth="2" strokeOpacity="0.4" />
          <circle cx="24" cy="56" r="18" fill="none" stroke={accent} strokeWidth="3" strokeOpacity="0.5" />
          <path {...common} d="M36 68l10 10" strokeOpacity="0.5" />
        </>
      )
    case 'journey':
      return (
        <>
          <rect x="20" y="28" width="30" height="52" rx="8" fill={accent} fillOpacity="0.12" stroke={accent} strokeWidth="2.5" />
          <rect x="110" y="28" width="30" height="52" rx="6" fill={accent} fillOpacity="0.12" stroke={accent} strokeWidth="2.5" />
          <path {...common} d="M50 42h60" strokeDasharray="6 4" />
          <path {...common} d="M110 66H50" strokeDasharray="6 4" />
          <path d="M105 39l8 3-8 3" fill={accent} fillOpacity="0.6" stroke="none" />
          <path d="M55 63l-8 3 8 3" fill={accent} fillOpacity="0.6" stroke="none" />
          <circle cx="80" cy="54" r="8" fill={accent} fillOpacity="0.2" stroke={accent} strokeWidth="2" />
          <text x="76" y="58" fill={accent} fontSize="10" fontWeight="700">API</text>
        </>
      )
    default:
      return <ActivityScene kind="build" accent={accent} />
  }
}

export function ActivityArtwork({ kind, title }) {
  const visual = activityVisuals[kind] || activityVisuals.build
  const accent = visual.accent

  return (
    <svg viewBox="0 0 160 120" role="img" aria-label={title || visual.label} style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect x="2" y="2" width="156" height="116" rx="22" fill="#09101d" stroke={hexToRgba(accent, 0.42)} strokeWidth="2" />
      <rect x="12" y="12" width="136" height="96" rx="18" fill={hexToRgba(accent, 0.08)} />
      <circle cx="132" cy="28" r="10" fill={hexToRgba(accent, 0.18)} />
      <ActivityScene kind={kind} accent={accent} />
      <text x="18" y="101" fill={accent} fontFamily="Arial, sans-serif" fontSize="15" fontWeight="700" letterSpacing="1.5">
        {visual.label}
      </text>
    </svg>
  )
}

function getActivityTypeLabel(type) {
  const labels = {
    quiz: 'Knowledge Check',
    sort: 'Sorting Activity',
    dragdrop: 'Drag and Drop',
    matchup: 'Match-Up Board',
    sequence: 'Sequence Activity',
    wheel: 'Spin Wheel',
    pipeline: 'Pipeline Simulator',
    xray: 'X-Ray Scanner',
    journey: 'Journey Simulator',
    dashboard: 'Dashboard Navigator',
    circuit: 'Builder Circuit',
    toolbar: 'Toolbar Simulator',
    wireframe: 'Canvas Wireframer',
    mapper: 'Storyboard Mapper',
    sorter: 'Widget Sorter',
    distributor: 'Team Hub Distributor',
    elevator: 'Hierarchy Elevator',
    setup_console: 'Setup Console',
    scope_rings: 'Scope Radar',
    toolbelt: 'Utility Toolbelt',
    branch_graph: 'Git Graph',
    time_machine: 'Time Machine',
    server_deploy: 'Server Deploy',
    launchpad: 'Launchpad',
  }

  return labels[type] || 'Interactive Activity'
}

function getFeedback(score, total, successText) {
  if (score === total) {
    return { color: '#86ffb7', title: 'All correct', body: successText }
  }

  if (score >= Math.ceil(total * 0.6)) {
    return { color: '#ffd166', title: 'Almost there', body: 'You are close. Review the highlighted areas and try again for a perfect score.' }
  }

  return { color: '#ff7d6b', title: 'Try one more pass', body: 'Use the chapter content to review the weak spots, then check your answers again.' }
}

function shuffleArray(items) {
  const next = [...items]

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const temp = next[index]
    next[index] = next[swapIndex]
    next[swapIndex] = temp
  }

  return next
}

function ActionButtons({ onCheck, onReset, canCheck, accent }) {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
      <button
        type="button"
        onClick={onCheck}
        disabled={!canCheck}
        style={{
          padding: '0.9rem 1.35rem',
          borderRadius: '14px',
          border: 'none',
          cursor: canCheck ? 'pointer' : 'not-allowed',
          background: canCheck ? `linear-gradient(135deg, ${accent}, #ffffff22)` : 'rgba(255,255,255,0.08)',
          color: '#041019',
          fontWeight: 800,
          opacity: canCheck ? 1 : 0.55,
        }}
      >
        Check Answers
      </button>
      <button
        type="button"
        onClick={onReset}
        style={{
          padding: '0.9rem 1.35rem',
          borderRadius: '14px',
          border: '1px solid rgba(255,255,255,0.14)',
          cursor: 'pointer',
          background: 'rgba(255,255,255,0.04)',
          color: '#fff',
          fontWeight: 700,
        }}
      >
        Try Again
      </button>
    </div>
  )
}

function ResultBanner({ score, total, successText }) {
  const feedback = getFeedback(score, total, successText)

  return (
    <div
      style={{
        marginBottom: '1.25rem',
        padding: '1rem 1.1rem',
        borderRadius: '18px',
        border: `1px solid ${hexToRgba(feedback.color, 0.35)}`,
        background: hexToRgba(feedback.color, 0.1),
      }}
    >
      <div style={{ color: feedback.color, fontSize: '0.78rem', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.45rem' }}>
        {feedback.title}
      </div>
      <div style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem' }}>
        Score: {score} / {total}
      </div>
      <p style={{ margin: 0, color: '#d7d7ea', lineHeight: 1.7 }}>{feedback.body}</p>
    </div>
  )
}

function QuizActivity({ activity, accent }) {
  const [selected, setSelected] = useState(() => Array(activity.questions.length).fill(null))
  const [submitted, setSubmitted] = useState(false)

  const score = selected.reduce((count, answer, index) => count + (answer === activity.questions[index].correct ? 1 : 0), 0)
  const canCheck = selected.every((answer) => answer !== null)

  const reset = () => {
    setSelected(Array(activity.questions.length).fill(null))
    setSubmitted(false)
  }

  return (
    <div>
      {submitted && <ResultBanner score={score} total={activity.questions.length} successText={activity.success} />}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {activity.questions.map((question, questionIndex) => (
          <div
            key={question.prompt}
            style={{
              padding: '1.1rem',
              borderRadius: '18px',
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${hexToRgba(accent, 0.14)}`,
            }}
          >
            <div style={{ color: accent, fontSize: '0.74rem', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.5rem' }}>
              Question {questionIndex + 1}
            </div>
            <h4 style={{ color: '#fff', margin: '0 0 0.95rem 0', lineHeight: 1.5, fontSize: '1rem' }}>{question.prompt}</h4>

            <div style={{ display: 'grid', gap: '0.65rem' }}>
              {question.options.map((option, optionIndex) => {
                const isSelected = selected[questionIndex] === optionIndex
                const isCorrect = question.correct === optionIndex
                const isWrongSelected = submitted && isSelected && !isCorrect

                let border = 'rgba(255,255,255,0.12)'
                let background = 'rgba(255,255,255,0.03)'
                let color = '#d7d7ea'

                if (isSelected) {
                  border = hexToRgba(accent, 0.4)
                  background = hexToRgba(accent, 0.1)
                  color = '#fff'
                }

                if (submitted && isCorrect) {
                  border = 'rgba(134,255,183,0.5)'
                  background = 'rgba(134,255,183,0.12)'
                  color = '#fff'
                }

                if (isWrongSelected) {
                  border = 'rgba(255,125,107,0.5)'
                  background = 'rgba(255,125,107,0.12)'
                  color = '#fff'
                }

                return (
                  <button
                    key={`${question.prompt}-${optionIndex}`}
                    type="button"
                    onClick={() => {
                      const next = [...selected]
                      next[questionIndex] = optionIndex
                      setSelected(next)
                      setSubmitted(false)
                    }}
                    style={{
                      textAlign: 'left',
                      padding: '0.9rem 1rem',
                      borderRadius: '14px',
                      border: `1px solid ${border}`,
                      background,
                      color,
                      cursor: 'pointer',
                      display: 'grid',
                      gridTemplateColumns: '30px 1fr',
                      gap: '0.75rem',
                      alignItems: 'start',
                    }}
                  >
                    <span
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        display: 'grid',
                        placeItems: 'center',
                        background: 'rgba(255,255,255,0.08)',
                        color: submitted && isCorrect ? '#86ffb7' : accent,
                        fontWeight: 800,
                      }}
                    >
                      {String.fromCharCode(65 + optionIndex)}
                    </span>
                    <span style={{ lineHeight: 1.6 }}>{option}</span>
                  </button>
                )
              })}
            </div>

            {submitted && (
              <div
                style={{
                  marginTop: '0.9rem',
                  padding: '0.9rem 1rem',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div style={{ color: '#aeb7cf', fontSize: '0.74rem', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Feedback
                </div>
                <p style={{ margin: 0, color: '#d7d7ea', lineHeight: 1.7 }}>{question.explanation}</p>
                {selected[questionIndex] !== question.correct && (
                  <div style={{ marginTop: '0.45rem', color: '#fff', fontWeight: 700 }}>
                    Correct answer: {question.options[question.correct]}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <ActionButtons onCheck={() => setSubmitted(true)} onReset={reset} canCheck={canCheck} accent={accent} />
    </div>
  )
}

function SortActivity({ activity, accent }) {
  const initialAssignments = activity.items.reduce((acc, item) => {
    acc[item.id] = ''
    return acc
  }, {})

  const [assignments, setAssignments] = useState(initialAssignments)
  const [submitted, setSubmitted] = useState(false)

  const score = activity.items.reduce((count, item) => count + (assignments[item.id] === item.correct ? 1 : 0), 0)
  const canCheck = activity.items.every((item) => assignments[item.id])

  const reset = () => {
    setAssignments(initialAssignments)
    setSubmitted(false)
  }

  return (
    <div>
      {submitted && <ResultBanner score={score} total={activity.items.length} successText={activity.success} />}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {activity.items.map((item) => {
          const selectedCategory = assignments[item.id]
          const isCorrect = submitted && selectedCategory === item.correct
          const isWrong = submitted && selectedCategory && selectedCategory !== item.correct

          return (
            <div
              key={item.id}
              style={{
                padding: '1rem',
                borderRadius: '18px',
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${
                  isCorrect
                    ? 'rgba(134,255,183,0.45)'
                    : isWrong
                      ? 'rgba(255,125,107,0.45)'
                      : hexToRgba(accent, 0.14)
                }`,
              }}
            >
              <div style={{ color: '#fff', fontWeight: 700, marginBottom: '0.8rem', lineHeight: 1.5 }}>{item.label}</div>

              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                {activity.categories.map((category) => {
                  const isSelected = selectedCategory === category
                  return (
                    <button
                      key={`${item.id}-${category}`}
                      type="button"
                      onClick={() => {
                        setAssignments({ ...assignments, [item.id]: category })
                        setSubmitted(false)
                      }}
                      style={{
                        padding: '0.7rem 0.95rem',
                        borderRadius: '999px',
                        border: `1px solid ${isSelected ? hexToRgba(accent, 0.5) : 'rgba(255,255,255,0.12)'}`,
                        background: isSelected ? hexToRgba(accent, 0.12) : 'rgba(255,255,255,0.03)',
                        color: isSelected ? '#fff' : '#d7d7ea',
                        cursor: 'pointer',
                        fontWeight: 700,
                      }}
                    >
                      {category}
                    </button>
                  )
                })}
              </div>

              {submitted && selectedCategory && (
                <div style={{ marginTop: '0.8rem', color: isCorrect ? '#86ffb7' : '#ffb4a8', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  {isCorrect ? 'Correct placement.' : `Correct bucket: ${item.correct}`}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <ActionButtons onCheck={() => setSubmitted(true)} onReset={reset} canCheck={canCheck} accent={accent} />
    </div>
  )
}

function MatchUpActivity({ activity, accent }) {
  const initialMatches = activity.pairs.reduce((acc, pair) => {
    acc[pair.id] = ''
    return acc
  }, {})

  const [matches, setMatches] = useState(initialMatches)
  const [activePromptId, setActivePromptId] = useState(activity.pairs[0]?.id || '')
  const [submitted, setSubmitted] = useState(false)
  const [answerOptions, setAnswerOptions] = useState(() => shuffleArray(activity.pairs.map((pair) => ({ id: pair.id, label: pair.answer }))))

  const score = activity.pairs.reduce((count, pair) => count + (matches[pair.id] === pair.id ? 1 : 0), 0)
  const canCheck = activity.pairs.every((pair) => matches[pair.id])

  const assignAnswer = (answerId) => {
    if (!activePromptId) return

    setMatches((current) => {
      const next = { ...current }

      Object.keys(next).forEach((promptId) => {
        if (next[promptId] === answerId) {
          next[promptId] = ''
        }
      })

      next[activePromptId] = answerId
      return next
    })

    setSubmitted(false)
  }

  const clearMatch = (pairId) => {
    setMatches({ ...matches, [pairId]: '' })
    setActivePromptId(pairId)
    setSubmitted(false)
  }

  const reset = () => {
    setMatches(initialMatches)
    setActivePromptId(activity.pairs[0]?.id || '')
    setSubmitted(false)
    setAnswerOptions(shuffleArray(activity.pairs.map((pair) => ({ id: pair.id, label: pair.answer }))))
  }

  const activePair = activity.pairs.find((pair) => pair.id === activePromptId)

  return (
    <div>
      {submitted && <ResultBanner score={score} total={activity.pairs.length} successText={activity.success} />}

      <div style={{ display: 'grid', gap: '1rem' }}>
        <div
          style={{
            padding: '1rem 1.1rem',
            borderRadius: '18px',
            border: `1px solid ${hexToRgba(accent, 0.18)}`,
            background: hexToRgba(accent, 0.06),
            color: '#d7d7ea',
            lineHeight: 1.7,
          }}
        >
          {activePair ? (
            <>
              <span style={{ color: accent, fontWeight: 800 }}>Selected card:</span> {activePair.prompt}
            </>
          ) : (
            'Select a prompt card, then click the best matching answer chip.'
          )}
        </div>

        <div className="chapter-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          <div style={{ display: 'grid', gap: '0.9rem' }}>
            {activity.pairs.map((pair) => {
              const selectedAnswer = answerOptions.find((option) => option.id === matches[pair.id])
              const isActive = activePromptId === pair.id
              const isCorrect = submitted && matches[pair.id] === pair.id
              const isWrong = submitted && matches[pair.id] && matches[pair.id] !== pair.id

              return (
                <div
                  key={pair.id}
                  style={{
                    padding: '1rem',
                    borderRadius: '18px',
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${
                      isCorrect
                        ? 'rgba(134,255,183,0.45)'
                        : isWrong
                          ? 'rgba(255,125,107,0.45)'
                          : isActive
                            ? hexToRgba(accent, 0.5)
                            : hexToRgba(accent, 0.14)
                    }`,
                    boxShadow: isActive ? `0 12px 30px ${hexToRgba(accent, 0.12)}` : 'none',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setActivePromptId(pair.id)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: 0,
                      border: 'none',
                      background: 'transparent',
                      color: '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ color: accent, fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.45rem' }}>
                      Match Card
                    </div>
                    <div style={{ lineHeight: 1.6, fontWeight: 600 }}>{pair.prompt}</div>
                  </button>

                  <div style={{ marginTop: '0.9rem', display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span
                      style={{
                        padding: '0.48rem 0.8rem',
                        borderRadius: '999px',
                        background: selectedAnswer ? hexToRgba(accent, 0.12) : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${selectedAnswer ? hexToRgba(accent, 0.35) : 'rgba(255,255,255,0.12)'}`,
                        color: selectedAnswer ? '#fff' : '#9ca6bf',
                        fontWeight: 700,
                        fontSize: '0.92rem',
                      }}
                    >
                      {selectedAnswer ? selectedAnswer.label : 'No match selected'}
                    </span>
                    {selectedAnswer && (
                      <button
                        type="button"
                        onClick={() => clearMatch(pair.id)}
                        style={{
                          padding: '0.45rem 0.75rem',
                          borderRadius: '999px',
                          border: '1px solid rgba(255,255,255,0.12)',
                          background: 'rgba(255,255,255,0.03)',
                          color: '#d7d7ea',
                          cursor: 'pointer',
                          fontWeight: 700,
                        }}
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {submitted && (
                    <div style={{ marginTop: '0.8rem', color: isCorrect ? '#86ffb7' : '#ffb4a8', fontSize: '0.92rem', lineHeight: 1.6 }}>
                      {isCorrect ? 'Correct match.' : `Correct match: ${pair.answer}`}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div
            style={{
              padding: '1rem',
              borderRadius: '20px',
              border: `1px solid ${hexToRgba(accent, 0.18)}`,
              background: 'rgba(255,255,255,0.03)',
              alignSelf: 'start',
            }}
          >
            <div style={{ color: accent, fontSize: '0.74rem', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.75rem' }}>
              Answer Bank
            </div>
            <div style={{ display: 'grid', gap: '0.7rem' }}>
              {answerOptions.map((option) => {
                const owner = activity.pairs.find((pair) => matches[pair.id] === option.id)
                const isAssigned = Boolean(owner)
                const isAssignedToActive = activePromptId && matches[activePromptId] === option.id

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => assignAnswer(option.id)}
                    style={{
                      textAlign: 'left',
                      padding: '0.9rem 1rem',
                      borderRadius: '14px',
                      border: `1px solid ${
                        isAssignedToActive
                          ? hexToRgba(accent, 0.5)
                          : isAssigned
                            ? 'rgba(255,255,255,0.2)'
                            : 'rgba(255,255,255,0.12)'
                      }`,
                      background: isAssignedToActive ? hexToRgba(accent, 0.12) : isAssigned ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)',
                      color: '#fff',
                      cursor: activePromptId ? 'pointer' : 'default',
                      opacity: activePromptId ? 1 : 0.6,
                    }}
                  >
                    <div style={{ fontWeight: 700, lineHeight: 1.5 }}>{option.label}</div>
                    {owner && (
                      <div style={{ marginTop: '0.35rem', color: '#9ca6bf', fontSize: '0.84rem' }}>
                        Linked to: {owner.prompt}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <ActionButtons onCheck={() => setSubmitted(true)} onReset={reset} canCheck={canCheck} accent={accent} />
    </div>
  )
}

function DragDropActivity({ activity, accent }) {
  const initialPlacements = activity.items.reduce((acc, item) => {
    acc[item.id] = ''
    return acc
  }, {})

  const [placements, setPlacements] = useState(initialPlacements)
  const [draggedId, setDraggedId] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const score = activity.items.reduce((count, item) => count + (placements[item.id] === item.correct ? 1 : 0), 0)
  const canCheck = activity.items.every((item) => placements[item.id])

  const dropItem = (targetCategory) => {
    if (!draggedId) return
    setPlacements({ ...placements, [draggedId]: targetCategory })
    setDraggedId(null)
    setSubmitted(false)
  }

  const handleDrop = (event, targetCategory) => {
    event.preventDefault()
    const itemId = event.dataTransfer.getData('text/plain') || draggedId
    if (!itemId) return
    setPlacements({ ...placements, [itemId]: targetCategory })
    setDraggedId(null)
    setSubmitted(false)
  }

  const reset = () => {
    setPlacements(initialPlacements)
    setDraggedId(null)
    setSubmitted(false)
  }

  const renderItem = (item) => {
    const placedCategory = placements[item.id]
    const isCorrect = submitted && placedCategory === item.correct
    const isWrong = submitted && placedCategory && placedCategory !== item.correct

    return (
      <div
        key={item.id}
        draggable
        onDragStart={(event) => {
          event.dataTransfer.setData('text/plain', item.id)
          setDraggedId(item.id)
        }}
        onDragEnd={() => setDraggedId(null)}
        style={{
          padding: '0.85rem 0.95rem',
          borderRadius: '14px',
          border: `1px solid ${
            isCorrect
              ? 'rgba(134,255,183,0.5)'
              : isWrong
                ? 'rgba(255,125,107,0.5)'
                : hexToRgba(accent, 0.22)
          }`,
          background: isCorrect ? 'rgba(134,255,183,0.12)' : isWrong ? 'rgba(255,125,107,0.12)' : 'rgba(255,255,255,0.04)',
          color: '#fff',
          cursor: 'grab',
          lineHeight: 1.6,
          fontWeight: 600,
        }}
      >
        {item.label}
        {submitted && isWrong && (
          <div style={{ marginTop: '0.35rem', color: '#ffb4a8', fontSize: '0.82rem' }}>
            Correct zone: {item.correct}
          </div>
        )}
      </div>
    )
  }

  const unplacedItems = activity.items.filter((item) => !placements[item.id])

  return (
    <div>
      {submitted && <ResultBanner score={score} total={activity.items.length} successText={activity.success} />}

      <div style={{ display: 'grid', gap: '1rem' }}>
        <div
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => handleDrop(event, '')}
          style={{
            padding: '1rem',
            borderRadius: '20px',
            border: `1px dashed ${hexToRgba(accent, 0.35)}`,
            background: 'rgba(255,255,255,0.03)',
          }}
        >
          <div style={{ color: accent, fontSize: '0.74rem', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.7rem' }}>
            Card Bank
          </div>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {unplacedItems.length > 0 ? unplacedItems.map(renderItem) : <div style={{ color: '#9ca6bf', lineHeight: 1.6 }}>All cards have been placed. Drag one back here if you want to retry a zone.</div>}
          </div>
        </div>

        <div className="chapter-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {activity.categories.map((category) => {
            const zoneItems = activity.items.filter((item) => placements[item.id] === category)

            return (
              <div
                key={category}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => handleDrop(event, category)}
                style={{
                  minHeight: '180px',
                  padding: '1rem',
                  borderRadius: '20px',
                  border: `1px dashed ${hexToRgba(accent, 0.35)}`,
                  background: hexToRgba(accent, 0.06),
                }}
              >
                <div style={{ color: accent, fontSize: '0.74rem', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.7rem' }}>
                  {category}
                </div>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {zoneItems.length > 0 ? (
                    zoneItems.map(renderItem)
                  ) : (
                    <button
                      type="button"
                      onClick={() => dropItem(category)}
                      style={{
                        padding: '0.95rem',
                        borderRadius: '14px',
                        border: '1px dashed rgba(255,255,255,0.16)',
                        background: 'rgba(255,255,255,0.03)',
                        color: '#9ca6bf',
                        cursor: draggedId ? 'pointer' : 'default',
                      }}
                    >
                      {draggedId ? 'Drop here' : 'Drag a card here'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <ActionButtons onCheck={() => setSubmitted(true)} onReset={reset} canCheck={canCheck} accent={accent} />
    </div>
  )
}

function MoveIcon({ direction }) {
  const rotate = direction === 'up' ? 0 : 180

  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: `rotate(${rotate}deg)` }} aria-hidden="true">
      <path d="M12 5v14" />
      <path d="m6 11 6-6 6 6" />
    </svg>
  )
}

function SequenceActivity({ activity, accent }) {
  const [order, setOrder] = useState(activity.startOrder)
  const [submitted, setSubmitted] = useState(false)

  const byId = activity.items.reduce((acc, item) => {
    acc[item.id] = item
    return acc
  }, {})

  const score = order.reduce((count, id, index) => count + (id === activity.correctOrder[index] ? 1 : 0), 0)
  const canCheck = order.length === activity.correctOrder.length

  const moveItem = (index, direction) => {
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= order.length) return

    const next = [...order]
    const temp = next[index]
    next[index] = next[swapIndex]
    next[swapIndex] = temp
    setOrder(next)
    setSubmitted(false)
  }

  const reset = () => {
    setOrder(activity.startOrder)
    setSubmitted(false)
  }

  return (
    <div>
      {submitted && <ResultBanner score={score} total={activity.correctOrder.length} successText={activity.success} />}

      <div style={{ display: 'grid', gap: '0.9rem' }}>
        {order.map((id, index) => {
          const isCorrectPosition = submitted && id === activity.correctOrder[index]
          const isWrongPosition = submitted && id !== activity.correctOrder[index]

          return (
            <div
              key={`${id}-${index}`}
              style={{
                padding: '1rem',
                borderRadius: '18px',
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${
                  isCorrectPosition
                    ? 'rgba(134,255,183,0.45)'
                    : isWrongPosition
                      ? 'rgba(255,125,107,0.45)'
                      : hexToRgba(accent, 0.14)
                }`,
                display: 'grid',
                gridTemplateColumns: '48px 1fr auto',
                gap: '1rem',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  display: 'grid',
                  placeItems: 'center',
                  background: hexToRgba(accent, 0.12),
                  color: '#fff',
                  fontWeight: 800,
                }}
              >
                {index + 1}
              </div>
              <div style={{ color: '#fff', lineHeight: 1.6, fontWeight: 600 }}>{byId[id].label}</div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => moveItem(index, 'up')}
                  disabled={index === 0}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: 'rgba(255,255,255,0.04)',
                    color: index === 0 ? '#6f7890' : '#fff',
                    cursor: index === 0 ? 'not-allowed' : 'pointer',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <MoveIcon direction="up" />
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(index, 'down')}
                  disabled={index === order.length - 1}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: 'rgba(255,255,255,0.04)',
                    color: index === order.length - 1 ? '#6f7890' : '#fff',
                    cursor: index === order.length - 1 ? 'not-allowed' : 'pointer',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <MoveIcon direction="down" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {submitted && score !== activity.correctOrder.length && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem 1.1rem',
            borderRadius: '18px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.03)',
          }}
        >
          <div style={{ color: '#aeb7cf', fontSize: '0.74rem', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.5rem' }}>
            Correct Order
          </div>
          <ol style={{ margin: 0, paddingLeft: '1.2rem', color: '#d7d7ea', lineHeight: 1.8 }}>
            {activity.correctOrder.map((id) => (
              <li key={`correct-${id}`}>{byId[id].label}</li>
            ))}
          </ol>
        </div>
      )}

      <ActionButtons onCheck={() => setSubmitted(true)} onReset={reset} canCheck={canCheck} accent={accent} />
    </div>
  )
}

function WheelActivity({ activity, accent }) {
  const [rotation, setRotation] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [selectedOption, setSelectedOption] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [spinning, setSpinning] = useState(false)

  const currentQuestion = selectedIndex === null ? null : activity.questions[selectedIndex]
  const score = submitted && currentQuestion && selectedOption === currentQuestion.correct ? 1 : 0
  const canCheck = currentQuestion !== null && selectedOption !== null && !spinning

  const wheelColors = ['#00f5d4', '#7b2ff7', '#ff9a5c', '#ffd166', '#ff5c8d', '#61a8ff', '#6cf0a8', '#ff8fab']
  const segmentSize = 100 / activity.questions.length
  const gradient = activity.questions
    .map((_, index) => {
      const color = wheelColors[index % wheelColors.length]
      const start = (index * segmentSize).toFixed(2)
      const end = ((index + 1) * segmentSize).toFixed(2)
      return `${color} ${start}% ${end}%`
    })
    .join(', ')

  const spinWheel = () => {
    if (spinning) return

    let nextIndex = Math.floor(Math.random() * activity.questions.length)
    if (activity.questions.length > 1 && nextIndex === selectedIndex) {
      nextIndex = (nextIndex + 1) % activity.questions.length
    }

    setSpinning(true)
    setSelectedOption(null)
    setSubmitted(false)

    const segmentAngle = 360 / activity.questions.length
    const nextRotation = rotation + 1440 + nextIndex * segmentAngle
    setRotation(nextRotation)

    window.setTimeout(() => {
      setSelectedIndex(nextIndex)
      setSpinning(false)
    }, 1700)
  }

  const reset = () => {
    setSelectedOption(null)
    setSubmitted(false)
  }

  return (
    <div>
      <div style={{ display: 'grid', gap: '1.2rem', justifyItems: 'center', marginBottom: '1.4rem' }}>
        <div style={{ position: 'relative', width: '260px', height: '260px' }}>
          <div
            style={{
              position: 'absolute',
              top: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '14px solid transparent',
              borderRight: '14px solid transparent',
              borderTop: '24px solid #ffffff',
              zIndex: 4,
            }}
          />
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: `4px solid ${hexToRgba(accent, 0.5)}`,
              background: `conic-gradient(${gradient})`,
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? 'transform 1.7s cubic-bezier(0.2, 0.9, 0.2, 1)' : 'none',
              boxShadow: `0 20px 40px ${hexToRgba(accent, 0.18)}`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: '28%',
                borderRadius: '50%',
                background: '#08101d',
                border: `2px solid ${hexToRgba(accent, 0.4)}`,
                display: 'grid',
                placeItems: 'center',
                textAlign: 'center',
                padding: '0.75rem',
                color: '#fff',
                fontWeight: 800,
                lineHeight: 1.35,
              }}
            >
              {spinning ? 'Spinning...' : 'Spin the wheel'}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={spinWheel}
          disabled={spinning}
          style={{
            padding: '0.95rem 1.35rem',
            borderRadius: '14px',
            border: 'none',
            cursor: spinning ? 'not-allowed' : 'pointer',
            background: `linear-gradient(135deg, ${accent}, #ffffff22)`,
            color: '#041019',
            fontWeight: 800,
            opacity: spinning ? 0.6 : 1,
          }}
        >
          {selectedIndex === null ? 'Spin to get a scenario' : 'Spin again'}
        </button>
      </div>

      {currentQuestion && (
        <div>
          {submitted && <ResultBanner score={score} total={1} successText={activity.success} />}

          <div
            style={{
              padding: '1.1rem',
              borderRadius: '18px',
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${hexToRgba(accent, 0.14)}`,
            }}
          >
            <div style={{ color: accent, fontSize: '0.74rem', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.5rem' }}>
              Wheel Scenario
            </div>
            <h4 style={{ color: '#fff', margin: '0 0 0.95rem 0', lineHeight: 1.5, fontSize: '1rem' }}>{currentQuestion.prompt}</h4>

            <div style={{ display: 'grid', gap: '0.65rem' }}>
              {currentQuestion.options.map((option, optionIndex) => {
                const isSelected = selectedOption === optionIndex
                const isCorrect = currentQuestion.correct === optionIndex
                const isWrongSelected = submitted && isSelected && !isCorrect

                let border = 'rgba(255,255,255,0.12)'
                let background = 'rgba(255,255,255,0.03)'
                let color = '#d7d7ea'

                if (isSelected) {
                  border = hexToRgba(accent, 0.4)
                  background = hexToRgba(accent, 0.1)
                  color = '#fff'
                }

                if (submitted && isCorrect) {
                  border = 'rgba(134,255,183,0.5)'
                  background = 'rgba(134,255,183,0.12)'
                  color = '#fff'
                }

                if (isWrongSelected) {
                  border = 'rgba(255,125,107,0.5)'
                  background = 'rgba(255,125,107,0.12)'
                  color = '#fff'
                }

                return (
                  <button
                    key={`${currentQuestion.prompt}-${optionIndex}`}
                    type="button"
                    onClick={() => {
                      setSelectedOption(optionIndex)
                      setSubmitted(false)
                    }}
                    style={{
                      textAlign: 'left',
                      padding: '0.9rem 1rem',
                      borderRadius: '14px',
                      border: `1px solid ${border}`,
                      background,
                      color,
                      cursor: 'pointer',
                      display: 'grid',
                      gridTemplateColumns: '30px 1fr',
                      gap: '0.75rem',
                      alignItems: 'start',
                    }}
                  >
                    <span
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        display: 'grid',
                        placeItems: 'center',
                        background: 'rgba(255,255,255,0.08)',
                        color: submitted && isCorrect ? '#86ffb7' : accent,
                        fontWeight: 800,
                      }}
                    >
                      {String.fromCharCode(65 + optionIndex)}
                    </span>
                    <span style={{ lineHeight: 1.6 }}>{option}</span>
                  </button>
                )
              })}
            </div>

            {submitted && (
              <div
                style={{
                  marginTop: '0.9rem',
                  padding: '0.9rem 1rem',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div style={{ color: '#aeb7cf', fontSize: '0.74rem', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Feedback
                </div>
                <p style={{ margin: 0, color: '#d7d7ea', lineHeight: 1.7 }}>{currentQuestion.explanation}</p>
                {selectedOption !== currentQuestion.correct && (
                  <div style={{ marginTop: '0.45rem', color: '#fff', fontWeight: 700 }}>
                    Correct answer: {currentQuestion.options[currentQuestion.correct]}
                  </div>
                )}
              </div>
            )}
          </div>

          <ActionButtons onCheck={() => setSubmitted(true)} onReset={reset} canCheck={canCheck} accent={accent} />
        </div>
      )}
    </div>
  )
}

/* ═══════ PIPELINE ACTIVITY (Chapter 1-1) ═══════ */
function PipelineActivity3D({ activity, accent }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [errorId, setErrorId] = useState(null)

  const correctStations = activity.stations.filter(s => !s.decoy)
  const isDone = stepIndex === correctStations.length

  const handleStationClick = (station) => {
    if (isDone) return
    const expected = correctStations[stepIndex]
    
    if (station.id === expected.id) {
      setStepIndex(prev => prev + 1)
    } else {
      setErrorId(station.id)
      setTimeout(() => setErrorId(null), 800)
    }
  }

  // Pre-calculate positions
  const getPos = (index, type) => {
    const isDecoy = type === 'decoy'
    const x = isDecoy ? (index % 2 === 0 ? -1.5 : 1.5) : (index - 2) * 1.5
    const z = isDecoy ? 1.5 : 0
    return [x, 0, z]
  }

  return (
    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      <div style={{ flex: '1 1 350px', height: '420px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
        <Canvas camera={{ position: [0, 5, 5], fov: 45 }}>
          <Environment preset="city" />
          <ambientLight intensity={0.4} />
          <pointLight position={[2, 4, 3]} intensity={1.5} color="#fff" />
          <pointLight position={[-2, -2, 2]} intensity={1} color={accent} />

          <group position={[0, -0.5, 0]}>
            {/* The main conveyor belt line */}
            <mesh position={[0, -0.05, 0]} rotation={[-Math.PI/2, 0, 0]}>
              <planeGeometry args={[8, 0.4]} />
              <meshPhysicalMaterial color="#111622" metalness={0.9} roughness={0.1} clearcoat={1} />
            </mesh>
            
            {activity.stations.map((station, i) => {
              const expectedIdx = correctStations.findIndex(s => s.id === station.id)
              const isCompleted = !station.decoy && expectedIdx < stepIndex
              const isNext = !station.decoy && expectedIdx === stepIndex
              
              const pos = station.decoy ? getPos(i, 'decoy') : getPos(expectedIdx, 'valid')
              
              const color = isCompleted ? '#86ffb7' : isNext ? accent : (station.decoy && errorId === station.id) ? '#ff2d55' : '#4f5973'
              
              return (
                <group key={station.id} position={pos} onClick={() => handleStationClick(station)}>
                  {/* Station base */}
                  <mesh position={[0, 0.1, 0]}>
                    <boxGeometry args={[0.6, 0.2, 0.6]} />
                    <meshPhysicalMaterial color={color} transmission={0.5} roughness={0.2} emissive={color} emissiveIntensity={isNext ? 0.8 : 0.2} />
                  </mesh>
                  {/* Glowing Core */}
                  {(isCompleted || isNext) && (
                    <Float speed={5} floatIntensity={0.5}>
                      <mesh position={[0, 0.5, 0]}>
                        <octahedronGeometry args={[0.2, 0]} />
                        <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={1.5} transmission={0.9} />
                      </mesh>
                    </Float>
                  )}
                  {isNext && <Sparkles position={[0, 0.5, 0]} count={15} scale={1} size={2} color={color} speed={2} />}
                  
                  {/* Label */}
                  <Text position={[0, -0.2, 0]} fontSize={0.12} color="#fff" font={undefined}>
                    {station.label}
                  </Text>
                </group>
              )
            })}
          </group>

          <ContactShadows position={[0, -1, 0]} opacity={0.7} scale={15} blur={2.5} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      <div style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {activity.stations.map((station) => {
          const expectedIdx = correctStations.findIndex(s => s.id === station.id)
          const isCompleted = !station.decoy && expectedIdx < stepIndex
          const isError = errorId === station.id
          
          return (
            <button
              key={station.id}
              onClick={() => handleStationClick(station)}
              disabled={isCompleted}
              className={isError ? 'jam-shake' : ''}
              style={{
                padding: '0.85rem 1rem', borderRadius: '12px', textAlign: 'left',
                background: isError ? 'rgba(255,45,85,0.1)' : isCompleted ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                border: isError ? '1px solid #ff2d55' : isCompleted ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(255,255,255,0.15)',
                color: isError ? '#ff2d55' : isCompleted ? '#6f7890' : '#fff',
                cursor: isCompleted ? 'default' : 'pointer', transition: 'all 0.2s'
              }}
            >
              <div style={{ fontWeight: 700 }}>{station.label} {isCompleted && <span style={{ float: 'right', color: '#86ffb7' }}>Running</span>}</div>
              <div style={{ fontSize: '0.8rem', color: '#6f7890', marginTop: '0.2rem' }}>{station.desc}</div>
              {isError && station.warning && (
                <div style={{ fontSize: '0.78rem', color: '#ff2d55', marginTop: '0.4rem', fontWeight: 600 }}>WARNING: {station.warning}</div>
              )}
            </button>
          )
        })}

        {isDone && (
          <div style={{ marginTop: '0.5rem', background: hexToRgba(accent, 0.1), border: `1px solid ${accent}`, padding: '1rem', borderRadius: '12px', textAlign: 'center', color: accent, fontWeight: 700 }}>
            {activity.success}
          </div>
        )}
      </div>
    </div>
  )
}

/* ═══════ X-RAY SCANNER ACTIVITY (Chapter 1-2) ═══════ */
function XRayActivity3D({ activity, accent }) {
  const [answers, setAnswers] = useState({})
  const [errorLayer, setErrorLayer] = useState(null)
  const [exploded, setExploded] = useState(true)

  const isDone = Object.keys(answers).length === activity.bugs.length
  
  const getNextBug = () => activity.bugs.find(b => !answers[b.id])
  const activeBug = isDone ? null : getNextBug()

  const handleLayerClick = (layerId) => {
    if (isDone || !activeBug) return
    
    if (activeBug.answer === layerId) {
      setAnswers(prev => ({ ...prev, [activeBug.id]: layerId }))
    } else {
      setErrorLayer(layerId)
      setTimeout(() => setErrorLayer(null), 800)
    }
  }

  // Calculate positions: 0, 1, 2
  const getLayerPos = (index) => {
    const spacing = exploded ? 1.5 : 0.2
    return [0, (1 - index) * spacing, 0]
  }

  return (
    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      <div style={{ flex: '1 1 350px', height: '420px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', position: 'relative' }}>
        <button 
          onClick={() => setExploded(!exploded)}
          style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: 600 }}
        >
          {exploded ? 'Collapse Layers' : 'Explode Layers'}
        </button>
        <Canvas camera={{ position: [4, 3, 5], fov: 40 }}>
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <pointLight position={[2, 4, 3]} intensity={1.5} color="#fff" />

          <group position={[0, -0.5, 0]}>
            {activity.layers.map((layer, i) => {
              const pos = getLayerPos(i)
              const isError = errorLayer === layer.id
              
              return (
                <Float key={layer.id} speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                  <group position={pos} onClick={() => handleLayerClick(layer.id)}>
                    <mesh rotation={[-Math.PI / 2, 0, 0]}>
                      <boxGeometry args={[2.5, 4, 0.1]} />
                      <meshPhysicalMaterial 
                        color={isError ? '#ff2d55' : layer.color} 
                        transmission={0.8} 
                        roughness={0.1} 
                        clearcoat={1} 
                        thickness={0.5}
                        emissive={isError ? '#ff2d55' : layer.color}
                        emissiveIntensity={isError ? 0.8 : 0.2}
                      />
                    </mesh>
                    {/* Layer Outline/Grid */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]}>
                      <boxGeometry args={[2.52, 4.02, 0.05]} />
                      <meshBasicMaterial color={layer.color} wireframe />
                    </mesh>
                    <Text position={[1.8, 0, 0]} fontSize={0.25} color={'#ffffff'} outlineWidth={0.02} outlineColor={layer.color} fontWeight="bold" anchorX="left">
                      {layer.label}
                    </Text>
                  </group>
                </Float>
              )
            })}
          </group>

          <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate={!activeBug} autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      <div style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        <div style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Bug Reports
        </div>
        {activity.bugs.map((bug) => {
          const solvedLayerId = answers[bug.id]
          const solvedLayer = solvedLayerId ? activity.layers.find(l => l.id === solvedLayerId) : null
          const isActive = activeBug?.id === bug.id
          
          return (
            <div
              key={bug.id}
              className={errorLayer && isActive ? 'jam-shake' : ''}
              style={{
                padding: '0.85rem 1rem', borderRadius: '12px',
                background: solvedLayer ? `${solvedLayer.color}15` : isActive ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${solvedLayer ? solvedLayer.color : isActive ? accent : 'rgba(255,255,255,0.05)'}`,
                color: solvedLayer ? '#fff' : isActive ? accent : '#6f7890',
                transition: 'all 0.3s'
              }}
            >
              <div style={{ fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>{bug.prompt}</span>
              </div>
              {solvedLayer ? (
                <div style={{ fontWeight: 800, color: solvedLayer.color, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  ✓ Fixed in {solvedLayer.label}
                </div>
              ) : isActive ? (
                <div style={{ fontWeight: 800, color: accent, fontSize: '0.75rem', textTransform: 'uppercase', animation: 'pulse 1.5s infinite' }}>
                  Click 3D layer to assign...
                </div>
              ) : null}
            </div>
          )
        })}

        {isDone && (
          <div style={{ marginTop: '0.5rem', background: hexToRgba(accent, 0.1), border: `1px solid ${accent}`, padding: '1rem', borderRadius: '12px', textAlign: 'center', color: accent, fontWeight: 700 }}>
            {activity.success}
          </div>
        )}
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

/* ═══════ REQUEST JOURNEY ACTIVITY (Chapter 1-3) ═══════ */
function JourneyActivity3D({ activity, accent }) {
  const [activeScenario, setActiveScenario] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const [errorId, setErrorId] = useState(null)

  const scenario = activity.scenarios[activeScenario]
  const path = scenario.path || []
  const correctSteps = path.filter(s => !s.decoy)
  const isDone = stepIndex === correctSteps.length

  const handleStepClick = (step) => {
    if (isDone) return
    const expected = correctSteps[stepIndex]
    
    if (step.id === expected.id) {
      setStepIndex(prev => prev + 1)
    } else {
      setErrorId(step.id)
      setTimeout(() => setErrorId(null), 800)
    }
  }

  // Frontend is left (-1.5), Backend is right (1.5)
  const getPos = (step, index) => {
    const isFrontend = step.label.toLowerCase().includes('frontend')
    const x = isFrontend ? -1.5 : 1.5
    // Z spacing
    const z = (index * 0.8) - 1.5
    return [x, 0, z]
  }

  return (
    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      <div style={{ flex: '1 1 350px', height: '420px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
        <Canvas camera={{ position: [0, 4, 6], fov: 45 }}>
          <Environment preset="city" />
          <ambientLight intensity={0.4} />
          <pointLight position={[2, 4, 3]} intensity={1.5} color="#fff" />
          
          <group position={[0, -0.5, 0]}>
            {/* Frontend Node */}
            <mesh position={[-1.5, 0, -2.5]}>
              <cylinderGeometry args={[0.5, 0.5, 0.2]} />
              <meshPhysicalMaterial color="#00f5d4" roughness={0.2} metalness={0.8} />
            </mesh>
            <Text position={[-1.5, 0.3, -2.5]} fontSize={0.2} color="#fff" font={undefined}>Client App (Frontend)</Text>
            
            {/* Backend Node */}
            <mesh position={[1.5, 0, -2.5]}>
              <boxGeometry args={[0.8, 0.8, 0.8]} />
              <meshPhysicalMaterial color="#7b2ff7" roughness={0.2} metalness={0.8} />
            </mesh>
            <Text position={[1.5, 0.6, -2.5]} fontSize={0.2} color="#fff" font={undefined}>Server Data (Backend)</Text>

            {/* Connecting wire */}
            <group position={[0, 0, -2.5]}>
              <Text position={[0, 0.3, 0]} fontSize={0.15} color="#c8c8e0" font={undefined}>Internet / API</Text>
              <Text position={[-0.5, 0.1, 0]} fontSize={0.12} color="#00f5d4" font={undefined}>Request →</Text>
              <Text position={[0.5, -0.1, 0]} fontSize={0.12} color="#7b2ff7" font={undefined}>← Response</Text>
              <mesh rotation={[0, 0, Math.PI/2]}>
                <cylinderGeometry args={[0.02, 0.02, 3]} />
                <meshBasicMaterial color="rgba(255,255,255,0.1)" />
              </mesh>
            </group>

            {path.map((step, i) => {
              const expectedIdx = correctSteps.findIndex(s => s.id === step.id)
              const isCompleted = !step.decoy && expectedIdx < stepIndex
              const isNext = !step.decoy && expectedIdx === stepIndex
              
              const pos = getPos(step, i)
              const color = isCompleted ? '#86ffb7' : isNext ? accent : (step.decoy && errorId === step.id) ? '#ff2d55' : '#4f5973'
              
              // Only draw valid/completed path nodes
              if (!isCompleted && !isNext && !step.decoy) return null
              if (step.decoy && errorId !== step.id) return null

              return (
                <Float key={step.id} speed={isCompleted ? 0 : 4} floatIntensity={0.2}>
                  <group position={pos}>
                    <mesh>
                      <sphereGeometry args={[isNext ? 0.15 : 0.1]} />
                      <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={isNext ? 1.5 : 0.5} roughness={0.1} transmission={0.9} thickness={0.5} />
                    </mesh>
                    {isNext && <Sparkles count={10} scale={0.5} size={1} color={color} speed={2} />}
                  </group>
                </Float>
              )
            })}
          </group>

          <ContactShadows position={[0, -1, 0]} opacity={0.6} scale={10} blur={2} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      <div style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        <div style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Journey: {scenario.title}
        </div>
        
        {path.map((step) => {
          const expectedIdx = correctSteps.findIndex(s => s.id === step.id)
          const isCompleted = !step.decoy && expectedIdx < stepIndex
          const isError = errorId === step.id
          
          return (
            <button
              key={step.id}
              onClick={() => handleStepClick(step)}
              disabled={isCompleted}
              className={isError ? 'jam-shake' : ''}
              style={{
                padding: '0.85rem 1rem', borderRadius: '12px', textAlign: 'left',
                background: isError ? 'rgba(255,45,85,0.1)' : isCompleted ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                border: isError ? '1px solid #ff2d55' : isCompleted ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(255,255,255,0.15)',
                color: isError ? '#ff2d55' : isCompleted ? '#6f7890' : '#fff',
                cursor: isCompleted ? 'default' : 'pointer', transition: 'all 0.2s',
                display: 'flex', gap: '0.75rem', alignItems: 'center'
              }}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: step.label.toLowerCase().includes('frontend') ? '#00f5d4' : '#7b2ff7', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 700 }}>{step.label}</div>
                {isError && step.warning && (
                  <div style={{ fontSize: '0.78rem', color: '#ff2d55', marginTop: '0.3rem', fontWeight: 600 }}>Dropped: {step.warning}</div>
                )}
              </div>
            </button>
          )
        })}

        {isDone && (
          <div style={{ marginTop: '0.5rem', background: hexToRgba(accent, 0.1), border: `1px solid ${accent}`, padding: '1rem', borderRadius: '12px', textAlign: 'center', color: accent, fontWeight: 700 }}>
            {activity.success}
          </div>
        )}
      </div>
    </div>
  )
}

// --- Chapter 2-1: Dashboard Navigator ---
function DashboardActivity({ activity, accent }) {
  const [currentScenario, setCurrentScenario] = useState(0)
  const [isDone, setIsDone] = useState(false)
  const [shakeZone, setShakeZone] = useState(null)

  const scenario = activity.scenarios[currentScenario]

  const handleZoneClick = (zoneId) => {
    if (isDone) return
    if (zoneId === scenario.zoneId) {
      if (currentScenario < activity.scenarios.length - 1) {
        setCurrentScenario(prev => prev + 1)
      } else {
        setIsDone(true)
      }
    } else {
      setShakeZone(zoneId)
      setTimeout(() => setShakeZone(null), 500)
    }
  }

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <div style={{
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem'
      }}>
        <div style={{ color: '#6f7890', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '0.5rem' }}>
          Scenario {currentScenario + 1} of {activity.scenarios.length}
        </div>
        <div style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 500 }}>
          {scenario.prompt}
        </div>
      </div>

      <div style={{
        position: 'relative', width: '100%', height: '360px',
        background: '#040d14', border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '16px', overflow: 'hidden'
      }}>
        {/* Mock Top Nav */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', padding: '0 1rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff2d55', marginRight: '6px' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffd166', marginRight: '6px' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00e676' }} />
        </div>

        {activity.zones.map(zone => {
          const isShake = shakeZone === zone.id
          return (
            <button
              key={zone.id}
              onClick={() => handleZoneClick(zone.id)}
              className={isShake ? 'jam-shake' : ''}
              style={{
                position: 'absolute',
                left: `${zone.x}%`, top: `${zone.y}%`, width: `${zone.w}%`, height: `${zone.h}%`,
                background: isShake ? 'rgba(255,45,85,0.15)' : 'rgba(255,255,255,0.04)',
                border: isShake ? '2px solid #ff2d55' : '1px dashed rgba(255,255,255,0.2)',
                borderRadius: '12px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: isShake ? '#ff2d55' : '#c8c8e0', fontWeight: 700, fontSize: '1.1rem',
                transition: 'background 0.2s, color 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!isDone && !isShake) {
                  e.currentTarget.style.background = hexToRgba(accent, 0.15)
                  e.currentTarget.style.borderColor = accent
                  e.currentTarget.style.color = accent
                }
              }}
              onMouseLeave={(e) => {
                if (!isDone && !isShake) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                  e.currentTarget.style.color = '#c8c8e0'
                }
              }}
            >
              {zone.label}
            </button>
          )
        })}

        {isDone && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(4,13,20,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(4px)', padding: '2rem'
          }}>
            <div style={{
              background: 'rgba(0,230,118,0.1)', border: '1px solid #00e676',
              padding: '1.5rem', borderRadius: '16px', textAlign: 'center', color: '#00e676', fontWeight: 700
            }}>
              {activity.success}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes jamShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .jam-shake { animation: jamShake 0.4s ease-in-out; }
      `}</style>
    </div>
  )
}

// --- Chapter 2-2: Builder Circuit ---
function CircuitActivity({ activity, accent }) {
  const [sequence, setSequence] = useState([])
  const [errorNode, setErrorNode] = useState(null)

  const handleNodeClick = (nodeId) => {
    if (sequence.length === activity.correctSequence.length) return
    if (sequence.includes(nodeId)) return

    const expectedNext = activity.correctSequence[sequence.length]
    if (nodeId === expectedNext) {
      setSequence([...sequence, nodeId])
    } else {
      setErrorNode(nodeId)
      setTimeout(() => {
        setErrorNode(null)
        setSequence([]) // Reset on break
      }, 600)
    }
  }

  const isDone = sequence.length === activity.correctSequence.length

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <div style={{
        position: 'relative', width: '100%', height: '400px',
        background: '#0a0f18', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)',
        overflow: 'hidden'
      }}>
        {/* SVG Lines */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          {sequence.map((nodeId, i) => {
            if (i === 0) return null
            const prevId = sequence[i - 1]
            const prev = activity.nodes.find(n => n.id === prevId)
            const curr = activity.nodes.find(n => n.id === nodeId)
            return (
              <line
                key={`line-${i}`}
                x1={`${prev.pos.x}%`} y1={`${prev.pos.y}%`}
                x2={`${curr.pos.x}%`} y2={`${curr.pos.y}%`}
                stroke={accent} strokeWidth="3"
                strokeDasharray="8 6"
                className="circuit-path"
              />
            )
          })}
        </svg>

        {activity.nodes.map(node => {
          const isSelected = sequence.includes(node.id)
          const isError = errorNode === node.id
          return (
            <button
              key={node.id}
              onClick={() => handleNodeClick(node.id)}
              className={isError ? 'jam-shake' : ''}
              style={{
                position: 'absolute',
                left: `${node.pos.x}%`, top: `${node.pos.y}%`,
                transform: 'translate(-50%, -50%)',
                padding: '0.8rem 1.2rem',
                background: isError ? 'rgba(255,45,85,0.2)' : isSelected ? hexToRgba(accent, 0.2) : 'rgba(255,255,255,0.05)',
                border: `2px solid ${isError ? '#ff2d55' : isSelected ? accent : 'rgba(255,255,255,0.2)'}`,
                borderRadius: '99px', color: isError ? '#ff2d55' : isSelected ? '#fff' : '#c8c8e0',
                fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s',
                boxShadow: isSelected ? `0 0 15px ${hexToRgba(accent, 0.4)}` : 'none',
                whiteSpace: 'nowrap'
              }}
            >
              {isSelected && <span style={{ marginRight: '8px', color: accent }}>✓</span>}
              {node.label}
            </button>
          )
        })}

        {isDone && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(10,15,24,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(4px)'
          }}>
            <div style={{
              background: hexToRgba(accent, 0.1), border: `1px solid ${accent}`,
              padding: '1.5rem 2rem', borderRadius: '16px', textAlign: 'center', color: accent, fontWeight: 700
            }}>
              Circuit Complete! {activity.success}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// --- Chapter 2-3: Toolbar Command Center ---
function ToolbarActivity({ activity, accent }) {
  const [current, setCurrent] = useState(0)
  const [isDone, setIsDone] = useState(false)
  const [shakeId, setShakeId] = useState(null)

  const scenario = activity.scenarios[current]

  const handleActionClick = (actionId) => {
    if (isDone) return
    if (actionId === scenario.answer) {
      if (current < activity.scenarios.length - 1) {
        setCurrent(prev => prev + 1)
      } else {
        setIsDone(true)
      }
    } else {
      setShakeId(actionId)
      setTimeout(() => setShakeId(null), 500)
    }
  }

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <div style={{
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem'
      }}>
        <div style={{ color: '#6f7890', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '0.5rem' }}>
          Scenario {current + 1} of {activity.scenarios.length}
        </div>
        <div style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 500 }}>
          {scenario.prompt}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {activity.actions.map(action => {
          const isError = shakeId === action.id
          return (
            <button
              key={action.id}
              onClick={() => handleActionClick(action.id)}
              className={isError ? 'jam-shake' : ''}
              style={{
                background: isError ? 'rgba(255,45,85,0.1)' : 'rgba(255,255,255,0.04)',
                border: isError ? '1px solid #ff2d55' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px', padding: '1rem', width: '120px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
                cursor: 'pointer', transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!isDone && !isError) {
                  e.currentTarget.style.background = hexToRgba(accent, 0.1)
                  e.currentTarget.style.borderColor = accent
                }
              }}
              onMouseLeave={(e) => {
                if (!isDone && !isError) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                }
              }}
            >
              <div style={{ fontSize: '1.8rem' }}>{action.icon}</div>
              <div style={{ color: '#c8c8e0', fontSize: '0.85rem', fontWeight: 700, textAlign: 'center' }}>{action.label}</div>
            </button>
          )
        })}
      </div>

      {isDone && (
        <div style={{
          marginTop: '2rem', background: hexToRgba(accent, 0.1), border: `1px solid ${accent}`,
          padding: '1.5rem', borderRadius: '16px', textAlign: 'center', color: accent, fontWeight: 700
        }}>
          {activity.success}
        </div>
      )}
    </div>
  )
}

// --- Chapter 2-4: Canvas Wireframer ---
function WireframeActivity({ activity, accent }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [errorIndex, setErrorIndex] = useState(null)

  const handleStepClick = (index) => {
    if (stepIndex === activity.steps.length) return
    if (index === stepIndex) {
      setStepIndex(prev => prev + 1)
    } else {
      setErrorIndex(index)
      setTimeout(() => setErrorIndex(null), 500)
    }
  }

  const isDone = stepIndex === activity.steps.length

  return (
    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      
      {/* Control Panel */}
      <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {activity.steps.map((step, i) => {
          const isCurrent = i === stepIndex
          const isCompleted = i < stepIndex
          const isError = errorIndex === i
          return (
            <button
              key={step.id}
              onClick={() => handleStepClick(i)}
              className={isError ? 'jam-shake' : ''}
              disabled={isCompleted}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '1rem', borderRadius: '12px', border: '1px solid',
                background: isError ? 'rgba(255,45,85,0.1)' : isCompleted ? 'rgba(255,255,255,0.02)' : isCurrent ? hexToRgba(accent, 0.1) : 'rgba(255,255,255,0.05)',
                borderColor: isError ? '#ff2d55' : isCompleted ? 'rgba(255,255,255,0.05)' : isCurrent ? accent : 'rgba(255,255,255,0.1)',
                color: isError ? '#ff2d55' : isCompleted ? '#6f7890' : isCurrent ? accent : '#c8c8e0',
                cursor: isCompleted ? 'default' : 'pointer',
                textAlign: 'left', transition: 'all 0.2s', fontWeight: 600
              }}
            >
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: isCompleted ? 'transparent' : 'rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem'
              }}>
                {isCompleted ? '✓' : step.icon}
              </div>
              {step.label}
            </button>
          )
        })}
      </div>

      {/* Wireframe Canvas */}
      <div style={{
        flex: '1 1 300px', minHeight: '340px', background: '#0a0f18',
        borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Background Grid Pattern */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '20px 20px', zIndex: 0 }} />
        <div style={{
          position: 'relative', zIndex: 1,
          width: '240px', height: '100%', minHeight: '280px', border: stepIndex > 0 ? `2px solid ${hexToRgba(accent, 0.5)}` : '2px dashed rgba(255,255,255,0.15)',
          background: stepIndex > 0 ? 'rgba(255,255,255,0.03)' : 'transparent',
          borderRadius: '24px', transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
          display: 'flex', flexDirection: 'column',
          padding: '1rem',
          transform: `scale(${stepIndex > 3 ? 0.95 : 1})`,
          boxShadow: stepIndex > 0 ? `0 0 40px ${hexToRgba(accent, 0.1)}` : 'none',
          opacity: stepIndex > 0 ? 1 : 0.4
        }}>
          {/* Header */}
          {stepIndex > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', animation: 'fadeIn 0.5s ease' }}>
              <div style={{ width: '40px', height: '12px', background: 'rgba(255,255,255,0.2)', borderRadius: '6px' }} />
              <div style={{ width: '24px', height: '24px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%' }} />
            </div>
          )}
          {/* Main Content Area */}
          {stepIndex > 2 && (
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '1rem', animation: 'fadeIn 0.5s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <div style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
            </div>
          )}
          {/* Bottom Tabs/List */}
          {stepIndex > 3 && (
            <div style={{ display: 'flex', gap: '0.8rem', animation: 'fadeIn 0.5s ease', justifyContent: 'space-around', alignItems: 'flex-end', paddingBottom: '0.5rem' }}>
              <div style={{ flex: 1, height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
              <div style={{ flex: 1, height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
              <div style={{ flex: 1, height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
            </div>
          )}
        </div>
      </div>

      {isDone && (
        <div style={{ width: '100%', marginTop: '1rem', background: hexToRgba(accent, 0.1), border: `1px solid ${accent}`, padding: '1rem', borderRadius: '12px', textAlign: 'center', color: accent, fontWeight: 700 }}>
          {activity.success}
        </div>
      )}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

// --- Chapter 2-5: Storyboard Mapper ---
function MapperActivity({ activity, accent }) {
  const [fixedProblems, setFixedProblems] = useState([])
  const [selectedTool, setSelectedTool] = useState(null)
  const [errorId, setErrorId] = useState(null)

  const handleProblemClick = (probId, solution) => {
    if (fixedProblems.includes(probId)) return
    
    if (selectedTool === solution) {
      setFixedProblems([...fixedProblems, probId])
      setSelectedTool(null)
    } else if (selectedTool) {
      setErrorId(probId)
      setTimeout(() => setErrorId(null), 500)
    }
  }

  const isDone = fixedProblems.length === activity.problems.length

  return (
    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {activity.tools.map(tool => (
          <button
            key={tool}
            onClick={() => setSelectedTool(tool === selectedTool ? null : tool)}
            style={{
              padding: '0.8rem 1.2rem', borderRadius: '12px', cursor: 'pointer',
              background: selectedTool === tool ? accent : 'rgba(255,255,255,0.05)',
              border: `2px solid ${selectedTool === tool ? accent : 'rgba(255,255,255,0.2)'}`,
              color: selectedTool === tool ? '#041019' : '#fff', fontWeight: 700,
              transition: 'all 0.2s', boxShadow: selectedTool === tool ? `0 0 15px ${hexToRgba(accent, 0.4)}` : 'none'
            }}
          >
            {tool}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {activity.problems.map(prob => {
          const isFixed = fixedProblems.includes(prob.id)
          const isError = errorId === prob.id
          return (
            <div
              key={prob.id}
              onClick={() => handleProblemClick(prob.id, prob.solution)}
              className={isError ? 'jam-shake' : ''}
              style={{
                background: isFixed ? hexToRgba(accent, 0.1) : '#0a0f18',
                border: isFixed ? `1px solid ${accent}` : isError ? '1px solid #ff2d55' : '1px dashed rgba(255,255,255,0.2)',
                borderRadius: '16px', padding: '1.5rem', cursor: isFixed ? 'default' : selectedTool ? 'pointer' : 'default',
                transition: 'all 0.3s'
              }}
            >
              <div style={{ color: isFixed ? accent : isError ? '#ff2d55' : '#ff9a5c', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {isFixed ? '✓ Fixed' : '⚠️ Missing'}
              </div>
              <div style={{ color: isFixed ? '#fff' : '#c8c8e0', fontWeight: 500, lineHeight: 1.5 }}>
                {isFixed ? `Applied: ${prob.solution}` : prob.desc}
              </div>
            </div>
          )
        })}
      </div>

      {isDone && (
        <div style={{ width: '100%', marginTop: '1rem', background: hexToRgba(accent, 0.1), border: `1px solid ${accent}`, padding: '1.5rem', borderRadius: '12px', textAlign: 'center', color: accent, fontWeight: 700 }}>
          {activity.success}
        </div>
      )}
    </div>
  )
}

// --- Chapter 2-6: Widget Sorter Kiosk ---
function SorterActivity({ activity, accent }) {
  const [sorted, setSorted] = useState([])
  const [errorBucket, setErrorBucket] = useState(null)
  
  const pendingItems = activity.items.filter(item => !sorted.includes(item))
  const currentItem = pendingItems[0]
  const isDone = pendingItems.length === 0

  const handleBucketClick = (bucketId) => {
    if (isDone || !currentItem) return
    if (bucketId === currentItem.bucketId) {
      setSorted([...sorted, currentItem])
    } else {
      setErrorBucket(bucketId)
      setTimeout(() => setErrorBucket(null), 500)
    }
  }

  return (
    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
      
      {/* Current Item */}
      <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        {currentItem ? (
          <div style={{
            background: 'rgba(255,255,255,0.05)', border: `2px solid ${accent}`,
            padding: '1.5rem 3rem', borderRadius: '16px', fontSize: '1.5rem', fontWeight: 700, color: '#fff',
            boxShadow: `0 10px 30px ${hexToRgba(accent, 0.2)}`,
            animation: 'jamBounceIn 0.4s ease-out'
          }}>
            {currentItem.label}
          </div>
        ) : (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
            animation: 'jamBounceIn 0.6s ease-out'
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <div style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 600, letterSpacing: '0.02em', marginTop: '0.5rem' }}>
              Completion Verified
            </div>
            <div style={{ color: '#8892b0', fontSize: '1rem' }}>
              {activity.success}
            </div>
          </div>
        )}
      </div>

      {/* Buckets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', width: '100%' }}>
        {activity.buckets.map(bucket => {
          const isError = errorBucket === bucket.id
          const itemsInBucket = sorted.filter(s => s.bucketId === bucket.id).length
          return (
            <button
              key={bucket.id}
              onClick={() => handleBucketClick(bucket.id)}
              className={isError ? 'jam-shake' : ''}
              style={{
                background: isError ? 'rgba(255,45,85,0.1)' : 'rgba(255,255,255,0.03)',
                border: isError ? '2px solid #ff2d55' : '2px dashed rgba(255,255,255,0.15)',
                borderRadius: '16px', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center',
                cursor: 'pointer', transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!isDone && !isError) {
                  e.currentTarget.style.background = hexToRgba(accent, 0.1)
                  e.currentTarget.style.borderColor = accent
                }
              }}
              onMouseLeave={(e) => {
                if (!isDone && !isError) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                }
              }}
            >
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>{bucket.label}</div>
              <div style={{ color: '#c8c8e0', fontSize: '0.9rem' }}>{itemsInBucket} sorted</div>
            </button>
          )
        })}
      </div>

      <style>{`
        @keyframes jamBounceIn {
          0% { transform: scale(0.8) translateY(20px); opacity: 0; }
          60% { transform: scale(1.05) translateY(-5px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

// --- Chapter 2-7: Team Hub Distributor ---
function DistributorActivity({ activity, accent }) {
  const [routed, setRouted] = useState([])
  const [errorVault, setErrorVault] = useState(null)
  
  const pending = activity.resources.filter(r => !routed.includes(r))
  const current = pending[0]
  const isDone = pending.length === 0

  const handleVaultClick = (vaultId) => {
    if (isDone || !current) return
    if (vaultId === current.vaultId) {
      setRouted([...routed, current])
    } else {
      setErrorVault(vaultId)
      setTimeout(() => setErrorVault(null), 500)
    }
  }

  return (
    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Belt/Arrival */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '2rem', textAlign: 'center' }}>
        <div style={{ color: '#6f7890', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, fontSize: '0.85rem', marginBottom: '1rem' }}>
          Arriving Resource
        </div>
        {current ? (
          <div style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 500 }}>
            "{current.label}"
          </div>
        ) : (
          <div style={{ color: accent, fontSize: '1.5rem', fontWeight: 700 }}>{activity.success}</div>
        )}
      </div>

      {/* Vaults */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {activity.vaults.map(vault => {
          const isError = errorVault === vault.id
          const hasCount = routed.filter(r => r.vaultId === vault.id).length
          return (
            <button
              key={vault.id}
              onClick={() => handleVaultClick(vault.id)}
              className={isError ? 'jam-shake' : ''}
              style={{
                background: isError ? 'rgba(255,45,85,0.1)' : 'rgba(255,255,255,0.05)',
                border: isError ? '2px solid #ff2d55' : `1px solid ${vault.color}`,
                borderTop: `6px solid ${vault.color}`,
                borderRadius: '12px', padding: '1.5rem', cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', flexDirection: 'column', alignItems: 'center'
              }}
              onMouseEnter={e => {
                if (!isDone && !isError) e.currentTarget.style.background = hexToRgba(vault.color, 0.1)
              }}
              onMouseLeave={e => {
                if (!isDone && !isError) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
              }}
            >
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{vault.label}</div>
              <div style={{ color: vault.color, fontWeight: 700, fontSize: '1.5rem' }}>{hasCount}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// --- Chapter 2-8: Hierarchy Elevator ---
function ElevatorActivity({ activity, accent }) {
  const [placed, setPlaced] = useState([])
  const [errorFloor, setErrorFloor] = useState(null)
  
  const pending = activity.items.filter(i => !placed.includes(i))
  const currentItem = pending[0]
  const isDone = pending.length === 0

  const handleFloorClick = (floorId) => {
    if (isDone || !currentItem) return
    if (floorId === currentItem.floorId) {
      setPlaced([...placed, currentItem])
    } else {
      setErrorFloor(floorId)
      setTimeout(() => setErrorFloor(null), 500)
    }
  }

  return (
    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap-reverse' }}>
      
      {/* Elevator Panel */}
      <div style={{ flex: '1 1 300px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ color: '#6f7890', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, fontSize: '0.85rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          Current Item
        </div>
        {currentItem ? (
          <div style={{ background: '#0a0f18', border: `1px solid ${accent}`, borderRadius: '12px', padding: '2rem', textAlign: 'center', color: '#fff', fontSize: '1.25rem', fontWeight: 500 }}>
            {currentItem.label}
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: accent, fontSize: '1.25rem', fontWeight: 700, padding: '2rem' }}>
            {activity.success}
          </div>
        )}
      </div>

      {/* Building Floors */}
      <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column-reverse', gap: '0.5rem' }}>
        {activity.floors.map((floor, index) => {
          const isError = errorFloor === floor.id
          const hasItem = placed.some(p => p.floorId === floor.id)
          return (
            <button
              key={floor.id}
              onClick={() => handleFloorClick(floor.id)}
              className={isError ? 'jam-shake' : ''}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem',
                background: isError ? 'rgba(255,45,85,0.1)' : hasItem ? hexToRgba(accent, 0.15) : 'rgba(255,255,255,0.05)',
                border: isError ? '2px solid #ff2d55' : hasItem ? `1px solid ${accent}` : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s',
                borderBottom: index === 0 ? '4px solid rgba(255,255,255,0.2)' : undefined
              }}
              onMouseEnter={e => {
                if (!isDone && !isError && !hasItem) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
              }}
              onMouseLeave={e => {
                if (!isDone && !isError && !hasItem) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
              }}
            >
              <div style={{ fontSize: '1.5rem' }}>{floor.icon}</div>
              <div style={{ color: hasItem ? '#fff' : '#c8c8e0', fontWeight: 700, fontSize: '1.1rem', flex: 1, textAlign: 'left' }}>{floor.label}</div>
              {hasItem && <div style={{ color: accent, fontWeight: 700 }}>✓</div>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// --- Chapter 3-1: Setup Wizard Console ---
function SetupConsoleActivity({ activity, accent }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [logs, setLogs] = useState(['$ flutterflow init', 'Waiting for system command...'])
  const [errorStep, setErrorStep] = useState(null)

  const expectedId = activity.correctSequence[stepIndex]
  const isDone = stepIndex === activity.correctSequence.length

  const handleCommand = (step) => {
    if (isDone) return
    if (step.id === expectedId) {
      setLogs([...logs, `$ ${step.label}`, `> ${step.log}`])
      setStepIndex(prev => prev + 1)
    } else {
      setErrorStep(step.id)
      setLogs([...logs, `$ ${step.label}`, `> ERROR: Command executed out of order. Expected: ${activity.steps.find(s => s.id === expectedId).label}`])
      setTimeout(() => setErrorStep(null), 500)
    }
  }

  return (
    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap-reverse' }}>
      
      {/* Console Output */}
      <div style={{
        flex: '1 1 300px', background: '#0a0f18', borderRadius: '12px', padding: '1.5rem',
        border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'monospace', height: '320px',
        overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem'
      }}>
        {logs.map((log, i) => (
          <div key={i} style={{ color: log.startsWith('>') ? log.includes('ERROR') ? '#ff2d55' : accent : '#c8c8e0', fontSize: '0.9rem' }}>
            {log}
          </div>
        ))}
        {isDone && (
          <div style={{ color: accent, marginTop: '1rem', fontWeight: 700, padding: '1rem', background: hexToRgba(accent, 0.1), borderRadius: '8px' }}>
            {activity.success}
          </div>
        )}
      </div>

      {/* Control Panel */}
      <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ color: '#6f7890', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
          Available Commands
        </div>
        {activity.steps.map(step => {
          const isError = errorStep === step.id
          const isCompleted = stepIndex > activity.correctSequence.indexOf(step.id)
          return (
            <button
              key={step.id}
              onClick={() => handleCommand(step)}
              className={isError ? 'jam-shake' : ''}
              disabled={isCompleted}
              style={{
                fontFamily: 'monospace', textAlign: 'left', padding: '1rem', borderRadius: '8px',
                background: isError ? 'rgba(255,45,85,0.1)' : isCompleted ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                border: isError ? '1px solid #ff2d55' : isCompleted ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(255,255,255,0.15)',
                color: isError ? '#ff2d55' : isCompleted ? '#6f7890' : '#fff', cursor: isCompleted ? 'default' : 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => {
                if (!isDone && !isError && !isCompleted) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
              }}
              onMouseLeave={e => {
                if (!isDone && !isError && !isCompleted) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
              }}
            >
              $ {step.label} {isCompleted && <span style={{ float: 'right', color: accent }}>✓</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// --- Chapter 3-2: Scope Radar Rings ---
function ScopeRingsActivity({ activity, accent }) {
  const [placed, setPlaced] = useState([])
  const [errorRing, setErrorRing] = useState(null)

  const pending = activity.items.filter(i => !placed.includes(i))
  const currentItem = pending[0]
  const isDone = pending.length === 0

  const handleRingClick = (ringId) => {
    if (isDone || !currentItem) return
    if (ringId === currentItem.ringId) {
      setPlaced([...placed, currentItem])
    } else {
      setErrorRing(ringId)
      setTimeout(() => setErrorRing(null), 500)
    }
  }

  return (
    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
      
      {/* Current Payload */}
      <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: '600px' }}>
        {currentItem ? (
          <div style={{
            background: 'rgba(255,255,255,0.05)', border: `1px solid ${accent}`, padding: '1.5rem 3rem',
            borderRadius: '99px', fontSize: '1.25rem', fontWeight: 700, color: '#fff',
            boxShadow: `0 0 20px ${hexToRgba(accent, 0.2)}`, animation: 'jamBounceIn 0.4s ease-out'
          }}>
            {currentItem.label}
          </div>
        ) : (
          <div style={{ color: accent, fontSize: '1.25rem', fontWeight: 700, textAlign: 'center' }}>
            {activity.success}
          </div>
        )}
      </div>

      {/* Radar */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '500px', aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {activity.rings.map((ring, index) => {
          const isError = errorRing === ring.id
          const hasItem = placed.some(p => p.ringId === ring.id)
          return (
            <div
              key={ring.id}
              onClick={() => handleRingClick(ring.id)}
              className={isError ? 'jam-shake' : ''}
              style={{
                position: 'absolute', width: `${ring.radius}%`, height: `${ring.radius}%`,
                borderRadius: '50%', border: isError ? '3px solid #ff2d55' : hasItem ? `3px solid ${accent}` : '2px dashed rgba(255,255,255,0.2)',
                background: isError ? 'rgba(255,45,85,0.05)' : hasItem ? hexToRgba(accent, 0.05) : 'transparent',
                cursor: currentItem ? 'pointer' : 'default', transition: 'all 0.3s',
                display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '1%'
              }}
              onMouseEnter={(e) => {
                if (!isDone && !isError) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                  e.currentTarget.style.borderStyle = 'solid'
                }
              }}
              onMouseLeave={(e) => {
                if (!isDone && !isError) {
                  e.currentTarget.style.background = hasItem ? hexToRgba(accent, 0.05) : 'transparent'
                  e.currentTarget.style.borderStyle = hasItem ? 'solid' : 'dashed'
                }
              }}
            >
              <div style={{
                background: hasItem ? accent : '#1a2235', color: hasItem ? '#000' : '#c8c8e0', padding: '0.2rem 0.8rem',
                borderRadius: '99px', fontSize: '0.8rem', fontWeight: 700, marginTop: '-12px', pointerEvents: 'none'
              }}>
                {ring.label}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// --- Chapter 3-3: Utility Toolbelt ---
function ToolbeltActivity({ activity, accent }) {
  const [currentTicket, setCurrentTicket] = useState(0)
  const [isDone, setIsDone] = useState(false)
  const [errorTool, setErrorTool] = useState(null)

  const ticket = activity.tickets[currentTicket]

  const handleToolClick = (toolId) => {
    if (isDone) return
    if (toolId === ticket.answer) {
      if (currentTicket < activity.tickets.length - 1) {
        setCurrentTicket(prev => prev + 1)
      } else {
        setIsDone(true)
      }
    } else {
      setErrorTool(toolId)
      setTimeout(() => setErrorTool(null), 500)
    }
  }

  return (
    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
      
      {/* Workbench Ticket */}
      <div style={{
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1rem'
      }}>
        <div style={{ color: '#6f7890', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
          Ticket {currentTicket + 1} of {activity.tickets.length}
        </div>
        <div style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 500, lineHeight: 1.5 }}>
          "{ticket.prompt}"
        </div>
      </div>

      {/* Toolbelt */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {activity.tools.map(tool => {
          const isError = errorTool === tool.id
          return (
            <button
              key={tool.id}
              onClick={() => handleToolClick(tool.id)}
              className={isError ? 'jam-shake' : ''}
              style={{
                background: isError ? 'rgba(255,45,85,0.1)' : 'rgba(255,255,255,0.05)',
                border: isError ? '2px solid #ff2d55' : '2px solid rgba(255,255,255,0.1)',
                borderRadius: '16px', padding: '1.5rem', minWidth: '140px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
                cursor: 'pointer', transition: 'all 0.2s'
              }}
              onMouseEnter={e => {
                if (!isDone && !isError) e.currentTarget.style.borderColor = accent
              }}
              onMouseLeave={e => {
                if (!isDone && !isError) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              }}
            >
              <div style={{ fontSize: '2.5rem' }}>{tool.icon}</div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>{tool.label}</div>
            </button>
          )
        })}
      </div>

      {isDone && (
        <div style={{ width: '100%', maxWidth: '600px', background: hexToRgba(accent, 0.1), border: `1px solid ${accent}`, padding: '1.5rem', borderRadius: '12px', textAlign: 'center', color: accent, fontWeight: 700 }}>
          {activity.success}
        </div>
      )}
    </div>
  )
}

// --- 3D Helpers ---
// --- 3D Helpers ---
function GlowSphere({ position, color, scale = 0.2, pulse, withSparkles = false }) {
  const meshRef = useRef()
  useFrame((state) => {
    if (meshRef.current && pulse) {
      meshRef.current.scale.setScalar(scale + Math.sin(state.clock.elapsedTime * 4) * (scale * 0.15))
    }
  })
  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[scale, 32, 32]} />
        <meshPhysicalMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={pulse ? 1.5 : 0.4} 
          transmission={0.8}
          roughness={0.1}
          thickness={0.5}
        />
      </mesh>
      {withSparkles && (
        <Sparkles count={pulse ? 30 : 5} scale={scale * 3} size={1} color={color} speed={0.5} opacity={pulse ? 1 : 0.2} />
      )}
    </group>
  )
}

function GitPipe({ start, end, color }) {
  const points = useMemo(() => [new THREE.Vector3(...start), new THREE.Vector3(...end)], [start, end])
  const lineGeom = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points])
  return (
    <line geometry={lineGeom}>
      <lineBasicMaterial color={color} linewidth={3} transparent opacity={0.6} />
    </line>
  )
}

function GlowingDataDisk({ position, color, speed = 2 }) {
  const ref = useRef()
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * speed * 0.5
      ref.current.rotation.y += delta * speed
    }
  })
  return (
    <group position={position}>
      <mesh ref={ref}>
        <octahedronGeometry args={[0.3, 0]} />
        <meshPhysicalMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={0.6}
          roughness={0} 
          metalness={0.8} 
          transmission={0.9} 
          thickness={0.2}
          clearcoat={1}
        />
      </mesh>
      <Sparkles count={20} scale={0.8} size={2} color={color} opacity={0.8} speed={1.5} />
    </group>
  )
}

function ServerRack3D({ position, color, label, filled, onClick }) {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * 0.05
    }
  })
  
  return (
    <group ref={ref} position={position} onClick={onClick}>
      <RoundedBox args={[1.2, 1.8, 0.7]} radius={0.08} smoothness={4}>
        <meshPhysicalMaterial
          color={'#151a28'}
          roughness={0.3}
          metalness={0.8}
          clearcoat={0.5}
        />
      </RoundedBox>
      {/* Front glowing plate */}
      <mesh position={[0, 0, 0.36]}>
        <planeGeometry args={[1.05, 1.65]} />
        <meshPhysicalMaterial
          color={filled ? color : '#0a0d14'}
          emissive={filled ? color : '#000'}
          emissiveIntensity={filled ? 0.8 : 0}
          transmission={0.9}
          roughness={0.1}
          opacity={0.8}
          transparent
        />
      </mesh>
      {/* LED indicators */}
      {[0.5, 0.2, -0.1, -0.4].map((y, i) => (
        <mesh key={i} position={[0.45, y, 0.38]}>
          <boxGeometry args={[0.06, 0.02, 0.02]} />
          <meshStandardMaterial color={filled ? '#fff' : '#444'} emissive={filled ? color : '#000'} emissiveIntensity={filled ? 2 : 0} />
        </mesh>
      ))}
      <Text position={[0, -1.2, 0]} fontSize={0.18} color={color} anchorX="center" anchorY="middle" font={undefined}>
        {label}
      </Text>
    </group>
  )
}

function LaunchPad3D({ position, color, active, onClick, label }) {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current && active) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 4) * 0.1
    }
  })
  return (
    <group ref={ref} position={position} onClick={onClick}>
      <mesh>
        <cylinderGeometry args={[0.5, 0.6, 0.3, 32]} />
        <meshPhysicalMaterial color={'#151a28'} metalness={0.8} roughness={0.2} clearcoat={1} />
      </mesh>
      <mesh position={[0, 0.45, 0]}>
        <coneGeometry args={[0.25, 0.7, 32]} />
        <meshPhysicalMaterial
          color={active ? color : '#1a2235'}
          emissive={active ? color : '#000'}
          emissiveIntensity={active ? 1.5 : 0}
          transmission={0.8}
          roughness={0.1}
          thickness={0.5}
          clearcoat={1}
        />
      </mesh>
      {active && <Sparkles position={[0, -0.1, 0]} count={10} scale={1} size={1} color={color} speed={2} opacity={0.6} />}
      <Text position={[0, -0.4, 0]} fontSize={0.15} color={color} anchorX="center" anchorY="middle" font={undefined}>
        {label}
      </Text>
    </group>
  )
}

// --- Chapter 4-1: Git Graph Builder (3D) ---
function BranchGraphActivity({ activity, accent }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [errorStep, setErrorStep] = useState(null)

  const handleStepClick = (stepId) => {
    if (stepIndex === activity.correctSequence.length) return
    const expectedId = activity.correctSequence[stepIndex]
    if (stepId === expectedId) {
      setStepIndex(prev => prev + 1)
    } else {
      setErrorStep(stepId)
      setTimeout(() => setErrorStep(null), 500)
    }
  }

  const isDone = stepIndex === activity.correctSequence.length

  // Node positions for git graph
  const mainNodes = [[-2.5, 0, 0], [-1, 0, 0], [1, 0, 0], [2.5, 0, 0]]
  const branchNodes = [[-0.5, 1.2, 0], [1, 1.2, 0]]

  return (
    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      <div style={{ flex: '1 1 350px', height: '420px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
        <Canvas camera={{ position: [0, 0.5, 5], fov: 45 }}>
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <pointLight position={[3, 3, 3]} intensity={1.5} color="#ffffff" />
          <pointLight position={[-3, -1, 2]} intensity={1} color={accent} />

          <group position={[0, -0.2, 0]}>
            {/* Main branch line */}
            <GitPipe start={[-3, 0, 0]} end={[3, 0, 0]} color="#4f5973" />
            
            {/* Main nodes (always visible) */}
            {mainNodes.map((pos, i) => (
              <GlowSphere key={`m${i}`} position={pos} color={i < 2 ? accent : stepIndex >= 5 ? accent : '#4f5973'} scale={0.15} withSparkles={i < 2 || stepIndex >= 5} />
            ))}
            
            {/* Branch fork (visible after step 1) */}
            {stepIndex >= 1 && <GitPipe start={[-1, 0, 0]} end={[-0.5, 1.2, 0]} color={accent} />}
            
            {/* Branch line */}
            {stepIndex >= 2 && <GitPipe start={[-0.5, 1.2, 0]} end={[1, 1.2, 0]} color={accent} />}
            
            {/* Branch nodes */}
            {stepIndex >= 1 && <GlowSphere position={branchNodes[0]} color={accent} scale={0.12} pulse withSparkles />}
            {stepIndex >= 4 && <GlowSphere position={branchNodes[1]} color="#86ffb7" scale={0.15} withSparkles />}
            
            {/* Merge line */}
            {stepIndex >= 5 && <GitPipe start={[1, 1.2, 0]} end={[1, 0, 0]} color="#86ffb7" />}
            
            {/* Floating label */}
            <Text position={[0, -0.8, 0]} fontSize={0.15} color="#6f7890" font={undefined}>
              main
            </Text>
            {stepIndex >= 1 && (
              <Text position={[0.25, 1.7, 0]} fontSize={0.15} color={accent} font={undefined}>
                feature
              </Text>
            )}
          </group>

          <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      <div style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {activity.steps.map(step => {
          let isCompleted = false
          if (!step.decoy) {
            const idx = activity.correctSequence.indexOf(step.id)
            isCompleted = idx > -1 && stepIndex > idx
          }
          const isError = errorStep === step.id
          return (
            <button
              key={step.id}
              onClick={() => handleStepClick(step.id)}
              className={isError ? 'jam-shake' : ''}
              disabled={isCompleted}
              style={{
                padding: '0.85rem 1rem', borderRadius: '12px', textAlign: 'left',
                background: isError ? 'rgba(255,45,85,0.1)' : isCompleted ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                border: isError ? '1px solid #ff2d55' : isCompleted ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(255,255,255,0.15)',
                color: isError ? '#ff2d55' : isCompleted ? '#6f7890' : '#fff',
                cursor: isCompleted ? 'default' : 'pointer', transition: 'all 0.2s'
              }}
            >
              <div style={{ fontWeight: 700 }}>{step.label} {isCompleted && <span style={{ float: 'right', color: accent }}>Done</span>}</div>
              <div style={{ fontSize: '0.8rem', color: '#6f7890', marginTop: '0.2rem' }}>{step.desc}</div>
            </button>
          )
        })}
        {isDone && (
          <div style={{ marginTop: '0.5rem', background: hexToRgba(accent, 0.1), border: `1px solid ${accent}`, padding: '1rem', borderRadius: '12px', textAlign: 'center', color: accent, fontWeight: 700 }}>
            {activity.success}
          </div>
        )}
      </div>
    </div>
  )
}

// --- Chapter 4-2: Time Machine Console (3D) ---
function TimeMachineActivity({ activity, accent }) {
  const [currentCrisis, setCurrentCrisis] = useState(0)
  const [isDone, setIsDone] = useState(false)
  const [errorTool, setErrorTool] = useState(null)

  const crisis = activity.crises[currentCrisis]

  const handleToolClick = (toolId) => {
    if (isDone) return
    if (toolId === crisis.answer) {
      if (currentCrisis < activity.crises.length - 1) {
        setCurrentCrisis(prev => prev + 1)
      } else {
        setIsDone(true)
      }
    } else {
      setErrorTool(toolId)
      setTimeout(() => setErrorTool(null), 500)
    }
  }

  return (
    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      <div style={{ flex: '1 1 350px', height: '420px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
        <Canvas camera={{ position: [0, 0, 4.5], fov: 50 }}>
          <Environment preset="city" />
          <ambientLight intensity={0.4} />
          <pointLight position={[2, 4, 3]} intensity={1.5} color="#fff" />
          <pointLight position={[-2, -2, 2]} intensity={1} color={accent} />

          {/* Timeline spine */}
          <group position={[0, -0.5, 0]}>
            <GitPipe start={[-3, 0, 0]} end={[3, 0, 0]} color="#4f5973" />
            
            {/* Timeline nodes */}
            {[-2, -0.7, 0.7, 2].map((x, i) => {
              const isActive = i <= (isDone ? 4 : currentCrisis % 4)
              return (
                <Float key={i} speed={2} rotationIntensity={0} floatIntensity={0.3}>
                  <GlowSphere position={[x, 0, 0]} color={isActive ? accent : '#4f5973'} scale={0.12 + (i === currentCrisis ? 0.05 : 0)} pulse={i === currentCrisis} withSparkles={isActive} />
                </Float>
              )
            })}
          </group>

          {/* Majestic Time Crystal */}
          <Float speed={2} rotationIntensity={0.8} floatIntensity={0.8}>
            <group position={[0, 1.2, 0]}>
              <mesh>
                <torusKnotGeometry args={[0.5, 0.1, 100, 16]} />
                <meshPhysicalMaterial 
                  color={'#fff'} 
                  transmission={1} 
                  roughness={0} 
                  thickness={1.5} 
                  ior={1.5} 
                  clearcoat={1}
                />
              </mesh>
              <mesh>
                <sphereGeometry args={[0.3, 32, 32]} />
                <meshPhysicalMaterial color={accent} emissive={accent} emissiveIntensity={isDone ? 2 : 0.8} roughness={0} transmission={0.5} />
              </mesh>
              {isDone && <Sparkles count={40} scale={2.5} size={2} color={accent} speed={2} />}
            </group>
          </Float>

          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
        </Canvas>
      </div>

      <div style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px', padding: '1.5rem'
        }}>
          <div style={{ color: '#6f7890', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '0.5rem' }}>
            Crisis {currentCrisis + 1} of {activity.crises.length}
          </div>
          <div style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 500, lineHeight: 1.5 }}>
            {crisis.prompt}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {activity.tools.map(tool => {
            const isError = errorTool === tool.id
            return (
              <button
                key={tool.id}
                onClick={() => handleToolClick(tool.id)}
                className={isError ? 'jam-shake' : ''}
                style={{
                  padding: '0.85rem 1rem', borderRadius: '10px', textAlign: 'left',
                  background: isError ? 'rgba(255,45,85,0.1)' : 'rgba(255,255,255,0.05)',
                  border: isError ? '1px solid #ff2d55' : '1px solid rgba(255,255,255,0.12)',
                  color: isError ? '#ff2d55' : '#fff', cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                <div style={{ fontWeight: 700 }}>{tool.label}</div>
                <div style={{ fontSize: '0.78rem', color: '#6f7890', marginTop: '0.2rem' }}>{tool.desc}</div>
              </button>
            )
          })}
        </div>

        {isDone && (
          <div style={{ background: hexToRgba(accent, 0.1), border: `1px solid ${accent}`, padding: '1rem', borderRadius: '12px', textAlign: 'center', color: accent, fontWeight: 700 }}>
            {activity.success}
          </div>
        )}
      </div>
    </div>
  )
}

// --- Chapter 4-3: Server Rack Deployer (3D) ---
function ServerDeployActivity({ activity, accent }) {
  const [routed, setRouted] = useState([])
  const [errorRack, setErrorRack] = useState(null)

  const pending = activity.disks.filter(d => !routed.includes(d))
  const current = pending[0]
  const isDone = pending.length === 0

  const handleRackClick = (rackId) => {
    if (isDone || !current) return
    if (rackId === current.rackId) {
      setRouted([...routed, current])
    } else {
      setErrorRack(rackId)
      setTimeout(() => setErrorRack(null), 500)
    }
  }

  return (
    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px', padding: '1.5rem', textAlign: 'center'
      }}>
        <div style={{ color: '#6f7890', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
          Deploy Config Target
        </div>
        {current ? (
          <div style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 500 }}>"{current.label}"</div>
        ) : (
          <div style={{ color: accent, fontSize: '1.25rem', fontWeight: 700 }}>{activity.success}</div>
        )}
      </div>

      <div style={{ height: '420px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', cursor: current ? 'crosshair' : 'default' }}>
        <Canvas camera={{ position: [0, 1.5, 6.5], fov: 45 }}>
          <Environment preset="city" />
          <ambientLight intensity={0.4} />
          <pointLight position={[3, 5, 4]} intensity={2} color="#fff" />
          <pointLight position={[-3, -2, 2]} intensity={1} color={accent} />

          <group position={[0, -0.5, 0]}>
            {activity.racks.map((rack, i) => {
              const x = (i - 1) * 2.4
              const filled = routed.filter(r => r.rackId === rack.id).length
              return (
                <ServerRack3D
                  key={rack.id}
                  position={[x, 0, 0]}
                  color={rack.color}
                  label={rack.label}
                  filled={filled > 0}
                  onClick={() => handleRackClick(rack.id)}
                />
              )
            })}
          </group>

          {/* Floating glowing disk */}
          {current && (
            <Float speed={4} rotationIntensity={0.8} floatIntensity={0.6}>
              <GlowingDataDisk position={[0, 2.5, 0]} color={accent} speed={3} />
            </Float>
          )}

          <ContactShadows position={[0, -1.8, 0]} opacity={0.6} scale={12} blur={2.5} far={4} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} />
        </Canvas>
      </div>
    </div>
  )
}

// --- Chapter 4-4: Launchpad Selector (3D) ---
function LaunchpadActivity({ activity, accent }) {
  const [currentScenario, setCurrentScenario] = useState(0)
  const [isDone, setIsDone] = useState(false)
  const [errorMode, setErrorMode] = useState(null)

  const scenario = activity.scenarios[currentScenario]

  const handleModeClick = (modeId) => {
    if (isDone) return
    if (modeId === scenario.answer) {
      if (currentScenario < activity.scenarios.length - 1) {
        setCurrentScenario(prev => prev + 1)
      } else {
        setIsDone(true)
      }
    } else {
      setErrorMode(modeId)
      setTimeout(() => setErrorMode(null), 500)
    }
  }

  const modeColors = { preview: '#86ffb7', test: '#ffd166', run: '#61a8ff', local: '#ff9a5c' }

  return (
    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      <div style={{ flex: '1 1 350px', height: '420px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
        <Canvas camera={{ position: [0, 2.5, 7], fov: 45 }}>
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <pointLight position={[3, 5, 3]} intensity={1.5} />
          <pointLight position={[-3, -1, 2]} intensity={1} color={accent} />

          <group position={[0, -0.5, 0]}>
            {/* Grand Launch Platform */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
              <ringGeometry args={[1.2, 2.5, 64]} />
              <meshPhysicalMaterial color="#111622" metalness={0.9} roughness={0.1} clearcoat={1} side={THREE.DoubleSide} />
            </mesh>

            {/* Glowing rings */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.19, 0]}>
              <ringGeometry args={[1.3, 1.35, 64]} />
              <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.5} />
            </mesh>

            {/* 4 launch rockets */}
            {activity.modes.map((mode, i) => {
              const angle = (i / 4) * Math.PI * 2 - Math.PI / 4
              const x = Math.cos(angle) * 1.85
              const z = Math.sin(angle) * 1.85
              const isActive = isDone ? true : (currentScenario > i || currentScenario === activity.scenarios.length - 1)
              return (
                <LaunchPad3D
                  key={mode.id}
                  position={[x, 0, z]}
                  color={modeColors[mode.id] || accent}
                  active={isActive || mode.id === scenario.answer} // Light up if correct so far, or if user clicked
                  onClick={() => handleModeClick(mode.id)}
                  label={mode.label}
                />
              )
            })}

            {/* Majestic Center Core */}
            <Float speed={3} floatIntensity={0.8} rotationIntensity={0.5}>
              <group position={[0, 1.5, 0]}>
                <mesh>
                  <icosahedronGeometry args={[0.5, 1]} />
                  <MeshDistortMaterial
                    color={accent}
                    emissive={accent}
                    emissiveIntensity={isDone ? 2 : 0.6}
                    speed={isDone ? 5 : 2}
                    distort={isDone ? 0.6 : 0.3}
                  />
                </mesh>
                <mesh scale={1.2}>
                  <icosahedronGeometry args={[0.5, 0]} />
                  <meshPhysicalMaterial color={'#fff'} transmission={1} wireframe thickness={2} roughness={0} />
                </mesh>
                {isDone && <Sparkles count={50} scale={3} size={2} color={accent} speed={3} />}
              </group>
            </Float>
          </group>

          <ContactShadows position={[0, -1, 0]} opacity={0.7} scale={15} blur={2.5} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={isDone ? 3 : 0.4} />
        </Canvas>
      </div>

      <div style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px', padding: '1.5rem'
        }}>
          <div style={{ color: '#6f7890', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '0.5rem' }}>
            Mission {currentScenario + 1} of {activity.scenarios.length}
          </div>
          <div style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 500, lineHeight: 1.5 }}>
            {scenario.prompt}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {activity.modes.map(mode => {
            const isError = errorMode === mode.id
            const col = modeColors[mode.id] || accent
            return (
              <button
                key={mode.id}
                onClick={() => handleModeClick(mode.id)}
                className={isError ? 'jam-shake' : ''}
                style={{
                  padding: '0.85rem 1rem', borderRadius: '10px', textAlign: 'left',
                  background: isError ? 'rgba(255,45,85,0.1)' : 'rgba(255,255,255,0.05)',
                  border: isError ? '1px solid #ff2d55' : `1px solid ${hexToRgba(col, 0.3)}`,
                  color: isError ? '#ff2d55' : '#fff', cursor: 'pointer', transition: 'all 0.2s',
                  borderLeft: `4px solid ${col}`
                }}
              >
                <div style={{ fontWeight: 700 }}>{mode.label}</div>
                <div style={{ fontSize: '0.78rem', color: '#6f7890', marginTop: '0.2rem' }}>{mode.desc}</div>
              </button>
            )
          })}
        </div>

        {isDone && (
          <div style={{ background: hexToRgba(accent, 0.1), border: `1px solid ${accent}`, padding: '1rem', borderRadius: '12px', textAlign: 'center', color: accent, fontWeight: 700 }}>
            {activity.success}
          </div>
        )}
      </div>
    </div>
  )
}

function ActivityBody({ activity, accent }) {
  if (activity.type === 'quiz') return <QuizActivity activity={activity} accent={accent} />
  if (activity.type === 'sort') return <SortActivity activity={activity} accent={accent} />
  if (activity.type === 'dragdrop') return <DragDropActivity activity={activity} accent={accent} />
  if (activity.type === 'matchup') return <MatchUpActivity activity={activity} accent={accent} />
  if (activity.type === 'sequence') return <SequenceActivity activity={activity} accent={accent} />
  if (activity.type === 'wheel') return <WheelActivity activity={activity} accent={accent} />
  if (activity.type === 'pipeline_3d') return <PipelineActivity3D activity={activity} accent={accent} />
  if (activity.type === 'xray_3d') return <XRayActivity3D activity={activity} accent={accent} />
  if (activity.type === 'journey_3d') return <JourneyActivity3D activity={activity} accent={accent} />
  if (activity.type === 'dashboard') return <DashboardActivity activity={activity} accent={accent} />
  if (activity.type === 'circuit') return <CircuitActivity activity={activity} accent={accent} />
  if (activity.type === 'toolbar') return <ToolbarActivity activity={activity} accent={accent} />
  if (activity.type === 'wireframe') return <WireframeActivity activity={activity} accent={accent} />
  if (activity.type === 'mapper') return <MapperActivity activity={activity} accent={accent} />
  if (activity.type === 'sorter') return <SorterActivity activity={activity} accent={accent} />
  if (activity.type === 'distributor') return <DistributorActivity activity={activity} accent={accent} />
  if (activity.type === 'elevator') return <ElevatorActivity activity={activity} accent={accent} />
  if (activity.type === 'setup_console') return <SetupConsoleActivity activity={activity} accent={accent} />
  if (activity.type === 'scope_rings') return <ScopeRingsActivity activity={activity} accent={accent} />
  if (activity.type === 'toolbelt') return <ToolbeltActivity activity={activity} accent={accent} />
  if (activity.type === 'branch_graph') return <BranchGraphActivity activity={activity} accent={accent} />
  if (activity.type === 'time_machine') return <TimeMachineActivity activity={activity} accent={accent} />
  if (activity.type === 'server_deploy') return <ServerDeployActivity activity={activity} accent={accent} />
  if (activity.type === 'launchpad') return <LaunchpadActivity activity={activity} accent={accent} />
  return null
}

export default function ChapterActivities({ chapterId }) {
  const config = chapterActivities[chapterId]

  if (!config) return null

  const activity = config.activity
  const visual = activityVisuals[activity.visualKind] || activityVisuals.build

  return (
    <section
      style={{
        padding: '2.5rem 0 3rem',
        background: `radial-gradient(circle at top right, ${hexToRgba(config.accent, 0.14)} 0%, rgba(7,12,24,0) 44%)`,
      }}
    >
      <div className="wrap">
        <div style={{ display: 'grid', gap: '0.85rem', maxWidth: '760px' }}>
          <span
            style={{
              width: 'max-content',
              padding: '0.4rem 0.9rem',
              borderRadius: '999px',
              fontSize: '0.72rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: config.accent,
              border: `1px solid ${hexToRgba(config.accent, 0.3)}`,
              background: hexToRgba(config.accent, 0.08),
              fontWeight: 700,
            }}
          >
            Interactive Chapter Activity
          </span>
          <h2
            style={{
              margin: 0,
              color: '#fff',
              fontSize: 'clamp(2rem, 3vw, 2.7rem)',
              lineHeight: 1.1,
            }}
          >
            Test What You Learned
          </h2>
          <p style={{ margin: 0, color: '#c8c8e0', lineHeight: 1.8, fontSize: '1rem' }}>
            {config.subtitle}
          </p>
        </div>

        <div
          className="chapter-card"
          style={{
            marginTop: '1.75rem',
            padding: '1.4rem',
            borderRadius: '28px',
            background: `linear-gradient(180deg, ${hexToRgba(visual.accent, 0.12)} 0%, rgba(8,12,26,0.97) 100%)`,
            border: `1px solid ${hexToRgba(visual.accent, 0.28)}`,
            boxShadow: `0 20px 48px ${hexToRgba(visual.accent, 0.12)}`,
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(120px, 160px) 1fr',
              gap: '1.25rem',
              alignItems: 'center',
              marginBottom: '1.4rem',
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '160px',
                borderRadius: '22px',
                overflow: 'hidden',
                border: `1px solid ${hexToRgba(visual.accent, 0.38)}`,
                background: hexToRgba(visual.accent, 0.08),
              }}
            >
              <ActivityArtwork kind={activity.visualKind} title={`${activity.title} illustration`} />
            </div>

            <div style={{ display: 'grid', gap: '0.55rem' }}>
              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                <span
                  style={{
                    padding: '0.35rem 0.7rem',
                    borderRadius: '999px',
                    fontSize: '0.72rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: visual.accent,
                    border: `1px solid ${hexToRgba(visual.accent, 0.32)}`,
                    background: hexToRgba(visual.accent, 0.08),
                    fontWeight: 700,
                  }}
                >
                  {getActivityTypeLabel(activity.type)}
                </span>
                <span
                  style={{
                    padding: '0.35rem 0.7rem',
                    borderRadius: '999px',
                    fontSize: '0.74rem',
                    color: '#d7d7ea',
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: 'rgba(255,255,255,0.03)',
                    fontWeight: 600,
                  }}
                >
                  Interactive
                </span>
              </div>
              <h3 style={{ margin: 0, color: '#fff', fontSize: '1.45rem', lineHeight: 1.25 }}>{activity.title}</h3>
              <p style={{ margin: 0, color: '#c8c8e0', lineHeight: 1.75 }}>{activity.instructions}</p>
            </div>
          </div>

          <ActivityBody key={chapterId} activity={activity} accent={visual.accent} />
        </div>
      </div>
    </section>
  )
}
