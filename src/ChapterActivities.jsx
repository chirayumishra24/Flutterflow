import { useState, useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox, Text, OrbitControls, Float, MeshDistortMaterial, Environment, ContactShadows, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import confetti from 'canvas-confetti'
import { AnimatePresence, motion } from 'framer-motion'

function CelebrationOverlay({ active, title = "Perfect Score!" }) {
  useEffect(() => {
    if (active) {
      const duration = 5000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#00f5d4', '#7b2ff7', '#86ffb7', '#ff9a5c']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#00f5d4', '#7b2ff7', '#86ffb7', '#ff9a5c']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [active]);

  if (!active) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(4, 13, 20, 0.4)', backdropFilter: 'blur(3px)',
      animation: 'fadeIn 0.5s ease-out'
    }}>
      <div style={{
        background: 'rgba(134, 255, 183, 0.15)', border: '2px solid #86ffb7',
        padding: '2rem 4rem', borderRadius: '24px', textAlign: 'center',
        boxShadow: '0 20px 60px rgba(134, 255, 183, 0.2)',
        animation: 'jamBounceIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1.2)'
      }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
        <div style={{ color: '#fff', fontSize: '2.5rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
          {title}
        </div>
        <div style={{ color: '#86ffb7', fontSize: '1.2rem', fontWeight: 600, marginTop: '0.5rem' }}>
          Activity Completed Successfully!
        </div>
      </div>
    </div>
  );
}

function useCelebration(isSuccess, resetFn) {
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      setShowCelebration(true);
      const timer = setTimeout(() => {
        setShowCelebration(false);
        if (resetFn) resetFn();
      }, 6000);
      return () => clearTimeout(timer);
    } else {
      setShowCelebration(false);
    }
  }, [isSuccess, resetFn]);

  return showCelebration;
}

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

function getCrisisToolIcon(toolId) {
  if (toolId === 'peek') return 'VIEW'
  if (toolId === 'commit') return 'LOG'
  if (toolId === 'deprecated') return 'OLD'
  if (toolId === 'restore') return 'REST'
  return 'TOOL'
}

function getEnvironmentHeuristics(label, rackId) {
  const lower = label.toLowerCase()

  if (rackId === 'dev') {
    return [
      'Built for local iteration, experiments, or mock systems.',
      lower.includes('localhost') || lower.includes('mock') ? 'The wording points to temporary or local-only usage.' : 'This target exists before QA or customer exposure.',
    ]
  }

  if (rackId === 'staging') {
    return [
      'Used for realistic validation before a public release.',
      lower.includes('sandbox') || lower.includes('qa') || lower.includes('prelaunch')
        ? 'Sandbox, QA, and prelaunch clues usually mean production-like but still safe.'
        : 'It mirrors production without serving live customers.',
    ]
  }

  return [
    'Used by real customers or connected to real money/live traffic.',
    lower.includes('live') || lower.includes('customer') || lower.includes('ssl')
      ? 'Live payments, final domains, and customer-facing systems are production signals.'
      : 'This one affects actual users, not internal testing.',
  ]
}

function getEnvironmentSignal(label) {
  const lower = (label || '').toLowerCase()

  if (lower.includes('localhost') || lower.includes('mock') || lower.includes('experimental') || lower.includes('debug')) {
    return {
      tag: 'Sandbox',
      summary: 'Experimental, mock, and local-only infrastructure belongs in Development.',
      spectrum: ['local', 'mocked', 'in-progress'],
    }
  }

  if (lower.includes('qa') || lower.includes('prelaunch') || lower.includes('sandbox') || lower.includes('mirror')) {
    return {
      tag: 'Dress Rehearsal',
      summary: 'Production-like systems used for sign-off or QA belong in Staging.',
      spectrum: ['near-real', 'preflight', 'safe validation'],
    }
  }

  if (lower.includes('live') || lower.includes('real money') || lower.includes('customer') || lower.includes('ssl') || lower.includes('cdn')) {
    return {
      tag: 'Live Traffic',
      summary: 'Anything serving customers, money, or public delivery belongs in Production.',
      spectrum: ['real users', 'payments', 'public web'],
    }
  }

  return {
    tag: 'Classify',
    summary: 'Decide whether the clue sounds experimental, rehearsal-grade, or customer-facing.',
    spectrum: ['experimental', 'pre-release', 'live'],
  }
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

  const showCelebration = useCelebration(submitted, reset);
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
                  
      <CelebrationOverlay active={showCelebration} />
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

  const showCelebration = useCelebration(submitted, reset);
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
                
      <CelebrationOverlay active={showCelebration} />
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

  const showCelebration = useCelebration(submitted, reset);
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
                    
      <CelebrationOverlay active={showCelebration} />
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

  const showCelebration = useCelebration(submitted, reset);
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
          
      <CelebrationOverlay active={showCelebration} />
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

  const showCelebration = useCelebration(submitted, reset);
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
            
      <CelebrationOverlay active={showCelebration} />
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

  const showCelebration = useCelebration(submitted, reset);
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
                  
      <CelebrationOverlay active={showCelebration} />
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

  const showCelebration = useCelebration(isDone, null);
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
                <div style={{ fontSize: '0.78rem', color: '#ff2d55', marginTop: '0.4rem', fontWeight: 600 }}>WARNING: {station.warning}
      <CelebrationOverlay active={showCelebration} />
</div>
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

  const showCelebration = useCelebration(isDone, () => { setAnswers({}) });
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
            
      <CelebrationOverlay active={showCelebration} />
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

  const getStepRole = (step) => {
    const label = step.label.toLowerCase()
    if (step.decoy) return 'decoy'
    if (label.includes('token')) return 'token'
    if (label.includes('database')) return 'database'
    if (label.includes('send') || label.includes('post') || label.includes('api')) return 'request'
    if (label.includes('frontend') || label.includes('store') || label.includes('tap')) return 'frontend'
    return 'backend'
  }

  const getStepColor = (step) => {
    const role = getStepRole(step)
    if (role === 'frontend') return '#00f5d4'
    if (role === 'request') return '#61a8ff'
    if (role === 'database') return '#ffd166'
    if (role === 'token') return '#86ffb7'
    if (role === 'decoy') return '#ff9a5c'
    return '#7b2ff7'
  }

  const getCompactLabel = (step) => (
    step.label
      .replace(/^Frontend:\s*/i, '')
      .replace(/^Backend:\s*/i, '')
      .replace('Taps "Login"', 'Tap Login')
      .replace('Sends Auth API Post', 'Send API')
      .replace('Validates Database', 'Validate DB')
      .replace('Returns JWT Token', 'Return JWT')
      .replace('Stores Token & Navigates', 'Store + Route')
      .replace('Immediately redirect', 'Instant Redirect')
      .replace('Generates Auth Token', 'Frontend JWT')
  )

  const laidOutSteps = useMemo(() => {
    const mainRoute = path.filter(step => !step.decoy)
    const totalMain = Math.max(mainRoute.length - 1, 1)
    let validSeen = 0
    let decoySeen = 0

    return path.map((step) => {
      if (!step.decoy) {
        const progress = mainRoute.length === 1 ? 0.5 : validSeen / totalMain
        const x = -3.6 + (progress * 7.2)
        const z = 0
        const layout = {
          step,
          position: [x, 0, z],
          socket: [x, 0.36, z],
          correctIndex: validSeen,
          branchFrom: null,
        }
        validSeen += 1
        return layout
      }

      const anchorIndex = Math.max(0, validSeen - 1)
      const anchorProgress = mainRoute.length === 1 ? 0.5 : anchorIndex / totalMain
      const anchorX = -3.6 + (anchorProgress * 7.2)
      const side = decoySeen % 2 === 0 ? 1 : -1
      const z = side * 1.45
      const position = [anchorX + 0.45, 0.36, z]

      decoySeen += 1

      return {
        step,
        position,
        socket: [position[0], position[1] + 0.18, position[2]],
        correctIndex: -1,
        branchFrom: [anchorX, 0.36, 0],
      }
    })
  }, [path])

  const mainRouteLayouts = laidOutSteps.filter(item => !item.step.decoy)
  const activeLayout =
    mainRouteLayouts.find(item => item.correctIndex === Math.min(stepIndex, mainRouteLayouts.length - 1)) ||
    mainRouteLayouts[0]

  const showCelebration = useCelebration(isDone, null)

  return (
    <>
      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 420px', height: '460px', borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Canvas camera={{ position: [0, 4.8, 8.6], fov: 34 }}>
            <Environment preset="city" />
            <ambientLight intensity={0.55} />
            <pointLight position={[-4, 4, 3]} intensity={1.1} color="#00f5d4" />
            <pointLight position={[4, 5, 2]} intensity={1.25} color="#7b2ff7" />
            <spotLight position={[0, 8, 4]} angle={0.42} intensity={18} penumbra={1} color="#ffffff" />

            <group position={[0, -0.85, 0]}>
              <RoundedBox args={[8.8, 0.22, 1.45]} radius={0.09} smoothness={4} position={[0, -0.02, 0]}>
                <meshPhysicalMaterial color="#0d1321" roughness={0.38} metalness={0.9} clearcoat={0.4} />
              </RoundedBox>

              <RoundedBox args={[8.5, 0.06, 0.82]} radius={0.06} smoothness={4} position={[0, 0.11, 0]}>
                <meshPhysicalMaterial color="#111b2f" roughness={0.2} metalness={0.95} />
              </RoundedBox>

              {[-3.2, -1.6, 0, 1.6, 3.2].map((x, i) => (
                <mesh key={i} position={[x, 0.15, 0]}>
                  <cylinderGeometry args={[0.18, 0.18, 0.88, 24]} />
                  <meshPhysicalMaterial color="#18233b" roughness={0.16} metalness={0.96} />
                </mesh>
              ))}

              {mainRouteLayouts.slice(0, -1).map((item, index) => (
                <PipeSegment3D
                  key={`pipe-${item.step.id}`}
                  start={item.socket}
                  end={mainRouteLayouts[index + 1].socket}
                  color={hexToRgba(accent, 0.95)}
                  radius={0.07}
                  opacity={0.9}
                />
              ))}

              {laidOutSteps.filter(item => item.step.decoy).map((item) => (
                <PipeSegment3D
                  key={`branch-${item.step.id}`}
                  start={item.branchFrom}
                  end={item.socket}
                  color={errorId === item.step.id ? '#ff2d55' : 'rgba(255,154,92,0.8)'}
                  radius={0.045}
                  opacity={errorId === item.step.id ? 0.95 : 0.4}
                />
              ))}

              {laidOutSteps.map((item) => {
                const { step, position } = item
                const role = getStepRole(step)
                const expectedIdx = correctSteps.findIndex(s => s.id === step.id)
                const isCompleted = !step.decoy && expectedIdx < stepIndex
                const isNext = !step.decoy && expectedIdx === stepIndex
                const isError = errorId === step.id
                const tone = isError ? '#ff2d55' : isCompleted ? '#86ffb7' : isNext ? accent : getStepColor(step)
                const idleOpacity = step.decoy ? 0.42 : 0.78

                return (
                  <group key={step.id} position={position} onClick={() => handleStepClick(step)}>
                    <RoundedBox args={[1.02, 0.18, 0.82]} radius={0.06} smoothness={4}>
                      <meshPhysicalMaterial
                        color="#101725"
                        roughness={0.32}
                        metalness={0.88}
                        clearcoat={0.6}
                      />
                    </RoundedBox>

                    {role === 'frontend' && (
                      <RoundedBox args={[0.62, 0.44, 0.12]} radius={0.05} smoothness={4} position={[0, 0.3, 0]}>
                        <meshPhysicalMaterial color={tone} emissive={tone} emissiveIntensity={isNext ? 0.8 : 0.18} roughness={0.16} metalness={0.55} transparent opacity={isCompleted || isNext ? 1 : idleOpacity} />
                      </RoundedBox>
                    )}

                    {role === 'request' && (
                      <mesh position={[0, 0.28, 0]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.16, 0.16, 0.76, 28]} />
                        <meshPhysicalMaterial color={tone} emissive={tone} emissiveIntensity={isNext ? 0.75 : 0.15} roughness={0.14} metalness={0.9} transparent opacity={isCompleted || isNext ? 1 : idleOpacity} />
                      </mesh>
                    )}

                    {role === 'backend' && (
                      <>
                        <RoundedBox args={[0.66, 0.5, 0.52]} radius={0.05} smoothness={4} position={[0, 0.34, 0]}>
                          <meshPhysicalMaterial color={tone} emissive={tone} emissiveIntensity={isNext ? 0.8 : 0.2} roughness={0.2} metalness={0.8} transparent opacity={isCompleted || isNext ? 1 : idleOpacity} />
                        </RoundedBox>
                        <mesh position={[0, 0.58, 0.18]}>
                          <sphereGeometry args={[0.05, 18, 18]} />
                          <meshBasicMaterial color="#dff8ff" />
                        </mesh>
                      </>
                    )}

                    {role === 'database' && (
                      <>
                        {[0.2, 0.34, 0.48].map((y, i) => (
                          <mesh key={i} position={[0, y, 0]}>
                            <cylinderGeometry args={[0.28, 0.28, 0.1, 28]} />
                            <meshPhysicalMaterial color={tone} emissive={tone} emissiveIntensity={isNext ? 0.75 : 0.18} roughness={0.14} metalness={0.82} transparent opacity={isCompleted || isNext ? 1 : idleOpacity} />
                          </mesh>
                        ))}
                      </>
                    )}

                    {role === 'token' && (
                      <mesh position={[0, 0.38, 0]}>
                        <octahedronGeometry args={[0.28, 0]} />
                        <meshPhysicalMaterial color={tone} emissive={tone} emissiveIntensity={isNext ? 1.1 : 0.25} roughness={0.04} transmission={0.9} thickness={0.35} transparent opacity={isCompleted || isNext ? 1 : idleOpacity} />
                      </mesh>
                    )}

                    {role === 'decoy' && (
                      <RoundedBox args={[0.72, 0.3, 0.54]} radius={0.05} smoothness={4} position={[0, 0.24, 0]} rotation={[0, 0.18, step.id === 'd1' ? -0.28 : 0.28]}>
                        <meshPhysicalMaterial color={tone} emissive={tone} emissiveIntensity={isError ? 0.95 : 0.08} roughness={0.2} metalness={0.75} transparent opacity={isError ? 1 : 0.5} />
                      </RoundedBox>
                    )}

                    {(isCompleted || isNext) && (
                      <GlowSphere
                        position={[0, 0.82, 0]}
                        color={tone}
                        scale={isNext ? 0.12 : 0.08}
                        pulse={isNext}
                        withSparkles={isNext}
                      />
                    )}

                    <Text
                      position={[0, 1.08, 0]}
                      fontSize={0.12}
                      maxWidth={1.45}
                      lineHeight={1.1}
                      anchorX="center"
                      anchorY="middle"
                      color={isError ? '#ff8a9a' : '#ffffff'}
                    >
                      {getCompactLabel(step)}
                    </Text>
                  </group>
                )
              })}

              {activeLayout && (
                <Float speed={3} floatIntensity={0.35} rotationIntensity={0.2}>
                  <group position={[activeLayout.position[0], 1.28, activeLayout.position[2]]}>
                    <mesh>
                      <sphereGeometry args={[0.16, 28, 28]} />
                      <meshPhysicalMaterial color={accent} emissive={accent} emissiveIntensity={1.4} roughness={0.05} transmission={0.85} thickness={0.45} />
                    </mesh>
                    <Sparkles count={18} scale={0.85} size={1.6} color={accent} speed={2} />
                  </group>
                </Float>
              )}

              <Text position={[-3.65, 1.7, -0.95]} fontSize={0.18} color="#00f5d4" anchorX="left">
                Client
              </Text>
              <Text position={[0, 1.7, -0.95]} fontSize={0.18} color="#61a8ff" anchorX="center">
                API Tunnel
              </Text>
              <Text position={[3.65, 1.7, -0.95]} fontSize={0.18} color="#7b2ff7" anchorX="right">
                Backend
              </Text>
            </group>

            <ContactShadows position={[0, -1.1, 0]} opacity={0.7} scale={13} blur={2.4} />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate={false}
              minPolarAngle={Math.PI / 3.2}
              maxPolarAngle={Math.PI / 2.4}
            />
          </Canvas>
        </div>

        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '1.2rem 1.25rem'
          }}>
            <div style={{ color: '#6f7890', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: '0.45rem' }}>
              Request Flow
            </div>
            <div style={{ color: '#fff', fontSize: '1.08rem', fontWeight: 700, marginBottom: '0.45rem' }}>
              {scenario.title}
            </div>
            <div style={{ color: '#c8c8e0', lineHeight: 1.6, fontSize: '0.92rem' }}>
              Build the real pipeline in order. The main route is correct; side branches are traps that drop the packet.
            </div>
          </div>

          {path.map((step) => {
            const expectedIdx = correctSteps.findIndex(s => s.id === step.id)
            const isCompleted = !step.decoy && expectedIdx < stepIndex
            const isNext = !step.decoy && expectedIdx === stepIndex
            const isError = errorId === step.id
            const role = getStepRole(step)
            const chipColor = step.decoy ? '#ff9a5c' : getStepColor(step)

            return (
              <button
                key={step.id}
                onClick={() => handleStepClick(step)}
                disabled={isCompleted}
                className={isError ? 'jam-shake' : ''}
                style={{
                  padding: '0.9rem 1rem',
                  borderRadius: '14px',
                  textAlign: 'left',
                  background: isError
                    ? 'rgba(255,45,85,0.1)'
                    : isCompleted
                      ? 'rgba(255,255,255,0.02)'
                      : isNext
                        ? hexToRgba(accent, 0.12)
                        : 'rgba(255,255,255,0.05)',
                  border: isError
                    ? '1px solid #ff2d55'
                    : isCompleted
                      ? '1px solid rgba(255,255,255,0.05)'
                      : isNext
                        ? `1px solid ${hexToRgba(accent, 0.5)}`
                        : '1px solid rgba(255,255,255,0.15)',
                  color: isError ? '#ff808f' : isCompleted ? '#6f7890' : '#fff',
                  cursor: isCompleted ? 'default' : 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
                  <span style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: chipColor,
                    boxShadow: `0 0 14px ${hexToRgba(chipColor, 0.65)}`,
                    flexShrink: 0
                  }} />
                  <span style={{ fontWeight: 700, flex: 1 }}>{step.label}</span>
                  <span style={{
                    padding: '0.18rem 0.48rem',
                    borderRadius: '999px',
                    fontSize: '0.68rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    border: `1px solid ${hexToRgba(chipColor, 0.35)}`,
                    color: chipColor,
                    background: hexToRgba(chipColor, 0.08),
                    fontWeight: 700,
                  }}>
                    {role === 'decoy' ? 'Trap' : role}
                  </span>
                </div>

                {isError && step.warning && (
                  <div style={{ fontSize: '0.8rem', color: '#ff8a9a', marginTop: '0.45rem', fontWeight: 600 }}>
                    Dropped packet: {step.warning}
                  </div>
                )}

                {isNext && !isError && (
                  <div style={{ fontSize: '0.78rem', color: accent, marginTop: '0.42rem', fontWeight: 700 }}>
                    Next pipeline stage
                  </div>
                )}
              </button>
            )
          })}

          {isDone && (
            <div style={{ marginTop: '0.2rem', background: hexToRgba(accent, 0.1), border: `1px solid ${accent}`, padding: '1rem', borderRadius: '12px', textAlign: 'center', color: accent, fontWeight: 700 }}>
              {activity.success}
            </div>
          )}
        </div>
      </div>

      <CelebrationOverlay active={showCelebration} />
    </>
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

  const showCelebration = useCelebration(false, null);
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
          
      <CelebrationOverlay active={showCelebration} />
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

  const showCelebration = useCelebration(isDone, () => { setSequence([]) });
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
          
      <CelebrationOverlay active={showCelebration} />
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

  const showCelebration = useCelebration(false, null);
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
        
      <CelebrationOverlay active={showCelebration} />
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
  const showCelebration = useCelebration(isDone, () => setStepIndex(0))

  return (
    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      
      {/* Control Panel */}
      <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {activity.steps.map((step, i) => {
          const isCurrent = i === stepIndex
          const isCompleted = i < stepIndex
          const isError = errorIndex === i
          // Using #22c55e for green color on correct completed options
          const itemColor = isError ? '#ff2d55' : isCompleted ? '#22c55e' : isCurrent ? accent : '#c8c8e0'
          const itemBg = isError ? 'rgba(255,45,85,0.1)' : isCompleted ? 'rgba(34, 197, 94, 0.08)' : isCurrent ? hexToRgba(accent, 0.15) : 'rgba(255,255,255,0.03)'
          const itemBorder = isError ? '#ff2d55' : isCompleted ? 'rgba(34, 197, 94, 0.4)' : isCurrent ? accent : 'rgba(255,255,255,0.1)'

          return (
            <button
              key={step.id}
              onClick={() => handleStepClick(i)}
              className={isError ? 'jam-shake' : ''}
              disabled={isCompleted}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '1.1rem', borderRadius: '16px', border: '1px solid',
                background: itemBg, borderColor: itemBorder, color: itemColor,
                cursor: isCompleted ? 'default' : 'pointer',
                textAlign: 'left', transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)', fontWeight: 600,
                boxShadow: isCurrent ? `0 0 20px ${hexToRgba(accent, 0.2)}` : 'none',
                transform: isCurrent ? 'scale(1.02)' : 'none'
              }}
            >
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: isCompleted ? '#22c55e' : 'rgba(255,255,255,0.1)',
                color: isCompleted ? '#000' : 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 800,
                boxShadow: isCompleted ? '0 0 10px rgba(34, 197, 94, 0.5)' : 'none'
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
        flex: '1 1 300px', minHeight: '380px', background: '#070b12',
        borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
        position: 'relative', overflow: 'hidden', boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)'
      }}>
        {/* Animated Grid Pattern */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${hexToRgba(accent, 0.05)} 1px, transparent 1px), linear-gradient(90deg, ${hexToRgba(accent, 0.05)} 1px, transparent 1px)`, backgroundSize: '30px 30px', zIndex: 0, animation: 'panGrid 20s linear infinite' }} />
        
        {/* Glassmorphic Phone Frame Mockup */}
        <div style={{
          position: 'relative', zIndex: 1,
          width: '240px', height: '100%', minHeight: '320px', 
          border: stepIndex > 0 ? `2px solid ${hexToRgba(accent, 0.6)}` : '2px dashed rgba(255,255,255,0.15)',
          background: stepIndex > 0 ? 'rgba(20, 25, 35, 0.6)' : 'transparent',
          backdropFilter: stepIndex > 0 ? 'blur(10px)' : 'none',
          borderRadius: '30px', transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
          display: 'flex', flexDirection: 'column',
          padding: '1.25rem',
          transform: `scale(${stepIndex > 3 ? 0.95 : 1}) translateY(${stepIndex > 0 ? '0' : '10px'})`,
          boxShadow: stepIndex > 0 ? `0 20px 50px ${hexToRgba(accent, 0.15)}, inset 0 2px 10px rgba(255,255,255,0.05)` : 'none',
          opacity: stepIndex > 0 ? 1 : 0.4
        }}>
          {/* Header */}
          {stepIndex > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', animation: 'fadeIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
              <div style={{ width: '40px', height: '12px', background: 'linear-gradient(90deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))', borderRadius: '6px' }} />
              <div style={{ width: '28px', height: '28px', background: 'rgba(255,255,255,0.15)', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }} />
            </div>
          )}
          {/* Main Content Area */}
          {stepIndex > 2 && (
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '16px', marginBottom: '1rem', animation: 'fadeIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
               <div style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.08)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                 <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.15)', borderRadius: '50%' }} />
               </div>
            </div>
          )}
          {/* Bottom Tabs/List */}
          {stepIndex > 3 && (
            <div style={{ display: 'flex', gap: '0.8rem', animation: 'fadeIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)', justifyContent: 'space-around', alignItems: 'flex-end', paddingBottom: '0.5rem' }}>
              {[1, 2, 3].map(n => (
                <div key={n} style={{ flex: 1, height: '40px', background: 'rgba(255,255,255,0.08)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }} />
              ))}
            </div>
          )}
        </div>
      </div>

      <CelebrationOverlay active={showCelebration} />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes panGrid {
          form { background-position: 0 0; }
          to { background-position: 30px 30px; }
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
  const showCelebration = useCelebration(isDone, () => {
    setFixedProblems([])
    setSelectedTool(null)
  })

  return (
    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', flexDirection: 'column' }}>
      <div style={{ textAlign: 'center', color: '#6f7890', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        Match the right options
      </div>
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
                background: isFixed ? 'rgba(34, 197, 94, 0.1)' : '#0a0f18',
                border: isFixed ? '1px solid #22c55e' : isError ? '1px solid #ff2d55' : '1px dashed rgba(255,255,255,0.2)',
                borderRadius: '16px', padding: '1.5rem', cursor: isFixed ? 'default' : selectedTool ? 'pointer' : 'default',
                transition: 'all 0.3s'
              }}
            >
              <div style={{ color: isFixed ? '#22c55e' : isError ? '#ff2d55' : '#ff9a5c', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
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
        <div style={{ width: '100%', marginTop: '1rem', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', color: '#22c55e', fontWeight: 700 }}>
          {activity.success}
        </div>
      )}
      
      <CelebrationOverlay active={showCelebration} />
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
  const showCelebration = useCelebration(isDone, () => setSorted([]))

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
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <div style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 600, letterSpacing: '0.02em', marginTop: '0.5rem' }}>
              Completion Verified
            </div>
            <div style={{ color: '#22c55e', fontSize: '1rem' }}>
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

      <CelebrationOverlay active={showCelebration} />

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

  const showCelebration = useCelebration(isDone, () => { setRouted([]) });
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
          <div style={{ color: accent, fontSize: '1.5rem', fontWeight: 700 }}>{activity.success}
      <CelebrationOverlay active={showCelebration} />
</div>
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

  const showCelebration = useCelebration(isDone, () => { setPlaced([]) });
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
          
      <CelebrationOverlay active={showCelebration} />
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

  const showCelebration = useCelebration(isDone, () => { setLogs(['$ flutterflow init', 'Waiting for system command...']) });
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
          
      <CelebrationOverlay active={showCelebration} />
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
  const showCelebration = useCelebration(isDone, () => setPlaced([]))

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
          <div style={{ color: '#22c55e', fontSize: '1.25rem', fontWeight: 700, textAlign: 'center' }}>
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
                borderRadius: '50%', border: isError ? '3px solid #ff2d55' : hasItem ? `3px solid #22c55e` : '2px dashed rgba(255,255,255,0.2)',
                background: isError ? 'rgba(255,45,85,0.05)' : hasItem ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                cursor: currentItem ? 'pointer' : 'default', transition: 'all 0.3s',
                display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '1%',
                boxShadow: hasItem ? '0 0 30px rgba(34, 197, 94, 0.2) inset' : 'none'
              }}
              onMouseEnter={(e) => {
                if (!isDone && !isError) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                  e.currentTarget.style.borderStyle = 'solid'
                }
              }}
              onMouseLeave={(e) => {
                if (!isDone && !isError) {
                  e.currentTarget.style.background = hasItem ? 'rgba(34, 197, 94, 0.1)' : 'transparent'
                  e.currentTarget.style.borderStyle = hasItem ? 'solid' : 'dashed'
                }
              }}
            >
              <div style={{
                background: hasItem ? '#22c55e' : '#1a2235', color: hasItem ? '#000' : '#c8c8e0', padding: '0.2rem 0.8rem',
                borderRadius: '99px', fontSize: '0.8rem', fontWeight: 700, marginTop: '-12px', pointerEvents: 'none'
              }}>
                {ring.label}
              </div>
            </div>
          )
        })}
      </div>

      <CelebrationOverlay active={showCelebration} />
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

  const showCelebration = useCelebration(false, null);
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
        
      <CelebrationOverlay active={showCelebration} />
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

function PipeSegment3D({ start, end, color, radius = 0.07, opacity = 0.8 }) {
  const { midpoint, quaternion, length } = useMemo(() => {
    const from = new THREE.Vector3(...start)
    const to = new THREE.Vector3(...end)
    const direction = new THREE.Vector3().subVectors(to, from)
    const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5)
    const quat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.clone().normalize()
    )

    return {
      midpoint: mid.toArray(),
      quaternion: quat,
      length: direction.length(),
    }
  }, [start, end])

  return (
    <mesh position={midpoint} quaternion={quaternion}>
      <cylinderGeometry args={[radius, radius, length, 20]} />
      <meshPhysicalMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.35}
        roughness={0.18}
        metalness={0.85}
        clearcoat={1}
        transparent
        opacity={opacity}
      />
    </mesh>
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

  const showCelebration = useCelebration(isDone, null);
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
          
      <CelebrationOverlay active={showCelebration} />
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
  const [resolvedTool, setResolvedTool] = useState(null)

  const crisis = activity.crises[currentCrisis]
  const resolvedCount = isDone ? activity.crises.length : currentCrisis
  const activeAnswer = crisis?.answer
  const toolThemes = {
    peek: { tint: '#61a8ff', mode: 'Inspect without changing history' },
    commit: { tint: '#86ffb7', mode: 'Create a shared checkpoint' },
    deprecated: { tint: '#ffd166', mode: 'Explain the legacy workflow shift' },
    restore: { tint: '#ff7d6b', mode: 'Replace the present with a prior state' },
  }

  const resetActivity = () => {
    setCurrentCrisis(0)
    setIsDone(false)
    setErrorTool(null)
    setResolvedTool(null)
  }

  const handleToolClick = (toolId) => {
    if (isDone) return
    if (toolId === crisis.answer) {
      setResolvedTool(toolId)
      if (currentCrisis < activity.crises.length - 1) {
        setTimeout(() => {
          setCurrentCrisis(prev => prev + 1)
          setResolvedTool(null)
        }, 380)
      } else {
        setIsDone(true)
      }
    } else {
      setErrorTool(toolId)
      setTimeout(() => setErrorTool(null), 500)
    }
  }

  const showCelebration = useCelebration(isDone, resetActivity)

  return (
    <div style={{ marginTop: '1.5rem', display: 'grid', gap: '1.35rem' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '0.8rem',
        }}
      >
        {activity.crises.map((item, index) => {
          const isActive = index === currentCrisis && !isDone
          const isSolved = index < currentCrisis || isDone
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              style={{
                position: 'relative',
                overflow: 'hidden',
                minHeight: '110px',
                padding: '0.95rem 1rem',
                borderRadius: '20px',
                background: isSolved
                  ? 'linear-gradient(135deg, rgba(134,255,183,0.12), rgba(134,255,183,0.03))'
                  : isActive
                    ? `linear-gradient(135deg, ${hexToRgba(accent, 0.18)}, rgba(255,255,255,0.03))`
                    : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isSolved ? 'rgba(134,255,183,0.28)' : isActive ? hexToRgba(accent, 0.48) : 'rgba(255,255,255,0.08)'}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.8rem', marginBottom: '0.45rem' }}>
                <div style={{ color: isSolved ? '#86ffb7' : isActive ? accent : '#8ba0c4', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                  {isSolved ? 'Locked' : isActive ? 'Live feed' : `Queued ${index + 1}`}
                </div>
                <div style={{ color: '#fff', fontWeight: 800 }}>{String(index + 1).padStart(2, '0')}</div>
              </div>
              <div style={{ color: '#dce5f8', fontSize: '0.86rem', lineHeight: 1.5 }}>{item.prompt}</div>
            </motion.div>
          )
        })}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(340px, 1.25fr) minmax(300px, 0.95fr)',
          gap: '1.35rem',
          alignItems: 'start',
        }}
      >
        <div
          style={{
            minHeight: '560px',
            borderRadius: '28px',
            overflow: 'hidden',
            position: 'relative',
            border: `1px solid ${hexToRgba(accent, 0.24)}`,
            background: 'radial-gradient(circle at 50% 22%, rgba(255,255,255,0.08), rgba(5,8,18,0.96) 58%)',
            boxShadow: `0 34px 80px ${hexToRgba(accent, 0.12)}`,
          }}
        >
        <div style={{ position: 'absolute', inset: '1rem 1rem auto 1rem', zIndex: 2, display: 'flex', justifyContent: 'space-between', gap: '1rem', pointerEvents: 'none' }}>
          <div style={{ padding: '0.75rem 0.95rem', borderRadius: '16px', background: 'rgba(5,9,18,0.72)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(14px)' }}>
            <div style={{ color: '#8fa6ce', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 800, marginBottom: '0.35rem' }}>
              Chronology Engine
            </div>
            <div style={{ color: '#fff', fontSize: '0.96rem', fontWeight: 700 }}>
              Crisis {currentCrisis + 1} / {activity.crises.length}
            </div>
          </div>
          <div style={{ padding: '0.75rem 0.95rem', borderRadius: '16px', background: 'rgba(5,9,18,0.72)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(14px)', textAlign: 'right' }}>
            <div style={{ color: '#8fa6ce', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 800, marginBottom: '0.35rem' }}>
              Active operator lens
            </div>
            <div style={{ color: activeAnswer ? toolThemes[activeAnswer].tint : '#fff', fontSize: '0.96rem', fontWeight: 800 }}>
              {activeAnswer ? toolThemes[activeAnswer].mode : 'Mission cleared'}
            </div>
          </div>
        </div>
        <Canvas camera={{ position: [0, 1.25, 7.2], fov: 42 }}>
          <Environment preset="city" />
          <ambientLight intensity={0.42} />
          <pointLight position={[4, 5, 4]} intensity={1.35} color="#ffffff" />
          <pointLight position={[-4, 3, 2]} intensity={1.25} color={accent} />
          <spotLight position={[0, 8, 0]} angle={0.42} penumbra={1} intensity={18} color="#e1f7ff" />

          <group position={[0, -0.55, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.18, 0]}>
              <cylinderGeometry args={[4.45, 5.1, 0.38, 72]} />
              <meshPhysicalMaterial color="#0a0f1b" metalness={0.8} roughness={0.18} clearcoat={1} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.95, 0]}>
              <ringGeometry args={[2.25, 4.15, 72]} />
              <meshBasicMaterial color={accent} transparent opacity={0.16} side={THREE.DoubleSide} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.94, 0]}>
              <ringGeometry args={[0.8, 1.55, 72]} />
              <meshBasicMaterial color="#86ffb7" transparent opacity={0.2} side={THREE.DoubleSide} />
            </mesh>

            {[0, 1, 2].map((ring) => (
              <Float key={ring} speed={1.5 + ring * 0.45} rotationIntensity={0.25} floatIntensity={0.18}>
                <mesh rotation={[Math.PI / (2.8 + ring * 0.2), ring * 0.65, ring * 0.2]} position={[0, 0.55 + ring * 0.4, 0]}>
                  <torusGeometry args={[1.15 + ring * 0.35, 0.028 + ring * 0.006, 32, 140]} />
                  <meshPhysicalMaterial color={ring === 1 ? '#86ffb7' : accent} emissive={ring === 1 ? '#86ffb7' : accent} emissiveIntensity={0.4 + ring * 0.15} roughness={0.06} metalness={0.86} transparent opacity={0.72 - ring * 0.12} />
                </mesh>
              </Float>
            ))}

            <Float speed={2.2} rotationIntensity={0.45} floatIntensity={0.45}>
              <group position={[0, 1.55, 0]}>
                <mesh>
                  <octahedronGeometry args={[0.64, 1]} />
                  <meshPhysicalMaterial color={accent} emissive={accent} emissiveIntensity={1.2} transmission={0.85} thickness={0.72} roughness={0.03} />
                </mesh>
                <mesh scale={1.25}>
                  <icosahedronGeometry args={[0.62, 0]} />
                  <meshBasicMaterial color="#dff8ff" wireframe transparent opacity={0.3} />
                </mesh>
                <Sparkles count={isDone ? 64 : 30} scale={3.4} size={2.2} color={isDone ? '#86ffb7' : accent} speed={1.9} />
                <Text position={[0, 0, 0]} fontSize={0.16} color="#f3fbff" anchorX="center" anchorY="middle">
                  {isDone ? 'SYNC' : `C${currentCrisis + 1}`}
                </Text>
              </group>
            </Float>

            {activity.tools.map((tool, index) => {
              const angle = (index / activity.tools.length) * Math.PI * 2 - Math.PI / 4
              const x = Math.cos(angle) * 2.95
              const z = Math.sin(angle) * 2.25
              const theme = toolThemes[tool.id]
              const isError = errorTool === tool.id
              const isResolved = resolvedTool === tool.id
              const isCurrent = activeAnswer === tool.id && !isDone
              const tint = isError ? '#ff7d8f' : isResolved ? '#86ffb7' : isCurrent ? theme.tint : '#4f5973'

              return (
                <group key={tool.id}>
                  <PipeSegment3D start={[0, -0.25, 0]} end={[x, -0.05, z]} color={tint} radius={0.03} opacity={isCurrent ? 0.95 : 0.35} />
                  <group position={[x, -0.02, z]} onClick={() => handleToolClick(tool.id)}>
                    <mesh>
                      <cylinderGeometry args={[0.52, 0.76, 0.28, 36]} />
                      <meshPhysicalMaterial color="#111827" metalness={0.88} roughness={0.12} clearcoat={1} />
                    </mesh>
                    <mesh position={[0, 0.55, 0]}>
                      <boxGeometry args={[0.5, 1.05, 0.5]} />
                      <meshPhysicalMaterial color="#131f33" metalness={0.82} roughness={0.16} />
                    </mesh>
                    <mesh position={[0, 0.95, 0]}>
                      <octahedronGeometry args={[0.24, 0]} />
                      <meshPhysicalMaterial color={tint} emissive={tint} emissiveIntensity={isCurrent ? 1.2 : 0.35} transmission={0.75} roughness={0.05} />
                    </mesh>
                    <Text position={[0, 0.56, 0.27]} fontSize={0.1} color="#f5fbff" anchorX="center" anchorY="middle">
                      {getCrisisToolIcon(tool.id)}
                    </Text>
                    <Text position={[0, -0.46, 0]} fontSize={0.12} maxWidth={1.5} color={tint} anchorX="center" anchorY="middle">
                      {tool.label}
                    </Text>
                    {(isResolved || isCurrent) && (
                      <GlowSphere position={[0, 1.36, 0]} color={isResolved ? '#86ffb7' : tint} scale={0.09} pulse={isCurrent && !resolvedTool} withSparkles={isResolved} />
                    )}
                  </group>
                </group>
              )
            })}

            {activity.crises.map((item, index) => {
              const x = -2.7 + index * 1.35
              const solved = index < resolvedCount || isDone
              const activeNode = index === currentCrisis && !isDone

              return (
                <group key={item.id} position={[x, -0.92, -2.45]}>
                  <mesh>
                    <sphereGeometry args={[0.12, 24, 24]} />
                    <meshPhysicalMaterial color={solved ? '#86ffb7' : activeNode ? accent : '#2e3a56'} emissive={solved ? '#86ffb7' : activeNode ? accent : '#2e3a56'} emissiveIntensity={activeNode ? 0.95 : 0.25} />
                  </mesh>
                </group>
              )
            })}
          </group>

          <ContactShadows position={[0, -1.25, 0]} opacity={0.78} scale={14} blur={2.8} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.55} />
        </Canvas>
      </div>

        <div style={{ display: 'grid', gap: '1rem' }}>
          <motion.div
            key={currentCrisis}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '26px',
              padding: '1.35rem',
              background: 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
              border: `1px solid ${hexToRgba(accent, 0.22)}`,
            }}
          >
            <div style={{ color: '#8ca0c4', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.18em', fontWeight: 800, marginBottom: '0.6rem' }}>
              Situation brief
            </div>
            <div style={{ color: '#fff', fontSize: '1.12rem', fontWeight: 700, lineHeight: 1.6 }}>
              {crisis.prompt}
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {['inspect', 'checkpoint', 'rollback', 'explain legacy'].map((label, index) => (
                <span
                  key={label}
                  style={{
                    padding: '0.38rem 0.72rem',
                    borderRadius: '999px',
                    background: index === 0 ? hexToRgba(accent, 0.12) : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${index === 0 ? hexToRgba(accent, 0.3) : 'rgba(255,255,255,0.08)'}`,
                    color: index === 0 ? accent : '#b9c7e3',
                    fontSize: '0.72rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    fontWeight: 800,
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.9rem' }}>
            {activity.tools.map((tool, index) => {
              const theme = toolThemes[tool.id]
              const isError = errorTool === tool.id
              const isResolved = resolvedTool === tool.id
              const isCurrent = activeAnswer === tool.id && !isDone

              return (
                <motion.button
                  key={tool.id}
                  type="button"
                  onClick={() => handleToolClick(tool.id)}
                  whileHover={{ y: -6, rotateX: -4, rotateY: index % 2 === 0 ? -3 : 3 }}
                  whileTap={{ scale: 0.985 }}
                  className={isError ? 'jam-shake' : ''}
                  style={{
                    minHeight: '195px',
                    padding: '1rem',
                    borderRadius: '24px',
                    textAlign: 'left',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    background: isResolved
                      ? 'linear-gradient(155deg, rgba(134,255,183,0.14), rgba(255,255,255,0.04))'
                      : isError
                        ? 'linear-gradient(155deg, rgba(255,45,85,0.14), rgba(255,255,255,0.03))'
                        : isCurrent
                          ? `linear-gradient(155deg, ${hexToRgba(theme.tint, 0.18)}, rgba(255,255,255,0.04))`
                          : 'linear-gradient(155deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                    border: `1px solid ${isResolved ? 'rgba(134,255,183,0.35)' : isError ? 'rgba(255,45,85,0.34)' : isCurrent ? hexToRgba(theme.tint, 0.44) : 'rgba(255,255,255,0.08)'}`,
                    boxShadow: isCurrent ? `0 22px 48px ${hexToRgba(theme.tint, 0.14)}` : 'none',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '1rem', alignItems: 'start' }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '18px',
                      display: 'grid',
                      placeItems: 'center',
                      color: theme.tint,
                      background: hexToRgba(theme.tint, 0.12),
                      border: `1px solid ${hexToRgba(theme.tint, 0.22)}`,
                      fontSize: '0.88rem',
                      fontWeight: 900,
                      letterSpacing: '0.08em',
                    }}>
                      {getCrisisToolIcon(tool.id)}
                    </div>
                    <div style={{ padding: '0.35rem 0.6rem', borderRadius: '999px', fontSize: '0.68rem', color: theme.tint, background: hexToRgba(theme.tint, 0.1), letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 800 }}>
                      {theme.mode.split(' ')[0]}
                    </div>
                  </div>
                  <div style={{ color: '#fff', fontSize: '1rem', fontWeight: 800, marginBottom: '0.4rem' }}>{tool.label}</div>
                  <div style={{ color: '#95a8cb', fontSize: '0.84rem', lineHeight: 1.6 }}>{tool.desc}</div>
                  <div style={{ position: 'absolute', left: '1rem', right: '1rem', bottom: '1rem', color: isResolved ? '#86ffb7' : isError ? '#ff8ca0' : isCurrent ? theme.tint : '#6f829f', fontSize: '0.76rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 800 }}>
                    {isResolved ? 'Resolved' : isError ? 'Unsafe fit' : isCurrent ? 'Best match now' : 'Standby'}
                  </div>
                </motion.button>
              )
            })}
          </div>

          <AnimatePresence mode="wait">
            {!isDone && (
              <motion.div
                key={`${crisis.id}-${resolvedTool || errorTool || 'idle'}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  borderRadius: '22px',
                  padding: '1.1rem 1.15rem',
                  background: resolvedTool
                    ? 'rgba(134,255,183,0.08)'
                    : errorTool
                      ? 'rgba(255,45,85,0.08)'
                      : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${resolvedTool ? 'rgba(134,255,183,0.28)' : errorTool ? 'rgba(255,45,85,0.28)' : 'rgba(255,255,255,0.08)'}`,
                }}
              >
                <div style={{ color: resolvedTool ? '#86ffb7' : errorTool ? '#ff95a4' : '#96a8ca', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 800, marginBottom: '0.5rem' }}>
                  {resolvedTool ? 'Why this was correct' : errorTool ? 'Why that failed' : 'Decision rule'}
                </div>
                <div style={{ color: '#dce5f8', fontSize: '0.92rem', lineHeight: 1.68 }}>
                  {resolvedTool
                    ? `"${activity.tools.find((tool) => tool.id === resolvedTool)?.label}" fits because the request is about ${toolThemes[resolvedTool].mode.toLowerCase()}, not a different kind of timeline change.`
                    : errorTool
                      ? 'Separate the intent first: inspect old work, create a checkpoint, explain the legacy workflow, or truly replace the current state. The wrong choice means the intent and the action do not match.'
                      : 'Start by asking one question: do you need to look, save, explain, or replace? Once that intent is clear, the right tool becomes obvious.'}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isDone && (
            <div style={{ background: hexToRgba(accent, 0.1), border: `1px solid ${accent}`, padding: '1rem', borderRadius: '20px', textAlign: 'center', color: accent, fontWeight: 800 }}>
              {activity.success}
            </div>
          )}
        </div>
      </div>

      <CelebrationOverlay active={showCelebration} />
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
  const currentSignal = current ? getEnvironmentSignal(current.label) : null

  const handleRackClick = (rackId) => {
    if (isDone || !current) return
    if (rackId === current.rackId) {
      setRouted([...routed, current])
    } else {
      setErrorRack(rackId)
      setTimeout(() => setErrorRack(null), 500)
    }
  }

  const showCelebration = useCelebration(isDone, () => {
    setRouted([])
    setErrorRack(null)
  })

  return (
    <div style={{ marginTop: '1.5rem', display: 'grid', gap: '1.25rem' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 1.1fr) minmax(220px, 0.9fr)',
          gap: '1rem',
        }}
      >
        <div
          style={{
            borderRadius: '24px',
            padding: '1.2rem 1.25rem',
            background: 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
            border: `1px solid ${hexToRgba(accent, 0.22)}`,
          }}
        >
          <div style={{ color: '#91a6cb', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.16em', fontWeight: 800, marginBottom: '0.55rem' }}>
            Packet to classify
          </div>
          <div style={{ color: '#fff', fontSize: '1.08rem', fontWeight: 700, lineHeight: 1.6 }}>
            {current ? current.label : activity.success}
          </div>
          {currentSignal && (
            <div style={{ marginTop: '0.95rem', display: 'flex', gap: '0.7rem', flexWrap: 'wrap' }}>
              <span style={{ padding: '0.4rem 0.72rem', borderRadius: '999px', background: hexToRgba(accent, 0.12), border: `1px solid ${hexToRgba(accent, 0.22)}`, color: accent, fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                {currentSignal.tag}
              </span>
              {currentSignal.spectrum.map((token) => (
                <span key={token} style={{ padding: '0.4rem 0.7rem', borderRadius: '999px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#bfd0eb', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
                  {token}
                </span>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            borderRadius: '24px',
            padding: '1.2rem 1.25rem',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div style={{ color: '#91a6cb', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.16em', fontWeight: 800, marginBottom: '0.55rem' }}>
            Throughput
          </div>
          <div style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, lineHeight: 1 }}>
            {routed.length}
            <span style={{ color: '#6f83a9', fontSize: '1rem', fontWeight: 700 }}> / {activity.disks.length}</span>
          </div>
          <div style={{ marginTop: '0.7rem', height: '10px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <motion.div
              initial={false}
              animate={{ width: `${(routed.length / activity.disks.length) * 100}%` }}
              style={{ height: '100%', borderRadius: '999px', background: `linear-gradient(90deg, ${accent}, #86ffb7)` }}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(340px, 1.2fr) minmax(300px, 0.98fr)',
          gap: '1.35rem',
          alignItems: 'start',
        }}
      >
      <div style={{ minHeight: '560px', borderRadius: '28px', overflow: 'hidden', position: 'relative', border: `1px solid ${hexToRgba(accent, 0.24)}`, background: 'radial-gradient(circle at 50% 15%, rgba(255,255,255,0.1), rgba(5,8,18,0.97) 60%)', boxShadow: `0 36px 82px ${hexToRgba(accent, 0.1)}`, cursor: current ? 'crosshair' : 'default' }}>
        <div style={{ position: 'absolute', inset: '1rem 1rem auto 1rem', zIndex: 2, display: 'flex', justifyContent: 'space-between', gap: '0.8rem', pointerEvents: 'none' }}>
          <div style={{ padding: '0.72rem 0.95rem', borderRadius: '16px', background: 'rgba(5,9,18,0.72)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(14px)' }}>
            <div style={{ color: '#8fa6ce', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 800, marginBottom: '0.35rem' }}>
              Deployment chamber
            </div>
            <div style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700 }}>
              Route the incoming config to the correct environment lane
            </div>
          </div>
        </div>
        <Canvas camera={{ position: [0, 2.2, 8.2], fov: 42 }}>
          <Environment preset="city" />
          <ambientLight intensity={0.42} />
          <pointLight position={[4, 6, 4]} intensity={1.65} color="#ffffff" />
          <pointLight position={[-4, 2, 3]} intensity={1.15} color={accent} />
          <spotLight position={[0, 8, 0]} angle={0.5} penumbra={1} intensity={16} color="#d8efff" />

          <group position={[0, -0.72, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.12, 0]}>
              <cylinderGeometry args={[4.8, 5.2, 0.34, 72]} />
              <meshPhysicalMaterial color="#0a111d" metalness={0.82} roughness={0.16} clearcoat={1} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.94, 0]}>
              <ringGeometry args={[0.75, 1.45, 72]} />
              <meshBasicMaterial color={accent} transparent opacity={0.22} side={THREE.DoubleSide} />
            </mesh>

            {activity.racks.map((rack, index) => {
              const x = (index - 1) * 3
              const z = index === 1 ? 0.95 : -0.65
              const stackCount = routed.filter((item) => item.rackId === rack.id).length
              const selectedWrong = errorRack === rack.id
              return (
                <group key={rack.id}>
                  <PipeSegment3D start={[0, -0.1, 0]} end={[x, -0.1, z]} color={selectedWrong ? '#ff7d8f' : rack.color} radius={0.045} opacity={0.62} />
                  <mesh position={[x, -0.1, z]}>
                    <cylinderGeometry args={[0.42, 0.42, 0.18, 32]} />
                    <meshPhysicalMaterial color={rack.color} emissive={rack.color} emissiveIntensity={0.35} roughness={0.18} metalness={0.82} />
                  </mesh>
                  <ServerRack3D
                    position={[x, 0.7, z]}
                    color={selectedWrong ? '#ff7d8f' : rack.color}
                    label={rack.label}
                    filled={stackCount > 0}
                    onClick={() => handleRackClick(rack.id)}
                  />
                  {stackCount > 0 && (
                    <Text position={[x, 1.95, z]} fontSize={0.16} color={rack.color} anchorX="center" anchorY="middle">
                      +{stackCount}
                    </Text>
                  )}
                </group>
              )
            })}

            <Float speed={3.2} rotationIntensity={0.6} floatIntensity={0.5}>
              <group position={[0, 2.55, 0]}>
                <mesh>
                  <octahedronGeometry args={[0.46, 0]} />
                  <meshPhysicalMaterial color={current ? accent : '#86ffb7'} emissive={current ? accent : '#86ffb7'} emissiveIntensity={1.15} roughness={0.04} transmission={0.82} thickness={0.45} />
                </mesh>
                <mesh scale={1.26}>
                  <icosahedronGeometry args={[0.42, 0]} />
                  <meshBasicMaterial color="#dff8ff" wireframe transparent opacity={0.3} />
                </mesh>
                <Sparkles count={current ? 22 : 50} scale={2.5} size={2} color={current ? accent : '#86ffb7'} speed={1.8} />
              </group>
            </Float>
          </group>

          <ContactShadows position={[0, -1.6, 0]} opacity={0.76} scale={13} blur={2.6} far={5} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.52} />
        </Canvas>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {current && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              borderRadius: '24px',
              padding: '1.15rem 1.2rem',
              background: 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
              border: `1px solid ${hexToRgba(accent, 0.2)}`,
            }}
          >
            <div style={{ color: '#8fa6ce', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.16em', fontWeight: 800, marginBottom: '0.55rem' }}>
              Environment decoding rule
            </div>
            <div style={{ color: '#fff', fontSize: '1rem', lineHeight: 1.65, fontWeight: 600 }}>
              {currentSignal?.summary}
            </div>
          </motion.div>
        )}

        <div style={{ display: 'grid', gap: '0.9rem' }}>
          {activity.racks.map((rack, index) => {
            const heuristics = current ? getEnvironmentHeuristics(current.label, rack.id) : []
            const isError = errorRack === rack.id
            const routedCount = routed.filter((item) => item.rackId === rack.id).length

            return (
              <motion.button
                key={rack.id}
                type="button"
                onClick={() => handleRackClick(rack.id)}
                whileHover={{ y: -5, x: index === 1 ? 0 : index === 0 ? -3 : 3 }}
                whileTap={{ scale: 0.99 }}
                className={isError ? 'jam-shake' : ''}
                style={{
                  padding: '1rem 1.05rem',
                  borderRadius: '24px',
                  textAlign: 'left',
                  cursor: current ? 'pointer' : 'default',
                  background: isError
                    ? 'linear-gradient(145deg, rgba(255,45,85,0.13), rgba(255,255,255,0.03))'
                    : `linear-gradient(145deg, ${hexToRgba(rack.color, 0.12)}, rgba(255,255,255,0.03))`,
                  border: `1px solid ${isError ? 'rgba(255,45,85,0.36)' : hexToRgba(rack.color, 0.34)}`,
                  opacity: current ? 1 : 0.7,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ color: rack.color, fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.16em', fontWeight: 800, marginBottom: '0.3rem' }}>
                      {rack.label}
                    </div>
                    <div style={{ color: '#fff', fontSize: '1rem', fontWeight: 800 }}>
                      {rack.id === 'dev' ? 'Build + experiment' : rack.id === 'staging' ? 'Mirror + verify' : 'Serve + protect'}
                    </div>
                  </div>
                  <div style={{ minWidth: '42px', height: '42px', borderRadius: '14px', display: 'grid', placeItems: 'center', background: hexToRgba(rack.color, 0.14), color: rack.color, fontWeight: 900 }}>
                    {routedCount}
                  </div>
                </div>
                <div style={{ display: 'grid', gap: '0.45rem' }}>
                  {heuristics.map((line) => (
                    <div key={line} style={{ color: '#c8d5ec', fontSize: '0.84rem', lineHeight: 1.55 }}>
                      {line}
                    </div>
                  ))}
                </div>
              </motion.button>
            )
          })}
        </div>

        {current && (
          <div
            style={{
              borderRadius: '20px',
              padding: '1rem 1.05rem',
              background: errorRack ? 'rgba(255,45,85,0.08)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${errorRack ? 'rgba(255,45,85,0.24)' : 'rgba(255,255,255,0.08)'}`,
            }}
          >
            <div style={{ color: errorRack ? '#ff95a4' : '#94a8cb', fontSize: '0.73rem', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 800, marginBottom: '0.45rem' }}>
              Routing thought process
            </div>
            <div style={{ color: '#dce5f8', fontSize: '0.9rem', lineHeight: 1.66 }}>
              Ask in order: Is it local or experimental? Then it is Development. Does it mimic production for QA or sign-off? Then it is Staging. Does it touch live customers, money, or the public domain? Then it is Production.
            </div>
          </div>
        )}

        {isDone && (
          <div style={{ background: hexToRgba(accent, 0.1), border: `1px solid ${accent}`, padding: '1rem', borderRadius: '20px', textAlign: 'center', color: accent, fontWeight: 800 }}>
            {activity.success}
          </div>
        )}
      </div>
      </div>

      <CelebrationOverlay active={showCelebration} />
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

  const showCelebration = useCelebration(false, null);
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
          
      <CelebrationOverlay active={showCelebration} />
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
